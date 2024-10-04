import { client } from "../utils/db";
export async function addCategory(label: string, parentId: number | null): Promise<void> {
    const query = `INSERT INTO categories (label, parent_id) VALUES ($1, $2)`;
    const values = [label, parentId];
    await client.query(query, values);
}

export async function addSubtree(label: string, parentId: number): Promise<void> {
    const query = `INSERT INTO categories (label, parent_id) VALUES ($1, $2)`;
    await client.query(query, [label, parentId]); 
}

export async function fetchCategoryById(id: number): Promise<any> {
    const query = `SELECT * FROM categories WHERE id = $1`;
    const categoryResult = await client.query(query, [id]);
    
    if (categoryResult.rows.length === 0) {
        throw new Error("Category not found");
    }
    
    const category = categoryResult.rows[0];

    const subcategoriesQuery = `SELECT * FROM categories WHERE parent_id = $1`;
    const subcategoriesResult = await client.query(subcategoriesQuery, [id]);
    
    return {
        ...category,
        children: subcategoriesResult.rows
    };
}

export async function removeCategory(id: number): Promise<void> {
    const query = `DELETE FROM categories WHERE id = $1`;
    await client.query(query, [id]);
}

export async function moveSubtree(id: number, newParentId: number | null): Promise<void> {
    const query = `UPDATE categories SET parent_id = $1 WHERE id = $2`;
    await client.query(query, [newParentId, id]);
}

