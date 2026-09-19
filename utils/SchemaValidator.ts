
import Ajv, { type ErrorObject, type AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

// strict:false keeps Ajv from throwing on harmless unknown keywords in schemas.
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export interface SchemaResult {
    valid: boolean;
    errors: ErrorObject[]; 
    /** Human-readable, multi-line error summary (empty when valid). */
    errorText: string;
}

export function validateSchema(schema: AnySchema, data: unknown): SchemaResult {
    const validate = ajv.compile(schema);
    const valid = validate(data) as boolean;
    const errors = validate.errors ?? [];
    const errorText = errors
        .map(e => `  • ${e.instancePath || '(root)'} ${e.message ?? ''}`)
        .join('\n');
    return { valid, errors, errorText };
}