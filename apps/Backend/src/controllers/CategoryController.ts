import CategoryService from "@/services/CategoryService";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";

import type { Request, Response } from "express";

export default class CategoryController {
    private service = new CategoryService();

    public getAll = async (_req: Request, res: Response) => {
        try {
            const categories = await this.service.getAll();
            return res.sendSuccess(categories);

        } catch (err: any) {
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    public getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) throw new RuntimeError('Id no recibido.');

            const category = await this.service.getById(id);
            return res.sendSuccess(category);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };
}
