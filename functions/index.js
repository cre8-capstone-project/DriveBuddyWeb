import { onCall } from "firebase-functions/v2/https";
import { createTransport } from "nodemailer";

// Callable function implementation with secret
export const sendDriverInvitation = onCall(async (request) => {
  const { email, name, code } = request.data;

  if (!email || !name) {
    throw new Error("Email and name are required");
  }

  // Create transporter with proper authentication
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "vinsouza1039@gmail.com",
      // eslint-disable-next-line no-undef
      pass: process.env.EMAIL_PSWD, // Use the secret value
    },
    secure: true, // Use TLS
  });

  const mailOptions = {
    from: { name: "DriveBuddy Team", address: "vinsouza1039@gmail.com" },
    to: email,
    subject: "Invitation to Join DriveBuddy",
    html: `<p>Hello ${name},</p>
           <p>You have been invited to join DriveBuddy as a driver. Use the code below to create an account in DriveBuddy:</p>
           <p style="font-weight:bold;font-size:2rem;text-align:center;letter-spacing:5px;">${code}</p>
           <p>Best regards,</p>
           <p>DriveBuddy Team</p>`,
  };

  try {
    console.log(`Attempting to send invitation email to ${email}`);
    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent invitation email to ${email}`);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
});
