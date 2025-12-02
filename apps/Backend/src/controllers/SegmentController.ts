import SegmentService from '@/services/SegmentService';

import { ElementNotFoundError, RuntimeError, ValidationError } from '@jcv/errors';

import type { Request, Response } from 'express';

export default class SegmentController {
    private service = new SegmentService();

    /**
     * GET /api/segment
     * Get all segments
     */
    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const segments = await this.service.getAll();
            res.sendSuccess(segments);
        } catch (err: any) {
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            return res.sendInternalServerError(err.message);
        }
    }

    /**
     * GET /api/segment/with-values
     * Get all segments with their values
     */
    public getAllWithValues = async (_req: Request, res: Response): Promise<void> => {
        try {
            const segments = await this.service.getAllWithValues();
            res.sendSuccess(segments);
        } catch (err: any) {
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            return res.sendInternalServerError(err.message);
        }
    }

    /**
     * GET /api/segment/:id
     * Get a segment by ID
     */
    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) throw new RuntimeError('Id no recibido.');

            const segment = await this.service.getById(id);
            res.sendSuccess(segment);
        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    }

    /**
     * GET /api/segment/:id/values
     * Get all segment values for a specific segment
     */
    public getSegmentValuesBySegmentId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) throw new RuntimeError('Id no recibido.');

            const values = await this.service.getSegmentValuesBySegmentId(id);
            res.sendSuccess(values);
        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    }

    /**
     * GET /api/segment/value/:id
     * Get a specific segment value by ID
     */
    public getSegmentValueById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) throw new RuntimeError('Id no recibido.');

            const segmentValue = await this.service.getSegmentValueById(id);
            res.sendSuccess(segmentValue);
        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            return res.sendInternalServerError(err.message);
        }
    }
}
