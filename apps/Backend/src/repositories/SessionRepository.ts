import { count, gte } from "drizzle-orm";
import db, { sessions } from "@/db/schema";

export default class SessionRepository {
    private db = db;
    private model = sessions;

    /**
     * Get count of active sessions created in the last 24 hours
     */
    public getActiveSessionsCount = async (): Promise<number> => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const result = await this.db
            .select({ count: count() })
            .from(this.model)
            .where(gte(this.model.createdAt, oneDayAgo));
        
        return Number(result[0]?.count || 0);
    };

    /**
     * Get total count of all sessions
     */
    public getTotalCount = async (): Promise<number> => {
        const result = await this.db
            .select({ count: count() })
            .from(this.model);
        
        return Number(result[0]?.count || 0);
    };
}
