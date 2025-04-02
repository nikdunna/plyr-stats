import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "COACH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const team = await prisma.team.findFirst({
      where: {
        coachId: session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 