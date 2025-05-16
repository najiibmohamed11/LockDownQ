import { cn } from '@/lib/utils';
import Image from 'next/image';

interface OwlLogoProps {
  size?: number;
  className?: string;
}

export function OwlLogo({ size = 40, className }: OwlLogoProps) {
  return <Image src="/logo.svg" alt="logo" width={50} height={50} />;
}
