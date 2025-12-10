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

export function GenericMessageDialog({
    isOpen,
    title,
    message,
    submitBtnTxt,
    onSubmit,
}: {
    isOpen: boolean,
    title: string,
    message: string,
    submitBtnTxt: string,
    onSubmit: any,
}) {
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
                            {message}
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onPress={onSubmit} className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl">
                            <ButtonText>{submitBtnTxt}</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}