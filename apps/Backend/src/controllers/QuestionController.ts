import QuestionService from "@/services/QuestionService";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";

import type { Request, Response } from "express";

export default class QuestionController {
    private service = new QuestionService();

    public create = async (req: Request, res: Response) => {
        try {
            const question = await this.service.create(req.body);
            return res.sendCreated(question);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    };

    public getAll = async (req: Request, res: Response) => {
        try {
            const cid = req.query.cid;
            let questions;

            if (cid && cid !== '') {
                questions = await this.service.getAllByCategory(cid as string);
            } else {
                questions = await this.service.getAll();
            }
            
            return res.sendSuccess(questions);

        } catch (err: any) {
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof ValidationError) return res.sendBadRequest(err.message, err.fields);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    public getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) throw new RuntimeError('Id no recibido.');

            const question = await this.service.getById(id);
            return res.sendSuccess(question);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    public pushResponse = async (req: Request, res: Response) => {
        try {
            const questionData = await this.service.pushResponse(req.body);
            return res.sendCreated(questionData);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    };
}