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

export function RemoveAccountTOTPDialog({
    isOpen,
    onSubmit,
    onCancel,
}: {
    isOpen: boolean;
    onSubmit: (code: string) => void;
    onCancel: () => void;
}) {
    const [code, setCode] = useState('');

    const handleCodeChange = (text: string) => {
        // Solo permite números y máximo 6 dígitos
        const numericCode = text.replace(/\D/g, '').slice(0, 6);
        setCode(numericCode);
    };

    const handleSubmit = async () => {
        await onSubmit(code);
        setCode('');
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
                            Ingresa tu código de doble factor para confirmar la eliminación de tu cuenta.
                        </Text>
                        <Input>
                            <InputField
                                value={code}
                                onChangeText={handleCodeChange}
                                placeholder="000000"
                                keyboardType="number-pad"
                                maxLength={6}
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
                            isDisabled={code.length !== 6}
                        >
                            <ButtonText>Eliminar cuenta</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
