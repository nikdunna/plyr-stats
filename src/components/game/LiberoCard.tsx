import { Player } from '@/types/game';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface LiberoCardProps {
  player: Player;
  onSwitchMiddle: (player: Player) => void;
  onSwitchLibero: (player: Player) => void;
  onDragStart: (e: React.DragEvent, player: Player) => void;
}

export default function LiberoCard({ player, onSwitchMiddle, onSwitchLibero, onDragStart }: LiberoCardProps) {
  const isLibero = player.position === 'Libero';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, player)}
      className="bg-gray-50 dark:bg-gray-700 p-2 rounded-xl shadow-sm cursor-move hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-600">
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-xs text-gray-900 dark:text-white">{player.name}</h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">{player.position}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => isLibero ? onSwitchMiddle(player) : onSwitchLibero(player)}
            className="mt-1 text-[10px] bg-blue-500 hover:bg-blue-600 text-white border-transparent h-5"
          >
            {isLibero ? 'Switch Middle' : 'Switch Libero'}
          </Button>
        </div>
      </div>
    </div>
  );
} 