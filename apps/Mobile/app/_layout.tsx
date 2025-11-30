import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { PlatformVersionCheck } from "@/components/version-checker";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PlatformVersionCheck>
      <SafeAreaView className="flex-1 bg-white" edges={["top", "right", "left", "bottom"]}>
        <GluestackUIProvider mode="light">
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="home" options={{ title: "Inicio" }} />
              <Stack.Screen name="questions" options={{ title: "Preguntas" }} />
              <Stack.Screen name="questionData" options={{ title: "Datos de pregunta" }} />
              <Stack.Screen name="my-account" options={{ title: "Mi Cuenta" }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </GluestackUIProvider>
      </SafeAreaView>
    </PlatformVersionCheck>
  );
}
