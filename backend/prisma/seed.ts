import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // six preset events
  const base = new Date();
  const events = [
    { name: "Campus Tech Meetup", location: "Auditorium A", startTime: new Date(base.getTime() + 3600e3) },
    { name: "Open Mic Night", location: "Cafeteria Stage", startTime: new Date(base.getTime() + 7200e3) },
    { name: "Design Jam", location: "Studio 2", startTime: new Date(base.getTime() + 10800e3) },
    { name: "Hack & Snack", location: "Lab 101", startTime: new Date(base.getTime() + 14400e3) },
    { name: "AI Study Circle", location: "Library Rm 3", startTime: new Date(base.getTime() + 18000e3) },
    { name: "Startup Pitch Night", location: "Main Hall", startTime: new Date(base.getTime() + 21600e3) },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { name: e.name },
      update: {},
      create: e,
    });
  }

  console.log("Seeded 6 events ✅");
}

main().finally(() => prisma.$disconnect());
