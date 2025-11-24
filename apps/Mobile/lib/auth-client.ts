import { createAuthClient } from "better-auth/react";

import { expoClient } from "@better-auth/expo/client";
import { passkeyClient } from "@better-auth/passkey/client";

import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    fetchOptions: {
        timeout: 10000,
    },
    plugins: [
        expoClient({
            scheme: "jcv",
            storagePrefix: "jcv",
            storage: SecureStore,
        }),
        passkeyClient()
    ],
});