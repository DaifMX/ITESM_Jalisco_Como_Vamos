import { eq } from "drizzle-orm";
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
}