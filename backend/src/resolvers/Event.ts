import { Context } from "../context.js";

export const Event = {
  attendees: (parent: any, _: any, ctx: Context) =>
    ctx.prisma.event.findUnique({ where: { id: parent.id } }).attendees(),
  attendeeCount: async (parent: any, _: any, ctx: Context) => {
    const count = await ctx.prisma.user.count({
      where: { events: { some: { id: parent.id } } },
    });
    return count;
  },
};
