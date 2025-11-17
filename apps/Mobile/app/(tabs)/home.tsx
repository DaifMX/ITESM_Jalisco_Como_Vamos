import { useState } from "react";
import { ScrollView, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import AvatarSection from "@/components/avatar-section";

import { Box } from "@/components/ui/box";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Input, InputSlot, InputIcon, InputField } from '@/components/ui/input';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { VStack } from "@/components/ui/vstack";

import { SearchIcon, GuitarIcon, SpeechIcon, CrossIcon, CarIcon, LucideIcon } from "lucide-react-native";

export type Session = typeof authClient.$Infer.Session;

export default function Home() {
    const router = useRouter();

    const session = authClient.useSession();

    const [searchFocused, setSearchFocused] = useState(false);
    const [searchBarVal, setSearchBarVal] = useState("");

    const [categories, setCategories] = useState([
        { id: 0, text: 'Salud', icon: CrossIcon, color: '#EF4444', bgColor: '#FEE2E2' },
        { id: 1, text: 'Relaciones Interpersonales', icon: SpeechIcon, color: '#8B5CF6', bgColor: '#EDE9FE' },
        { id: 2, text: 'Cultura y recreación', icon: GuitarIcon, color: '#F59E0B', bgColor: '#FEF3C7' },
        { id: 3, text: 'Movilidad', icon: CarIcon, color: '#3B82F6', bgColor: '#DBEAFE' },
    ]);

    const [questions, setQuestions] = useState([
        { id: 0, text: "¿Qué tan satisfecha(o) está con la educación escolar que tiene?", categoryId: 0 },
        { id: 1, text: '¿Cómo calificaría su calidad de vida?', categoryId: 1 },
        { id: 2, text: "En general, ¿qué tan feliz es usted?", categoryId: 2 },
        { id: 3, text: "¿Cuál es su actividad diaria principal?", categoryId: 3 },
        { id: 4, text: "¿Qué tan satisfecha(o) está con la educación escolar que tiene?", categoryId: 0 },
        { id: 5, text: '¿Cómo calificaría su calidad de vida?', categoryId: 1 },
        { id: 6, text: "En general, ¿qué tan feliz es usted?", categoryId: 2 },
        { id: 7, text: "¿Cuál es su actividad diaria principal?", categoryId: 3 },
        { id: 8, text: "¿Qué tan satisfecha(o) está con la educación escolar que tiene?", categoryId: 0 },
        { id: 9, text: '¿Cómo calificaría su calidad de vida?', categoryId: 1 },
        { id: 10, text: "En general, ¿qué tan feliz es usted?", categoryId: 2 },
        { id: 11, text: "¿Cuál es su actividad diaria principal?", categoryId: 3 },
    ]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32 }}
            >
                <View className="flex flex-col gap-8">
                    <View className="flex flex-row justify-between">
                        <ThemedText type="title">Inicio</ThemedText>
                        <AvatarSection
                            user={session.data?.user}
                            handleMyAccount={() => router.push('/my-account')}
                            handleSettings={() => router.push('/settings')}
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
                    <View className='gap-2'>
                        <ScrollView
                            className="flex flex-row"
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            <HStack space="md">
                                {categories.map((c) => {
                                    return (
                                        <CategoryCard
                                            key={c.id}
                                            bgColor={c.bgColor}
                                            color={c.color}
                                            icon={c.icon}
                                            text={c.text}
                                        />
                                    );
                                })}
                            </HStack>
                        </ScrollView>
                        <Divider className='bg-black h-[1px]' />
                    </View>

                    {/* Questions */}
                    <VStack space="md">
                        {questions.map((q) => {
                            return (
                                <QuestionCard
                                    key={q.id}
                                    text={q.text}
                                />
                            );
                        })}
                    </VStack>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const QuestionCard = ({ text }: { text: string }) => {
    return (
        <Pressable className="w-full">
            <Box className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 justify-center">
                <ThemedText className="text-base font-semibold text-[#111827]">
                    {text}
                </ThemedText>
            </Box>
        </Pressable>
    );
};

const CategoryCard = ({ bgColor, color, icon, text }: { bgColor: string, color: string, icon: LucideIcon, text: string }) => {
    return (
        <Pressable>
            <Badge
                className="rounded-xl h-12 px-4 shadow-sm"
                style={{ backgroundColor: bgColor }}
            >
                <BadgeIcon
                    as={icon}
                    size="lg"
                    style={{ color: color, strokeWidth: 20 }}
                />
                <BadgeText
                    className="font-semibold ml-2"
                    style={{ color: color }}
                >
                    {text}
                </BadgeText>
            </Badge>
        </Pressable>
    )
};