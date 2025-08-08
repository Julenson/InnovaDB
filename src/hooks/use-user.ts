// src/hooks/use-user.ts
'use client';

import { useState, useEffect } from 'react';

type User = {
  id: number;
  email: string;
  category: string;
  name?: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/users?current=true', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('No autorizado');
        const data = await res.json();
        // Cambiado para que user venga directamente, no en data.user
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}

