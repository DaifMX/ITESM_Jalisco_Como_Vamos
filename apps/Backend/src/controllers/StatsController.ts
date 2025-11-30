import type { Request, Response } from 'express';
import StatsService from '@/services/StatsService';

export default class StatsController {
    private statsService: StatsService;

    constructor() {
        this.statsService = new StatsService();
    }

    /**
     * Get dashboard statistics
     */
    getDashboardStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.statsService.getDashboardStats();

            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las estadísticas'
            });
        }
    };

    /**
     * Get user statistics only
     */
    getUserStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.statsService.getUserStats();

            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las estadísticas de usuarios'
            });
        }
    };

    /**
     * Get session statistics only
     */
    getSessionStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.statsService.getSessionStats();

            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching session stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las estadísticas de sesiones'
            });
        }
    };
}
