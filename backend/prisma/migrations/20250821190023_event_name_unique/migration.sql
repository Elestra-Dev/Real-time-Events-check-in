/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."_UserEvents" ADD CONSTRAINT "_UserEvents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_UserEvents_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "public"."Event"("name");
