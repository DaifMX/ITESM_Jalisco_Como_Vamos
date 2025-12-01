import { Pressable, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogBackdrop,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogBody
} from '@/components/ui/alert-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { CopyIcon } from 'lucide-react-native';

export function TFASecretCopyDialog({ isOpen, value, handleSubmit, handleCancel }: { isOpen: boolean, title: string, value: any, handleSubmit: () => void, handleCancel: () => void }) {
    const handleCopyBtn = async () => {
        await Clipboard.setStringAsync(value);
    };

    return (
        <AlertDialog isOpen={isOpen} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <View className='flex flex-col'>
                        <AlertDialogHeader>
                            <Heading>Doble factor (TOTP)</Heading>
                        </AlertDialogHeader>
                            <Text className='text-sm'>
                                Agrega este código en Google Authenticator
                            </Text>
                    </View>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-4">
                    <Box>
                        <Input className='p-2'>
                            <InputField
                                value={value}
                                placeholder="Contraseña"
                            />
                            <Pressable onPress={handleCopyBtn}>
                                <CopyIcon className='mx-2' />
                            </Pressable>
                        </Input>
                    </Box>
                </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={handleCancel} className='bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button onPress={handleSubmit} className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl">
                            <ButtonText>Continuar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
}