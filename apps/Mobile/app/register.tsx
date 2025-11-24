import { useState } from "react";
import { Pressable, TextInput, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import ErrorDialog from '@/components/error-dialog';
import LoadingDialog from '@/components/loading-dialog';

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { GoogleIcon } from "@/assets/ico/google-ico";
import { ArrowLeft } from "lucide-react-native";

export default function Register() {
    const router = useRouter();

    // ==== useStates ==== \\
    // Dialogs
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const [isErrorDiagOpen, setIsErrorDiagOpen] = useState(false);

    // Form focus
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Form values
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ==== Handlers ==== \\
    const handleRegister = async () => {
        try {
            await authClient.signUp.email(
                { name, email, password },
                {
                    onRequest: () => {
                        setIsLoading(true);
                    },
                    onResponse: () => {
                        setIsLoading(false);
                    },
                    onSuccess: () => {
                        router.push('/home');
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message);
                        setIsErrorDiagOpen(true)
                    }
                }
            );
        } catch (err: any) {
            setError(err.message ?? 'Error desconocido.');
            setIsErrorDiagOpen(true);

        } finally {
            setIsLoading(false);
        }

    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 32 }}
        >
            <LoadingDialog isOpen={isLoading} />
            <ErrorDialog isOpen={isErrorDiagOpen} cause={error} handleClose={() => setIsErrorDiagOpen(false)} />

            <View className="flex flex-col gap-8">
                <Pressable onPress={() => router.back()}>
                    <ArrowLeft size={40} />
                </Pressable>
                <ThemedView lightColor="transparent" darkColor="transparent">
                    <View className="gap-4">
                        <ThemedText type="title">
                            Registro
                        </ThemedText>
                        <ThemedText type="default">
                            Crea tu cuenta para explorar los datos de tu ciudad, compartir tus comentarios y descargar las tablas que más te interesen.
                        </ThemedText>
                    </View>
                    <Button className="flex flex-row my-6 h-14 bg-[#F5F5F5] justify-start p-2 rounded-lg items-center">
                        <ButtonIcon as={GoogleIcon} className='w-5 h-5 mr-2' />
                        <ButtonText className='color-black'>Regístrate con Google</ButtonText>
                    </Button>
                    <View className='flex flex-row justify-center items-center'>
                        <Divider className='bg-black my-1 w-40 h-0.5 mx-2' />
                        <ThemedText className="text-center text-sm" type="default">O bien</ThemedText>
                        <Divider className='bg-black my-1 w-40 h-0.5 mx-2' />
                    </View>
                </ThemedView>
                <ThemedView>
                    <View style={{ display: 'flex', flexDirection: 'column', rowGap: 18 }}>
                        <View>
                            <ThemedText style={{ fontSize: 18 }} type="subtitle">Nombre completo</ThemedText>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                textContentType='name'
                                placeholder='Introduce tu nombre completo'
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                                style={{ borderRadius: 10, padding: 16, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: nameFocused ? "#000000" : "transparent" }}
                            />
                        </View>
                        <View>
                            <ThemedText style={{ fontSize: 18 }} type="subtitle">Email</ThemedText>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                textContentType='emailAddress'
                                placeholder='ejemplo@email.com'
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                style={{ borderRadius: 10, padding: 16, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: emailFocused ? "#000000" : "transparent" }}
                            />
                        </View>
                        <View>
                            <ThemedText style={{ fontSize: 18 }} type="subtitle">Contraseña</ThemedText>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                textContentType='password'
                                secureTextEntry
                                placeholder='Introduce tu contraseña'
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                style={{ borderRadius: 10, padding: 16, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: passwordFocused ? "#000000" : "transparent" }}
                            />
                        </View>
                        <Button className="p-2 h-[52px] rounded-lg flex justify-center items-center bg-pantone-yellow" onPress={handleRegister} >
                            <ButtonText className='text-black text-lg'>Crear cuenta</ButtonText>
                        </Button>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text className="text-center font-bold">¿Ya tienes cuenta?</Text>
                        </Pressable>
                    </View>
                </ThemedView>
            </View>
        </ScrollView>
    );
}