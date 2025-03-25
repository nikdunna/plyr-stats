'use client';

import { Player, GameAction } from '@/types/game';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PlayerSquareProps {
  player: Player;
  onAction: (action: GameAction) => void;
}

const actionButtons = [
  { label: 'Spike', type: 'spike' as const },
  { label: 'Pass', type: 'pass' as const },
  { label: 'Block', type: 'block' as const },
  { label: 'Serve', type: 'serve' as const },
  { label: 'Dig', type: 'dig' as const },
  { label: 'Set', type: 'set' as const },
  { label: 'Kill', type: 'kill' as const },
  { label: 'Error', type: 'error' as const },
];

export default function PlayerSquare({ player, onAction }: PlayerSquareProps) {
  const handleAction = (actionType: GameAction['type']) => {
    const action: GameAction = {
      type: actionType,
      timestamp: new Date(),
      playerId: player.id,
    };
    console.log(`Action logged for ${player.name}:`, action);
    onAction(action);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {player.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {player.position}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          {actionButtons.map((button) => (
            <Button
              key={button.type}
              variant="outline"
              size="sm"
              onClick={() => handleAction(button.type)}
              className="text-xs"
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 