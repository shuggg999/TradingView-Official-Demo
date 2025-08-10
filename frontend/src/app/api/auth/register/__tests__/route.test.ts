import { POST } from '../route'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock Prisma client
const mockPrismaUser = {
  create: jest.fn(),
  findUnique: jest.fn(),
}

jest.mock('@/lib/prisma', () => ({
  user: mockPrismaUser,
}))

// Mock bcrypt
jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    // Mock that user doesn't exist
    mockPrismaUser.findUnique.mockResolvedValue(null)
    
    // Mock password hashing
    mockBcrypt.hash.mockResolvedValue('hashedpassword' as never)
    
    // Mock user creation
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockPrismaUser.create.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual({
      success: true,
      message: '注册成功，请查收验证邮件',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    })

    expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    })
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12)
    expect(mockPrismaUser.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      }
    })
  })

  it('should return error if user already exists', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    // Mock that user already exists
    mockPrismaUser.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
    })

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      message: '该邮箱已被注册',
    })

    expect(mockPrismaUser.create).not.toHaveBeenCalled()
  })

  it('should return error for invalid input', async () => {
    const requestBody = {
      email: 'invalid-email',
      password: '123', // too short
      name: 'Test User'
    }

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('验证失败')
  })

  it('should return error for missing required fields', async () => {
    const requestBody = {
      email: 'test@example.com',
      // missing password and name
    }

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('验证失败')
  })

  it('should handle database errors', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    // Mock that user doesn't exist
    mockPrismaUser.findUnique.mockResolvedValue(null)
    mockBcrypt.hash.mockResolvedValue('hashedpassword' as never)
    
    // Mock database error
    mockPrismaUser.create.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      success: false,
      message: '服务器错误，请稍后重试',
    })
  })

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toBe('请求格式错误')
  })

  it('should handle password hashing failure', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    mockPrismaUser.findUnique.mockResolvedValue(null)
    
    // Mock bcrypt hash failure
    mockBcrypt.hash.mockRejectedValue(new Error('Hash error') as never)

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      success: false,
      message: '服务器错误，请稍后重试',
    })
  })
})