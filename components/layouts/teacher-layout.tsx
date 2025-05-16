'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  FileQuestion,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Snowflake,
  Bell,
} from 'lucide-react';

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 flex flex-col">
      <header className="bg-white/50 backdrop-blur-sm py-3 border-b border-white/20 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-cyan-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <Link
                href="/teacher/dashboard"
                className="flex items-center gap-2"
              >
                <Snowflake className="h-6 w-6 text-cyan-700" />
                <h1 className="text-xl font-bold text-cyan-900">FrostQuiz</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-cyan-700 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Teacher" />
                <AvatarFallback className="bg-cyan-200 text-cyan-800">
                  TC
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-white/80 backdrop-blur-sm border-r border-white/20 pt-16 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          <nav className="p-4 space-y-1">
            <Link href="/teacher/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-800 hover:bg-cyan-100 hover:text-cyan-900"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/teacher/quizzes">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-800 hover:bg-cyan-100 hover:text-cyan-900"
              >
                <FileQuestion className="mr-2 h-5 w-5" />
                My Quizzes
              </Button>
            </Link>
            <Link href="/teacher/students">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-800 hover:bg-cyan-100 hover:text-cyan-900"
              >
                <Users className="mr-2 h-5 w-5" />
                Students
              </Button>
            </Link>
            <Link href="/teacher/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-800 hover:bg-cyan-100 hover:text-cyan-900"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </Link>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Link href="/logout">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-800 hover:bg-cyan-100 hover:text-cyan-900"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 pt-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
