import React from 'react';
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

export function RemoveAccountConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
}: {
    isOpen: boolean;
    onConfirm: any;
    onCancel: () => void;
}) {
    return (
        <>
            <AlertDialog isOpen={isOpen}>
                <AlertDialogBackdrop />
                <AlertDialogContent className='flex justify-between'>
                    <AlertDialogHeader>
                        <Heading>Eliminar cuenta</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className='my-2'>
                        <Text className='text-sm'>
                            ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos permanentemente.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={onCancel} className='bg-gray-500 data-[active=true]:bg-gray-600 rounded-lg'>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button onPress={onConfirm} className="bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-xl">
                            <ButtonText>Eliminar</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
