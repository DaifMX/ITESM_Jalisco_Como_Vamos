import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';

import Constants from 'expo-constants';
import axiosInstance from '@/lib/axios';

const MINIMUM_VERSIONS = {
    ios: 14, // iOS 14>=
    androidApi: 29, // Android 10>= (API level 29)
};

export const PlatformVersionCheck = ({ children }: any) => {
    const [isSupported, setIsSupported] = useState(true);

    const [unsupportedReason, setUnsupportedReason] = useState('');

    const checkPlatformVersion = () => {
        if (Platform.OS === 'ios') {
            const version = parseInt(Device.osVersion?.split('.')[0] || '0');
            if (version < MINIMUM_VERSIONS.ios) {
                setIsSupported(false);
                setUnsupportedReason('platform');
            }
        } else if (Platform.OS === 'android') {
            const version = Device.platformApiLevel || 0;
            if (version < MINIMUM_VERSIONS.androidApi) {
                setIsSupported(false);
                setUnsupportedReason('platform');
            }
        }
    };

    async function checkForUpdates() {
        try {
            const clientVersion = Constants.expoConfig?.version || '0.0.0';
            const res = await axiosInstance.post('/api/sys/app-version', { clientVersion });

            if (res.data.payload.forceUpdate) {
                setIsSupported(false)
                setUnsupportedReason('version');
            }
        } catch { }
    }

    useEffect(() => {
        checkPlatformVersion();
        checkForUpdates();
    }, []);

    if (!isSupported) {
        return (
            <SafeAreaView className='flex-1 bg-black'>
                <View className='flex-1 justify-center items-center px-8'>
                    {unsupportedReason === 'platform'
                        ? <>
                            <Text className='text-white text-2xl font-bold text-center mb-6'>
                                ⚠️ Versión de sistema operativo no compatible
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
                        </>
                        : <>
                            <Text className='text-white text-2xl font-bold text-center mb-6'>
                                ⚠️ Versión de app no compatible
                            </Text>
                            <Text className='text-white text-lg text-center mb-4'>
                                La aplicación requiere una versión más nueva. Favor de actualizar desde la tienda de aplicaciones.
                            </Text>
                            <Text className='text-gray-400 text-sm text-center leading-6'>
                                Las actualizaciones de la aplicación incluyen mejoras de seguridad, corrección de errores y nuevas funcionalidades.
                                Mantener la aplicación actualizada es esencial para proteger tus datos y garantizar el mejor rendimiento.
                            </Text>
                        </>
                    }
                </View>
            </SafeAreaView>
        );
    }

    return children;
};