/**
 * Theme Context Tests
 * Tests for theme functionality and persistence
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme, lightTheme, darkTheme } from '../src/context/ThemeContext';
import storageService from '../src/services/storageService';

// Mock the storage service
jest.mock('../src/services/storageService');

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getTheme.mockResolvedValue(null);
    storageService.saveTheme.mockResolvedValue(true);
  });

  describe('useTheme hook', () => {
    it('should provide light theme by default', () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.colors).toEqual(lightTheme);
    });

    it('should toggle theme from light to dark', async () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      // Wait for async storage call
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.theme).toBe('dark');
      expect(result.current.colors).toEqual(darkTheme);
    });

    it('should persist theme preference to storage', async () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(storageService.saveTheme).toHaveBeenCalledWith('dark');
    });

    it('should load theme from storage on mount', async () => {
      storageService.getTheme.mockResolvedValue('dark');

      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.theme).toBe('dark');
    });

    it('should provide all required theme colors', () => {
      const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
      const { result } = renderHook(() => useTheme(), { wrapper });

      const requiredColors = [
        'background', 'card', 'text', 'textSecondary',
        'primary', 'secondary', 'border', 'error', 'success', 'tint'
      ];

      requiredColors.forEach(color => {
        expect(result.current.colors).toHaveProperty(color);
      });
    });
  });

  describe('Theme Objects', () => {
    it('light theme should have valid colors', () => {
      expect(lightTheme.mode).toBe('light');
      expect(lightTheme.background).toBeTruthy();
      expect(lightTheme.text).toBeTruthy();
    });

    it('dark theme should have valid colors', () => {
      expect(darkTheme.mode).toBe('dark');
      expect(darkTheme.background).toBeTruthy();
      expect(darkTheme.text).toBeTruthy();
    });

    it('themes should have contrasting text colors', () => {
      expect(lightTheme.text).not.toBe(lightTheme.background);
      expect(darkTheme.text).not.toBe(darkTheme.background);
    });
  });
});
