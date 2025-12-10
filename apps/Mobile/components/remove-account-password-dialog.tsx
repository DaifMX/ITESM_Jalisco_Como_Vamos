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

export function RemoveAccountPasswordDialog({
    isOpen,
    onSubmit,
    onCancel,
}: {
    isOpen: boolean;
    onSubmit: (password: string) => void;
    onCancel: () => void;
}) {
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        await onSubmit(password);
        setPassword('');
    };

    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent className='flex justify-between'>
                    <AlertDialogHeader>
                        <Heading>Eliminar cuenta</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className='my-2'>
                        <Text className='text-sm mb-3'>
                            Ingresa tu contraseña para eliminar tu cuenta.
                        </Text>
                        <Input>
                            <InputField
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Contraseña"
                                type='password'
                            />
                        </Input>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={onCancel} className='bg-gray-500 data-[active=true]:bg-gray-600 rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button 
                            onPress={handleSubmit} 
                            className="bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-xl"
                            isDisabled={password.trim() === ''}
                        >
                            <ButtonText>Eliminar cuenta</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
