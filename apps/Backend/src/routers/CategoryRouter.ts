import BaseRouter from "@/routers/BaseRouter";

import CategoryController from "@/controllers/CategoryController";

const controller = new CategoryController();

export default class CategoryRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], controller.getAll);
        this.get('/:id', ['PUBLIC'], controller.getById);
    }
};