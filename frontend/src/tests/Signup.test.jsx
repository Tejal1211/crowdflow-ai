// src/tests/Signup.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../pages/Signup';
import { AuthContext } from '../lib/AuthContext';

// Mock the AuthContext
const mockSignup = vi.fn();
const mockLoginDemo = vi.fn();
const mockLoginWithGoogle = vi.fn();

vi.mock('../lib/AuthContext', () => ({
  AuthContext: {
    Provider: ({ children, value }) => <div data-testid="auth-provider">{children}</div>,
    Consumer: ({ children }) => children({ user: null, loading: false, signup: mockSignup, loginDemo: mockLoginDemo, loginWithGoogle: mockLoginWithGoogle }),
  },
  useAuth: () => ({ user: null, loading: false, signup: mockSignup, loginDemo: mockLoginDemo, loginWithGoogle: mockLoginWithGoogle }),
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
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. UI Rendering Tests
  describe('UI Rendering', () => {
    it('renders signup form with all required elements', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByText('Start enjoying smarter stadium experiences today')).toBeInTheDocument();
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue as demo user/i })).toBeInTheDocument();
    });

    it('renders password visibility toggle', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = passwordInput.parentElement.querySelector('button');

      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    });

    it('renders perks list', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      expect(screen.getByText('AI-powered assistant')).toBeInTheDocument();
      expect(screen.getByText('Emergency SOS alerts')).toBeInTheDocument();
      expect(screen.getByText('Real-time crowd insights')).toBeInTheDocument();
    });

    it('renders login link', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const loginLink = screen.getByRole('link', { name: /sign in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  // 2. User Interactions Tests
  describe('User Interactions', () => {
    it('updates all form input values', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect(passwordInput.value).toBe('password123');
      expect(confirmInput.value).toBe('password123');
    });

    it('toggles password visibility', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = passwordInput.parentElement.querySelector('button');

      expect(passwordInput.type).toBe('password');

      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });

    it('shows password mismatch error', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('shows loading state during form submission', async () => {
      mockSignup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  // 3. API/Firebase Calls Tests
  describe('API/Firebase Calls', () => {
    it('calls signup function with correct data', async () => {
      mockSignup.mockResolvedValue({ user: { email: 'john@example.com' } });

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
      });
    });

    it('calls Google login function', async () => {
      mockLoginWithGoogle.mockResolvedValue({ user: { email: 'john@example.com' } });

      render(
        <BrowserRouter>
          <Signup />
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
          <Signup />
        </BrowserRouter>
      );

      const demoButton = screen.getByRole('button', { name: /continue as demo user/i });
      fireEvent.click(demoButton);

      expect(mockLoginDemo).toHaveBeenCalled();
    });
  });

  // 4. Error Handling Tests
  describe('Error Handling', () => {
    it('displays error message on signup failure', async () => {
      mockSignup.mockRejectedValue(new Error('Email already exists'));

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });

    it('displays error message on Google signup failure', async () => {
      mockLoginWithGoogle.mockRejectedValue(new Error('Google signup failed'));

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText('Google signup failed. Try demo mode or check your connection.')).toBeInTheDocument();
      });
    });

    it('prevents submission when passwords do not match', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });
      fireEvent.click(submitButton);

      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  // 5. Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles empty form submission', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      expect(mockSignup).not.toHaveBeenCalled();
    });

    it('handles very long name input', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const longName = 'A'.repeat(100);

      fireEvent.change(nameInput, { target: { value: longName } });

      expect(nameInput.value).toBe(longName);
    });

    it('handles special characters in name', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const specialName = 'José María O\'Connor-Smith 第3';

      fireEvent.change(nameInput, { target: { value: specialName } });

      expect(nameInput.value).toBe(specialName);
    });

    it('handles complex passwords', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const complexPassword = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';

      fireEvent.change(passwordInput, { target: { value: complexPassword } });
      fireEvent.change(confirmInput, { target: { value: complexPassword } });

      expect(passwordInput.value).toBe(complexPassword);
      expect(confirmInput.value).toBe(complexPassword);
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });

    it('maintains form state during loading', () => {
      mockSignup.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect(passwordInput.value).toBe('password123');
      expect(confirmInput.value).toBe('password123');
      expect(submitButton).toBeDisabled();
    });
  });

  // 6. Routing/Navigation Tests
  describe('Routing/Navigation', () => {
    it('navigates to home on successful signup', async () => {
      mockSignup.mockResolvedValue({ user: { email: 'john@example.com' } });

      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    });

    it('navigates to home on successful Google signup', async () => {
      mockLoginWithGoogle.mockResolvedValue({ user: { email: 'john@example.com' } });

      render(
        <BrowserRouter>
          <Signup />
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
          <Signup />
        </BrowserRouter>
      );

      const demoButton = screen.getByRole('button', { name: /continue as demo user/i });
      fireEvent.click(demoButton);

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('navigates to login page', () => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );

      const loginLink = screen.getByRole('link', { name: /sign in/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});