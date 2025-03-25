'use client';

import { Player, GameAction } from '@/types/game';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PlayerSquareProps {
  player: Player;
  onAction: (action: GameAction) => void;
  onPlayerSwap: (newPlayer: Player) => void;
}

const actionButtons = [
  { label: 'Spike', type: 'spike' as const, color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Pass', type: 'pass' as const, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Block', type: 'block' as const, color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Serve', type: 'serve' as const, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Dig', type: 'dig' as const, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { label: 'Set', type: 'set' as const, color: 'bg-pink-500 hover:bg-pink-600' },
  { label: 'Kill', type: 'kill' as const, color: 'bg-orange-500 hover:bg-orange-600' },
  { label: 'Error', type: 'error' as const, color: 'bg-gray-500 hover:bg-gray-600' },
];

export default function PlayerSquare({ player, onAction, onPlayerSwap }: PlayerSquareProps) {
  const handleAction = (actionType: GameAction['type']) => {
    const action: GameAction = {
      type: actionType,
      timestamp: new Date(),
      playerId: player.id,
    };
    console.log(`Action logged for ${player.name}:`, action);
    onAction(action);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const newPlayer = JSON.parse(e.dataTransfer.getData('application/json')) as Player;
      onPlayerSwap(newPlayer);
    } catch (error) {
      console.error('Error handling player drop:', error);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700">
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {player.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {player.position}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {actionButtons.map((button) => (
            <Button
              key={button.type}
              variant="outline"
              size="sm"
              onClick={() => handleAction(button.type)}
              className={`text-white ${button.color} border-transparent`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 