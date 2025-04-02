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
      pass: preprocessCSS.env.EMAIL_PSWD, // Use the secret value
    },
    secure: true, // Use TLS
  });

  const mailOptions = {
    from: { name: "DriveBuddy Team", address: "vinsouza1039@gmail.com" },
    to: email,
    subject: "Invitation to Join DriveBuddy",
    html: getDynamicEmailHTMLContent(name, code),
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

const getDynamicEmailHTMLContent = (name, code) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container-row{
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: rgb(255, 255, 255);
      background: -moz-linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 65%,
        rgb(155, 252, 252) 100%
      );
      background: -webkit-linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 65%,
        rgb(155, 252, 252) 100%
      );
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 65%,
        rgb(155, 252, 252) 100%
      );
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#00ffff",GradientType=1);
        padding: 40px;
padding-top:1rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
    width:100%;
      max-width: 150px;
    }
    .code-container {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f0f0;
      border-radius: 8px;
      padding: 10px 20px;
      margin: 20px auto;
      cursor: pointer;
    }
.code-container:hover {
      background-color: whitesmoke;
    }
    .code {
      font-weight: bold;
      font-size: 2rem;
      letter-spacing: 5px;
      margin-right: 10px;
    }
    .icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .footer {
      background-color: #f0f0f0;
      padding: 0.5rem;
      text-align: center;
      border-top: 1px solid #ddd;
      margin-top: 40px;
    }
    .footer a {
      color: #007bff;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img alt="DriveBuddy Logo" id="logo" src="https://firebasestorage.googleapis.com/v0/b/capstone-project-8b697.firebasestorage.app/o/assets%2Fdrivebuddy-logo-name.png?alt=media&token=ae8c2bf8-3c70-439f-b26f-669000c06eba"/>
    </div>
    
    <p>Hello, ${name}</p> 
    <p>You have been invited to join DriveBuddy as a driver. Use the code below to create an account in DriveBuddy:</p>
    <div class="container-row">
    <div class="code-container" onclick="navigator.clipboard.writeText('${code}')">
      <span class="code">${code}</span>
      <img class="icon" src="https://firebasestorage.googleapis.com/v0/b/capstone-project-8b697.firebasestorage.app/o/assets%2Fcopy-icon.png?alt=media&token=f1b452d6-8136-49c3-9b34-e0f74600bb81" alt="Copy to Clipboard" id="copy-icon" width="80px" />
    </div>
        </div>

    
    <p>Click the code to copy it to your clipboard.</p>
    <p>Best regards,</p>
    <p>DriveBuddy Team</p>
  </div>

  <div class="footer">
    <p>Visit us at <a href="https://drivebuddy.wmdd.ca">www.drivebuddy.wmdd.ca</a></p>
    <p><small><a href="https://www.flaticon.com/free-icons/copy" title="copy icons">Copy icons created by Freepik - Flaticon</a></small></p>
<p><small style="color:black">DriveBuddy &copy; 2025</small></p>
  </div>
</body>
</html>
`;
};
