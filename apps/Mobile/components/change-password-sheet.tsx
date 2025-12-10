import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ThemedText } from "@/components/themed-text";

import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react-native";

interface ChangePasswordSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (current: string, newPass: string) => Promise<any>;
};

export function ChangePasswordSheet({ isOpen, onClose, onSubmit }: ChangePasswordSheetProps) {
    const passwordMinLen = 8;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [focusCurrent, setFocusCurrent] = useState(false);
    const [focusNew, setFocusNew] = useState(false);
    const [focusConfirm, setFocusConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Limpiar estados al abrir/cerrar
    useEffect(() => {
        if (isOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(null);
            setIsSubmitting(false);
            setShowConfirm(false);
            setShowNew(false);
            setShowCurrent(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setError(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Por favor completa todos los campos.");
            return;
        }

        if (newPassword.length < passwordMinLen) {
            setError(`La nueva contraseña debe tener al menos ${passwordMinLen} caracteres.`);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las nuevas contraseñas no coinciden.");
            return;
        }

        if (onSubmit) {
            setIsSubmitting(true);
            await onSubmit(currentPassword, newPassword);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-end"
                style={{ paddingTop: 60 }}
            >
                {/* Fondo oscuro que cierra el modal al tocar */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50" />
                </TouchableWithoutFeedback>

                {/* Contenido del Modal (Bottom Sheet) */}
                <View style={{ flex: 1 }} className="bg-white w-full rounded-t-3xl p-6 pb-10 shadow-xl">

                    {/* Header del Modal */}
                    <View className="flex-row justify-between items-center mb-2">
                        <ThemedText type="subtitle" className="text-xl font-bold">Cambiar contraseña</ThemedText>
                        <Pressable onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <XIcon size={20} color="#666" />
                        </Pressable>
                    </View>

                    <ThemedText className="text-gray-500 mb-6 text-sm">
                        {`Tu contraseña debe tener al menos ${passwordMinLen} caracteres.`}
                    </ThemedText>

                    {/* Inputs */}
                    <View className="gap-4">

                        {/* Contraseña Actual */}
                        <View className="relative">
                            <TextInput
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrent}
                                textContentType='password'
                                placeholder='Contraseña actual'
                                placeholderTextColor="#9CA3AF"
                                onFocus={() => setFocusCurrent(true)}
                                onBlur={() => setFocusCurrent(false)}
                                style={{ 
                                    borderRadius: 10, 
                                    padding: 16, 
                                    paddingRight: 50,
                                    backgroundColor: '#F5F5F5', 
                                    borderWidth: 1, 
                                    borderColor: focusCurrent ? "#000000" : "transparent",
                                    fontSize: 16,
                                    height: 52
                                }}
                            />
                            <Pressable 
                                onPress={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-0 bottom-0 justify-center"
                            >
                                {showCurrent ? <EyeOffIcon size={20} color="#6B7280" /> : <EyeIcon size={20} color="#6B7280" />}
                            </Pressable>
                        </View>

                        {/* Nueva Contraseña */}
                        <View className="relative">
                            <TextInput
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                textContentType='password'
                                placeholder='Nueva contraseña'
                                placeholderTextColor="#9CA3AF"
                                onFocus={() => setFocusNew(true)}
                                onBlur={() => setFocusNew(false)}
                                style={{ 
                                    borderRadius: 10, 
                                    padding: 16, 
                                    paddingRight: 50,
                                    backgroundColor: '#F5F5F5', 
                                    borderWidth: 1, 
                                    borderColor: focusNew ? "#000000" : "transparent",
                                    fontSize: 16,
                                    height: 52
                                }}
                            />
                            <Pressable 
                                onPress={() => setShowNew(!showNew)}
                                className="absolute right-4 top-0 bottom-0 justify-center"
                            >
                                {showNew ? <EyeOffIcon size={20} color="#6B7280" /> : <EyeIcon size={20} color="#6B7280" />}
                            </Pressable>
                        </View>

                        {/* Repetir Nueva Contraseña */}
                        <View className="relative">
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                textContentType='password'
                                placeholder='Confimar nueva contraseña'
                                placeholderTextColor="#9CA3AF"
                                onFocus={() => setFocusConfirm(true)}
                                onBlur={() => setFocusConfirm(false)}
                                style={{ 
                                    borderRadius: 10, 
                                    padding: 16, 
                                    paddingRight: 50,
                                    backgroundColor: '#F5F5F5', 
                                    borderWidth: 1, 
                                    borderColor: focusConfirm ? "#000000" : "transparent",
                                    fontSize: 16,
                                    height: 52
                                }}
                            />
                            <Pressable 
                                onPress={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-0 bottom-0 justify-center"
                            >
                                {showConfirm ? <EyeOffIcon size={20} color="#6B7280" /> : <EyeIcon size={20} color="#6B7280" />}
                            </Pressable>
                        </View>

                        {/* Mensaje de Error */}
                        {error && (
                            <Text className="text-red-500 text-sm text-center mt-1">
                                {error}
                            </Text>
                        )}

                        {/* Botón de Acción */}
                        <Button
                            className="w-full h-12 bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl mt-4 items-center justify-center"
                            onPress={handleSubmit}
                            isDisabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ButtonSpinner color="white" />
                            ) : (
                                <ButtonText className="text-white font-semibold text-lg">Cambiar contraseña</ButtonText>
                            )}
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}