import { Request, Response } from 'express';
import {
  handleAddCategory,
  handleAddSubtree,
  handleFetchCategoryById,
  handleRemoveCategory,
  handleMoveSubtree
} from './category.controller';
import {
  addCategory,
  removeCategory,
  moveSubtree,
  fetchCategoryById
} from '../services/category.service';

jest.mock('../services/category.service');

describe('Category Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let consoleErrorSpy: jest.SpyInstance;
  
    beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
      end: jest.fn(),
      writeHead: jest.fn().mockReturnThis(),
    };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('handleAddCategory', () => {
    it('should add a category successfully', async () => {
      mockReq.body = { label: 'Test Category', parentId: 1 };
      (addCategory as jest.Mock).mockResolvedValue(undefined);

      await handleAddCategory(mockReq as Request, mockRes as Response);

      expect(addCategory).toHaveBeenCalledWith('Test Category', 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith('Category added');
    });

    it('should return 400 if label is missing', async () => {
      mockReq.body = {};

      await handleAddCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Label is required');
    });

    it('should handle errors and log them', async () => {
      mockReq.body = { label: 'Test Category' };
      const testError = new Error('Test error');
      (addCategory as jest.Mock).mockRejectedValue(testError);

      await handleAddCategory(mockReq as Request, mockRes as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Failed to add category');
    });
  });

    describe('handleAddSubtree', () => {
        it('should add a subtree successfully', async () => {
          mockReq.params = { parentId: '1' };
          mockReq.body = { label: 'Test Subtree' };
          (addCategory as jest.Mock).mockResolvedValue(undefined);
    
          await handleAddSubtree(mockReq as Request, mockRes as Response);
    
          expect(addCategory).toHaveBeenCalledWith('Test Subtree', 1);
          expect(mockRes.writeHead).toHaveBeenCalledWith(201);
          expect(mockRes.end).toHaveBeenCalledWith('Subtree added under parent ID 1');
        });
    
        it('should return 400 if label is missing', async () => {
          mockReq.params = { parentId: '1' };
          mockReq.body = {};
    
          await handleAddSubtree(mockReq as Request, mockRes as Response);
    
          expect(mockRes.writeHead).toHaveBeenCalledWith(400);
          expect(mockRes.end).toHaveBeenCalledWith('Label is required');
        });
    
        it('should handle errors', async () => {
          mockReq.params = { parentId: '1' };
          mockReq.body = { label: 'Test Subtree' };
          const testError = new Error('Test error');
          (addCategory as jest.Mock).mockRejectedValue(testError);
    
          await handleAddSubtree(mockReq as Request, mockRes as Response);
    
          expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
          expect(mockRes.writeHead).toHaveBeenCalledWith(500);
          expect(mockRes.end).toHaveBeenCalledWith('Failed to add subtree');
        });
      });

  describe('handleFetchCategoryById', () => {
    it('should fetch a category successfully', async () => {
      mockReq.params = { id: '1' };
      const mockCategory = { id: 1, label: 'Test Category' };
      (fetchCategoryById as jest.Mock).mockResolvedValue(mockCategory);

      await handleFetchCategoryById(mockReq as Request, mockRes as Response);

      expect(fetchCategoryById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 400 if id is missing', async () => {
      mockReq.params = {};

      await handleFetchCategoryById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('ID is required');
    });

    it('should handle errors', async () => {
      mockReq.params = { id: '1' };
      (fetchCategoryById as jest.Mock).mockRejectedValue(new Error('Test error'));

      await handleFetchCategoryById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Failed to fetch category');
    });
  });

  describe('handleRemoveCategory', () => {
    it('should remove a category successfully', async () => {
      mockReq.params = { id: '1' };
      (removeCategory as jest.Mock).mockResolvedValue(undefined);

      await handleRemoveCategory(mockReq as Request, mockRes as Response);

      expect(removeCategory).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Category removed');
    });

    it('should return 400 if id is missing', async () => {
      mockReq.params = {};

      await handleRemoveCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('ID is required');
    });

    it('should handle errors', async () => {
      mockReq.params = { id: '1' };
      (removeCategory as jest.Mock).mockRejectedValue(new Error('Test error'));

      await handleRemoveCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Failed to remove category');
    });
  });

  describe('handleMoveSubtree', () => {
    it('should move a subtree successfully', async () => {
        mockReq.params = { newParentId: '2' };
        mockReq.body = { id: 1 };
        (moveSubtree as jest.Mock).mockResolvedValue(undefined);
      
        await handleMoveSubtree(mockReq as Request, mockRes as Response);
      
        expect(moveSubtree).toHaveBeenCalledWith(1, 2);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith('Subtree moved successfully');
      });

    it('should return 400 if id or newParentId is missing', async () => {
      mockReq.params = { newParentId: '2' };
      mockReq.body = {};

      await handleMoveSubtree(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Both category ID and new parent ID are required');
    });

    it('should handle errors', async () => {
      mockReq.params = { newParentId: '2' };
      mockReq.body = { id: 1 };
      (moveSubtree as jest.Mock).mockRejectedValue(new Error('Test error'));

      await handleMoveSubtree(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Failed to move subtree');
    });
  });
});