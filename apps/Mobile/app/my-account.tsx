import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";

import { ChangePasswordSheet } from "@/components/change-password-sheet";
import ErrorDialog from "@/components/error-dialog";
import LoadingDialog from "@/components/loading-dialog";
import { TFAPasswordInputDialog } from "@/components/2fa-password-input-dialog";
import { TFASecretCopyDialog } from "@/components/2fa-secret-copy-dialog";
import { RemoveAccountConfirmDialog } from "@/components/remove-account-confirm-dialog";
import { RemoveAccountPasswordDialog } from "@/components/remove-account-password-dialog";
import { RemoveAccountTOTPDialog } from "@/components/remove-account-totp-dialog";

import getBetterAuthErrorMessage_ES from "@/functions/getBetterAuthErrorMessage_ES";
import { isUsingSocialProvider } from "@/functions/isUsingSocialProvider";

import { ArrowLeftIcon, KeyRoundIcon, RectangleEllipsisIcon, LogOutIcon, TrashIcon } from "lucide-react-native";
import { GenericMessageDialog } from "@/components/success-dialog";
import { TFAConfirmDialog } from "@/components/2fa-confirm-dialog";

type DialogState = {
    type: 'none' | 'error' | 'change-password-sheet' | '2fa-password' | '2fa-secret' | '2fa-confirm' | 'name' | 'success' | 'remove-confirm' | 'remove-password' | 'remove-totp';
    title?: string;
    message?: string;
    callback?: (...args: any[]) => Promise<any>;
};

export default function MyAccount() {
    const router = useRouter();

    const session = authClient.useSession();
    const tfaEnabled = session.data?.user.twoFactorEnabled;

    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingProvider, setIsCheckingProvider] = useState(true);
    const [isSocialProviderSession, setIsSocialProviderSession] = useState(true);
    const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
    const [secret2FA, setSecret2FA] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    useEffect(() => {
        let isMounted = true;

        const checkProvider = async () => {
            try {
                setIsCheckingProvider(true);
                const result = await isUsingSocialProvider();
                if (isMounted) {
                    setIsSocialProviderSession(result);
                }
            } catch {
                // Default to credential provider on error
                if (isMounted) {
                    setIsSocialProviderSession(false);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingProvider(false);
                }
            }
        };

        checkProvider();

        return () => {
            isMounted = false;
        };
    }, [])

    // ==== HANDLERS ==== \\
    const handleChangePassword = async (currentPassword: string, newPassword: string) => {
        try {
            setDialog({ type: 'none' });
            setIsLoading(true);

            const { data, error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (data) setDialog({ type: 'success', title: 'Cambiar contraseña', message: '¡Contraseña modificada con éxito!' });

            if (error) {
                const errorMessage = error?.code
                    ? getBetterAuthErrorMessage_ES(error.code)
                    : error.message;
                setDialog({ type: 'error', message: errorMessage ?? 'Error al cambiar la contraseña' });
                return;
            }

        } catch (err: any) {
            setDialog({ type: 'error', message: err.message ?? 'Error al cambiar la contraseña' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd2FA = async (password: string) => {
        try {
            const { data, error } = await authClient.twoFactor.enable({
                password,
            });

            setDialog({ type: 'none' });

            if (error || !data) {
                const errorMessage = error?.code
                    ? getBetterAuthErrorMessage_ES(error.code)
                    : error.message;
                setDialog({ type: 'error', message: errorMessage ?? 'Error al habilitar 2FA. Intenta nuevamente más tarde.' });
                return;
            }

            const { totpURI } = data;
            const secretMatch = totpURI?.match(/secret=([^&]+)/);
            const secret = secretMatch ? secretMatch[1] : totpURI;

            setSecret2FA(secret);
            setDialog({ type: '2fa-secret' });

        } catch {
            setDialog({ type: 'error', message: 'Error al habilitar 2FA. Intenta nuevamente más tarde.' });
        }
    };

    const handleConfirm2FA = async (code: string) => {
        try {
            const { data, error } = await authClient.twoFactor.verifyTotp({
                code,
            });

            console.log({ data, error });
            if (data) setDialog({ type: 'success', title: 'Doble factor (TOTP)', message: 'Doble factor habilitado exitosamente.' });
            if (error) setDialog({ type: 'error', message: error.message ?? 'Error al habilitar 2FA. Intenta nuevamente más tarde.' });

        } catch {
            setDialog({ type: 'error', message: 'Error al habilitar 2FA. Intenta nuevamente más tarde.' });
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await authClient.signOut();
            router.replace('/login');
        } catch {
            router.replace('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAccount = async (password: string, totpCode?: string) => {
        try {
            setDialog({ type: 'none' });
            setIsLoading(true);
            const { error } = await authClient.deleteUser({ 
                password,
                ...(totpCode && { totpCode })
            });

            if (error) {
                const errorMessage = error?.code
                    ? getBetterAuthErrorMessage_ES(error.code)
                    : error.message;
                setDialog({ type: 'error', message: errorMessage ?? 'Error al eliminar cuenta' });
                return;
            }

            router.replace('/login');
        } catch {
            setDialog({ type: 'error', message: 'Error al eliminar la cuenta.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword_Btn = () => {
        setDialog({ type: 'change-password-sheet', callback: handleChangePassword });
    };

    const handleRemoveAccount_Btn = async () => {
        setDialog({ type: 'remove-confirm', callback: handleRemoveAccount });
    };

    const handleAdd2FA_Btn = async () => {
        setDialog({ type: '2fa-password', title: 'Doble factor', callback: handleAdd2FA });
    }

    const handleConfirmCopyDiag2FA_Btn = () => {
        setDialog({ type: '2fa-confirm' });
    };
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 bg-white"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32, gap: 20, display: 'flex', flexGrow: 1 }}
            >
                <LoadingDialog isOpen={isLoading} />

                <ErrorDialog
                    isOpen={dialog.type === 'error'}
                    cause={dialog.message ?? ''}
                    handleClose={() => setDialog({ type: 'none' })}
                />

                <GenericMessageDialog
                    isOpen={dialog.type === 'success'}
                    title={dialog.title!}
                    message={dialog.message!}
                    submitBtnTxt={'Aceptar'}
                    onSubmit={() => setDialog({ type: 'none' })}
                />

                <TFAPasswordInputDialog
                    isOpen={dialog.type === '2fa-password'}
                    onSubmit={dialog.callback}
                    onCancel={() => setDialog({ type: 'none' })}
                />

                <TFASecretCopyDialog
                    isOpen={dialog.type === '2fa-secret'}
                    title={'Google Authenticator'}
                    value={secret2FA}
                    handleSubmit={handleConfirmCopyDiag2FA_Btn}
                    handleCancel={() => setDialog({ type: 'none' })}
                />

                <TFAConfirmDialog
                    isOpen={dialog.type === '2fa-confirm'}
                    handleSubmit={handleConfirm2FA}
                    handleCancel={() => setDialog({ type: 'none' })}
                />

                <RemoveAccountConfirmDialog
                    isOpen={dialog.type === 'remove-confirm'}
                    onConfirm={() => setDialog({ type: 'remove-password' })}
                    onCancel={() => setDialog({ type: 'none' })}
                />

                <RemoveAccountPasswordDialog
                    isOpen={dialog.type === 'remove-password'}
                    onSubmit={(password) => {
                        setTempPassword(password);
                        if (tfaEnabled) {
                            setDialog({ type: 'remove-totp' });
                        } else {
                            handleRemoveAccount(password);
                        }
                    }}
                    onCancel={() => setDialog({ type: 'none' })}
                />

                <RemoveAccountTOTPDialog
                    isOpen={dialog.type === 'remove-totp'}
                    onSubmit={(code) => handleRemoveAccount(tempPassword, code)}
                    onCancel={() => {
                        setTempPassword('');
                        setDialog({ type: 'none' });
                    }}
                />

                <ChangePasswordSheet
                    isOpen={dialog.type === 'change-password-sheet'}
                    onClose={() => setDialog({ type: 'none' })}
                    onSubmit={dialog.callback}
                />

                <View className="flex flex-row justify-between">
                    <Pressable onPress={() => router.back()}>
                        <ArrowLeftIcon size={40} />
                    </Pressable>
                    <ThemedText type="title">
                        Mi cuenta
                    </ThemedText>
                </View>
                <View className="flex flex-row items-center gap-4">
                    <Avatar size='xl' className="bg-slate-300">
                        {
                            <AvatarFallbackText>
                                {session.data?.user?.name}
                            </AvatarFallbackText>
                        }
                    </Avatar>
                    <View className="flex-1">
                        <ThemedText type="subtitle">
                            {session.data?.user?.name ?? "Cargando..."}
                        </ThemedText>
                    </View>
                </View>
                {
                    session.data
                        ?
                        <View className="flex-1 justify-between">
                            <View className="flex">
                                <Button
                                    className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center"
                                    isDisabled={isSocialProviderSession || isCheckingProvider}
                                    onPress={handleChangePassword_Btn}
                                >
                                    <ButtonIcon as={RectangleEllipsisIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>
                                        {isCheckingProvider ? 'Cargando...' : 'Cambiar contraseña'}
                                    </ButtonText>
                                </Button>
                                {tfaEnabled ? null : (
                                    <Button
                                        className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center"
                                        isDisabled={isSocialProviderSession || isCheckingProvider}
                                        onPress={handleAdd2FA_Btn}
                                    >
                                        <ButtonIcon as={KeyRoundIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                        <ButtonText className='color-black data-[active=true]:color-black'>
                                            {isCheckingProvider ? 'Cargando...' : 'Habilitar doble factor'}
                                        </ButtonText>
                                    </Button>
                                )}
                            </View>
                            <View>
                                <Divider />
                                <Button
                                    className="flex flex-row my-3 h-14 bg-pantone-red data-[active=true]:bg-pantone-red-dark justify-start p-2 rounded-lg items-center"
                                    onPress={handleLogout}
                                >
                                    <ButtonIcon as={LogOutIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>Cerrar sesión</ButtonText>
                                </Button>
                                <Button
                                    className="flex flex-row my-3 h-14 bg-pantone-red data-[active=true]:bg-pantone-red-dark justify-start p-2 rounded-lg items-center"
                                    onPress={handleRemoveAccount_Btn}
                                >
                                    <ButtonIcon as={TrashIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>Eliminar cuenta</ButtonText>
                                </Button>
                            </View>
                        </View>
                        : <></>
                }
            </ScrollView>
        </SafeAreaView >
    );
}