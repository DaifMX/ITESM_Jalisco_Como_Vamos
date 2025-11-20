import { eq } from "drizzle-orm";
import db, { categories } from "@/db/schema";

import type { CategoryNew } from "@/types/schema-types";

export default class CategoriesRepository {
    private db = db;

    private model = categories;

    public create = async (category: CategoryNew) => {
        return await this.db
            .insert(this.model)
            .values(category)
            .returning();
    };

    public getAll = async () => {
        return await db
            .select()   
            .from(categories);
    };
    
    public getById = async (id: string) => {
        return await this.db
            .select()
            .from(this.model)
            .where(eq(this.model.id, id))
    };
}