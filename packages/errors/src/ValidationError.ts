import { ZodError } from 'zod/v4';

type ValidationFieldMeta = { field: string, cause: string };

export default class ValidationError extends Error {
    public msg = 'Error al verificar campo/s.';

    public fields?: ValidationFieldMeta[] | undefined;

    constructor(msg?: string, fields?: ValidationFieldMeta[]) {
        super(msg || 'Error validating field.');
        this.name = 'ValidationError';
        this.fields = fields;
    }

    public static parseZodError(zodError: ZodError): ValidationFieldMeta[] {
        return zodError.issues.map((i: any) => ({
            field: i.path[0],
            cause: i.message
        }));
    };

    public getErrorsObject(): Record<string, string> {
        if (this.fields == undefined) return {};

        return this.fields.reduce((acc: any, error: ValidationFieldMeta) => {
            acc[error.field] = error.cause
            return acc;
        }, {} as Record<string, string>);
    };
}