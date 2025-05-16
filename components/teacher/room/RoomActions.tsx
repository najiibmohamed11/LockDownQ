'use client';

import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RoomActionsProps {
  roomId: string;
  roomStatus: string;
  onToggleStatus: () => void;
  onCopyCode: () => void;
}

export function RoomActions({
  roomId,
  roomStatus,
  onToggleStatus,
  onCopyCode,
}: RoomActionsProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://quiz-app-sepia-gamma.vercel.app/student/${roomId}`
      );
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      onCopyCode();
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button className="bg-purple-600 hover:bg-purple-700 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Share Room
      </Button>

      <Button
        variant="outline"
        className={cn(
          'w-full',
          roomStatus === 'active'
            ? 'border-amber-600 text-amber-700 hover:bg-amber-100'
            : 'border-green-600 text-green-700 hover:bg-green-100'
        )}
        onClick={onToggleStatus}
      >
        {roomStatus === 'active' ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="23" y1="4" x2="1" y2="20" />
              <line x1="1" y1="4" x2="23" y2="20" />
            </svg>
            Pause Room
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Resume Room
          </>
        )}
      </Button>

      <div className="flex items-center mt-4">
        <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-md font-mono text-lg tracking-wider flex-1 text-center">
          https://quiz-app-sepia-gamma.vercel.app/student/{roomId}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-purple-700"
          onClick={handleCopyCode}
        >
          {copiedCode ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
