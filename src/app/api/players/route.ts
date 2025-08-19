import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "COACH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the coach's team
    const team = await prisma.team.findFirst({
      where: {
        coachId: session.user.id,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    // Get all players on the team
    const players = await prisma.user.findMany({
      where: {
        teamPlayers: {
          some: {
            teamId: team.id,
          },
        },
        role: "PLAYER",
      },
      select: {
        id: true,
        fullName: true,
        position: true,
        jerseyNumber: true,
      },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
