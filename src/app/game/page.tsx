'use client';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GameDashboard from '@/components/game/GameDashboard';
import { useEffect, useState } from 'react';
import { Player } from '@/types/game';

interface GameData {
  gameModel: any;
  players: Player[];
  benchPlayers: Player[];
}

export default function GamePage() {
  const [gameData, setGameData] = useState<GameData | undefined>(undefined);

  useEffect(() => {
    // Get game data from localStorage
    const data = localStorage.getItem('currentGameData');
    if (data) {
      setGameData(JSON.parse(data));
    }
  }, []);

  return <GameDashboard initialGameData={gameData} />;
} 