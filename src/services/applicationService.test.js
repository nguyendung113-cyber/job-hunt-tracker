import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applicationService } from './applicationService';
import { supabase } from '../lib/supabase';

// Mock the entire supabase module
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('applicationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch applications for a user', async () => {
      const mockData = [{ id: 1, company_name: 'Test Co' }];
      
      // Setup mock implementation for this specific test
      const selectMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const eqMock = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ select: selectMock }) });
      
      // We need to re-mock or spy on the implementation
      const fromSpy = vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => ({
          then: (callback) => callback({ data: mockData, error: null })
        }))
      });

      const result = await applicationService.getAll('user-123');
      
      expect(fromSpy).toHaveBeenCalledWith('applications');
      expect(result).toEqual(mockData);
    });

    it('should throw an error if supabase returns an error', async () => {
      const mockError = { message: 'Database error' };
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => ({
          then: (callback) => callback({ data: null, error: mockError })
        }))
      });

      await expect(applicationService.getAll('user-123')).rejects.toEqual(mockError);
    });
  });

  describe('updateStatus', () => {
    it('should call update with correct parameters', async () => {
      const updateSpy = vi.spyOn(applicationService, 'update').mockResolvedValue({ id: 1, status: 'Interviewing' });
      
      const result = await applicationService.updateStatus(1, 'Interviewing');
      
      expect(updateSpy).toHaveBeenCalledWith(1, { status: 'Interviewing' });
      expect(result.status).toBe('Interviewing');
    });
  });
});
