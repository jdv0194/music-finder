import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// JWT secret key (should be in env variables in production)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// JWT expiration time (30 days)
const JWT_EXPIRES_IN = "30d";

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare a password with a hash
export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate a JWT token for a user
export function generateToken(user: { id: string; email: string }): string {
  const payload = { userId: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify a JWT token
export function verifyToken(
  token: string
): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}

// Extract user from a request (using Authorization header)
export function getUserFromRequest(req: any): { userId: string } | null {
  try {
    const authHeader =
      req.headers?.get?.("authorization") ??
      req.headers?.authorization ??
      req.req?.headers?.authorization;

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  } catch (error) {
    console.error("Error extracting user from request:", error);
    return null;
  }
}
