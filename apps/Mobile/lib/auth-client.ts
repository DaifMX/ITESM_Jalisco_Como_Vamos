import { createAuthClient } from "better-auth/react";

import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: 'http://10.0.1.3:4040',
    plugins: [
        expoClient({
            scheme: "jaliscocomovamosapp",
            storagePrefix: "jcv",
            storage: SecureStore,
        })
    ]
});