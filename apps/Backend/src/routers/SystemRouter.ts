import SystemController from "@/controllers/SystemController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new SystemController();

export default class CategoryRouter extends BaseRouter {
    init() {
        this.post('/app-version', ['PUBLIC'], controller.appVersion);
    }
};