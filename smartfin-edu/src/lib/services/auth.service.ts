import { LoginCredentials, RegisterData, User, AuthResponse, AuthError } from '@/types/auth';
import { prisma } from '@/lib/clients/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });

      if (!user || !user.passwordHash) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is disabled');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      };
    } catch (error: any) {
      throw new AuthError('LOGIN_FAILED', error.message);
    }
  }

  static async register(data: RegisterData): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { username: data.username }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          fullName: data.fullName,
          passwordHash,
          role: 'FREE_USER',
          subscriptionTier: 'FREE',
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: false,
              marketAlerts: true,
              priceAlerts: true,
              newsUpdates: false,
            },
            trading: {
              defaultCurrency: 'USD',
              riskTolerance: 'medium',
              investmentGoals: [],
              preferredMarkets: [],
            },
          },
        }
      });

      return this.sanitizeUser(user);
    } catch (error: any) {
      throw new AuthError('REGISTER_FAILED', error.message);
    }
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return this.sanitizeUser(user);
    } catch (error) {
      return null;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 7 * 24 * 60 * 60,
      };
    } catch (error: any) {
      throw new AuthError('REFRESH_FAILED', error.message);
    }
  }

  private static sanitizeUser(user: any): User {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}