import BaseRouter from "@/routers/BaseRouter";

import CommentController from "@/controllers/CommentController";

const controller = new CommentController();

export default class CommentRouter extends BaseRouter {
    init() {
        // Crear comentario (usuario autenticado)
        this.post('/', ['USER'], controller.create);

        // Obtener comentarios de una pregunta (público)
        this.get('/question/:questionId', ['PUBLIC'], controller.getByQuestionId);

        // Eliminar comentario propio (usuario autenticado)
        this.delete('/:id', ['USER'], controller.deleteOwn);

        // Eliminar cualquier comentario (solo admin)
        this.delete('/admin/:id', ['ADMIN'], controller.deleteByAdmin);

        // Dar/quitar like a un comentario (usuario autenticado)
        this.post('/:id/like', ['USER'], controller.toggleLike);

        // Obtener estado de like de un comentario (público, pero retorna hasLiked=false si no está autenticado)
        this.get('/:id/like-status', ['PUBLIC'], controller.getLikeStatus);
    }
}
