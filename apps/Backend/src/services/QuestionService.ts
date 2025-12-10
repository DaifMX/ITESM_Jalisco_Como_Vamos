import QuestionRepository from "@/repositories/QuestionRepository";
import { questionInsertSchema, questionSelectSchema, questions } from "@/db/schema";

import type { QuestionNew, QuestionDataNew } from "@/types/schema-types";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";
import { ZodError } from "zod";

type Question = typeof questions.$inferSelect;

export default class QuestionService {
    private repository = new QuestionRepository();

    public getAll = async () => {
        const questions = await this.repository.getAll();
        if (!questions.length) throw new ElementNotFoundError('Preguntas no encontradas en la base de datos.');

        return questions;
    };

    public getAllByCategory = async (categoryId: string) => {
        let parsed;

        try {
            parsed = questionSelectSchema.pick({ categoryId: true }).parse({ categoryId });

        } catch (err: any) {
            if (err instanceof ZodError) {
                const errorArray = ValidationError.parseZodError(err);
                throw new ValidationError(undefined, errorArray);
            }
        };

        if (!parsed?.categoryId) throw new RuntimeError('Categoría invalida');

        const questions = await this.repository.getAllByCategory(parsed.categoryId);
        if (!questions) throw new ElementNotFoundError('Preguntas no encontradas en la base de datos.');

        return questions;
    };

    public getById = async (id: string, segmentValueId?: string) => {
        const result: any = await this.repository.getById(id, segmentValueId);
        if (!result) throw new ElementNotFoundError(`Pregunta ID-${id} no encontrada en la base de datos.`);

        if (segmentValueId && Array.isArray(result) && result.length > 0 && result[0].questions) {
            return {
                question: {
                    id: result[0].questions.id,
                    xlsxCode: result[0].questions.xlsxCode,
                    value: result[0].questions.value,
                },
                questionData: result
                    .filter((row: any) => row.questionData !== null)
                    .map((row: any) => ({
                        answerId: row.questionData.answerId,
                        questionId: row.questionData.questionId,
                        segmentValueId: row.questionData.segmentValueId,
                        result: row.questionData.result,
                        answerValue: row.answers?.value,
                    }))
            };
        }

        return result;
    };

    public create = async (question: QuestionNew) => {
        const parsed = questionInsertSchema.parse(question);
        const newQuestion = await this.repository.create(parsed);

        return newQuestion;
    };

    public update = async (id: string, data: Partial<QuestionNew>): Promise<Question> => {
        const existingQuestion = await this.repository.getById(id);
        if (!existingQuestion || !existingQuestion.length) {
            throw new ElementNotFoundError(`Pregunta ID-${id} no encontrada en la base de datos.`);
        }

        let parsed;
        try {
            parsed = questionInsertSchema.partial().parse(data);
        } catch (err: any) {
            if (err instanceof ZodError) {
                const errorArray = ValidationError.parseZodError(err);
                throw new ValidationError(undefined, errorArray);
            }
        }

        if (!parsed || Object.keys(parsed).length === 0) {
            throw new RuntimeError('No se proporcionaron datos válidos para actualizar.');
        }

        const cleanData = Object.entries(parsed).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as Partial<QuestionNew>);

        const updatedQuestion = await this.repository.update(id, cleanData);
        if (!updatedQuestion || !updatedQuestion.length) {
            throw new RuntimeError('Error al actualizar la pregunta.');
        }

        return updatedQuestion[0]!;
    };

    public pushResponse = async (data: QuestionDataNew) => {
        const newQuestionData = await this.repository.pushResponse(data);
        return newQuestionData;
    };

    public getAnswersByQuestionId = async (questionId: string) => {
        const answers = await this.repository.getAnswersByQuestionId(questionId);
        if (!answers || answers.length === 0) throw new ElementNotFoundError(`No se encontraron respuestas para la pregunta ID-${questionId}.`);

        return { questionId, answers };
    };

    public toggleHidden = async (id: string): Promise<Question> => {
        const result = await this.repository.toggleHidden(id);
        
        if (!result || !result.length) {
            throw new ElementNotFoundError(`Pregunta ID-${id} no encontrada en la base de datos.`);
        }

        return result[0]!;
    };
}