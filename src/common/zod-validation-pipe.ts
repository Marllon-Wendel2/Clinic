import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            const issues = error.issues ?? error.errors ?? [];
            const messages = issues.map((e: { message?: string }) => e.message ?? 'Erro desconhecido');
            throw new BadRequestException(
                `Validação falhou: ${messages.join(', ')}`,
            );
        }
    }
}