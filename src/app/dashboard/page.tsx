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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
          const teamResponse = await fetch("/api/team");
          if (!teamResponse.ok) {
            if (teamResponse.status === 404) {
              setHasTeam(false);
              router.push("/create-team");
              return;
            }
            throw new Error("Failed to fetch team");
          }
          setHasTeam(true);

          const playersResponse = await fetch("/api/players");
          if (playersResponse.ok) {
            const playersData = await playersResponse.json();
            setPlayers(playersData);
          }
        }

        const statsResponse = await fetch(
          `/api/stats${selectedPlayer !== "team" ? `?playerId=${selectedPlayer}` : ""}`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setGameStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <p className="text-gray-900 dark:text-white">Please sign in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session.user.fullName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {session.user.role === "COACH" && (
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
            <Button variant="default" onClick={() => router.push("/game-setup")}>
              Start New Game
            </Button>
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
                  : `${gameStats.length > 0 &&
                      gameStats[gameStats.length - 1]?.stats.hittingPercentage !== undefined
                      ? gameStats[gameStats.length - 1].stats.hittingPercentage.toFixed(1)
                      : "0.0"}%`}
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
                  : `${gameStats.length > 0 &&
                      gameStats[gameStats.length - 1]?.stats.passingPercentage !== undefined
                      ? gameStats[gameStats.length - 1].stats.passingPercentage.toFixed(1)
                      : "0.0"}%`}
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
                  : `${gameStats.length > 0 &&
                      gameStats[gameStats.length - 1]?.stats.servingEfficiency !== undefined
                      ? gameStats[gameStats.length - 1].stats.servingEfficiency.toFixed(1)
                      : "0.0"}%`}
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
                  : `${gameStats.length > 0 &&
                      gameStats[gameStats.length - 1]?.stats.blockingEfficiency !== undefined
                      ? gameStats[gameStats.length - 1].stats.blockingEfficiency.toFixed(1)
                      : "0.0"}%`}
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
              {gameStats.length === 0 ? (
                <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
                  No games recorded yet
                </div>
              ) : (
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
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {game.sets?.filter((set) => set.homeScore > set.opponentScore).length || 0}{" "}
                          -{" "}
                          {game.sets?.filter((set) => set.homeScore < set.opponentScore).length || 0}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Sets Won</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {game.sets?.map((set) => (
                        <div
                          key={set.setNumber}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Set {set.setNumber}
                            </h4>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {set.homeScore} - {set.opponentScore}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Hitting %:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.hittingPercentage?.toFixed(1) || "0.0"}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Passing %:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.passingPercentage?.toFixed(1) || "0.0"}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Serving %:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.servingEfficiency?.toFixed(1) || "0.0"}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Blocking %:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.blockingEfficiency?.toFixed(1) || "0.0"}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Kills:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.kills || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Digs:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {set.stats?.digs || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
                          No set data available
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="hitting" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hitting">Hitting</TabsTrigger>
            <TabsTrigger value="passing">Passing</TabsTrigger>
            <TabsTrigger value="serving">Serving</TabsTrigger>
            <TabsTrigger value="blocking">Blocking</TabsTrigger>
          </TabsList>

          <TabsContent value="hitting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hitting Percentage Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gameStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="stats.hittingPercentage"
                        stroke="#8884d8"
                        name="Hitting %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="passing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Passing Percentage Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gameStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="stats.passingPercentage"
                        stroke="#82ca9d"
                        name="Passing %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="serving" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Serving Efficiency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gameStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="stats.servingEfficiency"
                        stroke="#ffc658"
                        name="Serving %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blocking Efficiency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gameStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="stats.blockingEfficiency"
                        stroke="#ff7300"
                        name="Blocking %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
