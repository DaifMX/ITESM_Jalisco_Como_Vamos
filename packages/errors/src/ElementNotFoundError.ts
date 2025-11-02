export default class ElementNotFoundError extends Error{
    msg = 'Element not found in database.';

    constructor(msg?: string){
        super(msg);
        this.name = 'ElementNotFoundError';
    }   
}