const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, resetLink) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #333;">Reset Your DevDudes Password</h2>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p style="margin-top: 20px;">If you didn’t request this, you can safely ignore this email.</p>
              <p style="font-size: 12px; color: #888;">This link will expire in 15 minutes.</p>
            </div>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Reset your password using this link: ${resetLink}`,
        },
      },
    },
    Source: fromAddress,
  });
};

const run = async (subject, resetLink, toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmailId,
    "sanjai@devdudes.tech", // must be verified in SES
    subject,
    resetLink
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (err) {
    if (err instanceof Error && err.name === "MessageRejected") {
      return err;
    }
    throw err;
  }
};

module.exports = { run };
