'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('minutes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">
          Create New Quiz Room
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="room-name"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              Room Name*
            </label>
            <Input
              id="room-name"
              placeholder="Enter a name for your quiz room"
              className="bg-white border-purple-200"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="room-description"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="room-description"
              rows={3}
              placeholder="Enter a description for your quiz"
              className="w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="room-duration"
              className="block text-sm font-medium text-purple-800 mb-1"
            >
              Duration (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                id="room-duration"
                type="number"
                placeholder="30"
                className="bg-white border-purple-200"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <select
                className="rounded-md border border-purple-200 bg-white px-3 py-2 text-sm"
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
              >
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            className="border-purple-600 text-purple-700 hover:bg-purple-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Link href="/teacher/room/new-room">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create Room
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
