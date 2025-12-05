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

export function TFAPasswordInputDialog({
    isOpen,
    onSubmit,
    onCancel,
    title = 'Doble factor (TOTP)',
    description = 'Ingresa tu contraseña para verificar que eres tú',
}: {
    isOpen: boolean,
    onSubmit: any,
    onCancel: any,
    title?: string,
    description?: string,
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
                        <Heading>{title}</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className='my-2'>
                        <Text className='text-sm'>
                            {description}
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
                        <Button 
                            onPress={handleSubmit} 
                            className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl"
                            isDisabled={inputValue.trim() === ''}
                        >
                            <ButtonText>Continuar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}