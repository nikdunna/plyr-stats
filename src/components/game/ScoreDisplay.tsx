import { Card, CardContent } from '@/components/ui/card';

interface ScoreDisplayProps {
  homeScore: number;
  opponentScore: number;
  currentSet: number;
  homeSetsWon: number;
  opponentSetsWon: number;
}

export default function ScoreDisplay({ 
  homeScore, 
  opponentScore, 
  currentSet, 
  homeSetsWon, 
  opponentSetsWon 
}: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Home Team Sets Won */}
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-16">
        <CardContent className="p-1.5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] text-gray-600 dark:text-gray-300">Sets</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{homeSetsWon}</div>
          </div>
        </CardContent>
      </Card>

      {/* Home Team Score */}
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-24">
        <CardContent className="p-1.5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{homeScore}</div>
            <div className="text-[10px] text-gray-600 dark:text-gray-300">TEAM 1</div>
          </div>
        </CardContent>
      </Card>

      {/* Current Set */}
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-16">
        <CardContent className="p-1.5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] text-gray-600 dark:text-gray-300">Set</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{currentSet}</div>
          </div>
        </CardContent>
      </Card>

      {/* Opponent Team Score */}
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-24">
        <CardContent className="p-1.5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{opponentScore}</div>
            <div className="text-[10px] text-gray-600 dark:text-gray-300">TEAM 2</div>
          </div>
        </CardContent>
      </Card>

      {/* Opponent Team Sets Won */}
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-16">
        <CardContent className="p-1.5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] text-gray-600 dark:text-gray-300">Sets</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{opponentSetsWon}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 