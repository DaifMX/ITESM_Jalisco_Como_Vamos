import { Pressable, View } from "react-native";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";

import { CircleUserRoundIcon, LogOutIcon, LogInIcon, UserIcon, SettingsIcon } from "lucide-react-native";

type AvatarProps = {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    } | undefined,
    handleMyAccount: () => void,
    handleSettings: () => void,
    handleSignIn: () => void,
    handleSignOut: () => void,
};

export const AvatarSection = ({
    user,
    handleMyAccount,
    handleSettings,
    handleSignIn,
    handleSignOut,
}: AvatarProps
) => {
    return (
        <View className="flex flex-row-reverse">
            <Menu
                placement="bottom"
                offset={3}
                disabledKeys={['Settings']}
                trigger={({ ...triggerProps }) => {
                    return (
                        <Pressable {...triggerProps}>
                            <Avatar size='md' className="bg-slate-300">
                                {
                                    user
                                        ? <AvatarFallbackText>
                                            {user?.name}
                                        </AvatarFallbackText>
                                        : <Icon as={UserIcon} size="lg" className="stroke-white" />
                                }
                            </Avatar>
                        </Pressable>
                    );
                }}
            >
                {user
                    ? <>
                        <MenuItem key="My account" className="flex flex-row gap-3" onPress={() => handleMyAccount()} textValue="Mi cuenta">
                            <CircleUserRoundIcon size={16} className="mr-2" />
                            <MenuItemLabel size="sm">Mi cuenta</MenuItemLabel>
                        </MenuItem>
                        <MenuItem key="Settings" className="flex flex-row gap-3" onPress={() => handleSettings()} textValue="Ajustes">
                            <SettingsIcon size={16} className="mr-2" />
                            <MenuItemLabel size="sm">Ajustes</MenuItemLabel>
                        </MenuItem>
                        <MenuItem key="Sign out" className="flex flex-row gap-3" onPress={() => handleSignOut()} textValue="Cerrar sesión">
                            <LogOutIcon size={16} color="#EF4444" className="mr-2" />
                            <MenuItemLabel className="color-red-500" size="sm">Cerrar sesión</MenuItemLabel>
                        </MenuItem>
                    </>
                    : <>
                        <MenuItem key="Sign in" className="flex flex-row gap-3" onPress={() => handleSignIn()} textValue="Iniciar sesión">
                            <LogInIcon size={16} className="mr-2" />
                            <MenuItemLabel size="sm">Iniciar sesión</MenuItemLabel>
                        </MenuItem>
                    </>
                }
            </Menu>
        </View>
    );
};