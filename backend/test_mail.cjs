const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pmahboob001@gmail.com',
    pass: 'hlwgyfgixmknlqmg',
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: 'The Best School <pmahboob001@gmail.com>',
      to: 'indianalisir@gmail.com',
      subject: '[Action Required] Activate St. Jude Public School ERP Account',
      text: 'Hello Indian Ali Sir,\n\nYour school instance St. Jude Public School has been successfully provisioned.\nLicense Key: SCH-ENT-2026-94821\nClick to activate: http://localhost:5173/accept-invitation?token=test-token-indian-ali',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #faf5ff;">
          <h2 style="color: #7e22ce;">Welcome to The Best School ERP</h2>
          <p>Hello <strong>Indian Ali Sir</strong>,</p>
          <p>Your school instance <strong>St. Jude Public School</strong> has been successfully provisioned.</p>
          <p>License Key: <code>SCH-ENT-2026-94821</code></p>
          <div style="margin: 20px 0;">
            <a href="http://localhost:5173/accept-invitation?token=test-token-indian-ali" style="background-color: #7e22ce; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Set Password & Activate School Portal →</a>
          </div>
        </div>
      `,
    });

    console.log('SUCCESS! DISPATCHED TO indianalisir@gmail.com');
    console.log('Message ID:', info.messageId);
    console.log('Accepted Recipients:', info.accepted);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('SMTP ERROR:', error);
  }
}

main();
