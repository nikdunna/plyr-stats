'use client';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GameDashboard from '@/components/game/GameDashboard';
import { useEffect, useState } from 'react';
import { Player } from '@/types/game';
import { useRouter } from 'next/navigation';

interface GameData {
  gameModel: any;
  players: Player[];
  benchPlayers: Player[];
}

export default function GamePage() {
  const [gameData, setGameData] = useState<GameData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      // Get game data from localStorage
      const data = localStorage.getItem('currentGameData');
      if (!data) {
        setError('No game data found. Please set up a game first.');
        return;
      }
      
      const parsedData = JSON.parse(data);
      
      // Validate the data structure
      if (!parsedData.players || !parsedData.benchPlayers) {
        setError('Invalid game data structure. Please set up a game again.');
        return;
      }

      setGameData(parsedData);
    } catch (err) {
      setError('Error loading game data. Please try again.');
      console.error('Error loading game data:', err);
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/game-setup')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go to Game Setup
          </button>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading game data...</p>
        </div>
      </div>
    );
  }

  return <GameDashboard initialGameData={gameData} />;
} 