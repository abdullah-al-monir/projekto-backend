import emailjs from "@emailjs/nodejs";
import { config } from "./env.js";


emailjs.init({
  publicKey: config.emailPublicKey,
  privateKey: config.emailPrivateKey,
});

export const sendInviteEmail = async (
  email: string,
  inviteLink: string,
  role: string,
): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: email,
      from_name: "Projekto Team",
      user_role: role,
      invite_link: inviteLink,
      reply_to: "noreply@projekto.com",
    };

    console.log("Sending email with params:", templateParams);

    const response = await emailjs.send(
      config.emailServiceId, 
      config.emailTemplateId, 
      templateParams
    );
    
    console.log(`✓ Invite email sent to ${email}`, response);
    return true;
  } catch (error) {
    console.error("✗ Failed to send email:", error);
    if (config.isDevelopment) {
      console.log(`[DEV MODE] Email would be sent to: ${email}`);
      console.log(`[DEV MODE] Invite Link: ${inviteLink}`);
      return true;
    }
    return false;
  }
};

export default { sendInviteEmail };
