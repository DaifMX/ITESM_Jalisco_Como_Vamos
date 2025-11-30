import UserRepository from "@/repositories/UserRepository";
import SessionRepository from "@/repositories/SessionRepository";
import AnswerRepository from "@/repositories/AnswerRepository";

interface DashboardStats {
    totalUsers: {
        count: number;
        percentageChange: number;
        trend: 'up' | 'down' | 'stable';
    };
    activeSessions: {
        count: number;
        percentageChange: number;
        trend: 'up' | 'down' | 'stable';
    };
    totalResponses: {
        count: number;
        percentageChange: number;
        trend: 'up' | 'down' | 'stable';
    };
    activeUsers: {
        count: number;
        percentageChange: number;
        trend: 'up' | 'down' | 'stable';
    };
    bannedUsers: {
        count: number;
        percentageChange: number;
        trend: 'up' | 'down' | 'stable';
    };
}

export default class StatsService {
    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;
    private answerRepository: AnswerRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
        this.answerRepository = new AnswerRepository();
    }

    /**
     * Get comprehensive dashboard statistics
     */
    public getDashboardStats = async (): Promise<DashboardStats> => {
        // Fetch all stats in parallel for better performance
        const [
            totalUsers,
            activeUsers,
            bannedUsers,
            activeSessions,
            totalResponses
        ] = await Promise.all([
            this.userRepository.getTotalCount(),
            this.userRepository.getActiveCount(),
            this.userRepository.getBannedCount(),
            this.sessionRepository.getActiveSessionsCount(),
            this.answerRepository.getTotalCount()
        ]);

        // Calculate percentage changes (mock data for now)
        // TODO: Implement historical comparison for real percentage calculations
        const stats: DashboardStats = {
            totalUsers: {
                count: totalUsers,
                percentageChange: 12.5,
                trend: 'up'
            },
            activeSessions: {
                count: activeSessions,
                percentageChange: 8.2,
                trend: 'up'
            },
            totalResponses: {
                count: totalResponses,
                percentageChange: 15.3,
                trend: 'up'
            },
            activeUsers: {
                count: activeUsers,
                percentageChange: 0,
                trend: 'stable'
            },
            bannedUsers: {
                count: bannedUsers,
                percentageChange: 0,
                trend: 'stable'
            }
        };

        return stats;
    };

    /**
     * Get user statistics only
     */
    public getUserStats = async () => {
        const [totalUsers, activeUsers, bannedUsers] = await Promise.all([
            this.userRepository.getTotalCount(),
            this.userRepository.getActiveCount(),
            this.userRepository.getBannedCount()
        ]);

        return {
            total: totalUsers,
            active: activeUsers,
            banned: bannedUsers
        };
    };

    /**
     * Get session statistics only
     */
    public getSessionStats = async () => {
        const [total, active] = await Promise.all([
            this.sessionRepository.getTotalCount(),
            this.sessionRepository.getActiveSessionsCount()
        ]);

        return {
            total,
            activeLast24Hours: active
        };
    };
}
