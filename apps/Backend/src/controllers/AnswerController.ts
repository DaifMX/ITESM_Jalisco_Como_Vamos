import AnswerService from "@/services/AnswerService";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";

import type { Request, Response } from "express";

export default class AnswerController {
    private service = new AnswerService();

    public create = async (req: Request, res: Response) => {
        try {
            const answer = await this.service.create(req.body);
            return res.sendCreated(answer);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    };

    public getAll = async (_req: Request, res: Response) => {
        try {
            const answers = await this.service.getAll();
            return res.sendSuccess(answers);

        } catch (err: any) {
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    public getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) throw new RuntimeError('Id no recibido.');

            const answer = await this.service.getById(id);
            return res.sendSuccess(answer);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };
}
