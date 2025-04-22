import { FeedAction } from '@/types/game';

interface ActivityFeedProps {
  feed: FeedAction[];
}

export default function ActivityFeed({ feed }: ActivityFeedProps) {
  return (
    <div className="w-36 overflow-hidden mr-4">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1.5 h-full">
        <div className="text-[8px] font-semibold text-gray-600 dark:text-gray-300 mb-0.5">Recent Actions</div>
        <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: '2.5rem' }}>
          {feed.map((action, index) => (
            <div 
              key={index} 
              className="text-[8px] text-gray-900 dark:text-white"
            >
              {action.details}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 