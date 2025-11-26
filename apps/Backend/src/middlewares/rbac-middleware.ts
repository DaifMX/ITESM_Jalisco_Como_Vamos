import { admin } from 'better-auth/plugins';
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

import type { Request, Response, NextFunction } from "express";
import UserRepository from '@/repositories/UserRepository';


export function rbacMiddleware(policies: Array<string>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Redirect si politica es publica.
            if (policies.includes('PUBLIC')) return next();

            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });

            const userId = session?.user.id;
            if (!userId) return res.sendUnauthorized('Sesión no iniciada.');

            const userRepo = new UserRepository();
            const user = await userRepo.getById(userId);

            if (!policies.includes((user as any).role.toUpperCase()))
                return res.sendForbidden('No tienes permiso para realizar esta acción.');

            return next();

        } catch (err: any) {
            return res.sendInternalServerError(`Error desconocido. Contacte un administrador. ${err.message}`);
        }
    }
}