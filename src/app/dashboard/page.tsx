"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  id: string;
  fullName: string;
  position?: string;
  jerseyNumber?: number;
}

interface GameStats {
  gameId: string;
  gameDate: string;
  label: string;
  opponent: string;
  sets: {
    setNumber: number;
    homeScore: number;
    opponentScore: number;
    stats: {
      hittingPercentage: number;
      passingPercentage: number;
      servingEfficiency: number;
      blockingEfficiency: number;
      digs: number;
      kills: number;
      assists: number;
    };
  }[];
  stats: {
    hittingPercentage: number;
    passingPercentage: number;
    servingEfficiency: number;
    blockingEfficiency: number;
    digs: number;
    kills: number;
    assists: number;
  };
  location?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("team");
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTeamAndFetchData = async () => {
      try {
        if (session?.user?.role === "COACH") {
          // TODO: Change this check to team exist, not if stats exist
          // Check if coach has a team by trying to fetch stats
          const teamResponse = await fetch("/api/team");
          if (!teamResponse.ok) {
            if (teamResponse.status === 404) {
              // No team found
              setHasTeam(false);
              router.push("/create-team");
              return;
            }
            throw new Error("Failed to fetch team");
          }
          setHasTeam(true);

          // Fetch players if coach has a team
          const playersResponse = await fetch("/api/players");
          if (playersResponse.ok) {
            const playersData = await playersResponse.json();
            setPlayers(playersData);
          }
        }

        // Fetch game stats
        const statsResponse = await fetch(
          `/api/stats${
            selectedPlayer !== "team" ? `?playerId=${selectedPlayer}` : ""
          }`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setGameStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set default empty stats if there's an error
        setGameStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      checkTeamAndFetchData();
    }
  }, [session?.user, selectedPlayer, router]);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">
          Please sign in to view the dashboard.
        </p>
      </div>
    );
  }

  // Default stats for when there's no data
  const defaultStats = {
    hittingPercentage: 0,
    passingPercentage: 0,
    servingEfficiency: 0,
    blockingEfficiency: 0,
    digs: 0,
    kills: 0,
    assists: 0,
  };

  const currentStats = gameStats[gameStats.length - 1]?.stats || defaultStats;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session.user.fullName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {session.user.role === "COACH" && hasTeam && (
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team Stats</SelectItem>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {hasTeam && (
              <a
                href="/game-setup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start New Game
              </a>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Hitting %</CardTitle>
              <CardDescription>Kill efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `${currentStats.hittingPercentage.toFixed(1)}%`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passing %</CardTitle>
              <CardDescription>Pass quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `${currentStats.passingPercentage.toFixed(1)}%`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serving</CardTitle>
              <CardDescription>Serve efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `${currentStats.servingEfficiency.toFixed(1)}%`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blocking</CardTitle>
              <CardDescription>Block efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `${currentStats.blockingEfficiency.toFixed(1)}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
            <CardDescription>Detailed set-by-set performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {gameStats.length > 0 ? (
                gameStats.map((game) => (
                  <div
                    key={game.gameId}
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {game.label}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>vs {game.opponent}</span>
                          {game.location && (
                            <>
                              <span>•</span>
                              <span>{game.location}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(game.gameDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No games recorded yet. Start a new game to track statistics.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
