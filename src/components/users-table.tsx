import React, { useState } from 'react';
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
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
          {users.map((user) => {
            const isVisible = visiblePasswords.has(user.id);
            return (
              <tr key={user.id} className="text-center">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td
                  className="px-4 py-2 border cursor-pointer select-none"
                  onClick={() => togglePasswordVisibility(user.id)}
                  title={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{ userSelect: 'none' }}
                  aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {isVisible ? user.password : '••••••••'}
                </td>
                <td className="px-4 py-2 border">{user.category}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => onEdit(user)}
                    aria-label={`Editar usuario ${user.email}`}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline cursor-pointer"
                    onClick={() => onRemove(user.id)}
                    aria-label={`Eliminar usuario ${user.email}`}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
