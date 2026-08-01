import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            throw new BadRequestException(
                `Validação falhou: ${error.errors.map((e) => e.message).join(', ')}`,
            );
        }
    }
}