'use client';

import { useState } from 'react';
import { Player, GameAction, GameState } from '@/types/game';
import PlayerSquare from './PlayerSquare';
import { Button } from '@/components/ui/button';

// Mock data for testing
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Player 1',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Setter',
  },
  {
    id: '2',
    name: 'Player 2',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Outside',
  },
  {
    id: '3',
    name: 'Player 3',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Middle',
  },
  {
    id: '4',
    name: 'Player 4',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Opposite',
  },
  {
    id: '5',
    name: 'Player 5',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Libero',
  },
  {
    id: '6',
    name: 'Player 6',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Outside',
  },
];

export default function GameDashboard() {
  const [gameState, setGameState] = useState<GameState>({
    currentSet: 1,
    players: mockPlayers,
    actions: [],
  });

  const handleAction = (action: GameAction) => {
    setGameState(prev => ({
      ...prev,
      actions: [...prev.actions, action],
    }));
  };

  const handleSetChange = (increment: boolean) => {
    setGameState(prev => ({
      ...prev,
      currentSet: increment ? prev.currentSet + 1 : Math.max(1, prev.currentSet - 1),
    }));
  };

  const handleGameOver = () => {
    // Calculate stats for each player
    const playerStats = gameState.players.map(player => {
      const playerActions = gameState.actions.filter(action => action.playerId === player.id);
      const stats = {
        spikes: playerActions.filter(a => a.type === 'spike').length,
        passes: playerActions.filter(a => a.type === 'pass').length,
        blocks: playerActions.filter(a => a.type === 'block').length,
        serves: playerActions.filter(a => a.type === 'serve').length,
        digs: playerActions.filter(a => a.type === 'dig').length,
        sets: playerActions.filter(a => a.type === 'set').length,
        kills: playerActions.filter(a => a.type === 'kill').length,
        errors: playerActions.filter(a => a.type === 'error').length,
      };

      return {
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        stats,
        totalActions: playerActions.length,
      };
    });

    // For now, just log the stats (this would be a DB call in the future)
    console.log('Game Over - Player Stats:', playerStats);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleSetChange(false)}
                disabled={gameState.currentSet <= 1}
                className="w-full sm:w-auto"
              >
                Previous Set
              </Button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Set {gameState.currentSet}
              </h2>
              <Button
                variant="outline"
                onClick={() => handleSetChange(true)}
                className="w-full sm:w-auto"
              >
                Next Set
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Manage Players
              </Button>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={handleGameOver}
              >
                Game Over
              </Button>
            </div>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gameState.players.map((player) => (
            <PlayerSquare
              key={player.id}
              player={player}
              onAction={handleAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 