import AnswerController from "@/controllers/AnswerController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new AnswerController();

export default class AnswerRouter extends BaseRouter {
    init() {
        this.get('/', [], controller.getAll);
        this.get('/:id', [], controller.getById);
        this.post('/', [], controller.create);
    }
}
