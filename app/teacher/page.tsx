import { Suspense } from 'react';
import { OwlLogo } from '@/components/owl-logo';
import { UserProfile } from '@/components/profile';
import { TeacherHeader } from './components/teacher-header';
import { RoomGrid } from './components/room-grid';
import { CreateRoomModal } from './components/create-room-modal';

export default function TeacherRooms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <TeacherHeader />
        <RoomGrid />
      </div>
    </div>
  );
}
