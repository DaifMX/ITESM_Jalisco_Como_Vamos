import { ZodError } from 'zod/v4';

type ValidationErrorObject = { field: string, cause: string };
type ValidationErrorFieldArray = Array<ValidationErrorObject>;

export default class ValidationFailureError extends Error {
    public msg = 'Error al verificar campo/s.';

    public fields?: ValidationErrorFieldArray | undefined;

    constructor(msg?: string, fields?: ValidationErrorFieldArray) {
        super(msg || 'Error validating field.');
        this.name = 'ValidationFailureError';
        this.fields = fields;
    }

    public static parseZodError(zodError: ZodError): ValidationErrorFieldArray {
        return zodError.issues.map((i: any) => ({
            field: i.path[0],
            cause: i.message
        }));
    };

    public getErrorsObject(): Record<string, string> {
        if (this.fields == undefined) return {};

        return this.fields.reduce((acc: any, error: ValidationErrorObject) => {
            acc[error.field] = error.cause
            return acc;
        }, {} as Record<string, string>);
    };
}