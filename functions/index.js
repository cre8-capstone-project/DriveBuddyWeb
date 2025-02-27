import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";

// Create a nodemailer transporter
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "vinsouza1039@gmail.com",
    // eslint-disable-next-line no-undef
    pass: process.env.EMAIL_PSWD, // Use App Password
  },
});

// Callable function implementation
export const sendDriverInvitation = onCall(async (request) => {
  const { email, name } = request.data;

  if (!email || !name) {
    throw new Error("Email and name are required");
  }

  const mailOptions = {
    from: "vinsouza1039@gmail.com",
    to: email,
    subject: "Invitation to Join DriveBuddy",
    html: `<p>Hello ${name},</p>
           <p>You have been invited to join DriveBuddy as a driver. Click the link below to create your account:</p>
           <a href="https://your-website.com/signup">Create Account</a>
           <p>Best regards,</p>
           <p>DriveBuddy Team</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
});
