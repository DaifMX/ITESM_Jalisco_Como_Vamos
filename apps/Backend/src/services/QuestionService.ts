import QuestionRepository from "@/repositories/QuestionRepository";
import { questionInsertSchema, questionSelectSchema } from "@/db/schema";

import type { QuestionNew, QuestionDataNew } from "@/types/schema-types";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";
import { ZodError } from "zod";

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

    public getById = async (id: string) => {
        let question = await this.repository.getById(id);
        if (!question) throw new ElementNotFoundError(`Pregunta ID-${id} no encontrada en la base de datos.`);

        return question;
    };

    public create = async (question: QuestionNew) => {
        const parsed = questionInsertSchema.parse(question);
        const newQuestion = await this.repository.create(parsed);

        return newQuestion;
    };

    public pushResponse = async (data: QuestionDataNew) => {
        const newQuestionData = await this.repository.pushResponse(data);
        return newQuestionData;
    };
}