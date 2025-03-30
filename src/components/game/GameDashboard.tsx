'use client';

import { useState, useRef, useEffect } from 'react';
import { Player, GameAction, Game, PlayerStats, Set, GameActionType, FeedAction } from '@/types/game';
import PlayerSquare from './PlayerSquare';
import PlayerSidebar from './PlayerSidebar';
import LiberoCard from './LiberoCard';
import ActivityFeed from './ActivityFeed';
import ScoreDisplay from './ScoreDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


interface GameDashboardProps {
  initialGame?: Game;
}

interface PlayerWithStats extends Player {
  stats?: {
    spikes: number;
    kills: number;
    errors: number;
    passes: number;
    passRating: number;
    sets: number;
    setErrors: number;
  };
}

// Mock data for testing
const mockPlayers: Player[] = [
  {
    id: '4',
    name: 'Player 4',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Opposite',
  },
  {
    id: '3',
    name: 'Player 3',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Middle',
  },
  {
    id: '2',
    name: 'Player 2',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Outside',
  },
  {
    id: '5',
    name: 'Player 5',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Outside',
  },
  {
    id: '6',
    name: 'Player 6',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Middle',
  },
  {
    id: '1',
    name: 'Player 1',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Setter',
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
  {
    id: '10',
    name: 'Libero Player',
    imageUrl: '/images/players/placeholder.jpeg',
    position: 'Libero',
  },
];

export default function GameDashboard({ initialGame }: GameDashboardProps) {
  const defaultGame: Game = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    sets: [],
    currentSet: 1,
    players: mockPlayers,
    actions: [],
  };

  const [game, setGame] = useState<Game>(initialGame || defaultGame);
  const [benchPlayers, setBenchPlayers] = useState<Player[]>(initialBenchPlayers);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpponentServing, setIsOpponentServing] = useState(false);
  const [lastRotatedScore, setLastRotatedScore] = useState<number | null>(null);
  const [confirmingEndSet, setConfirmingEndSet] = useState(false);
  const [confirmingGameOver, setConfirmingGameOver] = useState(false);
  const [currentHomeScore, setCurrentHomeScore] = useState(0);
  const [currentOpponentScore, setCurrentOpponentScore] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(1);
  const [isReceiving, setIsReceiving] = useState(false);
  const [homeSetsWon, setHomeSetsWon] = useState(0);
  const [opponentSetsWon, setOpponentSetsWon] = useState(0);
  const hasProcessedRotation = useRef(false);
  const [liberoPosition, setLiberoPosition] = useState<number | null>(null);
  const [activeLibero, setActiveLibero] = useState<Player | null>(null);
  const [feed, setFeed] = useState<FeedAction[]>([]);

  // Initialize the active Libero when the component mounts
  useEffect(() => {
    const benchLibero = benchPlayers.find(p => p.position === 'Libero');
    if (benchLibero) {
      setActiveLibero(benchLibero);
    }
  }, []);

  const updateRotation = (increment: boolean) => {
    console.log('Updating rotation:', { currentRotation, increment });
    setCurrentRotation(prev => {
      const newRotation = increment ? prev + 1 : prev - 1;
      console.log('New rotation will be:', newRotation);
      return increment ? (newRotation > 6 ? 1 : newRotation) : (newRotation < 1 ? 6 : newRotation);
    });
  };

  const addToFeed = (action: FeedAction) => {
    setFeed(prev => [action, ...prev].slice(0, 5)); // Keep only the 5 most recent actions
  };

  const handlePlayerAction = (action: GameAction) => {
    // Handle scoring based on action properties
    if (action.homeScore) {
      handleScore(true, true); // Increment home team score
      setIsReceiving(false); // Home team is now serving
    } else if (action.awayScore) {
      handleScore(false, true); // Increment opponent score
      setIsReceiving(true); // Home team is now receiving
    }

    // Add to feed
    const player = game.players.find(p => p.id === action.playerId);
    addToFeed({
      type: action.type,
      timestamp: action.timestamp,
      playerId: action.playerId,
      playerName: player?.name,
      details: `${player?.name} ${action.detail}`,
      setNumber: action.setNumber,
    });

    // Update game state with new action
    setGame(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (player.id === action.playerId) {
          const playerWithStats = player as PlayerWithStats;
          if (!playerWithStats.stats) {
            playerWithStats.stats = {
              spikes: 0,
              kills: 0,
              errors: 0,
              passes: 0,
              passRating: 0,
              sets: 0,
              setErrors: 0,
            };
          }

          // Update player stats based on action type
          switch (action.type) {
            case 'kill':
            case 'attack_error':
              return {
                ...playerWithStats,
                stats: {
                  ...playerWithStats.stats,
                  spikes: playerWithStats.stats.spikes + 1,
                  kills: action.type === 'kill' ? playerWithStats.stats.kills + 1 : playerWithStats.stats.kills,
                  errors: action.type === 'attack_error' ? playerWithStats.stats.errors + 1 : playerWithStats.stats.errors,
                }
              };
            case 'pass_0':
            case 'pass_1':
            case 'pass_2':
            case 'pass_3':
              return {
                ...playerWithStats,
                stats: {
                  ...playerWithStats.stats,
                  passes: playerWithStats.stats.passes + 1,
                  passRating: calculatePassRating(action.type),
                }
              };
            case 'set_error':
            case 'assist':
              return {
                ...playerWithStats,
                stats: {
                  ...playerWithStats.stats,
                  sets: playerWithStats.stats.sets + 1,
                  setErrors: action.type === 'set_error' ? playerWithStats.stats.setErrors + 1 : playerWithStats.stats.setErrors,
                }
              };
            default:
              return playerWithStats;
          }
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
        actions: [...prev.actions, action],
      };
    });
  };

  const calculatePassRating = (actionType: GameActionType): number => {
    switch (actionType) {
      case 'pass_0': return 0;
      case 'pass_1': return 1;
      case 'pass_2': return 2;
      case 'pass_3': return 3;
      default: return 0;
    }
  };

  const calculatePlayerStats = (actions: GameAction[]): PlayerStats[] => {
    return game.players.map(player => {
      const playerActions = actions.filter(action => action.playerId === player.id);
      const stats = {
        // Serving stats
        serveAttempts: playerActions.filter(a => a.type === 'serve').length,
        aces: playerActions.filter(a => a.type === 'ace').length,
        serveErrors: playerActions.filter(a => a.type === 'serve_error').length,

        // Hitting stats
        attackAttempts: playerActions.filter(a => a.type === 'attack').length,
        kills: playerActions.filter(a => a.type === 'kill').length,
        attackErrors: playerActions.filter(a => a.type === 'attack_error').length,

        // Passing stats
        zeroPasses: playerActions.filter(a => a.type === 'pass_0').length,
        onePasses: playerActions.filter(a => a.type === 'pass_1').length,
        twoPasses: playerActions.filter(a => a.type === 'pass_2').length,
        threePasses: playerActions.filter(a => a.type === 'pass_3').length,

        // Blocking stats
        blockAttempts: playerActions.filter(a => a.type === 'block_attempt').length,
        blocks: playerActions.filter(a => a.type === 'block').length,
        blockAssists: playerActions.filter(a => a.type === 'block_assist').length,
        blockErrors: playerActions.filter(a => a.type === 'block_error').length,

        // Setting stats
        setAttempts: playerActions.filter(a => a.type === 'set_attempt').length,
        setAssists: playerActions.filter(a => a.type === 'assist').length,
        setErrors: playerActions.filter(a => a.type === 'set_error').length,

        // Defense stats
        digs: playerActions.filter(a => a.type === 'dig').length,
        digErrors: playerActions.filter(a => a.type === 'dig_error').length,

        // Scoring stats
        pointsScored: playerActions.filter(a => a.homeScore).length,
        pointsGiven: playerActions.filter(a => a.awayScore).length,
        totalActions: playerActions.length,
        actionDetails: playerActions.map(a => ({
          type: a.type,
          detail: a.detail,
          timestamp: a.timestamp,
          setNumber: a.setNumber
        }))
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

    // Add to feed
    addToFeed({
      type: 'game_end',
      timestamp: new Date(),
      details: `Game ended with final score ${currentHomeScore}-${currentOpponentScore}`,
      setNumber: game.currentSet,
    });

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

    // Determine which team won the set
    const homeTeamWon = currentHomeScore > currentOpponentScore;

    // Update sets won count
    if (homeTeamWon) {
      setHomeSetsWon(prev => prev + 1);
    } else {
      setOpponentSetsWon(prev => prev + 1);
    }

    // Add to feed
    addToFeed({
      type: 'set_end',
      timestamp: new Date(),
      details: `Set ${game.currentSet} ended with score ${currentHomeScore}-${currentOpponentScore} (${homeTeamWon ? 'Home' : 'Opponent'} won)`,
      setNumber: game.currentSet,
    });

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

  // Function to calculate current zone for a player
  const calculateCurrentZone = (basePosition: number) => {
    let currentPosition = basePosition;
    for (let i = 0; i < currentRotation - 1; i++) {
      currentPosition = currentPosition === 6 ? 1 : currentPosition + 1;
    }
    return currentPosition;
  };

  // Function to check if a middle player is in the back row
  const isMiddleInBackRow = (playerIndex: number) => {
    const basePositions = [4, 3, 2, 5, 6, 1];
    return calculateCurrentZone(basePositions[playerIndex]) === 1 ||
      calculateCurrentZone(basePositions[playerIndex]) === 6 ||
      calculateCurrentZone(basePositions[playerIndex]) === 5;
  };

  const handleScore = (isTeamPoint: boolean, isIncrement: boolean) => {
    console.log('handleScore called with:', { isTeamPoint, isIncrement });
    // Reset the rotation processing flag at the start of each score update
    hasProcessedRotation.current = false;

    if (isTeamPoint) {
      // Store the current values before updating
      const prevScore = currentHomeScore;
      const shouldRotate = isOpponentServing && prevScore > 0 && currentOpponentScore > 0;

      setCurrentHomeScore(prev => {
        const newScore = isIncrement ? prev + 1 : Math.max(0, prev - 1);
        console.log('Updating home score:', { prev, newScore });

        if (isIncrement) {
          // When home team scores
          if (shouldRotate && !hasProcessedRotation.current) {
            console.log('Conditions met for rotation:', {
              isOpponentServing,
              prevScore,
              currentOpponentScore
            });
            // Only update the rotation number, don't move players
            setLastRotatedScore(newScore);
            console.log('Home team scored, updating rotation');
            updateRotation(true);
            hasProcessedRotation.current = true;
          }
          setIsOpponentServing(false);
          setIsReceiving(false); // Home team is now serving
        } else {
          if (prev === lastRotatedScore) {
            setLastRotatedScore(null);
            console.log('Home team lost point, updating rotation');
            updateRotation(false);
          }
          if (newScore === 0 && currentOpponentScore === 0) {
            setIsOpponentServing(false);
            setIsReceiving(true);
          }
        }

        return newScore;
      });
    } else {
      setCurrentOpponentScore(prev => {
        const newScore = isIncrement ? prev + 1 : Math.max(0, prev - 1);
        console.log('Updating opponent score:', { prev, newScore });

        if (isIncrement) {
          // When opponent scores
          if (!(newScore === 1 && currentHomeScore === 0)) {
            setIsOpponentServing(true);
            setIsReceiving(true); // Home team is now receiving
          }
        } else {
          if (newScore === 0 && currentHomeScore === 0) {
            setIsOpponentServing(false);
            setIsReceiving(true);
          }
        }

        return newScore;
      });
    }

    // Log current zones for each player after the score update
    console.log('Current player zones after point:', game.players.map((player, index) => {
      const basePosition = [4, 3, 2, 5, 6, 1][index];
      const currentZone = calculateCurrentZone(basePosition);
      return {
        playerName: player.name,
        position: player.position,
        basePosition,
        currentZone,
        currentRotation
      };
    }));
  };

  const handlePlayerSwap = (index: number, newPlayer: Player, currentZone: number, baseRotation: number) => {
    const replacedPlayer = game.players[index];

    // Add to feed
    addToFeed({
      type: 'player_swap',
      timestamp: new Date(),
      playerId: newPlayer.id,
      playerName: newPlayer.name,
      details: `${newPlayer.name} replaced ${replacedPlayer.name} at zone ${currentZone}`,
      setNumber: game.currentSet,
    });

    // If the new player is the Libero, update the activeLibero state
    if (newPlayer.position === 'Libero') {
      setActiveLibero(newPlayer);
    } else if (replacedPlayer.position === 'Libero') {
      // If we're replacing the Libero, update activeLibero with the player that replaced them
      setActiveLibero(replacedPlayer);
    }

    setGame(prev => ({
      ...prev,
      players: prev.players.map((player, i) =>
        i === index ? newPlayer : player
      ),
    }));

    // Only add the replaced player to bench if they're not the Libero
    if (replacedPlayer.position !== 'Libero') {
      setBenchPlayers(prev =>
        [...prev.filter(p => p.id !== newPlayer.id), replacedPlayer]
      );
    }
  };

  // Add this new function to handle Libero drag start
  const handleLiberoDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.setData('application/json', JSON.stringify(player));
  };

  // Add this new function to handle Libero position updates
  const handleLiberoPositionUpdate = (position: number) => {
    setLiberoPosition(position);
  };

  const handleLiberoSwitchMiddle = (player: Player) => {
    // Find a middle player in the back row
    const middlePlayerIndex = game.players.findIndex(p =>
      p.position === 'Middle' && isMiddleInBackRow(game.players.indexOf(p))
    );

    if (middlePlayerIndex !== -1) {
      const middlePlayer = game.players[middlePlayerIndex];

      // Add to feed
      addToFeed({
        type: 'libero_switch',
        timestamp: new Date(),
        playerId: player.id,
        playerName: player.name,
        details: `${player.name} switched with ${middlePlayer.name} for Libero rotation`,
        setNumber: game.currentSet,
      });

      // Update the Libero card with the middle player's information
      setActiveLibero(middlePlayer);

      // Update the game state to swap the players
      setGame(prev => ({
        ...prev,
        players: prev.players.map((p, i) =>
          i === middlePlayerIndex ? player : p
        ),
      }));

      // Update bench players - replace the Libero with the middle player
      setBenchPlayers(prev =>
        prev.map(p => p.id === player.id ? middlePlayer : p)
      );
    }
  };

  const handleLiberoSwitchLibero = (player: Player) => {
    // Find the Libero in the game players
    const liberoIndex = game.players.findIndex(p => p.position === 'Libero');

    if (liberoIndex !== -1) {
      const currentLibero = game.players[liberoIndex];

      // Add to feed
      addToFeed({
        type: 'libero_switch',
        timestamp: new Date(),
        playerId: player.id,
        playerName: player.name,
        details: `${player.name} switched with ${currentLibero.name} for Libero rotation`,
        setNumber: game.currentSet,
      });

      // Update the Libero card with the Libero's information
      setActiveLibero(currentLibero);

      // Update the game state to swap the players
      setGame(prev => ({
        ...prev,
        players: prev.players.map((p, i) =>
          i === liberoIndex ? player : p
        ),
      }));

      // Update bench players - replace the Libero with the current player
      setBenchPlayers(prev =>
        prev.map(p => p.id === player.id ? currentLibero : p)
      );
    }
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 dark:bg-gray-900 p-2 flex flex-col overflow-hidden">
      {/* Main Layout */}
      <div className="flex-none">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1.5">
          {/* Right Side - Libero Card */}
          <div className="mr-2">
            {activeLibero && (
              <LiberoCard
                player={activeLibero}
                onSwitchMiddle={handleLiberoSwitchMiddle}
                onSwitchLibero={handleLiberoSwitchLibero}
                onDragStart={handleLiberoDragStart}
              />
            )}
          </div>
          {/* Left Side - Rotation Card */}
          <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-16 ml-4">

            <CardContent className="p-1.5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[10px] text-gray-600 dark:text-gray-300">Rotation</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{currentRotation}</div>
                <div className="text-[10px] font-medium text-gray-900 dark:text-white">
                  {isReceiving ? 'Receiving' : 'Serving'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center - Score Display */}
          <div className="flex-1 flex justify-center">
            <ScoreDisplay
              homeScore={currentHomeScore}
              opponentScore={currentOpponentScore}
              currentSet={game.currentSet}
              homeSetsWon={homeSetsWon}
              opponentSetsWon={opponentSetsWon}
            />
          </div>

          {/* Activity Feed */}
          <ActivityFeed feed={feed} />

          {/* Right Controls */}
          <div className="flex flex-col gap-0.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-200 dark:border-gray-600 h-5 text-[10px] px-1.5"
            >
              Bench
            </Button>
            <Button
              variant={confirmingEndSet ? "destructive" : "secondary"}
              size="sm"
              onClick={handleEndSet}
              className={`${confirmingEndSet ?
                "bg-red-500 hover:bg-red-600 text-white" :
                "bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-200 dark:border-gray-600"} h-5 text-[10px] px-1.5`}
            >
              {confirmingEndSet ? "Confirm End" : "End Set"}
            </Button>
            <Button
              variant={confirmingGameOver ? "destructive" : "secondary"}
              size="sm"
              onClick={handleGameOver}
              className={`${confirmingGameOver ?
                "bg-red-500 hover:bg-red-600 text-white" :
                "bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-200 dark:border-gray-600"} h-5 text-[10px] px-1.5`}
            >
              {confirmingGameOver ? "Confirm End" : "Game Over"}
            </Button>
          </div>
        </div>
      </div>

      {/* Player Grid - Fixed positions */}
      <div className="flex-1 overflow-hidden p-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
          {game.players.map((player, index) => {
            const basePosition = [4, 3, 2, 5, 6, 1][index];
            const currentZone = calculateCurrentZone(basePosition);
            return (
              <PlayerSquare
                key={player.id}
                player={player}
                position={basePosition}
                onAction={handlePlayerAction}
                onPlayerSwap={(newPlayer, currentZone, baseRotation) => handlePlayerSwap(index, newPlayer, currentZone, baseRotation)}
                currentSet={game.currentSet}
                currentRotation={currentRotation}
                currentZone={currentZone}
                baseRotation={basePosition}
                isServer={currentZone === 1 && !isReceiving}
              />
            );
          })}
        </div>
      </div>

      {/* Player Management Sidebar */}
      <PlayerSidebar
        isOpen={isSidebarOpen}
        players={benchPlayers}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
} 