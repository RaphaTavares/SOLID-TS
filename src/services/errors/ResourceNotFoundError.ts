export class ResourceNotFoundError extends Error {
    constructor() {
        super('Resource was not found');
    }
}