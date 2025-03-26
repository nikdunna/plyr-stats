import { NextResponse } from 'next/server'

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, email, password, role } = body

  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role, // must match your Role enum: 'PLAYER', 'COACH', etc.
      },
    })

    return NextResponse.json({ message: 'Signup successful', user: { id: user.id, role: user.role } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
