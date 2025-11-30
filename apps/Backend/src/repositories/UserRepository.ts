import { count } from "drizzle-orm";
import db, { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export default class UserRepository {
    private db = db;
    private model = users;

    /**
     * Get total count of all users
     */
    public getTotalCount = async (): Promise<number> => {
        const result = await this.db
            .select({ count: count() })
            .from(this.model);
        
        return Number(result[0]?.count || 0);
    };

    /**
     * Get count of active users (not banned)
     */
    public getActiveCount = async (): Promise<number> => {
        const result = await this.db
            .select({ count: count() })
            .from(this.model)
            .where(sql`${this.model.banned} = false OR ${this.model.banned} IS NULL`);
        
        return Number(result[0]?.count || 0);
    };

    /**
     * Get count of banned users
     */
    public getBannedCount = async (): Promise<number> => {
        const result = await this.db
            .select({ count: count() })
            .from(this.model)
            .where(sql`${this.model.banned} = true`);
        
        return Number(result[0]?.count || 0);
    };
}
