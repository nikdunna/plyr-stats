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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface Team {
  id: string;
  name: string;
}

export default function GameSetup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    opponentTeam: "",
    location: "",
    numberOfSets: "3",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team data
        const teamResponse = await fetch("/api/team");
        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team data");
        }
        const teamData = await teamResponse.json();
        setTeam(teamData);

        // Fetch players
        const playersResponse = await fetch("/api/players");
        if (!playersResponse.ok) {
          throw new Error("Failed to fetch players");
        }
        const playersData = await playersResponse.json();
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user && session.user.role !== "COACH") {
      router.push("/dashboard");
    }
  }, [session?.user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) {
      setError("Team data not found. Please try again.");
      return;
    }

    // Create the game model according to the Prisma schema
    const gameModel = {
      id: crypto.randomUUID(), // This will be replaced by DB
      tournamentId: null,
      teamId: team.id,
      gameDate: new Date(),
      label: formData.label,
      location: formData.location,
      createdAt: new Date(),
      opponentTeam: formData.opponentTeam,
      Team: team,
      tournament: null,
      sets: Array.from({ length: parseInt(formData.numberOfSets) }, (_, i) => ({
        id: crypto.randomUUID(), // This will be replaced by DB
        gameId: crypto.randomUUID(), // This will be replaced by DB
        setNumber: i + 1,
        teamScore: 0,
        opponentScore: 0,
        playerStats: [],
      })),
    };

    // Store game model in localStorage
    localStorage.setItem('currentGameModel', JSON.stringify(gameModel));
    
    // Navigate to lineup setup
    router.push('/lineup-setup');
  };

  if (!session?.user || session.user.role !== "COACH") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">
          You must be a coach to access this page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Set Up New Game</CardTitle>
            <CardDescription>
              Configure the details for your new volleyball game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Game Title
                </label>
                <Input
                  required
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Enter game title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opponent Team
                </label>
                <Input
                  required
                  value={formData.opponentTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, opponentTeam: e.target.value })
                  }
                  placeholder="Enter opponent team name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter game location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Sets
                </label>
                <Select
                  value={formData.numberOfSets}
                  onValueChange={(value) =>
                    setFormData({ ...formData, numberOfSets: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of sets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Sets</SelectItem>
                    <SelectItem value="5">5 Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit">Start Game</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 