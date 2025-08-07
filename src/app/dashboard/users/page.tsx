'use client';

import React, { useEffect, useState } from 'react';
import { UsersTable } from '@/components/users-table';
import type { User } from '@/lib/types';
import { AddUserDialog } from '@/components/add-user-dialog';

export default function UsersDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAddUser, setPendingAddUser] = useState<Omit<User, 'id'> | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        // Fetch usuario actual
        const userRes = await fetch('/api/users', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData);
          setCurrentUserRole((userData.category || '').trim().toLowerCase());
        } else {
          setCurrentUser(null);
          setCurrentUserRole('');
        }

        // Fetch lista de usuarios
        const usersRes = await fetch('/api/users', { headers, cache: 'no-store' });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          console.log('Usuarios cargados:', usersData);
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          console.error('No se pudo obtener usuarios');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCurrentUser(null);
        setCurrentUserRole('');
        setUsers([]);
      }
    }

    fetchData();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.email.toLowerCase().includes(term) ||
        (user.category?.toLowerCase().includes(term) ?? false)
      );
    })
    .sort((a, b) => a.email.localeCompare(b.email));

  async function handleRemove(id: number) {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        console.error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error en handleRemove:', error);
    }
  }

  async function handleUpdateUser(user: User): Promise<void> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers,
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u)));
      } else {
        console.error('Error actualizando usuario');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  async function handleAddUser(newUserData: Omit<User, 'id'>) {
    const duplicate = users.find(
      (u) => u.email.trim().toLowerCase() === newUserData.email.trim().toLowerCase()
    );

    if (duplicate) {
      setPendingAddUser(newUserData);
      setShowDuplicateDialog(true);
    } else {
      await addNewUser(newUserData);
    }
  }

  async function addNewUser(newUserData: Omit<User, 'id'>) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(newUserData),
    });

    if (res.ok) {
      const addedUser = await res.json();
      setUsers((prev) => [...prev, addedUser]);
      setIsAddDialogOpen(false);
    } else {
      console.error('Error agregando usuario');
    }
  }

  async function confirmAddDuplicate(overrideExisting: boolean) {
    if (!pendingAddUser) {
      setShowDuplicateDialog(false);
      return;
    }

    const duplicate = users.find(
      (u) => u.email.trim().toLowerCase() === pendingAddUser.email.trim().toLowerCase()
    );

    if (!duplicate) {
      await addNewUser(pendingAddUser);
    } else {
      if (overrideExisting) {
        await handleUpdateUser({
          ...duplicate,
          ...pendingAddUser,
        });
        setIsAddDialogOpen(false);
      }
    }

    setPendingAddUser(null);
    setShowDuplicateDialog(false);
  }

  const isAuthorized = ['admin', 'developer'].includes(currentUserRole);

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          {isAuthorized && (
            <button
              className="btn-primary"
              onClick={() => setIsAddDialogOpen(true)}
              aria-label="Agregar usuario"
            >
              + Agregar usuario
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isAuthorized ? (
          <UsersTable
            users={filteredUsers}
            currentUserRole={currentUserRole}
            currentUser={currentUser}
            onRemove={handleRemove}
            onEdit={handleUpdateUser}
          />
        ) : (
          <p className="text-center text-gray-600">No tienes permisos para ver esta página.</p>
        )}

        {showDuplicateDialog && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Usuario duplicado</h2>
              <p className="mb-4">
                Ya existe un usuario con el mismo email. ¿Quieres sobrescribir los datos existentes o cancelar?
              </p>
              <div className="flex justify-end space-x-4">
                <button className="btn-secondary" onClick={() => confirmAddDuplicate(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={() => confirmAddDuplicate(true)}>
                  Sobrescribir
                </button>
              </div>
            </div>
          </div>
        )}

        <AddUserDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddUser}
          trigger={null}
        />
      </div>
    </div>
  );
}
