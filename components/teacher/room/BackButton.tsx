'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

function BackButton() {
  return (
    <Button
      variant="ghost"
      className="text-purple-700 mr-2"
      onClick={() => history.back()}
    >
      <ArrowLeft className="h-4 w-4 mr-1" /> Back{' '}
    </Button>
  );
}

export default BackButton;
