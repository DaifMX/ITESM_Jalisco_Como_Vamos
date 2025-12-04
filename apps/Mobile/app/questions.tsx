import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import { fetcher } from "@/lib/axios";

import { AvatarSection } from "@/components/avatar-section";
import { BasicElementCard } from "@/components/basic-elem-card";
import { CategoryCard } from "@/components/category-card";
import { Footer } from "@/components/footer";

import { ScrollView, Pressable, View } from "react-native";

import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Input, InputSlot, InputIcon, InputField } from "@/components/ui/input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { VStack } from "@/components/ui/vstack";

import { ArrowLeftIcon, SearchIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Session = typeof authClient.$Infer.Session;

export default function Question() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const session = authClient.useSession();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchBarVal, setSearchBarVal] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    (params.categoryId as string) || null
  );

  useEffect(() => {
    if (params.categoryId) {
      setSelectedCategoryId(params.categoryId as string);
    }
  }, [params.categoryId]);

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              handleMyAccount={() => router.push("/my-account")}
              handleSettings={() => router.push("/my-account")}
              handleSignIn={() => router.push("/login")}
              handleSignOut={() => {
                authClient.signOut();
                router.push("/login");
              }}
            />
          </View>
          <ThemedView lightColor="transparent" darkColor="transparent">
            <View className="gap-4">
              <View>
                <Input
                  className={`h-14 rounded-[10px] bg-[#F5F5F5] border ${searchFocused ? "border-black" : "border-transparent"}`}
                >
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
          <View className="gap-2">
            <ScrollView
              className="flex flex-row"
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
            >
              <HStack space="md">
                <CategoryList
                  selectedCategoryId={selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                />
              </HStack>
            </ScrollView>
            <Divider className="bg-black h-[1px]" />
          </View>

          {/* Questions */}
          <VStack space="md">
            <QuestionList categoryId={selectedCategoryId} searchQuery={searchBarVal} />
          </VStack>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const QuestionList = ({ categoryId, searchQuery }: { categoryId: string | null; searchQuery: string }) => {
  const router = useRouter();

  const url = categoryId ? `/api/question?cid=${categoryId}` : "/api/question";
  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error)
    return (
      <ThemedText className="text-red-500">
        Error al cargar preguntas
      </ThemedText>
    );

  if (isLoading) return <ThemedText>Cargando...</ThemedText>;

  // Filtrar preguntas basado en la búsqueda
  const filteredData = data?.filter((c: any) => 
    c.valueShort.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.value?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!filteredData || filteredData.length === 0) {
    return (
      <ThemedText className="text-gray-500 text-center">
        {searchQuery ? "No se encontraron preguntas que coincidan con tu búsqueda" : "No hay preguntas en esta categoría"}
      </ThemedText>
    );
  }

  return filteredData?.map((c: any) => {
    return (
      <BasicElementCard
        key={c.id}
        onPress={() => router.push(`/questionData?id=${c.id}`)}
        text={c.valueShort}
      />
    );
  });
};

const CategoryList = ({
  selectedCategoryId,
  setSelectedCategoryId,
}: {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string) => void;
}) => {
  const { data } = useSWR(`api/category`, fetcher);

  const navigation = useNavigation() as any;

  const handleOnPress = ({ id }: { id: string }) => {
    setSelectedCategoryId(id);
    navigation.setParams({
      categoryId: id
    });
  };

  return data?.map((c: any) => {
    return (
      <CategoryCard
        bgColor={c.color}
        color={"#FFFFFF"}
        icon={c.icon}
        text={c.name}
        onPress={() => handleOnPress({ id: c.id })}
        selected={c.id === selectedCategoryId}
        key={`CategoryMinicard` + c.id}
      />
    );
  });
};
