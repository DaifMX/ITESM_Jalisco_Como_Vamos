import { useState } from "react";
import { Pressable, TextInput, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { authClient } from "@/lib/auth-client";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { GoogleIcon } from "@/assets/ico/google-ico";
import { ArrowLeft } from "lucide-react-native";

export default function Register() {
    const router = useRouter();
    
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const payload = {
            name,
            email,
            password
        }
        console.log(payload)
        const res = await authClient.signUp.email(payload);

        console.log(res);
    };

    return (
        <View className="h-full p-12 bg-white">
            <View className="flex flex-col gap-8">
                <Pressable>
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
                    <Button className="flex flex-row my-6 h-12 bg-slate-100 justify-start p-2 rounded-lg items-center">
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
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                style={{ borderRadius: 10, padding: 16, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: emailFocused ? "#000000" : "transparent" }}
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
                        <Button className="p-2 h-[52px] rounded-lg flex justify-center items-center bg-[rgba(8,97,241,0.56)]" onPress={handleRegister} >
                            <ButtonText className='text-black text-lg'>Iniciar sesión</ButtonText>
                        </Button>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text className="text-center font-bold">¿Ya tienes cuenta?</Text>
                        </Pressable>
                    </View>
                </ThemedView>
            </View>
        </View>
    );
}