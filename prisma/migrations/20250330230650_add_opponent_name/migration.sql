/*
  Warnings:

  - You are about to drop the column `opponentTeamId` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "opponentTeamId",
ADD COLUMN     "opponentTeam" TEXT;
