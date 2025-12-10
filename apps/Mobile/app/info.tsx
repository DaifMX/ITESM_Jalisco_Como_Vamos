import { View, Pressable, ScrollView, Linking } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, FileTextIcon, ExternalLinkIcon } from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { Footer } from "@/components/footer";

export default function Info() {
  const router = useRouter();

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://drive.google.com/file/d/1aInmjBc_iMpK59llbY1Sr-AarWE15FQz/view');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 32 }}
      >
        <View className="flex flex-col gap-8">
          {/* Header */}
          <View className="flex flex-row justify-between items-center">
            <Pressable onPress={() => router.back()}>
              <ArrowLeftIcon size={40} />
            </Pressable>
            <ThemedText type="title">Información</ThemedText>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <View className="gap-6">
            <ThemedText type="subtitle">Documentos Legales</ThemedText>

            {/* Privacy Policy Button */}
            <Pressable
              onPress={handlePrivacyPolicy}
              className="flex flex-row items-center justify-between bg-[#F5F5F5] p-4 rounded-xl active:opacity-70"
            >
              <View className="flex flex-row items-center gap-3">
                <FileTextIcon size={24} color="#000" />
                <View>
                  <ThemedText className="font-semibold text-base">
                    Aviso de Privacidad
                  </ThemedText>
                  <ThemedText className="text-sm text-gray-600">
                    Consultar documento
                  </ThemedText>
                </View>
              </View>
              <ExternalLinkIcon size={20} color="#666" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}
