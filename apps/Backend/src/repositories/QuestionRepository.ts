import { eq } from "drizzle-orm";
import db, { categories, questions, questionData } from "@/db/schema";

import type { QuestionNew, QuestionDataNew } from "@/types/schema-types";

export default class QuestionRepository {
    private db = db;

    private model = questions;

    public create = async (question: QuestionNew) => {
        return await this.db
            .insert(this.model)
            .values(question)
            .returning();
    };

    public getAll = async () => {
        return await db
            .select()   
            .from(questions);
    };

    public getAllByCategory = async (categoryId: string) => {
        return await this.db
            .select()   
            .from(this.model)
            .leftJoin(categories, eq(this.model.categoryId, categories.id))
            .where(eq(this.model.categoryId, categoryId));
    };
    
    public getById = async (id: string) => {
        return await this.db
            .select()
            .from(this.model)
            .where(eq(this.model.id, id))
    };

    public pushResponse = async (data: QuestionDataNew) => {
        return await this.db
            .insert(questionData)
            .values(data)
            .returning();
    };
}