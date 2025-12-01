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

import getBetterAuthErrorMessage_ES from "@/functions/getBetterAuthErrorMessage_ES";
import { isUsingSocialProvider } from "@/functions/isUsingSocialProvider";

import { ArrowLeftIcon, KeyRoundIcon, RectangleEllipsisIcon, LogOutIcon, TrashIcon } from "lucide-react-native";

type DialogState = {
    type: 'none' | 'error' | 'password' | 'change-password-sheet' | '2fa-secret' | '2fa-confirm' | 'name';
    title?: string;
    message?: string;
    callback?: (...args: any[]) => Promise<any>;
};

export default function MyAccount() {
    const router = useRouter();

    const session = authClient.useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [isSocialProviderSession, setIsSocialProviderSession] = useState(true);
    const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
    const [secret2FA, setSecret2FA] = useState('');

    // useEffect(() => {
    //     let isMounted = true;

    //     const checkProvider = async () => {
    //         try {
    //             const result = await isUsingSocialProvider();
    //             if (isMounted) setIsSocialProviderSession(result);
    //         } catch { }
    //     };

    //     checkProvider();

    //     return () => {
    //         isMounted = false;
    //     };
    // }, [])

    useEffect(() => {
        let isMounted = true;
        console.log('[MyAccount] Montando componente...'); // LOG 1

        const checkProvider = async () => {
            try {
                console.log('[MyAccount] Iniciando checkProvider...'); // LOG 2
                const start = Date.now();

                const result = await isUsingSocialProvider();

                const end = Date.now();
                console.log(`[MyAccount] checkProvider terminó en ${end - start}ms`); // LOG 3

                if (end - start > 500) console.warn('¡OJO! isUsingSocialProvider está tardando mucho');

                if (isMounted) setIsSocialProviderSession(result);
            } catch (e) {
                console.error(e);
            }
        };

        checkProvider();

        return () => {
            console.log('[MyAccount] Desmontando componente'); // LOG 4
            isMounted = false;
        };
    }, [])


    // ==== HANDLERS ==== \\
    const handleChangePassword = async (currentPassword: string, newPassword: string) => {
        try {
            // Cerramos el modal primero para mejorar la UX
            setDialog({ type: 'none' });
            setIsLoading(true);

            const { data, error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                const errorMessage = error?.code
                    ? getBetterAuthErrorMessage_ES(error.code)
                    : error.message;
                setDialog({ type: 'error', message: errorMessage ?? 'Error al cambiar la contraseña' });
                return;
            }
            // Opcional: Mostrar mensaje de éxito
        } catch (err: any) {
            setDialog({ type: 'error', message: err.message ?? 'Error al cambiar la contraseña' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword_Btn = () => {
        // Cambiamos el tipo de dialogo a nuestro nuevo sheet
        setDialog({ type: 'change-password-sheet', callback: handleChangePassword });
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

        } catch (err: any) {
            setDialog({ type: 'error', message: 'Error al habilitar 2FA. Intenta nuevamente más tarde.' });
        }
    };

    const handleAdd2FA_Btn = async () => {
        setDialog({ type: 'password', title: 'Doble factor', callback: handleAdd2FA });
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

    const handleRemoveAccount = async (password: string) => {
        try {
            setIsLoading(true);
            const { data, error } = await authClient.deleteUser({ password });

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

    const handleRemoveAccount_Btn = async () => {
        setDialog({ type: 'password', title: 'Eliminar cuenta', callback: handleRemoveAccount });
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

                {/* Aquí iría tu componente PasswordInputDialog original para las otras acciones (2FA, Eliminar) */}
                {/* <PasswordInputDialog ... /> */}

                <TFASecretCopyDialog
                    isOpen={dialog.type === '2fa-secret'}
                    title={'Google Authenticator'}
                    value={secret2FA}
                    handleSubmit={() => setDialog({ type: 'none' })}
                    handleCancel={() => setDialog({ type: 'none' })}
                />
                
                <TFAPasswordInputDialog
                    isOpen={dialog.type === 'password'}
                    onSubmit={dialog.callback}
                    onCancel={() => setDialog({ type: 'none' })}
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
                                    isDisabled={isSocialProviderSession}
                                    onPress={handleChangePassword_Btn}
                                >
                                    <ButtonIcon as={RectangleEllipsisIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>Cambiar contraseña</ButtonText>
                                </Button>
                                <Button
                                    className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center"
                                    isDisabled={isSocialProviderSession}
                                    onPress={handleAdd2FA_Btn}
                                >
                                    <ButtonIcon as={KeyRoundIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>Habilitar doble factor</ButtonText>
                                </Button>
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
        </SafeAreaView>
    );
}