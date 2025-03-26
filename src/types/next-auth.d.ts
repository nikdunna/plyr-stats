import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'COACH' | 'PLAYER' | 'PARENT' | 'ADMIN'
    }
  }

  interface User {
    id: string
    email: string
    role: 'COACH' | 'PLAYER' | 'PARENT' | 'ADMIN'
  }
}
