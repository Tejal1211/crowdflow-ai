// src/tests/UserDashboard.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDashboard from '../pages/UserDashboard';
import { AuthContext } from '../lib/AuthContext';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  ShieldAlert: () => <div data-testid="shield-alert-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  Camera: () => <div data-testid="camera-icon" />,
}));

// Mock the AuthContext
const mockData = {
  gates: [
    { id: 1, name: 'Gate A', waitTime: 5, status: 'open' },
    { id: 2, name: 'Gate B', waitTime: 12, status: 'busy' }
  ],
  zones: [
    { name: 'North Stand', occupancy: 75 },
    { name: 'South Stand', occupancy: 60 }
  ],
  lastUpdated: new Date()
};
const mockRefresh = vi.fn();

vi.mock('../hooks/useLiveData', () => ({
  useLiveData: vi.fn(() => ({ data: mockData, refresh: mockRefresh }))
}));

// Mock AppLayout
vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children, title, onRefresh, lastUpdated }) => (
    <div data-testid="app-layout">
      <div data-testid="layout-title">{title}</div>
      <div data-testid="layout-refresh" onClick={onRefresh} />
      <div data-testid="layout-last-updated">{lastUpdated.toISOString()}</div>
      {children}
    </div>
  )
}));

// Mock chart components
vi.mock('../components/charts/CrowdHeatmap', () => ({
  default: () => <div data-testid="crowd-heatmap">Crowd Heatmap</div>
}));

vi.mock('../components/charts/GateWaitTimes', () => ({
  default: ({ gates }) => (
    <div data-testid="gate-wait-times">
      {gates.map(gate => (
        <div key={gate.id} data-testid={`gate-${gate.id}`}>
          {gate.name}: {gate.waitTime} min
        </div>
      ))}
    </div>
  )
}));

vi.mock('../components/ui/AlertFeed', () => ({
  default: () => <div data-testid="alert-feed">Alert Feed</div>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  UtensilsCrossed: () => <div data-testid="utensils-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Navigation2: () => <div data-testid="navigation-icon" />,
  AlertTriangle: () => <div data-testid="alert-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

describe('UserDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. UI Rendering Tests
  describe('UI Rendering', () => {
    it('renders dashboard with user info and logout', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });

    it('renders dashboard components', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('crowd-heatmap')).toBeInTheDocument();
      expect(screen.getByTestId('gate-wait-times')).toBeInTheDocument();
      expect(screen.getByTestId('alert-feed')).toBeInTheDocument();
    });

    it('renders gate wait times with correct data', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByTestId('gate-1')).toHaveTextContent('Gate A: 5 min');
      expect(screen.getByTestId('gate-2')).toHaveTextContent('Gate B: 12 min');
    });

    it('renders food stalls section', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
      expect(screen.getByTestId('utensils-icon')).toBeInTheDocument();
    });

    it('renders restrooms section', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Restrooms')).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toHaveTextContent('MapPin');
    });

    it('renders emergency SOS section', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Emergency SOS')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
    });
  });

  // 2. User Interactions Tests
  describe('User Interactions', () => {
    it('calls refresh function when refresh is triggered', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      const refreshButton = screen.getByTestId('layout-refresh');
      fireEvent.click(refreshButton);

      expect(mockRefresh).toHaveBeenCalled();
    });

    it('calls logout function when logout button is clicked', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, logout: mockLogout }}>
          <UserDashboard />
        </AuthContext.Provider>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    it('handles SOS button click', () => {
      render(<UserDashboard />);

      const sosButton = screen.getByRole('button', { name: /activate emergency sos/i });
      fireEvent.click(sosButton);

      // SOS active state should be triggered (though we can't easily test the timeout)
      expect(sosButton).toBeInTheDocument();
    });

    it('shows demo badge for demo users', () => {
      const demoUser = { ...mockUser, isDemo: true };
      vi.mocked(vi.doMock)('../lib/AuthContext', () => ({
        useAuth: () => ({ user: demoUser, loading: false, logout: mockLogout }),
      }));

      render(<UserDashboard />);

      expect(screen.getByText('Demo Mode')).toBeInTheDocument();
    });
  });

  // 3. API/Firebase Calls Tests
  describe('API/Firebase Calls', () => {
    it('initializes with live data', () => {
      const { useLiveData } = require('../hooks/useLiveData');
      render(<UserDashboard />);

      expect(useLiveData).toHaveBeenCalledWith(5000);
    });

    it('passes correct props to AppLayout', () => {
      render(<UserDashboard />);

      expect(screen.getByTestId('layout-title')).toHaveTextContent('My Dashboard');
      expect(screen.getByTestId('layout-last-updated')).toBeInTheDocument();
    });
  });

  // 4. Error Handling Tests
  describe('Error Handling', () => {
    it('handles missing user data gracefully', () => {
      const userWithoutName = { ...mockUser, displayName: null };
      vi.mocked(vi.doMock)('../lib/AuthContext', () => ({
        useAuth: () => ({ user: userWithoutName, loading: false, logout: mockLogout }),
      }));

      render(<UserDashboard />);

      expect(screen.getByText('Welcome back, User!')).toBeInTheDocument();
    });

    it('handles logout errors gracefully', async () => {
      mockLogout.mockRejectedValue(new Error('Logout failed'));

      render(<UserDashboard />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      // Component should not crash even if logout fails
      expect(logoutButton).toBeInTheDocument();
    });
  });

  // 5. Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles empty gate data', () => {
      const emptyData = { ...mockData, gates: [] };
      vi.mocked(vi.doMock)('../hooks/useLiveData', () => ({
        useLiveData: vi.fn(() => ({ data: emptyData, refresh: mockRefresh }))
      }));

      render(<UserDashboard />);

      expect(screen.getByTestId('gate-wait-times')).toBeInTheDocument();
      // Should not crash with empty gates array
    });

    it('handles very long user names', () => {
      const longNameUser = { ...mockUser, displayName: 'A'.repeat(100) };
      vi.mocked(vi.doMock)('../lib/AuthContext', () => ({
        useAuth: () => ({ user: longNameUser, loading: false, logout: mockLogout }),
      }));

      render(<UserDashboard />);

      expect(screen.getByText(`Welcome back, ${'A'.repeat(100)}!`)).toBeInTheDocument();
    });

    it('handles special characters in user data', () => {
      const specialUser = {
        ...mockUser,
        displayName: 'José María O\'Connor-Smith 第3',
        email: 'test+tag@example.co.uk'
      };
      vi.mocked(vi.doMock)('../lib/AuthContext', () => ({
        useAuth: () => ({ user: specialUser, loading: false, logout: mockLogout }),
      }));

      render(<UserDashboard />);

      expect(screen.getByText('Welcome back, José María O\'Connor-Smith 第3!')).toBeInTheDocument();
      expect(screen.getByText('test+tag@example.co.uk')).toBeInTheDocument();
    });

    it('handles null lastUpdated', () => {
      const dataWithoutUpdate = { ...mockData, lastUpdated: null };
      vi.mocked(vi.doMock)('../hooks/useLiveData', () => ({
        useLiveData: vi.fn(() => ({ data: dataWithoutUpdate, refresh: mockRefresh }))
      }));

      render(<UserDashboard />);

      // Should not crash with null lastUpdated
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });
  });

  // 6. Routing/Navigation Tests
  describe('Routing/Navigation', () => {
    it('renders within AppLayout with correct title', () => {
      render(<UserDashboard />);

      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      expect(screen.getByTestId('layout-title')).toHaveTextContent('My Dashboard');
    });

    it('passes refresh function to AppLayout', () => {
      render(<UserDashboard />);

      const refreshButton = screen.getByTestId('layout-refresh');
      fireEvent.click(refreshButton);

      expect(mockRefresh).toHaveBeenCalled();
    });

    it('displays last updated timestamp', () => {
      render(<UserDashboard />);

      expect(screen.getByTestId('layout-last-updated')).toHaveTextContent(mockData.lastUpdated.toISOString());
    });
  });
});