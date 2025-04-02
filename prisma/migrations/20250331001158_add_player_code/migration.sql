/*
  Warnings:

  - You are about to drop the column `playerID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_playerID_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "playerID",
ADD COLUMN     "playerCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_playerCode_key" ON "User"("playerCode");
