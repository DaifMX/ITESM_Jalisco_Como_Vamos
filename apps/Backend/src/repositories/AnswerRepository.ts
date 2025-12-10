import { eq, count } from "drizzle-orm";
import db, { answers } from "@/db/schema";

import type { AnswerNew } from "@/types/schema-types";

export default class AnswerRepository {
    private db = db;

    private model = answers;

    public create = async (answer: AnswerNew) => {
        return await this.db
            .insert(this.model)
            .values(answer)
            .returning();
    };

    public getAll = async () => {
        return await db
            .select()   
            .from(answers);
    };
    
    public getById = async (id: string) => {
        return await this.db
            .select()
            .from(this.model)
            .where(eq(this.model.id, id))
    };

    /**
     * Get total count of all answers
     */
    public getTotalCount = async (): Promise<number> => {
        const result = await this.db
            .select({ count: count() })
            .from(this.model);
        
        return Number(result[0]?.count || 0);
    };
}