import { createAuthClient } from "better-auth/react";

import { adminClient, twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL,
    fetchOptions: {
        timeout: 10000,
        credentials: 'include', // Changed from 'omit' to 'include' for cookie-based sessions
        headers: {
            'x-admin-login': 'true',
        },
    },
    plugins: [
        twoFactorClient(),
        adminClient(),
    ],
});