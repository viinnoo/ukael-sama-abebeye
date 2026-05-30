import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { UserRole } from "src/user/dto/create-user.dto";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Gunakan optional chaining (?.) untuk mencegah crash jika user undefined
        const hasRole = requiredRoles.includes(user?.role);

        if (!hasRole) {
            // Ditambah exception ini biar respons di Postman kelihatan rapi (403 Forbidden)
            throw new ForbiddenException('Akses ditolak! Role Anda tidak sesuai.');
        }

        return hasRole;
    }
}