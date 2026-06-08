/**
 * Error Logger Service Tests
 * Tests for error logging and monitoring functionality
 */

import errorLogger from '../src/services/errorLogger';

describe('ErrorLogger Service', () => {
  beforeEach(() => {
    errorLogger.clearLogs();
  });

  describe('log method', () => {
    it('should log errors with message', () => {
      const error = new Error('Test error');
      const log = errorLogger.log(error);

      expect(log.message).toBe('Test error');
      expect(log.type).toBe('Error');
      expect(log.timestamp).toBeTruthy();
    });

    it('should log errors with context', () => {
      const error = new Error('Test error');
      const context = { action: 'testAction', userId: 123 };
      const log = errorLogger.log(error, context);

      expect(log.context).toEqual(context);
    });

    it('should add logs to history', () => {
      errorLogger.log(new Error('Error 1'));
      errorLogger.log(new Error('Error 2'));

      const logs = errorLogger.getLogs();
      expect(logs.length).toBe(2);
    });

    it('should maintain max logs limit', () => {
      // Add more logs than the max (50)
      for (let i = 0; i < 60; i++) {
        errorLogger.log(new Error(`Error ${i}`));
      }

      const logs = errorLogger.getLogs();
      expect(logs.length).toBe(50);
    });
  });

  describe('warn method', () => {
    it('should log warnings with message', () => {
      const warn = errorLogger.warn('Test warning');

      expect(warn.message).toBe('Test warning');
      expect(warn.type).toBe('Warning');
    });

    it('should log warnings with context', () => {
      const context = { section: 'auth' };
      const warn = errorLogger.warn('Test warning', context);

      expect(warn.context).toEqual(context);
    });
  });

  describe('info method', () => {
    it('should log info messages', () => {
      const info = errorLogger.info('Test info');

      expect(info.message).toBe('Test info');
      expect(info.type).toBe('Info');
    });

    it('should log info with context', () => {
      const context = { version: '1.0.0' };
      const info = errorLogger.info('App started', context);

      expect(info.context).toEqual(context);
    });
  });

  describe('log management', () => {
    it('should retrieve all logs', () => {
      errorLogger.log(new Error('Error 1'));
      errorLogger.warn('Warning 1');
      errorLogger.info('Info 1');

      const logs = errorLogger.getLogs();
      expect(logs.length).toBe(3);
    });

    it('should clear all logs', () => {
      errorLogger.log(new Error('Error 1'));
      errorLogger.log(new Error('Error 2'));

      errorLogger.clearLogs();
      const logs = errorLogger.getLogs();

      expect(logs.length).toBe(0);
    });

    it('should export logs as JSON', () => {
      errorLogger.log(new Error('Test error'));
      const exported = errorLogger.exportLogs();

      expect(typeof exported).toBe('string');
      expect(() => JSON.parse(exported)).not.toThrow();

      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle errors without stack trace', () => {
      const errorObj = { message: 'Simple error' };
      const log = errorLogger.log(errorObj);

      expect(log.message).toBe('Simple error');
      expect(log.stack).toBe('');
    });

    it('should handle null errors gracefully', () => {
      const log = errorLogger.log(null);

      expect(log.message).toBe('Unknown error');
      expect(log.type).toBe('Error');
    });

    it('should timestamp all logs', () => {
      errorLogger.log(new Error('Test'));
      const logs = errorLogger.getLogs();

      logs.forEach(log => {
        expect(log.timestamp).toBeTruthy();
        expect(new Date(log.timestamp)).toBeInstanceOf(Date);
      });
    });
  });
});
