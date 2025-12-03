import CommentRepository from "@/repositories/CommentRepository";

import { ElementNotFoundError, ValidationError, RuntimeError } from "@jcv/errors";

export default class CommentService {
    private repository = new CommentRepository();

    /**
     * Crear un nuevo comentario
     */
    public create = async (data: { msgContent: string; questionId: string; userId: string }) => {
        if (!data.msgContent || data.msgContent.trim().length === 0) {
            throw new ValidationError('El contenido del comentario no puede estar vacío.');
        }

        if (data.msgContent.length > 1000) {
            throw new ValidationError('El comentario no puede exceder 1000 caracteres.');
        }

        const comment = await this.repository.create(data);
        if (!comment) throw new ElementNotFoundError('Error al crear el comentario.');

        return comment;
    };

    /**
     * Obtener todos los comentarios de una pregunta con likes
     */
    public getByQuestionId = async (questionId: string) => {
        if (!questionId) {
            throw new ValidationError('ID de pregunta requerido.');
        }

        const comments = await this.repository.getByQuestionId(questionId);
        return comments;
    };

    /**
     * Eliminar comentario por el usuario que lo creó
     */
    public deleteByUser = async (commentId: string, userId: string) => {
        if (!commentId || !userId) {
            throw new ValidationError('ID de comentario y usuario requeridos.');
        }

        const comment = await this.repository.getById(commentId);
        if (!comment) {
            throw new ElementNotFoundError(`Comentario ID-${commentId} no encontrado.`);
        }

        // Verificar que el usuario sea el dueño del comentario
        if (comment.userId !== userId) {
            throw new RuntimeError('No tienes permiso para eliminar este comentario.');
        }

        const deleted = await this.repository.deleteByUser(commentId, userId);
        if (!deleted) {
            throw new ElementNotFoundError('Error al eliminar el comentario.');
        }

        return deleted;
    };

    /**
     * Eliminar cualquier comentario (solo admin)
     */
    public deleteByAdmin = async (commentId: string) => {
        if (!commentId) {
            throw new ValidationError('ID de comentario requerido.');
        }

        const comment = await this.repository.getById(commentId);
        if (!comment) {
            throw new ElementNotFoundError(`Comentario ID-${commentId} no encontrado.`);
        }

        const deleted = await this.repository.deleteByAdmin(commentId);
        if (!deleted) {
            throw new ElementNotFoundError('Error al eliminar el comentario.');
        }

        return deleted;
    };

    /**
     * Dar o quitar like a un comentario (toggle)
     */
    public toggleLike = async (commentId: string, userId: string) => {
        if (!commentId || !userId) {
            throw new ValidationError('ID de comentario y usuario requeridos.');
        }

        const comment = await this.repository.getById(commentId);
        if (!comment) {
            throw new ElementNotFoundError(`Comentario ID-${commentId} no encontrado.`);
        }

        const hasLiked = await this.repository.hasUserLiked(commentId, userId);

        if (hasLiked) {
            // Si ya dio like, quitarlo
            await this.repository.removeLike(commentId, userId);
            return { action: 'removed', liked: false };
        } else {
            // Si no ha dado like, agregarlo
            await this.repository.addLike(commentId, userId);
            return { action: 'added', liked: true };
        }
    };

    /**
     * Obtener si el usuario dio like y el total de likes
     */
    public getLikeStatus = async (commentId: string, userId: string) => {
        if (!commentId) {
            throw new ValidationError('ID de comentario requerido.');
        }

        const hasLiked = userId ? await this.repository.hasUserLiked(commentId, userId) : false;
        const likesCount = await this.repository.getLikesCount(commentId);

        return {
            hasLiked,
            likesCount
        };
    };
}
