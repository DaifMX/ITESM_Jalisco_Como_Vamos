import BaseRouter from '@/routers/BaseRouter';

import SegmentController from '@/controllers/SegmentController';

const controller = new SegmentController();

export default class SegmentRouter extends BaseRouter {
    init() {
        // GET /api/segment - Get all segments
        this.get('/', ['PUBLIC'], controller.getAll);

        // GET /api/segment/with-values - Get all segments with their values
        this.get('/with-values', ['PUBLIC'], controller.getAllWithValues);

        // GET /api/segment/value/:id - Get a specific segment value by ID
        this.get('/value/:id', ['PUBLIC'], controller.getSegmentValueById);

        // GET /api/segment/:id - Get a segment by ID
        this.get('/:id', ['PUBLIC'], controller.getById);

        // GET /api/segment/:id/values - Get all segment values for a specific segment
        this.get('/:id/values', ['PUBLIC'], controller.getSegmentValuesBySegmentId);
    }
}
