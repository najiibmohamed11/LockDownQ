'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, CreditCard, ChevronDown } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 rounded-full "
        >
          <Skeleton className="h-8 w-8 rounded-full bg-gray-400" />
          <Skeleton className="h-4 w-4 bg-gray-400" />
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => router.push('/sign-in')}
      >
        Sign In
      </Button>
    );
  }
  console.log(user);
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8 border border-purple-100">
          <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
          <AvatarFallback className="bg-purple-100 text-purple-700">
            {getInitials(user.fullName || '')}
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transition-all duration-200 ease-in-out animate-in fade-in slide-in-from-top-5">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-purple-100">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {getInitials(user.fullName || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 text-gray-500" />
              Profile
            </Link>
            <Link
              href="/billing"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4 text-gray-500" />
              Billing
            </Link>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
