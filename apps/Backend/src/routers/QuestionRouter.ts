import QuestionController from "@/controllers/QuestionController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new QuestionController();

export default class QuestionRouter extends BaseRouter {
    init() {
        this.get('/', [], controller.getAll);
        this.get('/category/:cid', [], controller.getAllByCategory);
        this.get('/:id', [], controller.getById);
        this.post('/', [], controller.create);
        this.post('/push', [], controller.pushResponse);
    }
}