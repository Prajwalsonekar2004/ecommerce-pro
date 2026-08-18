import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);


// fetch("/api/auth/email-otp/send-verification-otp", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     email: "test@example.com",
//     type: "sign-in",
//   }),
// }).then(async (response) => {
//   console.log("STATUS:", response.status);
//   console.log("RESPONSE:", await response.text());
// });

// fetch("/api/auth/sign-in/email-otp", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     email: "test@example.com",
//     otp: "240176",
//   }),
// }).then(async (response) => {
//   console.log("STATUS:", response.status);
//   console.log("RESPONSE:", await response.text());
// });