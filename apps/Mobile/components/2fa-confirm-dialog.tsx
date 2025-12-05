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

export function TFAConfirmDialog({ 
    isOpen, 
    handleSubmit, 
    handleCancel,
    title = 'Doble factor (TOTP)',
    description = 'Confirmar doble factor',
}: { 
    isOpen: boolean, 
    handleSubmit: any, 
    handleCancel: any,
    title?: string,
    description?: string,
}) {
    const [code, setCode] = useState('');

    const handleCodeChange = (text: string) => {
        // Solo permite números y máximo 6 dígitos
        const numericCode = text.replace(/\D/g, '').slice(0, 6);
        setCode(numericCode);
    };

    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading>{title}</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-3 mb-4">
                        <Text className="">{description}</Text>
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
                        <Button onPress={handleCancel} className='bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button 
                            onPress={() => handleSubmit(code)} 
                            className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl"
                            isDisabled={code.length !== 6}
                        >
                            <ButtonText>Continuar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}