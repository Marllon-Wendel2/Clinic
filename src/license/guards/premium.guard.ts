import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PREMIUM_KEY } from "../decorators/premium.decorator";

@Injectable()
export class PremiumGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiresPremium = this.reflector.getAllAndOverride<Boolean>(PREMIUM_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiresPremium) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || user.tier !== 'premium') {
            throw new ForbiddenException(
            'Esta funcionalidade requer tier premium. Faça upgrade para acessar.'
            );
        }

        return true;
    }
}