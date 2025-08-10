import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { LoginForm } from '../LoginForm'
import { useAuth } from '@/hooks/useAuth'

// Mock useAuth hook
const mockLogin = jest.fn()
const mockClearError = jest.fn()

jest.mock('@/hooks/useAuth')

// Mock next-auth signIn
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

describe('LoginForm Component', () => {
  const user = userEvent.setup()
  const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

  beforeEach(() => {
    mockLogin.mockClear()
    mockClearError.mockClear()
    mockSignIn.mockClear()
    
    // Set default mock implementation
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    } as any)
  })

  it('should render all form elements', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('邮箱地址')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByLabelText('记住登录状态')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /GitHub/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: '登录' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('请输入邮箱地址')).toBeInTheDocument()
      expect(screen.getByText('请输入密码')).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('邮箱地址')
    const submitButton = screen.getByRole('button', { name: '登录' })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('密码')
    const submitButton = screen.getByRole('button', { name: '登录' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('密码至少6位')).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    mockLogin.mockResolvedValue(true)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('密码')
    const rememberMeCheckbox = screen.getByLabelText('记住登录状态')
    const submitButton = screen.getByRole('button', { name: '登录' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(rememberMeCheckbox)
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      })
    })
  })

  it('should call clearError when input changes', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('邮箱地址')

    await user.type(emailInput, 'test@example.com')

    expect(mockClearError).toHaveBeenCalled()
  })

  it('should handle Google OAuth login', async () => {
    render(<LoginForm />)

    const googleButton = screen.getByRole('button', { name: /Google/i })
    await user.click(googleButton)

    expect(mockSignIn).toHaveBeenCalledWith('google', { 
      callbackUrl: '/dashboard/portfolio' 
    })
  })

  it('should handle GitHub OAuth login', async () => {
    render(<LoginForm />)

    const githubButton = screen.getByRole('button', { name: /GitHub/i })
    await user.click(githubButton)

    expect(mockSignIn).toHaveBeenCalledWith('github', { 
      callbackUrl: '/dashboard/portfolio' 
    })
  })

  it('should use custom redirect URL', async () => {
    render(<LoginForm redirectTo="/custom-redirect" />)

    const googleButton = screen.getByRole('button', { name: /Google/i })
    await user.click(googleButton)

    expect(mockSignIn).toHaveBeenCalledWith('google', { 
      callbackUrl: '/custom-redirect' 
    })
  })

  it('should show loading state', () => {
    // Mock loading state
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    } as any)

    render(<LoginForm />)

    expect(screen.getByText('登录中...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录中/i })).toBeDisabled()
  })

  it('should show error message', () => {
    const mockError = {
      type: 'login' as const,
      message: 'Invalid credentials'
    }

    // Mock error state
    mockedUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: mockError,
      clearError: mockClearError,
    } as any)

    render(<LoginForm />)

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('should call onSuccess callback after successful login', async () => {
    const mockOnSuccess = jest.fn()
    mockLogin.mockResolvedValue(true)

    render(<LoginForm onSuccess={mockOnSuccess} />)

    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('密码')
    const submitButton = screen.getByRole('button', { name: '登录' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should clear validation errors when typing', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('邮箱地址')
    const submitButton = screen.getByRole('button', { name: '登录' })

    // Trigger validation error
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('请输入邮箱地址')).toBeInTheDocument()
    })

    // Start typing should clear the error
    await user.type(emailInput, 'test')

    await waitFor(() => {
      expect(screen.queryByText('请输入邮箱地址')).not.toBeInTheDocument()
    })
  })
})