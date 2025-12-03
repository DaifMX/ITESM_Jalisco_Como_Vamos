import CommentService from "@/services/CommentService";

import { ElementNotFoundError, RuntimeError, ValidationError } from "@jcv/errors";

import type { Request, Response } from "express";

export default class CommentController {
    private service = new CommentService();

    /**
     * Crear un nuevo comentario
     * POST /comments
     */
    public create = async (req: Request, res: Response) => {
        try {
            const { msgContent, questionId } = req.body;
            const userId = (req as any).session?.user?.id;

            if (!userId) {
                throw new RuntimeError('Usuario no autenticado.');
            }

            if (!msgContent || !questionId) {
                throw new ValidationError('Contenido del mensaje y ID de pregunta son requeridos.');
            }

            const comment = await this.service.create({ msgContent, questionId, userId });
            return res.sendSuccess(comment, 'Comentario creado exitosamente.');

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    /**
     * Obtener comentarios de una pregunta
     * GET /comments/question/:questionId
     */
    public getByQuestionId = async (req: Request, res: Response) => {
        try {
            const { questionId } = req.params;

            if (!questionId) {
                throw new ValidationError('ID de pregunta requerido.');
            }

            const comments = await this.service.getByQuestionId(questionId);
            return res.sendSuccess(comments);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    /**
     * Eliminar comentario propio (usuario)
     * DELETE /comments/:id
     */
    public deleteOwn = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = (req as any).session?.user?.id;

            if (!userId) {
                throw new RuntimeError('Usuario no autenticado.');
            }

            if (!id) {
                throw new ValidationError('ID de comentario requerido.');
            }

            const deleted = await this.service.deleteByUser(id, userId);
            return res.sendSuccess(deleted, 'Comentario eliminado exitosamente.');

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    /**
     * Eliminar cualquier comentario (admin)
     * DELETE /comments/admin/:id
     */
    public deleteByAdmin = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new ValidationError('ID de comentario requerido.');
            }

            const deleted = await this.service.deleteByAdmin(id);
            return res.sendSuccess(deleted, 'Comentario eliminado exitosamente por el administrador.');

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    /**
     * Dar/quitar like a un comentario (toggle)
     * POST /comments/:id/like
     */
    public toggleLike = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = (req as any).session?.user?.id;

            if (!userId) {
                throw new RuntimeError('Usuario no autenticado.');
            }

            if (!id) {
                throw new ValidationError('ID de comentario requerido.');
            }

            const result = await this.service.toggleLike(id, userId);
            const message = result.liked ? 'Like agregado.' : 'Like removido.';
            return res.sendSuccess(result, message);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);
            if (err instanceof RuntimeError) return res.sendBadRequest(err.message);

            return res.sendInternalServerError(err.message);
        }
    };

    /**
     * Obtener estado de like de un comentario
     * GET /comments/:id/like-status
     */
    public getLikeStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = (req as any).session?.user?.id;

            if (!id) {
                throw new ValidationError('ID de comentario requerido.');
            }

            const status = await this.service.getLikeStatus(id, userId);
            return res.sendSuccess(status);

        } catch (err: any) {
            if (err instanceof ValidationError) return res.sendBadRequest(err.message);
            if (err instanceof ElementNotFoundError) return res.sendNotFound(err.message);

            return res.sendInternalServerError(err.message);
        }
    };
}
