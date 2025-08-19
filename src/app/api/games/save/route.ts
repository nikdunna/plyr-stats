import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    console.log("Starting game save process...");

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Authentication failed - no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Authentication successful:", { userId: session.user?.id });

    // Get the request body
    const gameData = await request.json();
    console.log("Received game data:", {
      id: gameData.id,
      teamId: gameData.teamId,
      tournamentId: gameData.tournamentId,
      setsCount: gameData.sets?.length,
      firstSet: gameData.sets?.[0],
    });

    // Validate required fields
    if (!gameData.teamId) {
      console.log("Validation failed - missing teamId");
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Log the data structure before creating
    console.log("Preparing to create game with data structure:", {
      hasId: !!gameData.id,
      hasTeamId: !!gameData.teamId,
      hasTournamentId: !!gameData.tournamentId,
      setsCount: gameData.sets?.length,
      firstSetStats: gameData.sets?.[0]?.playerStats?.length,
    });

    // Create the game with sets and player stats
    console.log("Attempting to create game in database...");
    const game = await prisma.game.create({
      data: {
        id: gameData.id,
        teamId: gameData.teamId,
        tournamentId: gameData.tournamentId,
        gameDate: gameData.gameDate ? new Date(gameData.gameDate) : null,
        label: gameData.label,
        location: gameData.location,
        opponentTeam: gameData.opponentTeam,
        sets: {
          create: gameData.sets.map(
            (set: {
              setNumber: number;
              teamScore: number;
              opponentScore: number;
              playerStats: Array<{
                playerId: string;
                stats: {
                  attackAttempts: number;
                  kills: number;
                  setAssists: number;
                  setAttempts: number;
                  threePasses: number;
                  twoPasses: number;
                  onePasses: number;
                  zeroPasses: number;
                  digs: number;
                  serveAttempts: number;
                  aces: number;
                  blocks: number;
                  blockAttempts: number;
                  serveErrors: number;
                  attackErrors: number;
                  blockErrors: number;
                  digErrors: number;
                  setErrors: number;
                };
              }>;
            }) => ({
              setNumber: set.setNumber,
              teamScore: set.teamScore,
              opponentScore: set.opponentScore,
              playerStats: {
                create: set.playerStats.map(
                  (stat: {
                    playerId: string;
                    stats: {
                      attackAttempts: number;
                      kills: number;
                      setAssists: number;
                      setAttempts: number;
                      threePasses: number;
                      twoPasses: number;
                      onePasses: number;
                      zeroPasses: number;
                      digs: number;
                      serveAttempts: number;
                      aces: number;
                      blocks: number;
                      blockAttempts: number;
                      serveErrors: number;
                      attackErrors: number;
                      blockErrors: number;
                      digErrors: number;
                      setErrors: number;
                    };
                  }) => ({
                    playerId: stat.playerId,
                    hitAttempts: stat.stats.attackAttempts,
                    kills: stat.stats.kills,
                    assists: stat.stats.setAssists,
                    assistAttempts: stat.stats.setAttempts,
                    threePass: stat.stats.threePasses,
                    twoPass: stat.stats.twoPasses,
                    onePass: stat.stats.onePasses,
                    zeroPass: stat.stats.zeroPasses,
                    digs: stat.stats.digs,
                    serves: stat.stats.serveAttempts,
                    aces: stat.stats.aces,
                    killBlocks: stat.stats.blocks,
                    blockTouches: stat.stats.blockAttempts,
                    serviceErrors: stat.stats.serveErrors,
                    hittingErrors: stat.stats.attackErrors,
                    blockingErrors: stat.stats.blockErrors,
                    diggingErrors: stat.stats.digErrors,
                    assistErrors: stat.stats.setErrors,
                  })
                ),
              },
            })
          ),
        },
      },
      include: {
        sets: {
          include: {
            playerStats: true,
          },
        },
      },
    });

    console.log("Game successfully created:", {
      gameId: game.id,
      setsCount: game.sets?.length,
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error saving game:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to save game",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
