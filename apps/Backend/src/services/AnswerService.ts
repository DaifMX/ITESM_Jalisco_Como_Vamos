import AnswerRepository from "@/repositories/AnswerRepository";
import { answerInsertSchema, answerSelectSchema } from "@/db/schema";

import type { AnswerNew } from "@/types/schema-types";

import { ElementNotFoundError } from "@jcv/errors";

export default class AnswerService {
    private repository = new AnswerRepository();

    public getAll = async () => {
        const answers = await this.repository.getAll();
        if (!answers.length) throw new ElementNotFoundError('Respuestas no encontradas en la base de datos.');

        return answers;
    };

    public getById = async (id: string) => {
        let answer = await this.repository.getById(id);
        if (!answer || (Array.isArray(answer) && !answer.length)) throw new ElementNotFoundError(`Respuesta ID-${id} no encontrada en la base de datos.`);

        return answer;
    };

    public create = async (answer: AnswerNew) => {
        const parsed = answerInsertSchema.parse(answer);
        const newAnswer = await this.repository.create(parsed);

        return newAnswer;
    };
} 