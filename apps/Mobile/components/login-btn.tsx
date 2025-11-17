import React, { useMemo, useRef } from 'react';
import { Vibration } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { Button, ButtonText } from '@/components/ui/button';


const AnimatedButton = Animatable.createAnimatableComponent(Button);

export function LoginButton({ handleLogin, isLoginBtnDisabled, styles }: { handleLogin: () => void, isLoginBtnDisabled: boolean, styles: Record<string, any> }) {
  const buttonRef = useRef<any>(null);

  const runShake = useMemo(
    () => ({
      duration: 400,
      easing: 'ease-in-out',
      iterationCount: 1,
    }),
    []
  );

  const onPress = () => {
    console.log('pressed')
    if (isLoginBtnDisabled) {
      buttonRef.current?.shake(runShake);
      Vibration.vibrate(40);
      return;
    }
    handleLogin();
  };

  return (
    <AnimatedButton
      ref={buttonRef}
      onPress={onPress}
      accessibilityRole="button"
      style={styles}
      isDisabled={isLoginBtnDisabled}
    >
      <ButtonText className="text-black text-lg">
        Iniciar sesión
      </ButtonText>
    </AnimatedButton>
  );
}