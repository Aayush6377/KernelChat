const websitelogo = "https://res.cloudinary.com/dtyua1uzq/image/upload/v1763308763/Logo_ybhzlo.png";

export const createWelcomeEmailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to KernelChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="${websitelogo}" alt="KernelChat Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to KernelChat!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We're excited to have you join our messaging platform! KernelChat connects you with friends, family, and colleagues in real-time, no matter where they are.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Set up your profile picture</li>
          <li style="margin-bottom: 10px;">Find and add your contacts</li>
          <li style="margin-bottom: 10px;">Start a conversation</li>
          <li style="margin-bottom: 0;">Share text, photos, and more</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href=${process.env.FRONTEND_URL} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Open Messenger</a>
      </div>
      
      <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
      <p style="margin-top: 0;">Happy messaging!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The KernelChat Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© ${new Date().getFullYear()} KernelChat. All rights reserved.</p>
      <p>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
  `;
}

export const createOtpEmailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="${websitelogo}" alt="KernelChat Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Verify Your Email</h1>
    </div>
  
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello,</strong></p>
      <p>Here is your One-Time Password (OTP) to complete your signup. Please use the code below to verify your email address.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Your Verification Code is:</strong></p>
        <span style="display: inline-block; font-size: 32px; font-weight: 600; color: #333; letter-spacing: 5px; background-color: #ffffff; padding: 10px 25px; border-radius: 8px; border: 1px dashed #cccccc;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size: 14px; color: #777; margin-bottom: 25px;">This code is valid for <strong>2 minutes</strong>. If you did not request this code, please ignore this email or contact support.</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The KernelChat Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© ${new Date().getFullYear()} KernelChat. All rights reserved.</p>
      <p>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </p>
    </div>
  
  </body>
  </html>
  `;
}

export const createPasswordResetTemplate = (name, resetUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="${websitelogo}" alt="KernelChat Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Password Reset Request</h1>
    </div>
  
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We received a request to reset the password for your KernelChat account. If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please click the button below. This link is only valid for <strong>5 minutes</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Reset Your Password</a>
      </div>
      
      <p style="font-size: 14px; color: #777;">If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #5B86E5; word-break: break-all; -webkit-user-select: all; user-select: all;">${resetUrl}</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The KernelChat Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© ${new Date().getFullYear()} KernelChat. All rights reserved.</p>
      <p>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href=${process.env.FRONTEND_URL} style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </p>
    </div>
  
  </body>
  </html>
  `;
}