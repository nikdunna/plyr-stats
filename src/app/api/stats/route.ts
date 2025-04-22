import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Game, Set, PlayerStats } from "@prisma/client";

type GameWithSets = Game & {
  sets: (Set & {
    playerStats: PlayerStats[];
  })[];
  opponentTeam: string | null;
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's team
    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { coachId: session.user.id },
          {
            teamPlayers: {
              some: {
                playerId: session.user.id,
              },
            },
          },
        ],
      },
    });

    if (!team) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    // Get the playerId from the query parameters if it exists
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");

    // If playerId is provided and user is not a coach, verify it's their own stats
    if (
      playerId &&
      session.user.role === "PLAYER" &&
      playerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all games for the team
    const games = (await prisma.game.findMany({
      where: {
        teamId: team.id,
      },
      include: {
        sets: {
          include: {
            playerStats: {
              where: playerId ? { playerId } : undefined,
            },
          },
        },
      },
      orderBy: {
        gameDate: "asc",
      },
    })) as unknown as GameWithSets[];

    // Calculate stats for each game
    const gameStats = games.map((game) => {
      const allPlayerStats = game.sets.flatMap((set) => set.playerStats);

      // Calculate team stats
      const stats = {
        hittingPercentage: calculateHittingPercentage(allPlayerStats),
        passingPercentage: calculatePassingPercentage(allPlayerStats),
        servingEfficiency: calculateServingEfficiency(allPlayerStats),
        blockingEfficiency: calculateBlockingEfficiency(allPlayerStats),
        digs: allPlayerStats.reduce((sum, stat) => sum + (stat.digs || 0), 0),
        kills: allPlayerStats.reduce((sum, stat) => sum + (stat.kills || 0), 0),
        assists: allPlayerStats.reduce(
          (sum, stat) => sum + (stat.assists || 0),
          0
        ),
      };

      // Calculate stats for each set
      const sets = game.sets.map((set) => {
        const setPlayerStats = set.playerStats;
        return {
          setNumber: set.setNumber,
          homeScore: set.teamScore,
          opponentScore: set.opponentScore,
          stats: {
            hittingPercentage: calculateHittingPercentage(setPlayerStats),
            passingPercentage: calculatePassingPercentage(setPlayerStats),
            servingEfficiency: calculateServingEfficiency(setPlayerStats),
            blockingEfficiency: calculateBlockingEfficiency(setPlayerStats),
            digs: setPlayerStats.reduce(
              (sum, stat) => sum + (stat.digs || 0),
              0
            ),
            kills: setPlayerStats.reduce(
              (sum, stat) => sum + (stat.kills || 0),
              0
            ),
            assists: setPlayerStats.reduce(
              (sum, stat) => sum + (stat.assists || 0),
              0
            ),
          },
        };
      });

      return {
        gameId: game.id,
        gameDate: game.gameDate?.toISOString() || "",
        label: game.label || `Game ${game.id.slice(0, 8)}`,
        opponent: game.opponentTeam || "Unknown Opponent",
        location: game.location || "Unknown Location",
        sets,
        stats,
      };
    });

    return NextResponse.json(gameStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateHittingPercentage(stats: any[]) {
  const totalKills = stats.reduce((sum, stat) => sum + (stat.kills || 0), 0);
  const totalErrors = stats.reduce(
    (sum, stat) => sum + (stat.hittingErrors || 0),
    0
  );
  const totalAttempts = stats.reduce(
    (sum, stat) => sum + (stat.hitAttempts || 0),
    0
  );

  if (totalAttempts === 0) return 0;
  return ((totalKills - totalErrors) / totalAttempts) * 100;
}

function calculatePassingPercentage(stats: any[]) {
  const threePass = stats.reduce((sum, stat) => sum + (stat.threePass || 0), 0);
  const twoPass = stats.reduce((sum, stat) => sum + (stat.twoPass || 0), 0);
  const onePass = stats.reduce((sum, stat) => sum + (stat.onePass || 0), 0);
  const totalPasses =
    threePass +
    twoPass +
    onePass +
    stats.reduce((sum, stat) => sum + (stat.zeroPass || 0), 0);

  if (totalPasses === 0) return 0;
  return ((threePass * 3 + twoPass * 2 + onePass) / (totalPasses * 3)) * 100;
}

function calculateServingEfficiency(stats: any[]) {
  const totalAces = stats.reduce((sum, stat) => sum + (stat.aces || 0), 0);
  const totalErrors = stats.reduce(
    (sum, stat) => sum + (stat.serviceErrors || 0),
    0
  );
  const totalServes = stats.reduce((sum, stat) => sum + (stat.serves || 0), 0);

  if (totalServes === 0) return 0;
  return ((totalAces - totalErrors) / totalServes) * 100;
}

function calculateBlockingEfficiency(stats: any[]) {
  const totalKillBlocks = stats.reduce(
    (sum, stat) => sum + (stat.killBlocks || 0),
    0
  );
  const totalErrors = stats.reduce(
    (sum, stat) => sum + (stat.blockingErrors || 0),
    0
  );
  const totalTouches = stats.reduce(
    (sum, stat) => sum + (stat.blockTouches || 0),
    0
  );

  if (totalTouches === 0) return 0;
  return ((totalKillBlocks - totalErrors) / totalTouches) * 100;
}
