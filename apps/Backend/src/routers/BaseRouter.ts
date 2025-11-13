import { Router } from 'express';

// import { rbacMiddleware } from '@/middleware/rbac_middleware';

import { InternalError } from '@jcv/errors';

import type { Request, RequestHandler, Response, NextFunction } from 'express';
import type { AuthPolicy } from '@/types/auth-policy-types';

export default abstract class BaseRouter {
    private router;

    constructor() {
        this.router = Router();
        this.init();
    };

    protected init() { };

    public getRouter(): Router {
        return this.router;
    };

    //=========================//
    //     ROUTER METHODS      //
    //=========================//
    public get(path: string, policies: AuthPolicy[], ...callbacks: RequestHandler[]): void {
        // if (this.validatePolicies(policies, path)) this.router.get(path, this.generateCustomResponses, rbacMiddleware(policies), callbacks);
        if (this.validatePolicies(policies, path)) this.router.get(path, this.generateCustomResponses, callbacks);
    };

    public patch(path: string, policies: AuthPolicy[], ...callbacks: RequestHandler[]): void {
        // if (this.validatePolicies(policies, path)) this.router.patch(path, this.generateCustomResponses, rbacMiddleware(policies), callbacks);
        if (this.validatePolicies(policies, path)) this.router.patch(path, this.generateCustomResponses, callbacks);
    };

    public post(path: string, policies: AuthPolicy[], ...callbacks: RequestHandler[]): void {
        // if (this.validatePolicies(policies, path)) this.router.post(path, this.generateCustomResponses, rbacMiddleware(policies), callbacks);
        if (this.validatePolicies(policies, path)) this.router.post(path, this.generateCustomResponses, callbacks);
    };

    public put(path: string, policies: AuthPolicy[], ...callbacks: RequestHandler[]): void {
        // if (this.validatePolicies(policies, path)) this.router.put(path, this.generateCustomResponses, rbacMiddleware(policies), callbacks);
        if (this.validatePolicies(policies, path)) this.router.put(path, this.generateCustomResponses, callbacks);
    };

    public delete(path: string, policies: AuthPolicy[], ...callbacks: RequestHandler[]): void {
        // if (this.validatePolicies(policies, path)) this.router.delete(path, this.generateCustomResponses, rbacMiddleware(policies), callbacks);
        if (this.validatePolicies(policies, path)) this.router.delete(path, this.generateCustomResponses, callbacks);
    };

    //=========================//
    //    INTERNAL METHODS     //
    //=========================//

    private validatePolicies = (policies: AuthPolicy[], path: string): boolean => {
        if (!policies || !Array.isArray(policies)) throw new InternalError(`No policies on ${path}`);

        const allowedPolicies = ['PUBLIC', 'AUTHORIZED', 'USER', 'ADMIN'];

        // Ensures each provided policy is one of the allowed ones.
        for (const p of policies) {
            if (!allowedPolicies.includes(p)) {
                throw new InternalError(`Bad policy ${p} from ${path}`);
            }
        }

        return true;
    }

    private generateCustomResponses(_req: Request, res: Response, next: NextFunction) {
        //2XX
        res.sendSuccess = (payload: Record<string, any>, msg?: string, pagination?: Record<string, any>) => res.status(200).json({
            payload,
            status: 'success',
            msg,
            pagination,
        });

        res.sendCreated = (payload: Record<string, any>, msg?: string) => res.status(201).json({ status: 'success', payload, msg });
        res.sendAccepted = (payload: Record<string, any>, msg?: string) => res.status(202).json({ status: 'success', payload, msg });

        // 4XX
        res.sendBadRequest = (reason: string = 'Razon de error desconocida', fields?: string) => res.status(400).json({
            status: 'error',
            error: 'Error en la solicitud enviada.',
            reason,
            fields,
        });
        res.sendUnauthorized = (reason?: string) => res.status(401).json({
            status: 'error',
            error: 'Creedenciales invalidas para realizar esta acción.',
            reason,
        });
        res.sendForbidden = (reason?: string) => res.status(403).json({
            status: 'error',
            error: 'Permisos insuficientes para realizar esta acción.',
            reason,
        })
        res.sendNotFound = (reason?: string) => res.status(404).json({
            status: 'error',
            error: 'Recurso no encontrado en la base de datos.',
            reason
        });
        res.sendTooManyRequests = (reason?: string) => res.status(429).json({
            status: 'error',
            error: 'Demasiadas solicitudes. Intente nuevamente más tarde.',
            reason
        });

        // 5XX
        res.sendInternalServerError = (reason?: string) => res.status(500).json({
            status: 'error',
            error: 'Error interno en el servidor. Contacte un administrador.',
            reason
        });

        next();
    };
}