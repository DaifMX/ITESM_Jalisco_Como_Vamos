import CategoryController from "@/controllers/CategoryController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new CategoryController();

export default class CategoryRouter extends BaseRouter {
    init() {
        this.get('/', [], controller.getAll);
        this.get('/:id', [], controller.getById);
    }
};