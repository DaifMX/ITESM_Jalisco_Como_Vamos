import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';

export function useAvatarNavigation() {
    const router = useRouter();

    const handleMyAccount = useCallback(() => {
        router.push('/my-account');
    }, [router]);

    const handleInfo = useCallback(() => {
        router.push('/info');
    }, [router]);

    const handleSignIn = useCallback(() => {
        router.push('/login');
    }, [router]);

    const handleSignOut = useCallback(() => {
        authClient.signOut();
        router.push('/login');
    }, [router]);

    return {
        handleMyAccount,
        handleInfo,
        handleSignIn,
        handleSignOut,
    };
}
