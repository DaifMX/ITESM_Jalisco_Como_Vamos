import BaseRouter from "@/routers/BaseRouter";

import QuestionController from "@/controllers/QuestionController";

const controller = new QuestionController();

export default class QuestionRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], controller.getAll);
        this.get('/:id', ['PUBLIC'], controller.getById);
        this.post('/', ['ADMIN'], controller.create);
        this.patch('/:id', ['ADMIN'], controller.update);
        this.post('/push', ['ADMIN'], controller.pushResponse);
    }
}