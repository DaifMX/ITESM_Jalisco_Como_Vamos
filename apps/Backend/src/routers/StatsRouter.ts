import StatsController from "@/controllers/StatsController";
import BaseRouter from "@/routers/BaseRouter";

const controller = new StatsController();

export default class StatsRouter extends BaseRouter {
    init() {
        // Get comprehensive dashboard statistics
        this.get('/dashboard', ['ADMIN'], controller.getDashboardStats);
        
        // Get user statistics only
        this.get('/users', ['ADMIN'], controller.getUserStats);
        
        // Get session statistics only
        this.get('/sessions', ['ADMIN'], controller.getSessionStats);
    }
}
