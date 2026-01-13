import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, firstName, jobTitle, topCandidates, totalCandidates } = await request.json();

    console.log("[Send Notification] Request received:", { to, subject, candidateCount: topCandidates?.length });

    if (!to || !subject) {
      console.error("[Send Notification] Missing required fields");
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[Send Notification] EMAIL_USER or EMAIL_PASS environment variables not set");
      return NextResponse.json({
        success: false,
        error: 'Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.'
      }, { status: 500 });
    }

    console.log("[Send Notification] Using email:", process.env.EMAIL_USER);

    // Create transporter using Gmail SMTP
    // User needs to set up an App Password in their Google Account
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS,  // Gmail App Password
      },
    });

    // Build HTML email content
    const candidatesHtml = topCandidates
      .map((c, i) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; font-weight: bold; color: ${i === 0 ? '#3b82f6' : '#64748b'};">#${i + 1}</td>
          <td style="padding: 12px;">${c.name || 'Candidate'}</td>
          <td style="padding: 12px; text-align: right;">
            <span style="background: ${i === 0 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#e2e8f0'}; 
                         color: ${i === 0 ? 'white' : '#64748b'}; 
                         padding: 4px 12px; 
                         border-radius: 20px; 
                         font-weight: bold;">
              ${c.score || 0}%
            </span>
          </td>
        </tr>
      `)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Ranking Complete!</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
              Hello <strong>${firstName || 'there'}</strong>! 👋
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
              Your resume ranking for <strong style="color: #3b82f6;">"${jobTitle || 'your position'}"</strong> has been completed.
            </p>
            
            <!-- Stats Card -->
            <div style="background: linear-gradient(135deg, #f0f9ff, #f5f3ff); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e0e7ff;">
              <div style="display: flex; justify-content: center; gap: 40px; text-align: center;">
                <div>
                  <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${totalCandidates}</div>
                  <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Candidates</div>
                </div>
              </div>
            </div>
            
            <!-- Top Candidates Table -->
            <h3 style="color: #374151; margin-bottom: 16px; font-size: 16px;">🏆 Top Candidates</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 12px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Rank</th>
                  <th style="padding: 12px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Name</th>
                  <th style="padding: 12px; text-align: right; color: #64748b; font-size: 12px; text-transform: uppercase;">Score</th>
                </tr>
              </thead>
              <tbody>
                ${candidatesHtml}
              </tbody>
            </table>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hiresight-delta.vercel.app'}/history" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                View Full Results →
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Sent with 💜 by <strong>HireSight</strong>
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin-top: 8px;">
              AI-Powered Resume Screening
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"HireSight" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log('Email sent:', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
