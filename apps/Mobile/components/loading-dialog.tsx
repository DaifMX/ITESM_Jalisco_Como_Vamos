import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogBackdrop,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';

import { Heading } from '@/components/ui/heading';

import { Spinner } from '@/components/ui/spinner';

export default function LoadingDialog({ isOpen }: { isOpen: boolean }) {
    return (
        <AlertDialog isOpen={isOpen} size="sm">
            <AlertDialogBackdrop />
            <AlertDialogContent className=''>
                <AlertDialogBody className="flex gap-2 mt-3 mb-4 ">
                    <Spinner size="large" className='my-2' />
                    <Heading className="text-typography-950 font-semibold text-center" size="md">
                        Cargando...
                    </Heading>
                </AlertDialogBody>
            </AlertDialogContent>
        </AlertDialog>
    );
}