import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import ErrorDialog from "@/components/error-dialog";
import LoadingDialog from "@/components/loading-dialog";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Footer } from "@/components/footer";
import TwoFactorVerifyDialog from "@/components/2fa-verify-dialog";

import { Divider } from "@/components/ui/divider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Button,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";

import { UserIcon } from "lucide-react-native";
import { LoginButton } from "@/components/login-btn";

import getBetterAuthErrorMessage_ES from "@/functions/getBetterAuthErrorMessage_ES";
import { SafeAreaView } from "react-native-safe-area-context";

const GoogleIcon = () => (
  <Image
    source={require("@/assets/ico/googleico.png")}
    style={{ width: 20, height: 20, marginRight: 8 }}
  />
);

export default function HomeScreen() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [isErrorDiagOpen, setIsErrorDiagOpen] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoginBtnDisabled, setIsLoginBtnDisabled] = useState(false);

  // Estados para 2FA
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (email === "" || password === "") setIsLoginBtnDisabled(true);
    else setIsLoginBtnDisabled(false);
  }, [email, password]);

  const handleLoginEmailPassword = async () => {
    try {
      setIsLoading(true);

      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        await authClient.signOut();
        const errorMessage = result.error.code
          ? getBetterAuthErrorMessage_ES(result.error.code)
          : (result.error.message || "Error de autenticación");
        setError(errorMessage);
        setIsErrorDiagOpen(true);
      }

      if (result.data) {
        if ((result.data as any).twoFactorRedirect) {
          setRequires2FA(true);
        } else {
          router.replace("/home");
        }
      }
    } catch (err: any) {
      const errorMessage = err.code
        ? getBetterAuthErrorMessage_ES(err.code)
        : (err.message ?? "Error desconocido.");
      setError(errorMessage);
      setIsErrorDiagOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/home",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onResponse: () => {
            setIsLoading(false);
          },
          onSuccess: () => {
            router.push("/home");
          },
          onError: (ctx: any) => {
            const errorMessage = ctx.error?.code
              ? getBetterAuthErrorMessage_ES(ctx.error.code)
              : ctx.error.message;
            setError(errorMessage);
            setIsErrorDiagOpen(true);
          },
        }
      );
    } catch (err: any) {
      const errorMessage = err.code
        ? getBetterAuthErrorMessage_ES(err.code)
        : (err.message ?? "Error desconocido.");
      setError(errorMessage);
      setIsErrorDiagOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setError("Ingresa un código válido de 6 dígitos");
      setIsErrorDiagOpen(true);
      return;
    }

    try {
      setIsVerifying(true);

      const result = await authClient.twoFactor.verifyTotp({
        code: twoFactorCode,
      });

      if (result.error) {
        setError(result.error.message || "Código inválido");
        setIsErrorDiagOpen(true);
      } else if (result.data) {
        // Verificación exitosa, obtener sesión
        const session = await authClient.getSession();
        if (session.data?.user) {
          setRequires2FA(false);
          router.replace("/home");
        }
      }
    } catch (err) {
      console.error("2FA error:", err);
      setError("Error al verificar el código. Intenta de nuevo.");
      setIsErrorDiagOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel2FA = () => {
    setRequires2FA(false);
    setTwoFactorCode("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/bg.jpg")}
            style={styles.header}
          />
        }
      >
        <LoadingDialog isOpen={isLoading} />
        <ErrorDialog
          isOpen={isErrorDiagOpen}
          cause={error}
          handleClose={() => setIsErrorDiagOpen(false)}
        />

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Iniciar sesión</ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <ThemedText style={{ fontSize: 14 }} type="default">
              Inicia sesión con tu cuenta de
            </ThemedText>
            <ThemedText
              style={{ marginLeft: 4, fontSize: 14 }}
              type="defaultSemiBold"
            >
              Jalisco Como Vamos
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <View
            style={{ display: "flex", flexDirection: "column", rowGap: 18 }}
          >
            <View>
              <ThemedText style={{ fontSize: 18 }} type="subtitle">
                Email
              </ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                textContentType="emailAddress"
                placeholder="ejemplo@email.com"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  borderRadius: 10,
                  padding: 16,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: emailFocused ? "#000000" : "transparent",
                }}
              />
            </View>
            <View>
              <ThemedText style={{ fontSize: 18 }} type="subtitle">
                Contraseña
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                textContentType="password"
                secureTextEntry
                placeholder="Introduce tu contraseña"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  borderRadius: 10,
                  padding: 16,
                  backgroundColor: "#F5F5F5",
                  borderWidth: 1,
                  borderColor: passwordFocused ? "#000000" : "transparent",
                }}
              />
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <LoginButton
            handleLogin={handleLoginEmailPassword}
            isLoginBtnDisabled={isLoginBtnDisabled}
            styles={styles.loginBtn}
          />
          <Pressable onPress={() => router.push("/register")}>
            <View className="flex flex-row justify-center">
              <ThemedText style={{ fontSize: 14 }} type="default">
                ¿No tienes cuenta?
              </ThemedText>
              <ThemedText
                style={{ marginLeft: 4, fontSize: 14 }}
                type="defaultSemiBold"
              >
                Regístrate aquí
              </ThemedText>
            </View>
          </Pressable>
          <View className="flex flex-row justify-center items-center">
            <Divider className="bg-black my-1 w-40 h-0.5 mx-2" />
            <ThemedText className="text-center text-sm" type="default">
              O bien
            </ThemedText>
            <Divider className="bg-black my-1 w-40 h-0.5 mx-2" />
          </View>

          <Button onPress={handleLoginGoogle} style={styles.inviteBtn}>
            <ButtonIcon as={GoogleIcon} className="w-5 h-5 mr-2" />
            <ButtonText className="color-black data-[active=true]:color-black data-[hover=true]:color-black">
              Iniciar sesión con Google
            </ButtonText>
          </Button>
          <Button onPress={() => router.push("/home")} style={styles.inviteBtn}>
            <ButtonIcon as={UserIcon} className="w-5 h-5 mr-2 color-black" />
            <ButtonText className="color-black data-[active=true]:color-black data-[hover=true]:color-black">
              Entrar como invitado
            </ButtonText>
          </Button>
        </ThemedView>
      </ParallaxScrollView>
      
      <TwoFactorVerifyDialog
        isOpen={requires2FA}
        twoFactorCode={twoFactorCode}
        isVerifying={isVerifying}
        onCodeChange={setTwoFactorCode}
        onVerify={handleVerify2FA}
        onCancel={handleCancel2FA}
      />
      
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  loginBtn: {
    backgroundColor: "#003DA5",
    padding: 8,
    height: 52,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inviteBtn: {
    display: "flex",
    flexDirection: "row",
    height: 52,
    justifyContent: "flex-start",
    backgroundColor: "#F2F2F2",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  header: {
    display: "flex",
    height: 300,
    bottom: 0,
    left: 0,
  },
});
