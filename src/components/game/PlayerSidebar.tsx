import { Player } from '@/types/game';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PlayerSidebarProps {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
}

export default function PlayerSidebar({ isOpen, players, onClose }: PlayerSidebarProps) {
  return (
    <div 
      className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Players</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(player));
              }}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-sm cursor-move hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-600">
                  <Image
                    src={player.imageUrl}
                    alt={player.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{player.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{player.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 