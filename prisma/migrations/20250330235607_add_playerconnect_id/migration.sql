/*
  Warnings:

  - A unique constraint covering the columns `[playerID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "playerID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_playerID_key" ON "User"("playerID");
