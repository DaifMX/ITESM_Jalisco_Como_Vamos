import SegmentRepository from '@/repositories/SegmentRepository';
import { ValidationError, ElementNotFoundError } from '@jcv/errors';

export default class SegmentService {
    private repository = new SegmentRepository();

    /**
     * Get all segments
     */
    public getAll = async () => {
        const segments = await this.repository.getAll();

        if (!segments || segments.length === 0) {
            throw new ElementNotFoundError('No segments found');
        }

        return segments;
    }

    /**
     * Get a segment by ID
     */
    public getById = async (id: string) => {
        if (!id) {
            throw new ValidationError('Segment ID is required');
        }

        const segment = await this.repository.getById(id);

        if (!segment) {
            throw new ElementNotFoundError('Segment not found');
        }

        return segment;
    }

    /**
     * Get all segment values for a specific segment
     */
    public getSegmentValuesBySegmentId = async (segmentId: string) => {
        if (!segmentId) {
            throw new ValidationError('Segment ID is required');
        }

        // Verify segment exists
        const segment = await this.repository.getById(segmentId);
        if (!segment) {
            throw new ElementNotFoundError('Segment not found');
        }

        const values = await this.repository.getSegmentValuesBySegmentId(segmentId);

        if (!values || values.length === 0) {
            throw new ElementNotFoundError('No segment values found for this segment');
        }

        return values;
    }

    /**
     * Get all segments with their segment values
     */
    public getAllWithValues = async () => {
        const segments = await this.repository.getAllWithValues();

        if (!segments || segments.length === 0) {
            throw new ElementNotFoundError('No segments found');
        }

        return segments;
    }

    /**
     * Get a specific segment value by ID
     */
    public getSegmentValueById = async (id: string) => {
        if (!id) {
            throw new ValidationError('Segment value ID is required');
        }

        const segmentValue = await this.repository.getSegmentValueById(id);

        if (!segmentValue) {
            throw new ElementNotFoundError('Segment value not found');
        }

        return segmentValue;
    }
}
