import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { OwlLogo } from '@/components/owl-logo';
import { UserProfile } from '@/components/profile';

export function TeacherHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center">
        <Link href="/">
          <div className="mr-3">
            <OwlLogo size={40} />
          </div>
        </Link>
        <h1 className="text-3xl font-bold text-purple-900">Your Quiz Rooms</h1>
      </div>

      <div className="flex w-full md:w-auto gap-3">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
          <Input
            placeholder="Search rooms..."
            className="pl-10 bg-white/80 border-purple-200 w-full"
          />
        </div>
        <Link href="/teacher/creat-room">
          <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" /> New Room
          </Button>
        </Link>
        <UserProfile />
      </div>
    </div>
  );
}
