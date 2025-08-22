import { prisma } from "./prisma.js";
import { getUserFromRequest } from "./auth.js";
import { Request, Response } from "express";
import { Server as IOServer } from "socket.io";

export type Context = {
  prisma: typeof prisma;
  req: Request;
  res: Response;
  io: IOServer;
  user: Awaited<ReturnType<typeof getUserFromRequest>>;
};

export const createContext =
  (io: IOServer) =>
  async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
    const user = await getUserFromRequest(req);
    return { prisma, req, res, io, user };
  };
