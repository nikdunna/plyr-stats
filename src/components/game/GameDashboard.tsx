'use client';

import { useState } from 'react';
import { Player, GameAction, Game, PlayerStats, Set } from '@/types/game';
import PlayerSquare from './PlayerSquare';
import PlayerSidebar from './PlayerSidebar';
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

// Mock additional players (will come from DB later)
const initialBenchPlayers: Player[] = [
  {
    id: '7',
    name: 'Sub Player 1',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Outside',
  },
  {
    id: '8',
    name: 'Sub Player 2',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Middle',
  },
  {
    id: '9',
    name: 'Sub Player 3',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Setter',
  },
];

export default function GameDashboard() {
  const [game, setGame] = useState<Game>({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    sets: [],
    currentSet: 1,
    players: mockPlayers,
    actions: [],
  });
  const [benchPlayers, setBenchPlayers] = useState<Player[]>(initialBenchPlayers);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpponentServing, setIsOpponentServing] = useState(false);
  const [lastRotatedScore, setLastRotatedScore] = useState<number | null>(null);
  const [confirmingEndSet, setConfirmingEndSet] = useState(false);
  const [confirmingGameOver, setConfirmingGameOver] = useState(false);
  const [currentHomeScore, setCurrentHomeScore] = useState(0);
  const [currentOpponentScore, setCurrentOpponentScore] = useState(0);

  const handleAction = (action: GameAction) => {
    setGame(prev => ({
      ...prev,
      actions: [...prev.actions, { ...action, setNumber: prev.currentSet }],
    }));
  };

  const calculatePlayerStats = (actions: GameAction[]): PlayerStats[] => {
    return game.players.map(player => {
      const playerActions = actions.filter(action => action.playerId === player.id);
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
  };

  const handleGameOver = () => {
    if (!confirmingGameOver) {
      setConfirmingGameOver(true);
      return;
    }

    // Save the final set
    const finalSet: Set = {
      setNumber: game.currentSet,
      homeScore: currentHomeScore,
      opponentScore: currentOpponentScore,
      playerStats: calculatePlayerStats(game.actions.filter(a => a.setNumber === game.currentSet)),
      timestamp: new Date().toISOString(),
    };

    // Save the complete game
    const finalGame: Game = {
      ...game,
      sets: [...game.sets, finalSet],
    };

    // Log the complete game for saving
    console.log('Game Over - Final Game State:', finalGame);

    // Reset the game state
    setGame({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      sets: [],
      currentSet: 1,
      players: mockPlayers,
      actions: [],
    });
    setCurrentHomeScore(0);
    setCurrentOpponentScore(0);
    setConfirmingGameOver(false);
  };

  const handleEndSet = () => {
    if (!confirmingEndSet) {
      setConfirmingEndSet(true);
      return;
    }

    // Save current set data
    const currentSet: Set = {
      setNumber: game.currentSet,
      homeScore: currentHomeScore,
      opponentScore: currentOpponentScore,
      playerStats: calculatePlayerStats(game.actions.filter(a => a.setNumber === game.currentSet)),
      timestamp: new Date().toISOString(),
    };

    // Update game state for new set
    setGame(prev => ({
      ...prev,
      currentSet: prev.currentSet + 1,
      sets: [...prev.sets, currentSet],
    }));
    setCurrentHomeScore(0);
    setCurrentOpponentScore(0);
    setConfirmingEndSet(false);
  };

  const handleScore = (isTeamPoint: boolean, isIncrement: boolean) => {
    if (isTeamPoint) {
      setCurrentHomeScore(prev => {
        const newScore = isIncrement ? prev + 1 : Math.max(0, prev - 1);
        
        if (isIncrement) {
          if (isOpponentServing && prev > 0 && currentOpponentScore > 0) {
            setGame(prev => ({
              ...prev,
              players: [
                prev.players[5],
                prev.players[0],
                prev.players[1],
                prev.players[2],
                prev.players[3],
                prev.players[4],
              ]
            }));
            setLastRotatedScore(newScore);
          }
          setIsOpponentServing(false);
        } else {
          if (prev === lastRotatedScore) {
            setGame(prev => ({
              ...prev,
              players: [
                prev.players[1],
                prev.players[2],
                prev.players[3],
                prev.players[4],
                prev.players[5],
                prev.players[0],
              ]
            }));
            setLastRotatedScore(null);
          }
          if (newScore === 0 && currentOpponentScore === 0) {
            setIsOpponentServing(false);
          }
        }
        
        return newScore;
      });
    } else {
      setCurrentOpponentScore(prev => {
        const newScore = isIncrement ? prev + 1 : Math.max(0, prev - 1);
        
        if (isIncrement) {
          if (!(newScore === 1 && currentHomeScore === 0)) {
            setIsOpponentServing(true);
          }
        } else {
          if (newScore === 0 && currentHomeScore === 0) {
            setIsOpponentServing(false);
          }
        }
        
        return newScore;
      });
    }
  };

  const handlePlayerSwap = (index: number, newPlayer: Player) => {
    const replacedPlayer = game.players[index];
    setGame(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? newPlayer : player
      ),
    }));
    setBenchPlayers(prev => 
      [...prev.filter(p => p.id !== newPlayer.id), replacedPlayer]
    );
  };

  const rotatePlayersClockwise = () => {
    setGame(prev => ({
      ...prev,
      players: [
        prev.players[5], // Position 6 moves to 1
        prev.players[0], // Position 1 moves to 2
        prev.players[1], // Position 2 moves to 3
        prev.players[2], // Position 3 moves to 4
        prev.players[3], // Position 4 moves to 5
        prev.players[4], // Position 5 moves to 6
      ]
    }));
  };

  const rotatePlayersCounterClockwise = () => {
    setGame(prev => ({
      ...prev,
      players: [
        prev.players[1], // Position 2 moves to 1
        prev.players[2], // Position 3 moves to 2
        prev.players[3], // Position 4 moves to 3
        prev.players[4], // Position 5 moves to 4
        prev.players[5], // Position 6 moves to 5
        prev.players[0], // Position 1 moves to 6
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-6">
            {/* Score and Set Controls */}
            <div className="flex items-center justify-between">
              {/* Set Number */}
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Set {game.currentSet}
                </h2>
                <Button
                  variant={confirmingEndSet ? "destructive" : "secondary"}
                  size="sm"
                  onClick={handleEndSet}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {confirmingEndSet ? "Confirm End Set" : "End Set"}
                </Button>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Team</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScore(true, false)}
                      className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                    >
                      -
                    </Button>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                      {currentHomeScore}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScore(true, true)}
                      className="bg-green-500 hover:bg-green-600 text-white border-transparent"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">-</span>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Opponent</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScore(false, false)}
                      className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                    >
                      -
                    </Button>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white min-w-[2rem] text-center">
                      {currentOpponentScore}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScore(false, true)}
                      className="bg-green-500 hover:bg-green-600 text-white border-transparent"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Empty div for flex spacing */}
              <div className="w-[200px]"></div>
            </div>

            {/* Management Controls */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSidebarOpen ? 'Close Players' : 'Manage Players'}
              </Button>
              <Button 
                variant={confirmingGameOver ? "destructive" : "outline"}
                onClick={handleGameOver}
                className={confirmingGameOver ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 hover:bg-gray-600 text-white"}
              >
                {confirmingGameOver ? "Confirm Game Over" : "Game Over"}
              </Button>
            </div>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {game.players.map((player, index) => (
            <PlayerSquare
              key={player.id}
              player={player}
              onAction={handleAction}
              onPlayerSwap={(newPlayer) => handlePlayerSwap(index, newPlayer)}
              currentSet={game.currentSet}
            />
          ))}
        </div>

        {/* Player Management Sidebar */}
        <PlayerSidebar 
          isOpen={isSidebarOpen} 
          players={benchPlayers} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
} 