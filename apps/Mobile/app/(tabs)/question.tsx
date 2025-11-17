import { ScrollView, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import AvatarSection from "@/components/avatar-section";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Card } from '@/components/ui/card';

import { ArrowLeftIcon } from "lucide-react-native";

export default function Question({ text }: { text: string }) {
    const router = useRouter();

    const session = authClient.useSession();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32 }}
            >
                <View className="flex flex-col gap-8">
                    <View className="flex flex-row justify-between">
                        <Pressable onPress={() => router.push('/home')}>
                            <ArrowLeftIcon size={40} />
                        </Pressable>
                        <AvatarSection
                            user={session.data?.user}
                            handleMyAccount={() => router.push('/my-account')}
                            handleSettings={() => router.push('/settings')}
                            handleSignIn={() => router.push('/login')}
                            handleSignOut={() => { authClient.signOut(); router.push('/login') }}
                        />
                    </View>
                    <ThemedView lightColor="transparent" darkColor="transparent">
                        <Card className='border-black border-[1px] rounded-md'>
                            <View className="gap-4">
                                <ThemedText type="title">
                                    {text ?? "Descripción"}
                                </ThemedText>
                                <View>
                                    <Card className='bg-slate-200 rounded-md'>
                                        <ThemedText type="default">
                                            En una escala del 1 al 5, donde 1 significa "Nada satisfecha(o)" y 5 significa "Muy satisfecha(o)".  ¿Qué tan satisfecha(o) está con la educación escolar que tiene?
                                        </ThemedText>
                                    </Card>
                                </View>
                            </View>
                        </Card>
                    </ThemedView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}