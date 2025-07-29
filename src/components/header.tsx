
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  User,
  Settings,
  LifeBuoy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InnovaSportLogo } from './icons';

export default function Header() {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <InnovaSportLogo className="h-8 w-8 text-primary" />
          <span className="sr-only">Innova-Sport</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-foreground transition-colors hover:text-foreground font-bold text-lg"
        >
          Innova-Sport
        </Link>
      </nav>
      {/* Mobile menu can be added here if needed */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Search can be added here */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Menu Alternado de Usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Ayuda</span>
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
