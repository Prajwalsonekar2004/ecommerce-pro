import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log("OTP:", { email, otp, type });
      },
    }),
  ],
});
