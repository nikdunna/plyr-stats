'use client';

import { Player, GameAction, GameActionType } from '@/types/game';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PlayerSquareProps {
  player: Player;
  onAction: (action: GameAction) => void;
  onPlayerSwap: (newPlayer: Player, currentZone: number, baseRotation: number) => void;
  currentSet: number;
  position: number;
  currentRotation: number;
  currentZone: number;
  baseRotation: number;
  isServer: boolean;
}

type ButtonConfig = {
  label: string;
  type: GameActionType;
  color: string;
  detail: string;
  homeScore: boolean;
  awayScore: boolean;
};

const actionGroups: { title: string; buttons: ButtonConfig[] }[] = [
  {
    title: 'SERVING',
    buttons: [
      { label: 'ATT', type: 'serve' as const, color: 'bg-teal-500 hover:bg-teal-600', detail: 'Serve attempt', homeScore: false, awayScore: false },
      { label: 'ACE', type: 'ace' as const, color: 'bg-teal-500 hover:bg-teal-600', detail: 'Ace serve', homeScore: true, awayScore: false },
      { label: 'ERR', type: 'serve_error' as const, color: 'bg-teal-500 hover:bg-teal-600', detail: 'Serve error', homeScore: false, awayScore: true },
    ]
  },
  {
    title: 'HITTING',
    buttons: [
      { label: 'ATT', type: 'attack' as const, color: 'bg-blue-500 hover:bg-blue-600', detail: 'Attack attempt', homeScore: false, awayScore: false },
      { label: 'KILL', type: 'kill' as const, color: 'bg-blue-500 hover:bg-blue-600', detail: 'Kill', homeScore: true, awayScore: false },
      { label: 'ERR', type: 'attack_error' as const, color: 'bg-blue-500 hover:bg-blue-600', detail: 'Attack error', homeScore: false, awayScore: true },
    ]
  },
  {
    title: 'PASSING',
    buttons: [
      { label: '0', type: 'pass_0' as const, color: 'bg-purple-500 hover:bg-purple-600', detail: 'Poor pass', homeScore: false, awayScore: true },
      { label: '1', type: 'pass_1' as const, color: 'bg-purple-500 hover:bg-purple-600', detail: 'Fair pass', homeScore: false, awayScore: false },
      { label: '2', type: 'pass_2' as const, color: 'bg-purple-500 hover:bg-purple-600', detail: 'Good pass', homeScore: false, awayScore: false },
      { label: '3', type: 'pass_3' as const, color: 'bg-purple-500 hover:bg-purple-600', detail: 'Excellent pass', homeScore: false, awayScore: false },
    ]
  },
  {
    title: 'BLOCKING',
    buttons: [
      { label: 'ATT', type: 'block_attempt' as const, color: 'bg-pink-500 hover:bg-pink-600', detail: 'Block attempt', homeScore: false, awayScore: false },
      { label: 'BLK', type: 'block' as const, color: 'bg-pink-500 hover:bg-pink-600', detail: 'Block', homeScore: true, awayScore: false },
      { label: 'ASST', type: 'block_assist' as const, color: 'bg-pink-500 hover:bg-pink-600', detail: 'Block assist', homeScore: false, awayScore: false },
      { label: 'ERR', type: 'block_error' as const, color: 'bg-pink-500 hover:bg-pink-600', detail: 'Block error', homeScore: false, awayScore: true },
    ]
  },
  {
    title: 'SETTING',
    buttons: [
      { label: 'ATT', type: 'set_attempt' as const, color: 'bg-orange-300 hover:bg-orange-400', detail: 'Set attempt', homeScore: false, awayScore: false },
      { label: 'ASST', type: 'assist' as const, color: 'bg-orange-300 hover:bg-orange-400', detail: 'Set assist', homeScore: false, awayScore: false },
      { label: 'ERR', type: 'set_error' as const, color: 'bg-orange-300 hover:bg-orange-400', detail: 'Set error', homeScore: false, awayScore: true },
    ]
  },
  {
    title: 'DEFENSE',
    buttons: [
      { label: 'DIG', type: 'dig' as const, color: 'bg-orange-500 hover:bg-orange-600', detail: 'Dig', homeScore: false, awayScore: false },
      { label: 'ERR', type: 'dig_error' as const, color: 'bg-orange-500 hover:bg-orange-600', detail: 'Dig error', homeScore: false, awayScore: true },
    ]
  },
];

export default function PlayerSquare({ player, onAction, onPlayerSwap, currentSet, position, currentRotation, currentZone, baseRotation, isServer }: PlayerSquareProps) {
  // Calculate the rotated position number without moving the player
  const calculateRotatedPosition = (basePosition: number) => {
    let currentPosition = basePosition;
    for (let i = 0; i < currentRotation - 1; i++) {
      currentPosition = currentPosition === 6 ? 1 : currentPosition + 1;
    }
    return currentPosition;
  };

  const rotatedPosition = calculateRotatedPosition(position);

  const handleAction = (actionType: GameAction['type']) => {
    // Find the button configuration
    const buttonConfig = actionGroups
      .flatMap(group => group.buttons)
      .find(button => button.type === actionType);

    if (!buttonConfig) return;

    const action: GameAction = {
      type: actionType,
      timestamp: new Date(),
      playerId: player.id,
      setNumber: currentSet,
      detail: buttonConfig.detail,
      homeScore: buttonConfig.homeScore,
      awayScore: buttonConfig.awayScore,
    };
    console.log(`Action logged for ${player.name}:`, action);
    onAction(action);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    try {
      const newPlayer = JSON.parse(data) as Player;
      onPlayerSwap(newPlayer, currentZone, baseRotation);
    } catch (error) {
      console.error('Error handling player drop:', error);
    }
  };

  return (
    <div 
      className={`${isServer ? 'bg-red-200 dark:bg-red-950' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg shadow p-2 relative h-full flex flex-col`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Position Number */}
      <div className="absolute top-0.5 right-0.5">
        <span className="bg-blue-500 text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm font-bold transition-all duration-200">
          {currentZone}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <div className="relative w-6 h-6 rounded-lg overflow-hidden">
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-0.5">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              {player.name}
            </h3>
            <span className="bg-teal-500 text-white rounded px-0.5 py-0.5 text-[10px]">
              {player.position}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-between">
        {actionGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <h4 className="text-[8px] font-semibold text-gray-500 dark:text-gray-400">
              {group.title}
            </h4>
            <div className="flex gap-0.5">
              {group.buttons.map((button) => (
                <Button
                  key={button.type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(button.type)}
                  className={`flex-1 text-white text-[10px] ${button.color} border-transparent h-6`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 