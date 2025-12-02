import { auth } from "@/lib/auth";

import { fromNodeHeaders } from "better-auth/node";

import type { Request, Response, NextFunction } from "express";

export function rbacMiddleware(policies: Array<string>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Redirect si politica es publica.
            if (policies.includes('PUBLIC')) return next();

            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            });

            if (!session) return res.sendUnauthorized('Sesión no iniciada.');

            const userRole = (session?.user as any).role;
            if (!userRole) return res.sendUnauthorized('Sesión no iniciada.');

            if (!policies.includes(userRole.toUpperCase()))
                return res.sendForbidden('No tienes permiso para realizar esta acción.');

            return next();

        } catch (err: any) {
            return res.sendInternalServerError(`Error desconocido. Contacte un administrador. ${err.message}`);
        }
    }
}