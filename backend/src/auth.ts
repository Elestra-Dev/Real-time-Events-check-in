import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "./prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev";

export type JwtPayload = { userId: string };

export const signToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token?: string): JwtPayload | null => {
  try {
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const getUserFromRequest = async (req: Request) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = verifyToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
};

export const hashPassword = async (pwd: string) => bcrypt.hash(pwd, 10);
export const comparePassword = async (pwd: string, hash: string) => bcrypt.compare(pwd, hash);
