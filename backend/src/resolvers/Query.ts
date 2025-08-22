import { Context } from "../context.js";

export const Query = {
  me: (_: any, __: any, ctx: Context) => ctx.user,
  events: (_: any, __: any, ctx: Context) => ctx.prisma.event.findMany({ orderBy: { startTime: "asc" } }),
  event: (_: any, { id }: { id: string }, ctx: Context) => ctx.prisma.event.findUnique({ where: { id } }),
};
