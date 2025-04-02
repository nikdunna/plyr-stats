"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  fullName: string;
  position?: string;
  jerseyNumber?: number;
  imageUrl?: string;
}

interface CourtPosition {
  id: string;
  position: number;
  player: Player | null;
}

export default function LineupSetup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [courtPositions, setCourtPositions] = useState<CourtPosition[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: `position-${i + 1}`,
      position: i + 1,
      player: null,
    }))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players");
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchPlayers();
    }
  }, [session?.user]);

  const handleDragStart = (e: React.DragEvent, player: Player, positionId?: string) => {
    e.dataTransfer.setData("player", JSON.stringify(player));
    if (positionId) {
      e.dataTransfer.setData("sourcePosition", positionId);
    }
  };

  const handleDrop = (e: React.DragEvent, positionId: string) => {
    e.preventDefault();
    const playerData = e.dataTransfer.getData("player");
    const sourcePositionId = e.dataTransfer.getData("sourcePosition");
    
    if (playerData) {
      const player = JSON.parse(playerData);
      
      // Get the target position's current player
      const targetPosition = courtPositions.find(pos => pos.id === positionId);
      const targetPlayer = targetPosition?.player;

      // If dragging from one position to another
      if (sourcePositionId) {
        // If target position has a player, swap them
        if (targetPlayer) {
          setCourtPositions((prev) =>
            prev.map((pos) => {
              if (pos.id === sourcePositionId) {
                return { ...pos, player: targetPlayer };
              }
              if (pos.id === positionId) {
                return { ...pos, player };
              }
              return pos;
            })
          );
        } else {
          // If target position is empty, just move the player
          setCourtPositions((prev) =>
            prev.map((pos) =>
              pos.id === sourcePositionId ? { ...pos, player: null } :
              pos.id === positionId ? { ...pos, player } : pos
            )
          );
        }
      } else {
        // If dragging from available players list
        if (targetPlayer) {
          // If target position has a player, add the new player to available players
          setPlayers((prev) => [...prev, targetPlayer]);
        }
        // Add the new player to the position
        setCourtPositions((prev) =>
          prev.map((pos) =>
            pos.id === positionId ? { ...pos, player } : pos
          )
        );
        // Remove the player from available players
        setPlayers((prev) => prev.filter((p) => p.id !== player.id));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContinue = () => {
    // Create the starting lineup array in the format expected by GameDashboard
    const startingLineup = courtPositions
      .filter((pos) => pos.player)
      .map((pos) => ({
        id: pos.player!.id,
        name: pos.player!.fullName,
        imageUrl: pos.player!.imageUrl || "/images/players/placeholder.jpeg",
        position: pos.player!.position || "Unknown",
      }));

    // Create the bench players array with remaining players
    const benchPlayers = players
      .filter((player) => !courtPositions.some((pos) => pos.player?.id === player.id))
      .map((player) => ({
        id: player.id,
        name: player.fullName,
        imageUrl: player.imageUrl || "/images/players/placeholder.jpeg",
        position: player.position || "Unknown",
      }));

    // Get the game model from localStorage
    const gameModel = JSON.parse(localStorage.getItem('currentGameModel') || 'null');

    // Store all game data in localStorage
    localStorage.setItem('currentGameData', JSON.stringify({
      gameModel,
      players: startingLineup,
      benchPlayers
    }));

    // Navigate to game page
    router.push('/game');
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">
          Please sign in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Set Starting Lineup
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop players to set your starting lineup
            </p>
          </div>
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue to Game
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Court Layout */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Court Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Libero Position */}
                <div
                  key="position-7"
                  className={`aspect-square border-2 border-dashed rounded-lg p-4 flex items-center justify-center ${
                    courtPositions[6]?.player
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  onDrop={(e) => handleDrop(e, "position-7")}
                  onDragOver={handleDragOver}
                >
                  {courtPositions[6]?.player ? (
                    <div 
                      className="text-center cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, courtPositions[6].player!, "position-7")}
                    >
                      <div className="font-semibold text-lg truncate">{courtPositions[6].player.fullName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {courtPositions[6].player.position || "Unknown"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 dark:text-gray-600 text-lg">
                      L
                    </div>
                  )}
                </div>

                {/* Empty space for layout */}
                <div className="aspect-square"></div>
                <div className="aspect-square"></div>

                {/* Court Positions */}
                {[4, 5, 2, 6, 3, 1].map((posNumber, index) => (
                  <div
                    key={`position-${posNumber}-${index}`}
                    className={`aspect-square border-2 border-dashed rounded-lg p-4 flex items-center justify-center ${
                      courtPositions[index]?.player
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    onDrop={(e) => handleDrop(e, `position-${index + 1}`)}
                    onDragOver={handleDragOver}
                  >
                    {courtPositions[index]?.player ? (
                      <div 
                        className="text-center cursor-move"
                        draggable
                        onDragStart={(e) => handleDragStart(e, courtPositions[index].player!, `position-${index + 1}`)}
                      >
                        <div className="font-semibold text-lg truncate">{courtPositions[index].player.fullName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {courtPositions[index].player.position || "Unknown"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 dark:text-gray-600 text-lg">
                        {posNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Players */}
          <Card>
            <CardHeader>
              <CardTitle>Available Players</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 min-h-[400px] transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onDrop={(e) => {
                  e.preventDefault();
                  const playerData = e.dataTransfer.getData("player");
                  const sourcePositionId = e.dataTransfer.getData("sourcePosition");
                  
                  if (playerData && sourcePositionId) {
                    const player = JSON.parse(playerData);
                    // Add player back to bench
                    setPlayers((prev) => [...prev, player]);
                    // Remove player from court position
                    setCourtPositions((prev) =>
                      prev.map((pos) =>
                        pos.id === sourcePositionId ? { ...pos, player: null } : pos
                      )
                    );
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                }}
              >
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      Loading players...
                    </div>
                  ) : players.length === 0 ? (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      No players available
                    </div>
                  ) : (
                    players.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 border rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-800"
                        draggable
                        onDragStart={(e) => handleDragStart(e, player)}
                      >
                        <div className="font-medium">{player.fullName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {player.position || "Unknown"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 