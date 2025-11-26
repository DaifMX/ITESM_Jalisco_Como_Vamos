import { InternalError } from "@jcv/errors";

import type { Request, Response } from "express";

export default class SystemController {
    public appVersion = async (req: Request, res: Response) => {
        const clientVersion = req.body.clientVersion;
        const minVersion = process.env.APP_MIN_VERSION;

        console.log(clientVersion);
        if (!minVersion) throw new InternalError("Error Critico: VERSION MINIMA NO RECIBIDA.");

        // Compare versions (format: Major.Minor.Build)
        const isClientOutdated = this.compareVersions(clientVersion, minVersion) < 0;

        return res.sendSuccess(
            {
                minVersion,
                latestVersion: process.env.APP_LATEST_VERSION,
                forceUpdate: isClientOutdated ? 1 : 0,
                updateMessage: 'Actualiza la app para seguir investigando acerca de Jalisco!'
            }
        );
    };

    /**
     * Compare two semantic versions in format "Major.Minor.Build"
     * @returns -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
     */
    private compareVersions(v1: string, v2: string): number {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }
}