import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { createError, ErrorMessages } from '../utils/errors.js';

const PAGE_SIZE = 10;

export const getUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || '';

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * PAGE_SIZE;

    const users = await User.find(query)
      .select('-password')
      .limit(PAGE_SIZE)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          total,
          pages: Math.ceil(total / PAGE_SIZE),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw createError(404, ErrorMessages.USER_NOT_FOUND);
    }

    // Prevent changing admin to non-admin if they're the only admin
    if (user.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount === 1) {
        throw createError(
          400,
          'Cannot remove the last admin from the system'
        );
      }
    }

    user.role = role;
    await user.save();

    res.json({
      status: 'success',
      message: 'User role updated',
      data: {
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

export const updateUserStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw createError(404, ErrorMessages.USER_NOT_FOUND);
    }

    // Prevent deactivating the last admin
    if (user.role === 'ADMIN' && status === 'INACTIVE') {
      const activeAdminCount = await User.countDocuments({
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      if (activeAdminCount === 1) {
        throw createError(
          400,
          'Cannot deactivate the last active admin'
        );
      }
    }

    user.status = status;
    await user.save();

    res.json({
      status: 'success',
      message: 'User status updated',
      data: {
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

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      throw createError(404, ErrorMessages.USER_NOT_FOUND);
    }

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    throw error;
  }
};

export default { getUsers, updateUserRole, updateUserStatus, getCurrentUser };