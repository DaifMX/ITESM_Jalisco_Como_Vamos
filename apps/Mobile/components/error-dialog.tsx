import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogBackdrop,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogBody
} from '@/components/ui/alert-dialog';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function ErrorDialog({ isOpen, cause, handleClose }: { isOpen: boolean, cause: string, handleClose: () => void }) {
    return (
        <AlertDialog isOpen={isOpen} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        Error
                    </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-4">
                    <Text size="sm">
                        {cause}
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        className='bg-pantone-dark-blue rounded-xl'
                        variant="outline"
                        action="primary"
                        onPress={handleClose}
                        size="sm"
                    >
                        <ButtonText className='text-white'>Cerrar</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}