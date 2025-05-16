import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  PlusCircle,
  Clock,
  CircleHelp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUsersRoom } from '@/app/server/queries';

export async function RoomGrid() {

  const result = await getUsersRoom()

  if (result.length == 0) {
    return <EmptyRoom />;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((room) => (
          <Link href={`/teacher/room/${room.id}`} key={room.id}>
            <div className="group h-full">
              <Card className="h-full bg-white/90 backdrop-blur-sm border-purple-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-purple-900 line-clamp-1">
                      {room.name}
                    </h3>
                    <div
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        room.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : room.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : room.status === 'finish'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-indigo-100 text-indigo-800'
                      )}
                    >
                      {room.status
                        ? room.status.charAt(0).toUpperCase() +
                          room.status.slice(1)
                        : 'Draft'}
                    </div>
                  </div>

                  <div className="space-y-3">             
                    <div className="flex items-center text-purple-800 ">
                      <CircleHelp className="h-4 w-4 mr-2" />
                      <span>{room.numberOfQuestions || 0} questions</span>
                    </div>

                    {
                      <div className="flex items-center text-purple-800">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {room.duration
                            ? `${room.duration} minutes`
                            : '  unlimited'}{' '}
                        </span>
                      </div>
                    }
                  </div>
                </div>
                <div className="px-6 py-4 bg-purple-50 flex justify-between items-center">
                  <span className="text-sm text-purple-700">
                    Created {formatDate(room.created_at)}
                  </span>
                </div>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function EmptyRoom() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
      <h3 className="text-xl font-semibold text-purple-900 mb-2">
        No quiz rooms found
      </h3>

      <Button className="bg-purple-600 hover:bg-purple-700">
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Room
      </Button>
    </div>
  );
}
