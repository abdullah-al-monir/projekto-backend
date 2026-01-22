import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Invite } from '../models/Invite.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { createError, ErrorMessages } from '../utils/errors.js';
import { sendInviteEmail } from '../config/email.js';
import crypto from 'crypto';
import { config } from '../config/env.js';

export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      throw createError(401, ErrorMessages.INVALID_CREDENTIALS);
    }

    if (user.status === 'INACTIVE') {
      throw createError(403, ErrorMessages.USER_INACTIVE);
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const inviteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, ErrorMessages.EMAIL_EXISTS);
    }

    // Check if invite already exists
    const existingInvite = await Invite.findOne({
      email,
      acceptedAt: { $eq: null },
    });
    if (existingInvite) {
      throw createError(409, 'Invite already sent to this email');
    }

    // Create invite token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.inviteExpiryDays);

    const invite = await Invite.create({
      email,
      role,
      token,
      expiresAt,
    });

    // Send email
    const inviteLink = `${config.frontendUrl}/register?token=${token}`;
    await sendInviteEmail(email, inviteLink, role);

    res.status(201).json({
      status: 'success',
      message: 'Invite sent successfully',
      data: {
        id: invite._id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const registerViaInvite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { token, name, password } = req.body;

    // Find and validate invite
    const invite = await Invite.findOne({ token });
    if (!invite) {
      throw createError(400, ErrorMessages.INVALID_TOKEN);
    }

    if (new Date() > invite.expiresAt) {
      throw createError(400, ErrorMessages.TOKEN_EXPIRED);
    }

    if (invite.acceptedAt) {
      throw createError(400, 'This invite has already been used');
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      throw createError(409, ErrorMessages.EMAIL_EXISTS);
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      status: 'ACTIVE',
      invitedAt: invite.createdAt,
    });

    // Mark invite as accepted
    invite.acceptedAt = new Date();
    await invite.save();

    const jwtToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export default { login, inviteUser, registerViaInvite };