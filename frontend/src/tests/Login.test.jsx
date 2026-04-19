// src/tests/Login.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock the AuthContext
const mockLogin = vi.fn();
const mockLoginDemo = vi.fn();
const mockLoginWithGoogle = vi.fn();

vi.mock('../lib/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, login: mockLogin, loginDemo: mockLoginDemo, loginWithGoogle: mockLoginWithGoogle }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Camera: () => <div data-testid="camera-icon" />,
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. UI Rendering Tests
  describe('UI Rendering', () => {
    it('renders login form with all required elements', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue as demo user/i })).toBeInTheDocument();
    });

    it('renders password visibility toggle', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = passwordInput.parentElement.querySelector('button');

      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('renders signup link', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const signupLink = screen.getByRole('link', { name: /create one/i });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });

  // 2. User Interactions Tests
  describe('User Interactions', () => {
    it('updates email input value', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password input value', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('toggles password visibility', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = passwordInput.parentElement.querySelector('button');

      // Initially password is shown
      expect(passwordInput.type).toBe('text');
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();

      // Click to hide password
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

      // Click to show password again
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    });

    it('shows loading state during form submission', async () => {
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('disabled:opacity-60');
    });
  });

  // 3. API/Firebase Calls Tests
  describe('API/Firebase Calls', () => {
    it('calls login function with correct credentials', async () => {
      mockLogin.mockImplementation(() => Promise.resolve({ user: { email: 'test@example.com' } }));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('calls Google login function', async () => {
      mockLoginWithGoogle.mockImplementation(() => Promise.resolve({ user: { email: 'test@example.com' } }));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockLoginWithGoogle).toHaveBeenCalled();
      });
    });

    it('calls demo login function', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const demoButton = screen.getByRole('button', { name: /continue as demo user/i });
      fireEvent.click(demoButton);

      expect(mockLoginDemo).toHaveBeenCalled();
    });
  });

  // 4. Error Handling Tests
  describe('Error Handling', () => {
    it('displays error message on login failure', async () => {
      mockLogin.mockImplementation(() => Promise.reject(new Error('Invalid credentials')));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password. Try demo mode below.')).toBeInTheDocument();
      });
    });

    it('displays error message on Google login failure', async () => {
      mockLoginWithGoogle.mockImplementation(() => Promise.reject(new Error('Google login failed')));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText('Google login failed. Try demo mode or check your connection.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('clears error message on successful retry', async () => {
      mockLogin
        .mockImplementationOnce(() => Promise.reject(new Error('Invalid credentials')))
        .mockImplementationOnce(() => Promise.resolve({ user: { email: 'test@example.com' } }));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // First attempt - fails
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password. Try demo mode below.')).toBeInTheDocument();
      });

      // Second attempt - succeeds
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Invalid email or password. Try demo mode below.')).not.toBeInTheDocument();
      });
    });
  });

  // 5. Edge Cases Tests
  describe('Edge Cases', () => {
    it('prevents form submission with empty fields', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('handles very long email input', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const longEmail = 'a'.repeat(200) + '@example.com';

      fireEvent.change(emailInput, { target: { value: longEmail } });

      expect(emailInput.value).toBe(longEmail);
    });

    it('handles special characters in password', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const specialPassword = 'P@ssw0rd!#$%^&*()';

      fireEvent.change(passwordInput, { target: { value: specialPassword } });

      expect(passwordInput.value).toBe(specialPassword);
    });

    it('maintains form state during loading', () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
      expect(submitButton).toBeDisabled();
    });
  });

  // 6. Routing/Navigation Tests
  describe('Routing/Navigation', () => {
    it('navigates to home on successful login', async () => {
      mockLogin.mockImplementation(() => Promise.resolve({ user: { email: 'test@example.com' } }));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    });

    it('navigates to home on successful Google login', async () => {
      mockLoginWithGoogle.mockImplementation(() => Promise.resolve({ user: { email: 'test@example.com' } }));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    });

    it('navigates to home on demo login', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const demoButton = screen.getByRole('button', { name: /continue as demo user/i });
      fireEvent.click(demoButton);

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('navigates to signup page', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const signupLink = screen.getByRole('link', { name: /create one/i });
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });
});