import { useState } from 'react';

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

export function TFAConfirmDialog({ isOpen, handleSubmit, handleCancel }: { isOpen: boolean, handleSubmit: any, handleCancel: any }) {
    const [code, setCode] = useState('');

    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading>Doble factor (TOTP)</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-3 mb-4">
                        <Text className="">Confirmar doble factor</Text>
                        <Input>
                            <InputField
                                value={code}
                                onChangeText={setCode}
                                placeholder="Escribe tu código..."
                            />
                        </Input>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={handleCancel} className='bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button onPress={() => handleSubmit(code)} className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl">
                            <ButtonText>Continuar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}