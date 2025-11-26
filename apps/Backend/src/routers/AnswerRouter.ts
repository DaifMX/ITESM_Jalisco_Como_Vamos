import BaseRouter from "@/routers/BaseRouter";

import AnswerController from "@/controllers/AnswerController";

const controller = new AnswerController();

export default class AnswerRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], controller.getAll);
        this.get('/:id', ['PUBLIC'], controller.getById);
        this.post('/', ['ADMIN'], controller.create);
    }
}
