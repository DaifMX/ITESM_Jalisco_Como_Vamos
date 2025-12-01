import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import { ThemedText } from "@/components/themed-text";

import { ALargeSmallIcon, ArrowLeftIcon, KeyRoundIcon, RectangleEllipsisIcon, LogOutIcon, TrashIcon } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import LoadingDialog from "@/components/loading-dialog";
import ErrorDialog from "@/components/error-dialog";

import { isUsingSocialProvider } from "@/functions/isUsingSocialProvider";

import { TFASecretCopyDialog } from "@/components/2fa-secret-copy-dialog";
import { PasswordInputDialog } from "@/components/password-input-dialog";

import getBetterAuthErrorMessage_ES from "@/functions/getBetterAuthErrorMessage_ES";

type DialogState = {
    type: 'none' | 'error' | 'password' | '2fa-secret' | '2fa-confirm';
    title?: string;
    message?: string;
    callback?: (value: string) => Promise<any>;
};

export default function MyAccount() {
    const router = useRouter();

    const session = authClient.useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [isSocialProviderSession, setIsSocialProviderSession] = useState(true);
    const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
    const [secret2FA, setSecret2FA] = useState('');

    useEffect(() => {
        let isMounted = true;

        const checkProvider = async () => {
            try {
                const result = await isUsingSocialProvider();
                if (isMounted) setIsSocialProviderSession(result);
            } catch { }
        };

        checkProvider();

        return () => {
            isMounted = false;
        };
    }, [])


    // ==== HANDLERS ==== \\
    const handleChangeName = () => {

    };

    const handleChangePassword = async (currentPassword: string) => {
        const newPassword = ''; // This needs to be collected from user
        try {
            const { data, error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                const errorMessage = error?.code
                    ? getBetterAuthErrorMessage_ES(error.code)
                    : error.message;
                setDialog({ type: 'error', message: errorMessage ?? 'Error al habilitar 2FA' });
                return;
            }

        } catch (err: any) {

        }
    };

    const handleChangePassword_Btn = () => {
        setDialog({ type: 'password', title: 'Cambiar contraseña', callback: handleChangePassword });
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
                setDialog({ type: 'error', message: errorMessage ?? 'Error al habilitar 2FA' });
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
                <PasswordInputDialog
                    isOpen={dialog.type === 'password'}
                    title={dialog.title ?? ''}
                    onSubmit={dialog.callback}
                    onCancel={() => setDialog({ type: 'none' })}
                />
                <TFASecretCopyDialog
                    isOpen={dialog.type === '2fa-secret'}
                    title={'Google Authenticator'}
                    value={secret2FA}
                    handleSubmit={() => setDialog({ type: 'none' })}
                    handleCancel={() => setDialog({ type: 'none' })}
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
                                    onPress={handleChangeName}
                                >
                                    <ButtonIcon as={ALargeSmallIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                    <ButtonText className='color-black data-[active=true]:color-black'>Cambiar nombre</ButtonText>
                                </Button>
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