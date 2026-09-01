import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,

      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your BlackHeadFashion verification code"
            : "Your BlackHeadFashion verification code";

        await resend.emails.send({
          from: "BlackHeadFashion <onboarding@resend.dev>",
          to: email,
          subject,
          html: `
            <div style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,sans-serif;">
              <div style="max-width:520px;margin:0 auto;background:#ffffff;padding:40px 32px;">
                <h1 style="margin:0;font-size:28px;color:#111111;">
                  BlackHeadFashion
                </h1>

                <p style="margin:32px 0 8px;font-size:16px;color:#555555;">
                  Your verification code is:
                </p>

                <div style="margin:0 0 28px;font-size:36px;font-weight:700;letter-spacing:10px;color:#111111;">
                  ${otp}
                </div>

                <p style="margin:0;font-size:14px;line-height:1.6;color:#777777;">
                  This code will expire in 5 minutes.
                </p>

                <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#999999;">
                  If you didn't request this code, you can safely ignore this email.
                </p>
              </div>
            </div>
          `,
        });
        console.log(`Verification OTP sent to ${email}`);
      },
    }),
  ],
});
