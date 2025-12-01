import StatsController from "@/controllers/StatsController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new StatsController();

export default class StatsRouter extends BaseRouter {
    init() {
        this.get('/dashboard', ['ADMIN'], controller.getDashboardStats);
        
        this.get('/users', ['ADMIN'], controller.getUserStats);
        
        this.get('/sessions', ['ADMIN'], controller.getSessionStats);
    }
}
