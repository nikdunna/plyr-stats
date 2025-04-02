import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'COACH' | 'PLAYER' | 'PARENT' | 'ADMIN'
      fullName: string
      position?: string
      height?: number
      jerseyNumber?: number
      playerCode?: string
    }
  }

  interface User {
    id: string
    email: string
    role: 'COACH' | 'PLAYER' | 'PARENT' | 'ADMIN'
    fullName: string
    position?: string
    height?: number
    jerseyNumber?: number
    playerCode?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    role: Role
    fullName: string
    position?: string
    height?: number
    jerseyNumber?: number
    playerCode?: string
  }
}