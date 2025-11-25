import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';

const MINIMUM_VERSIONS = {
    ios: 14, // iOS 14>=
    androidApi: 29, // Android 10>= (API level 29)
};

export const PlatformVersionCheck = ({ children }: any) => {
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        checkPlatformVersion();
    }, []);

    const checkPlatformVersion = () => {
        if (Platform.OS === 'ios') {
            const version = parseInt(Device.osVersion?.split('.')[0] || '0');
            setIsSupported(version >= MINIMUM_VERSIONS.ios);
        } else if (Platform.OS === 'android') {
            const version = Device.platformApiLevel || 0;
            setIsSupported(version >= MINIMUM_VERSIONS.androidApi); // Android 10 = API 29
        }
    };

    if (!isSupported) {
        return (
            <SafeAreaView className='flex-1 bg-black'>
                <View className='flex-1 justify-center items-center px-8'>
                    <Text className='text-white text-2xl font-bold text-center mb-6'>
                        ⚠️ Versión no compatible
                    </Text>
                    <Text className='text-white text-lg text-center mb-4'>
                        La aplicación requiere una versión actualizada del sistema operativo.
                    </Text>
                    <Text className='text-gray-400 text-sm text-center leading-6'>
                        Cada actualización del sistema operativo móvil incluye parches de seguridad y nuevas funciones de seguridad.
                        Al soportar versiones antiguas, las aplicaciones permanecen vulnerables a amenazas conocidas. Este control
                        garantiza que la aplicación se ejecute en una versión actualizada de la plataforma para que los usuarios tengan
                        las últimas protecciones de seguridad.
                    </Text>
                    <View className='mt-8 p-4 bg-gray-900 rounded-lg'>
                        <Text className='text-gray-300 text-sm text-center'>
                            {Platform.OS === 'ios' 
                                ? `Requiere iOS ${MINIMUM_VERSIONS.ios}+`
                                : `Requiere Android 10+ (API ${MINIMUM_VERSIONS.androidApi})`}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return children;
};