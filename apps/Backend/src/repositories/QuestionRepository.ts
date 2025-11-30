import { eq } from "drizzle-orm";
import db, { questions, questionData } from "@/db/schema";

import type { QuestionNew, QuestionDataNew } from "@/types/schema-types";

export default class QuestionRepository {
    private db = db;

    public create = async (question: QuestionNew) => {
        return await this.db
            .insert(questions)
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
            .from(questions)
            .where(eq(questions.categoryId, categoryId));
    };
    
    public getById = async (id: string) => {
        return await this.db
            .select()
            .from(questions)
            .where(eq(questions.id, id))
    };

    public pushResponse = async (data: QuestionDataNew) => {
        return await this.db
            .insert(questionData)
            .values(data)
            .returning();
    };
}