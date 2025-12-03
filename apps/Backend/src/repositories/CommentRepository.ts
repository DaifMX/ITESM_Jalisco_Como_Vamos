import { eq, and, desc, sql } from "drizzle-orm";
import db, { comments, commentLikes, users } from "@/db/schema";

export default class CommentRepository {
    private db = db;
    private commentModel = comments;
    private commentLikeModel = commentLikes;

    /**
     * Crear un nuevo comentario
     */
    public create = async (data: { msgContent: string; questionId: string; userId: string }) => {
        const [comment] = await this.db
            .insert(this.commentModel)
            .values(data)
            .returning();
        
        return comment;
    };

    /**
     * Obtener todos los comentarios de una pregunta con el conteo de likes
     */
    public getByQuestionId = async (questionId: string) => {
        const result = await this.db
            .select({
                id: this.commentModel.id,
                msgContent: this.commentModel.msgContent,
                questionId: this.commentModel.questionId,
                userId: this.commentModel.userId,
                userName: users.name,
                createdAt: this.commentModel.createdAt,
                likesCount: sql<number>`CAST(COUNT(DISTINCT ${this.commentLikeModel.userId}) AS INTEGER)`,
            })
            .from(this.commentModel)
            .leftJoin(
                users,
                eq(this.commentModel.userId, users.id)
            )
            .leftJoin(
                this.commentLikeModel,
                eq(this.commentModel.id, this.commentLikeModel.commentId)
            )
            .where(eq(this.commentModel.questionId, questionId))
            .groupBy(
                this.commentModel.id,
                this.commentModel.msgContent,
                this.commentModel.questionId,
                this.commentModel.userId,
                users.name,
                this.commentModel.createdAt
            )
            .orderBy(desc(this.commentModel.createdAt));

        return result;
    };

    /**
     * Obtener un comentario por ID
     */
    public getById = async (commentId: string) => {
        const [comment] = await this.db
            .select()
            .from(this.commentModel)
            .where(eq(this.commentModel.id, commentId))
            .limit(1);

        return comment;
    };

    /**
     * Eliminar un comentario (solo el dueño puede hacerlo)
     */
    public deleteByUser = async (commentId: string, userId: string) => {
        const [deleted] = await this.db
            .delete(this.commentModel)
            .where(
                and(
                    eq(this.commentModel.id, commentId),
                    eq(this.commentModel.userId, userId)
                )
            )
            .returning();

        return deleted;
    };

    /**
     * Eliminar cualquier comentario (solo admin)
     */
    public deleteByAdmin = async (commentId: string) => {
        const [deleted] = await this.db
            .delete(this.commentModel)
            .where(eq(this.commentModel.id, commentId))
            .returning();

        return deleted;
    };

    /**
     * Eliminar todos los comentarios de un usuario (cuando se elimina la cuenta)
     */
    public deleteAllByUserId = async (userId: string) => {
        return await this.db
            .delete(this.commentModel)
            .where(eq(this.commentModel.userId, userId))
            .returning();
    };

    /**
     * Dar like a un comentario
     */
    public addLike = async (commentId: string, userId: string) => {
        const [like] = await this.db
            .insert(this.commentLikeModel)
            .values({ commentId, userId })
            .returning();

        return like;
    };

    /**
     * Quitar like de un comentario
     */
    public removeLike = async (commentId: string, userId: string) => {
        const [like] = await this.db
            .delete(this.commentLikeModel)
            .where(
                and(
                    eq(this.commentLikeModel.commentId, commentId),
                    eq(this.commentLikeModel.userId, userId)
                )
            )
            .returning();

        return like;
    };

    /**
     * Verificar si un usuario ya dio like a un comentario
     */
    public hasUserLiked = async (commentId: string, userId: string) => {
        const [like] = await this.db
            .select()
            .from(this.commentLikeModel)
            .where(
                and(
                    eq(this.commentLikeModel.commentId, commentId),
                    eq(this.commentLikeModel.userId, userId)
                )
            )
            .limit(1);

        return !!like;
    };

    /**
     * Obtener el conteo de likes de un comentario
     */
    public getLikesCount = async (commentId: string) => {
        const result = await this.db
            .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
            .from(this.commentLikeModel)
            .where(eq(this.commentLikeModel.commentId, commentId));

        return result[0]?.count || 0;
    };
}
