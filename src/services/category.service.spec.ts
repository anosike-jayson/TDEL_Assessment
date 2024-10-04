import { client } from "../utils/db";
import {
  addCategory,
  addSubtree,
  fetchCategoryById,
  removeCategory,
  moveSubtree
} from './category.service'; 


jest.mock('../utils/db', () => ({
  client: {
    query: jest.fn(),  
  },
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
}));
describe('Category Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCategory', () => {
    it('should add a category successfully', async () => {
      const label = 'Test Category';
      const parentId = 1;
      
      await addCategory(label, parentId);

      expect(client.query).toHaveBeenCalledWith(
        'INSERT INTO categories (label, parent_id) VALUES ($1, $2)',
        [label, parentId]
      );
    });

    it('should add a root category when parentId is null', async () => {
      const label = 'Root Category';
      const parentId = null;
      
      await addCategory(label, parentId);

      expect(client.query).toHaveBeenCalledWith(
        'INSERT INTO categories (label, parent_id) VALUES ($1, $2)',
        [label, parentId]
      );
    });
  });

  describe('addSubtree', () => {
    it('should add a subtree successfully', async () => {
      const label = 'Subtree Category';
      const parentId = 1;
      
      await addSubtree(label, parentId);

      expect(client.query).toHaveBeenCalledWith(
        'INSERT INTO categories (label, parent_id) VALUES ($1, $2)',
        [label, parentId]
      );
    });
  });

  describe('removeCategory', () => {
    it('should remove a category successfully', async () => {
      const categoryId = 1;
      
      await removeCategory(categoryId);

      expect(client.query).toHaveBeenCalledWith(
        'DELETE FROM categories WHERE id = $1',
        [categoryId]
      );
    });
  });

  describe('moveSubtree', () => {
    it('should move a subtree successfully', async () => {
      const categoryId = 1;
      const newParentId = 2;
      
      await moveSubtree(categoryId, newParentId);

      expect(client.query).toHaveBeenCalledWith(
        'UPDATE categories SET parent_id = $1 WHERE id = $2',
        [newParentId, categoryId]
      );
    });

    it('should move a subtree to root level', async () => {
      const categoryId = 1;
      const newParentId = null;
      
      await moveSubtree(categoryId, newParentId);

      expect(client.query).toHaveBeenCalledWith(
        'UPDATE categories SET parent_id = $1 WHERE id = $2',
        [newParentId, categoryId]
      );
    });
  });
});
