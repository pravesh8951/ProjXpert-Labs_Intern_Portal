import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (
  userId: string,
  testStatus: string,
  paymentStatus: string,
  rememberMe: boolean = false,
  domain: string | null = null
): string => {
  return jwt.sign({ id: userId, testStatus, paymentStatus, domain }, JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "7d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
