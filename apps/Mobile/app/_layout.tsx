import { useEffect, useState } from 'react';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router, useSegments } from "expo-router";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { PlatformVersionCheck } from "@/components/version-checker";

import { View, ActivityIndicator } from 'react-native';
import { authClient } from '@/lib/auth-client'

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    checkAuthAndRedirect();
  }, [segments]);

  const checkAuthAndRedirect = async () => {
    try {
      const session = await authClient.getSession();
      const isAuthenticated = !!session?.data?.user;
      
      // Rutas de autenticación (login, register)
      const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

      if (isAuthenticated && inAuthGroup) {
        // Usuario logueado intentando acceder a login/register
        
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <PlatformVersionCheck>
      {/* <SafeAreaView className="flex-1 bg-white" edges={["top", "right", "left", "bottom"]}> */}
        <GluestackUIProvider mode="light">
          <ThemeProvider
            value={DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="home" options={{ title: "Inicio" }} />
              <Stack.Screen name="questions" options={{ title: "Preguntas" }} />
              <Stack.Screen name="questionData" options={{ title: "Datos de pregunta" }} />
              <Stack.Screen name="my-account" options={{ title: "Mi Cuenta" }} />
              <Stack.Screen name="info" options={{ title: "Acerca de nosotros" }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </GluestackUIProvider>
      {/* </SafeAreaView> */}
    </PlatformVersionCheck>
  );
}
