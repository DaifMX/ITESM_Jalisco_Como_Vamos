import { View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";

import { ArrowLeftIcon, LogOutIcon, TrashIcon } from "lucide-react-native";

export default function MyAccount() {
    const router = useRouter();

    const session = authClient.useSession();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32, gap: 20, display: 'flex' }}
            >
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
                <View className="flex gap-0">
                    <Button className="flex flex-row my-3 h-14 bg-[#F5F5F5] justify-start p-2 rounded-lg items-center">
                        <ButtonText className='color-black'>Cambiar nombre</ButtonText>
                    </Button>
                    <Button className="flex flex-row my-3 h-14 bg-[#F5F5F5] justify-start p-2 rounded-lg items-center">
                        <ButtonText className='color-black'>Cambiar contraseña</ButtonText>
                    </Button>
                </View>
                <View>
                    <Button className="flex flex-row my-3 h-14 bg-[#cf3232bd] justify-start p-2 rounded-lg items-center" onPress={() => { authClient.signOut(); router.push('/login'); }}>
                        <ButtonIcon as={LogOutIcon} className='w-5 h-5 mr-2 color-black' />
                        <ButtonText className='color-black'>Cerrar sesión</ButtonText>
                    </Button>
                    <Button className="flex flex-row my-3 h-14 bg-[#cf3232bd] justify-start p-2 rounded-lg items-center" onPress={() => { authClient.deleteUser(); router.push('/login'); }}>
                        <ButtonIcon as={TrashIcon} className='w-5 h-5 mr-2 color-black' />
                        <ButtonText className='color-black'>Eliminar cuenta</ButtonText>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}