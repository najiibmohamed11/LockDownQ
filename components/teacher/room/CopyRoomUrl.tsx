'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

function CopyRoomUrl() {
  const [copiedCode, setCopiedCode] = useState(false);
  const path = usePathname();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `https://quiz-app-sepia-gamma.vercel.app/student/${path.split('/')[3]}/student-info`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  return (
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
  );
}

export default CopyRoomUrl;
