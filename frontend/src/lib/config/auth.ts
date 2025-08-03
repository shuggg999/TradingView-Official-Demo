import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/clients/prisma"
import { compare } from "bcryptjs"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("缺少邮箱或密码")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { 
            subscription: true,
            _count: {
              select: {
                watchlists: true,
                learningProgress: true
              }
            }
          }
        })

        if (!user || !user.password) {
          throw new Error("用户不存在或密码错误")
        }

        if (!user.isActive) {
          throw new Error("账户已被禁用")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("用户不存在或密码错误")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          emailVerified: user.emailVerified,
          subscription: user.subscription,
          stats: user._count
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 初次登录时保存用户信息
      if (account && user) {
        token.role = user.role
        token.subscription = user.subscription
        token.emailVerified = user.emailVerified
        token.stats = user.stats
      }

      // 每次请求时刷新用户信息（可选，会增加数据库查询）
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { 
            subscription: true,
            _count: {
              select: {
                watchlists: true,
                learningProgress: true
              }
            }
          }
        })

        if (dbUser) {
          token.role = dbUser.role
          token.subscription = dbUser.subscription
          token.emailVerified = dbUser.emailVerified
          token.stats = dbUser._count
          token.name = dbUser.name
          token.picture = dbUser.avatar
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.subscription = token.subscription
        session.user.emailVerified = token.emailVerified as Date
        session.user.stats = token.stats
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // 允许OAuth提供商登录
      if (account?.provider !== "credentials") {
        return true
      }

      // 邮箱验证检查（可选）
      // if (!user.emailVerified) {
      //   throw new Error("请先验证您的邮箱")
      // }

      return true
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // 记录登录事件
      console.log(`User ${user.email} signed in with ${account?.provider}`)
      
      // 新用户自动创建默认观察列表
      if (isNewUser && user.id) {
        await prisma.watchlist.create({
          data: {
            userId: user.id,
            name: "默认观察列表",
            description: "系统自动创建的观察列表",
            isDefault: true
          }
        }).catch(err => {
          console.error("Failed to create default watchlist:", err)
        })
      }
    },
    async signOut({ token }) {
      console.log(`User ${token?.email} signed out`)
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  debug: process.env.NODE_ENV === "development"
}

// 类型声明扩展
declare module "next-auth" {
  interface User {
    role: UserRole
    subscription?: any
    emailVerified?: Date
    stats?: any
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: UserRole
      subscription?: any
      emailVerified?: Date
      stats?: any
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    subscription?: any
    emailVerified?: Date
    stats?: any
  }
}