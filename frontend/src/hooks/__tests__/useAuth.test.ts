import { renderHook, act, waitFor } from '@testing-library/react'
import { signIn } from 'next-auth/react'
import { useAuth } from '../useAuth'

// Mock fetch
global.fetch = jest.fn()

// Mock next-auth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('useAuth Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockSignIn.mockClear()
  })

  describe('login function', () => {
    it('should login successfully with valid credentials', async () => {
      mockSignIn.mockResolvedValueOnce({
        ok: true,
        error: null,
      } as any)

      const { result } = renderHook(() => useAuth())

      let loginResult: boolean | undefined

      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false
        })
      })

      expect(loginResult).toBe(true)
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    it('should handle login failure', async () => {
      mockSignIn.mockResolvedValueOnce({
        ok: false,
        error: 'Invalid credentials',
      } as any)

      const { result } = renderHook(() => useAuth())

      let loginResult: boolean | undefined

      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
          rememberMe: false
        })
      })

      expect(loginResult).toBe(false)
      expect(result.current.error).toEqual({
        code: 'LOGIN_FAILED',
        message: 'Invalid credentials'
      })
    })

    it('should handle network errors', async () => {
      mockSignIn.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuth())

      let loginResult: boolean | undefined

      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false
        })
      })

      expect(loginResult).toBe(false)
      expect(result.current.error).toEqual({
        code: 'LOGIN_FAILED',
        message: 'Network error'
      })
    })
  })

  describe('register function', () => {
    it('should register successfully with valid data', async () => {
      const mockResponse = {
        success: true,
        message: 'Registration successful'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useAuth())

      let registerResult: boolean | undefined

      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
      })

      expect(registerResult).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }),
      })
    })

    it('should handle registration failure', async () => {
      const mockError = {
        success: false,
        error: 'Email already exists',
        code: 'EMAIL_EXISTS'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      const { result } = renderHook(() => useAuth())

      let registerResult: boolean | undefined

      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })
      })

      expect(registerResult).toBe(false)
      expect(result.current.error).toEqual({
        code: 'EMAIL_EXISTS',
        message: 'Email already exists'
      })
    })
  })

  describe('forgotPassword function', () => {
    it('should send forgot password request successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset email sent'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useAuth())

      let forgotPasswordResult: boolean | undefined

      await act(async () => {
        forgotPasswordResult = await result.current.forgotPassword('test@example.com')
      })

      expect(forgotPasswordResult).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com'
        }),
      })
    })
  })

  describe('resetPassword function', () => {
    it('should reset password successfully with valid token', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset successful'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useAuth())

      let resetPasswordResult: boolean | undefined

      await act(async () => {
        resetPasswordResult = await result.current.resetPassword(
          'valid-token',
          'test@example.com', 
          'newpassword123',
          'newpassword123'
        )
      })

      expect(resetPasswordResult).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          email: 'test@example.com',
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        }),
      })
    })
  })

  describe('checkPasswordStrength function', () => {
    it('should return password strength analysis', async () => {
      const mockResponse = {
        data: {
          score: 4,
          valid: true,
          strength: '强',
          errors: [],
          suggestions: []
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const { result } = renderHook(() => useAuth())

      let strengthResult: any

      await act(async () => {
        strengthResult = await result.current.checkPasswordStrength('strongpassword123!')
      })

      expect(strengthResult).toEqual(mockResponse.data)
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/password-strength', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'strongpassword123!',
          username: undefined,
          email: undefined,
        }),
      })
    })

    it('should return fallback result when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))

      const { result } = renderHook(() => useAuth())

      let strengthResult: any

      await act(async () => {
        strengthResult = await result.current.checkPasswordStrength('shortpw')
      })

      expect(strengthResult).toEqual({
        valid: false,
        score: 1,
        strength: '弱',
        errors: ['密码至少需要8个字符'],
        suggestions: ['增加密码长度'],
      })
    })
  })

  describe('loading state', () => {
    it('should show loading state during async operations', async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void
      const controlledPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      mockSignIn.mockImplementationOnce(() => controlledPromise as Promise<any>)

      const { result } = renderHook(() => useAuth())

      // Start the login operation
      act(() => {
        result.current.login({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false
        })
      })

      // Check that loading state is true
      expect(result.current.isLoading).toBe(true)

      // Resolve the promise
      act(() => {
        resolvePromise({
          ok: true,
          error: null,
        })
      })

      // Wait for the loading state to change
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('error handling', () => {
    it('should clear errors when clearError is called', async () => {
      // First, create an error
      mockSignIn.mockResolvedValueOnce({
        ok: false,
        error: 'Test error',
      } as any)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
          rememberMe: false
        })
      })

      expect(result.current.error).toBeTruthy()

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})