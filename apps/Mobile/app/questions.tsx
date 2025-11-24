import { useState } from "react";
import { ScrollView, Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import { AvatarSection } from "@/components/avatar-section";
import { Footer } from "@/components/footer";

import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Input, InputSlot, InputIcon, InputField } from '@/components/ui/input';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { VStack } from "@/components/ui/vstack";

import { ArrowLeftIcon, SearchIcon, GuitarIcon, SpeechIcon, CrossIcon, CarIcon, LucideIcon } from "lucide-react-native";
import { BasicElementCard } from "@/components/basic-elem-card";

export type Session = typeof authClient.$Infer.Session;

export default function Question() {
    const router = useRouter();

    const session = authClient.useSession();

    const [searchFocused, setSearchFocused] = useState(false);
    const [searchBarVal, setSearchBarVal] = useState("");

    const [categories, setCategories] = useState([
        { id: 0, text: 'Salud', icon: CrossIcon, color: '#FFFFFF', bgColor: 'rgb(0, 61, 165)' },
        { id: 1, text: 'Relaciones interpersonales', icon: SpeechIcon, color: '#FFFFFF', bgColor: 'rgb(243, 112, 33)' },
        { id: 2, text: 'Cultura y recreación', icon: GuitarIcon, color: '#FFFFFF', bgColor: 'rgb(196, 214, 0)' },
        { id: 3, text: 'Movilidad', icon: CarIcon, color: '#FFFFFF', bgColor: 'rgb(228, 0, 43)' },
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

    const COLORS: string[] = [
        "rgb(0, 61, 165)",      // pantone-dark-blue
        "rgb(243, 112, 33)",    // pantone-orange
        "rgb(196, 214, 0)",     // pantone-green
        "rgb(228, 0, 43)",      // pantone-red
        "rgb(254, 221, 0)",     // pantone-yellow
        "rgb(153, 179, 214)",   // pantone-light-blue
    ];

    return (
        <>
            <ScrollView
                className="flex-1 bg-white"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 32 }}
            >
                <View className="flex flex-col gap-8">
                    <View className="flex flex-row justify-between">
                        <Pressable onPress={() => router.back()}>
                            <ArrowLeftIcon size={40} />
                        </Pressable>
                        <ThemedText type="title">Preguntas</ThemedText>
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
                                <BasicElementCard
                                    key={q.id}
                                    onPress={() => router.push('/questionData')}
                                    text={q.text}
                                />
                            );
                        })}
                    </VStack>
                </View>
            </ScrollView>
            <Footer />
        </>
    );
}

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