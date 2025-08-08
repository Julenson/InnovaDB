'use client';

import React, { useEffect, useState } from 'react';
import { UsersTable } from '@/components/users-table';
import { EditUserDialog } from '@/components/edit-user-dialog';
import type { User } from '@/lib/types';
import { AddUserDialog } from '@/components/add-user-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function UsersDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingAddUser, setPendingAddUser] = useState<Omit<User, 'id'> | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const res = await fetch('/api/users?current=true', { headers });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
          setCurrentUserRole((data.category || '').trim().toLowerCase());
        } else {
          setCurrentUser(null);
          setCurrentUserRole('');
        }
      } catch (err) {
        console.error('Error obteniendo usuario actual:', err);
        setCurrentUser(null);
        setCurrentUserRole('');
      }
    }

    async function fetchUsers() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const res = await fetch('/api/users', { headers, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          console.log('Usuarios cargados:', data);
          setUsers(Array.isArray(data) ? data : []);
        } else {
          console.error('Error al obtener usuarios');
          setUsers([]);
        }
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setUsers([]);
      }
    }

    fetchCurrentUser().then(fetchUsers);
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.email.toLowerCase().includes(term) ||
        (user.category?.toLowerCase().includes(term) ?? false)
      );
    })
    .sort((a, b) => a.id - b.id);

  async function handleRemove(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const errorData = await res.json();
        console.error('Error al eliminar usuario:', errorData.error);
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
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u))
        );
      } else {
        console.error('Error actualizando usuario');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  const openEditDialog = (user: User) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditUser(null);
    setIsEditDialogOpen(false);
  };

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

  const isAuthorized = ['owner', 'developer'].includes(currentUserRole);

  // NUEVAS funciones para eliminar usuario con diálogo interno
  const openDeleteDialog = (user: User) => setUserToDelete(user);
  const closeDeleteDialog = () => setUserToDelete(null);

  async function confirmDeleteUser() {
    if (!userToDelete) return;
    await handleRemove(userToDelete.id);
    closeDeleteDialog();
  }

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
            onEdit={openEditDialog}
            onDelete={openDeleteDialog} // Aquí pasamos la función que abre el modal de eliminar
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
                Ya existe un usuario con el mismo email. ¿Quieres sobrescribir los datos existentes
                o cancelar?
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

        {/* Diálogo modal interno para confirmar eliminación */}
        <Dialog open={!!userToDelete} onOpenChange={(val) => !val && closeDeleteDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p className="mb-4">
              ¿Seguro que quieres eliminar al usuario <strong>{userToDelete?.email}</strong>?
            </p>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmDeleteUser}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddUserDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddUser}
          trigger={null}
        />

        {editUser && (
          <EditUserDialog
            user={editUser}
            open={isEditDialogOpen}
            onClose={closeEditDialog}
            onSave={async (updatedFields) => {
              if (!editUser) return;
              // Aquí combinas el usuario actual con los campos nuevos
              const updatedUser = { ...editUser, ...updatedFields };
              await handleUpdateUser(updatedUser);
              closeEditDialog();
            }}
          />
        )}
      </div>
    </div>
  );
}
