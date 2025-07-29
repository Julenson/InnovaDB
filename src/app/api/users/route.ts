// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser, updatePassword, deleteUser } from '@db/managedb';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authenticatedUserCategory, email, password, category } = await request.json();
    await createUser(authenticatedUserCategory, email, password, category);
    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    await updatePassword(email, password);
    return NextResponse.json({ message: 'Password updated' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error updating password' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();
    await deleteUser(email);
    return NextResponse.json({ message: 'User deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
