import React, { useState } from 'react';
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

import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

export function NameInputDialog({
    isOpen,
    onSubmit,
    onCancel,
}: {
    isOpen: boolean,
    onSubmit: any,
    onCancel: any,
}) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async () => {
        await onSubmit(inputValue);
        setInputValue('');
    };

    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent className='flex justify-between'>
                    <AlertDialogHeader>
                        <Heading>Doble factor (TOTP)</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className='my-2'>
                        <Text className='text-sm'>
                            Ingresa tu contraseña para verificar que eres tú
                        </Text>
                        <Input>
                            <InputField
                                value={inputValue}
                                onChangeText={setInputValue}
                                placeholder="Contraseña"
                                type='password'
                            />
                        </Input>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={onCancel} className='bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button onPress={handleSubmit} className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl">
                            <ButtonText>Continuar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}