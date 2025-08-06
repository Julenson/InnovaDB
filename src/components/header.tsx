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
    <header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden md:flex md:items-center">
        <Link
          href="/dashboard"
          className="flex items-center"
          aria-label="Innova-Sport"
        >
          <div className="h-8 w-auto">
            <InnovaSportLogo className="h-full w-auto object-contain" />
          </div>
        </Link>
      </nav>

      {/* Espacio flexible que empuja el menú usuario a la derecha */}
      <div className="flex-grow" />

      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Menú de usuario</span>
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
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
