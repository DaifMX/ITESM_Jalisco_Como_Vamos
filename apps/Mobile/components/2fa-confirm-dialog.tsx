import { useState } from 'react';
import { Pressable } from 'react-native';

import * as Clipboard from 'expo-clipboard';

import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { CopyIcon } from 'lucide-react-native';

export function TFAConfirmDialog({ isOpen, copyCode, onClose }: { isOpen: boolean, copyCode: string, onClose: any }) {
    const [code, setCode] = useState('');

    const handleCopy = async () => {
        await Clipboard.setStringAsync(copyCode);
    };

    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading>Confirmar doble factor</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Box>
                            <Pressable onPress={handleCopy} className="flex-row items-center gap-2 p-3 bg-gray-100 rounded-lg mb-4">
                                <CopyIcon size={20} />
                                <Text className="flex-1">{copyCode}</Text>
                            </Pressable>
                        </Box>

                        <Text className="mb-4">Código:</Text>
                        <Input>
                            <InputField
                                value={code}
                                onChangeText={setCode}
                                placeholder="Escribe tu código..."
                            />
                        </Input>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button variant="outline" onPress={onClose} className="mr-3">
                            <ButtonText>Cerrar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}