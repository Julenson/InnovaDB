'use client';

import React from 'react';
import type { User } from '@/lib/types';

interface UsersTableProps {
  users: User[];
  currentUserRole: string;
  currentUser: User | null;
  onRemove: (id: number) => void;
  onEdit: (user: User) => void;
}

export function UsersTable({
  users,
  currentUserRole,
  currentUser,
  onRemove,
  onEdit,
}: UsersTableProps) {
  if (!users || users.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay usuarios para mostrar.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Contraseña</th>
            <th className="px-4 py-2 border">Categoría</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="px-4 py-2 border">{user.id}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.password}</td>
              <td className="px-4 py-2 border">{user.category}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onEdit(user)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => onRemove(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
