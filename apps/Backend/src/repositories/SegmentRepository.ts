import { eq } from 'drizzle-orm';

import db, { segments, segmentValues } from '@/db/schema';

export default class SegmentRepository {
    private db = db;
    /**
     * Get all segments
     */
    public getAll = async () => {
        return await this.db.select().from(segments);
    }

    /**
     * Get a segment by ID
     */
    public getById = async (id: string) => {
        const result = await this.db
            .select()
            .from(segments)
            .where(eq(segments.id, id))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get all segment values for a specific segment
     */
    public getSegmentValuesBySegmentId = async (segmentId: string) => {
        return await this.db
            .select()
            .from(segmentValues)
            .where(eq(segmentValues.segmentId, segmentId));
    }

    /**
     * Get all segments with their segment values
     */
    public getAllWithValues = async () => {
        const allSegments = await this.db.select().from(segments);
        
        const result = await Promise.all(
            allSegments.map(async (segment: any) => {
                const values = await this.db
                    .select()
                    .from(segmentValues)
                    .where(eq(segmentValues.segmentId, segment.id));
                
                return {
                    ...segment,
                    values
                };
            })
        );

        return result;
    }

    /**
     * Get a specific segment value by ID
     */
    public getSegmentValueById = async (id: string) => {
        const result = await this.db
            .select()
            .from(segmentValues)
            .where(eq(segmentValues.id, id))
            .limit(1);

        return result[0] || null;
    }
}
