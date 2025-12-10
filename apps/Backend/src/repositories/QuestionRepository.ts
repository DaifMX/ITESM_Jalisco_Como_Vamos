import { eq, and } from "drizzle-orm";
import db, { questions, questionData, answers } from "@/db/schema";

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
    
    public getById = async (id: string, segmentValueId?: string) => {
        if (segmentValueId) {
            return await this.db
                .select()
                .from(questions)
                .where(eq(questions.id, id))
                .leftJoin(
                    questionData,
                    and(
                        eq(questionData.questionId, id),
                        eq(questionData.segmentValueId, segmentValueId)
                    )
                )
                .leftJoin(
                    answers,
                    eq(questionData.answerId, answers.id)
                );
        }

        return await this.db
            .select()
            .from(questions)
            .where(eq(questions.id, id));
    };

    public update = async (id: string, data: Partial<QuestionNew>) => {
        return await this.db
            .update(questions)
            .set(data)
            .where(eq(questions.id, id))
            .returning();
    };

    public pushResponse = async (data: QuestionDataNew) => {
        return await this.db
            .insert(questionData)
            .values(data)
            .returning();
    };

    public getAnswersByQuestionId = async (questionId: string) => {
        return await this.db
            .select({
                answerId: answers.id,
                answerValue: answers.value,
            })
            .from(questionData)
            .where(eq(questionData.questionId, questionId))
            .innerJoin(answers, eq(questionData.answerId, answers.id))
            .groupBy(answers.id, answers.value);
    };

    public toggleHidden = async (id: string) => {
        const question = await this.db
            .select()
            .from(questions)
            .where(eq(questions.id, id))
            .limit(1);

        if (!question.length) {
            return null;
        }

        return await this.db
            .update(questions)
            .set({ isHidden: !question[0]?.isHidden })
            .where(eq(questions.id, id))
            .returning();
    };
}