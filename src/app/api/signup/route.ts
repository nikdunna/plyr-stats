import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";

const generatePlayerCode = () => {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
  return `PLYR-${nanoid()}`;
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    fullName,
    email,
    password,
    role,
    teamCode,
    jerseyNumber,
    height,
    playerCode,
  } = body;

  if (!email || !password || !fullName || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let teamIdToLink: string | undefined;
    // Validate team exists if role is PLAYER
    if (teamCode) {
      const team = await prisma.team.findUnique({ where: { teamCode } });
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      teamIdToLink = team.id;
    }

    let playerIdToLink: string | undefined;
    // Validate player exists if role is PARENT
    if (role === "PARENT") {
      const player = await prisma.user.findFirst({
        where: {
          playerCode: playerCode,
          role: "PLAYER",
        },
      });
      if (!player) {
        return NextResponse.json(
          { error: "Player not found" },
          { status: 404 }
        );
      }
      playerIdToLink = player.id;
    }

    let generatedPlayerCode: string | undefined = undefined;

    if (role === "PLAYER") {
      let isUnique = false;
      let attemptCount = 0;
      while (!isUnique && attemptCount < 5) {
        const code = generatePlayerCode();
        const existing = await prisma.user.findFirst({
          where: { playerCode: code },
        });
        if (!existing) {
          generatedPlayerCode = code;
          isUnique = true;
        }
        attemptCount++;
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: "Failed to generate a unique player code." },
          { status: 500 }
        );
      }
    }

    // Create user with role-specific fields
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role,
        jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : undefined,
        height: height ? parseInt(height) : undefined,
        ...(generatedPlayerCode ? { playerCode: generatedPlayerCode } : {}),
        // Removed team connection for players to avoid overwriting coachId
      },
    });

    // If role is PLAYER and the team exists, create a TeamPlayers association.
    if (role === "PLAYER" && teamIdToLink) {
      await prisma.teamPlayers.create({
        data: {
          teamId: teamIdToLink,
          playerId: user.id,
        },
      });
    }

    // If role is PARENT, create parent-player relationship
    if (role === "PARENT" && playerIdToLink) {
      await prisma.parentPlayer.create({
        data: {
          parentId: user.id,
          playerId: playerIdToLink,
        },
      });
    }

    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: user.id,
        role: user.role,
        playerCode: user.playerCode, // Include playerCode in response for players
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Player code already in use" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
