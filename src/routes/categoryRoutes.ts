import { Router } from 'express';
import {
    handleAddCategory,
    handleRemoveCategory,
    handleMoveSubtree,
    handleAddSubtree,
    handleFetchCategoryById,
} from '../controllers/category.controller';

const router = Router();
router.post('/categories', handleAddCategory);
router.post('/categories/:parentId/subtree', handleAddSubtree);
router.delete('/categories/:id', handleRemoveCategory);
router.get('/categories/:id', handleFetchCategoryById);
router.patch('/categories/move/:newParentId', handleMoveSubtree);


export default router;
