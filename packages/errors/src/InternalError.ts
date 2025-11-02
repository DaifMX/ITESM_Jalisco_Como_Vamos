export default class InternalError extends Error {
    msg = 'Internal error.';

    constructor(msg?: string){
        super(msg);
        this.name = 'InternalError';
    }   
}