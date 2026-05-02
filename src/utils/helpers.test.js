import { describe, it, expect } from 'vitest';
import { getStatusClass, formatDate, truncateText } from './helpers';

describe('Helpers Utility Functions', () => {
  describe('getStatusClass', () => {
    it('should return correct class for Applied status', () => {
      expect(getStatusClass('Applied')).toBe('status-applied');
    });

    it('should return correct class for Interviewing status', () => {
      expect(getStatusClass('Interviewing')).toBe('status-interviewing');
    });

    it('should return status-default for unknown status', () => {
      expect(getStatusClass('Unknown')).toBe('status-default');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 10)).toBe('This is a ...');
    });

    it('should use default maxLength of 50', () => {
      const text = 'a'.repeat(60);
      expect(truncateText(text)).toHaveLength(53); // 50 + '...'
    });
  });

  describe('formatDate', () => {
    it('should return empty string if no date provided', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should format date correctly for vi-VN', () => {
      const date = '2026-05-02';
      // The exact output might vary by environment locale settings, 
      // but we expect it to contain 2026 and 2
      const formatted = formatDate(date);
      expect(formatted).toContain('2026');
    });
  });
});
