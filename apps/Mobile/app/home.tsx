import { useState } from "react";
import useSWR from 'swr';
import { useRouter } from "expo-router";

import { ScrollView, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { fetcher } from "@/lib/axios";

import { AvatarSection } from "@/components/avatar-section";
import { BasicElementCard } from "@/components/basic-elem-card";
import { Footer } from "@/components/footer";

import { Input, InputSlot, InputIcon, InputField } from '@/components/ui/input';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { VStack } from "@/components/ui/vstack";

import { SearchIcon } from "lucide-react-native";

export type Session = typeof authClient.$Infer.Session;

export default function Home() {
    const router = useRouter();

    const session = authClient.useSession();

    const [searchFocused, setSearchFocused] = useState(false);
    const [searchBarVal, setSearchBarVal] = useState("");

    return (
        <>
            <ScrollView
                className="flex-1 bg-white"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32 }}
            >
                <View className="flex flex-col gap-8">
                    <View className="flex flex-row justify-between">
                        <ThemedText type="title">Inicio</ThemedText>
                        <AvatarSection
                            user={session.data?.user}
                            handleMyAccount={() => router.push('/my-account')}
                            handleSettings={() => router.push('/my-account')}
                            handleSignIn={() => router.push('/login')}
                            handleSignOut={() => { authClient.signOut(); router.push('/login') }}
                        />
                    </View>
                    <ThemedView lightColor="transparent" darkColor="transparent">
                        <View className="gap-4">
                            <View>
                                <Input className={`h-14 rounded-[10px] bg-[#F5F5F5] border ${searchFocused ? 'border-black' : 'border-transparent'}`}>
                                    <InputSlot className="pl-4">
                                        <InputIcon as={SearchIcon} />
                                    </InputSlot>
                                    <InputField
                                        placeholder="Buscar"
                                        value={searchBarVal}
                                        onChangeText={setSearchBarVal}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                    />
                                </Input>
                            </View>
                        </View>
                    </ThemedView>

                    {/* Categories */}
                    <VStack space="md">
                        <CategoryList />
                    </VStack>
                </View>
            </ScrollView>
            <Footer/>
        </>
    );
}

const CategoryList = () => {
    const router = useRouter();

    const { data, error, isLoading } = useSWR('/api/category', fetcher);

    if (error) return <ThemedText className="color-red-500">Error</ThemedText>

    if (isLoading) return <ThemedText className="color-blue-400">Error</ThemedText>

    return (
        data?.map((c: any) => {
            return (
                <BasicElementCard
                    key={c.id}
                    onPress={() => router.push('/questions')}
                    text={c.name}
                />
            );
        })
    );
};