import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";

interface TwoFactorVerifyDialogProps {
  isOpen: boolean;
  twoFactorCode: string;
  isVerifying: boolean;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  onCancel: () => void;
}

export default function TwoFactorVerifyDialog({
  isOpen,
  twoFactorCode,
  isVerifying,
  onCodeChange,
  onVerify,
  onCancel,
}: TwoFactorVerifyDialogProps) {
  return (
    <AlertDialog isOpen={isOpen}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>Doble factor (TOTP)</Heading>
        </AlertDialogHeader>
        
        <AlertDialogBody className="mt-3 mb-4">
          <Text>Ingresa el código de 6 dígitos de tu aplicación de autenticación</Text>
          <Input>
            <InputField
              placeholder="000000"
              value={twoFactorCode}
              onChangeText={onCodeChange}
              keyboardType="number-pad"
              maxLength={6}
            />
          </Input>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button 
            onPress={onCancel} 
            isDisabled={isVerifying}
            className="bg-pantone-red data-[active=true]:bg-pantone-red-dark rounded-lg"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          
          <Button
            onPress={onVerify}
            isDisabled={isVerifying || twoFactorCode.length !== 6}
            className="bg-pantone-dark-blue data-[active=true]:bg-pantone-darkest-blue rounded-xl"
          >
            {isVerifying ? (
              <ButtonSpinner />
            ) : (
              <ButtonText>Continuar</ButtonText>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
