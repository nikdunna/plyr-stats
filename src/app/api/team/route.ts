import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";

// Helper to generate unique 6-character team codes
const generateTeamCode = () => {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
  return `TEAM-${nanoid()}`;
};

// POST /api/team
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, coachId } = body;

    if (!name || !coachId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingTeam = await prisma.team.findFirst({
      where: {
        name: name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Team already exists" },
        { status: 400 }
      );
    }

    let teamCode: string;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      teamCode = generateTeamCode();
      const existing = await prisma.team.findUnique({ where: { teamCode } });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: "Failed to generate unique team code" },
        { status: 500 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        coachId,
        teamCode: teamCode!,
      },
    });

    const session = await getServerSession(authOptions);

    const updatedSession = {
      ...session,
      user: {
        ...session?.user,
        teamCode: team.teamCode,
      },
    };

    return NextResponse.json({
      message: "Team created",
      team,
      teamCode: team.teamCode,
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
