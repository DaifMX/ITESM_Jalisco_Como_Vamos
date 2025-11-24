import { View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";

import { ALargeSmallIcon, ArrowLeftIcon, KeyRoundIcon, LogOutIcon, ScanFaceIcon, TrashIcon } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { addBiometric } from "@/lib/biometrics";
import LoadingDialog from "@/components/loading-dialog";
import ErrorDialog from "@/components/error-dialog";

export default function MyAccount() {
    const router = useRouter();

    const session = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isErrorDiagOpen, setIsErrorDiagOpen] = useState(false);

    const handleAddBiometric = async () => {
        try {
            setIsLoading(true);
            await addBiometric();
            // Optionally show success message
        } catch (err: any) {
            setError(err.message ?? 'Error al configurar autenticación biométrica.');
            setIsErrorDiagOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 32, gap: 20, display: 'flex' }}
        >
            <LoadingDialog isOpen={isLoading} />
            <ErrorDialog isOpen={isErrorDiagOpen} cause={error} handleClose={() => setIsErrorDiagOpen(false)} />
            
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
                    ? <View className="flex h-max justify-between">
                        <View className="flex gap-0">
                            <Button className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center">
                                <ButtonIcon as={ALargeSmallIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                <ButtonText className='color-black data-[active=true]:color-black'>Cambiar nombre</ButtonText>
                            </Button>
                            <Divider />
                            <Button className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center">
                                <ButtonIcon as={KeyRoundIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                <ButtonText className='color-black data-[active=true]:color-black'>Cambiar contraseña</ButtonText>
                            </Button>
                            <Button className="flex flex-row my-3 h-14 bg-[#F5F5F5] data-[active=true]:bg-[#b2a8a8] justify-start p-2 rounded-lg items-center" onPress={handleAddBiometric}>
                                <ButtonIcon as={ScanFaceIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                <ButtonText className='color-black data-[active=true]:color-black'>Desbloqueo con Face ID</ButtonText>
                            </Button>
                        </View>
                        <Divider />
                        <View>
                            <Button className="flex flex-row my-3 h-14 bg-pantone-red data-[active=true]:bg-pantone-red-dark justify-start p-2 rounded-lg items-center" onPress={() => { authClient.signOut(); router.push('/login'); }}>
                                <ButtonIcon as={LogOutIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                <ButtonText className='color-black data-[active=true]:color-black'>Cerrar sesión</ButtonText>
                            </Button>
                            <Button className="flex flex-row my-3 h-14 bg-pantone-red data-[active=true]:bg-pantone-red-dark justify-start p-2 rounded-lg items-center" onPress={() => { authClient.deleteUser(); router.push('/login'); }}>
                                <ButtonIcon as={TrashIcon} className='w-7 h-7 mr-2 color-black data-[active=true]:color-white' />
                                <ButtonText className='color-black data-[active=true]:color-black'>Eliminar cuenta</ButtonText>
                            </Button>
                        </View>
                    </View>
                    : <></>
            }
        </ScrollView>
    );
}