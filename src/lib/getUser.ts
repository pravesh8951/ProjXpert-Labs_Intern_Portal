import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import connectToDatabase from "@/lib/db";

export const getUserFromRequest = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const decoded: any = verifyToken(token);
  if (!decoded) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(decoded.id);
  
  return user;
};
