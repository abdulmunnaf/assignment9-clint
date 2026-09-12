import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://assignment-9:I7DUjfDiE84hMpRS@cluster0.sq0nbb4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Re-use MongoDB client across serverless function invocations
let client;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(MONGODB_URI);
}
client = global._mongoClient;
const db = client.db("DriveFleet");

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "drivefleet_better_auth_secret_token_key_2026",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://*.vercel.app",
    "https://*.vercel.sh",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [jwt()],
});

