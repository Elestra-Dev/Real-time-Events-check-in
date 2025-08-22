import { Context } from "../context.js";
import { comparePassword, hashPassword, signToken } from "../auth.js";

export const Mutation = {
  register: async (_: any, { name, email, password }: any, ctx: Context) => {
    const existing = await ctx.prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");
    const user = await ctx.prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        avatarUrl: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
          name
        )}`,
      },
    });
    const token = signToken(user.id);
    return { token, user };
  },

  login: async (_: any, { email, password }: any, ctx: Context) => {
    const user = await ctx.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new Error("Invalid credentials");
    const token = signToken(user.id);
    return { token, user };
  },

  joinEvent: async (_: any, { eventId }: any, ctx: Context) => {
    if (!ctx.user) throw new Error("Not authenticated");
    const event = await ctx.prisma.event.update({
      where: { id: eventId },
      data: { attendees: { connect: { id: ctx.user.id } } },
      include: { attendees: true },
    });

    ctx.io.to(`event:${eventId}`).emit("event:attendees", {
      eventId,
      attendees: event.attendees.map((u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl })),
      count: event.attendees.length,
      joinedUserId: ctx.user.id,
    });

    return event;
  },

  leaveEvent: async (_: any, { eventId }: any, ctx: Context) => {
    if (!ctx.user) throw new Error("Not authenticated");
    const event = await ctx.prisma.event.update({
      where: { id: eventId },
      data: { attendees: { disconnect: { id: ctx.user.id } } },
      include: { attendees: true },
    });

    ctx.io.to(`event:${eventId}`).emit("event:attendees", {
      eventId,
      attendees: event.attendees.map((u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl })),
      count: event.attendees.length,
      leftUserId: ctx.user.id,
    });

    return event;
  },

  deleteAccount: async (_: any, __: any, ctx: Context) => {
    if (!ctx.user) throw new Error("Not authenticated");
    await ctx.prisma.user.delete({ where: { id: ctx.user.id } });
    return true;
  },
};
