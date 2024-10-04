import { Request, Response } from 'express';
import { addCategory, removeCategory, moveSubtree, fetchCategoryById } from '../services/category.service';

export async function handleAddCategory(req: Request, res: Response): Promise<void> {
    const { label, parentId } = req.body; 

    if (label === undefined) {
        res.status(400).send("Label is required");
        return;
    }

    try {
        await addCategory(label, parentId ?? null);
        res.status(201).send("Category added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add category");
    }
}

export async function handleAddSubtree(req: Request, res: Response): Promise<void> {
    const parentId = Number(req.params.parentId); 
    const { label } = req.body;

    if (!label) {
        res.writeHead(400).end("Label is required");
        return;
    }

    try {
        await addCategory(label, parentId); 
        res.writeHead(201).end("Subtree added under parent ID " + parentId);
    } catch (err) {
        console.error(err);
        res.writeHead(500).end("Failed to add subtree");
    }
}

export async function handleFetchCategoryById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    if (!id) {
        res.status(400).send("ID is required");
        return;
    }

    try {
        const category = await fetchCategoryById(id);
        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch category");
    }
}

export async function handleRemoveCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
        res.status(400).send("ID is required");
        return;
    }

    try {
        await removeCategory(Number(id));
        res.status(200).send("Category removed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to remove category");
    }
}

export async function handleMoveSubtree(req: Request, res: Response): Promise<void> {
    const newParentId = Number(req.params.newParentId);
    const { id } = req.body; 

    if (!id || !newParentId) {
        res.status(400).send("Both category ID and new parent ID are required");
        return;
    }

    try {
        await moveSubtree(Number(id), newParentId);
        res.status(200).end("Subtree moved successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to move subtree");
    }
}