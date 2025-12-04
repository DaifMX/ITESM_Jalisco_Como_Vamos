import { Pressable } from "react-native";
import { useMemo } from "react";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";

import { CircleUserRoundIcon, LogOutIcon, LogInIcon, UserIcon, InfoIcon } from "lucide-react-native";

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
    handleInfo: () => void,
    handleSignIn: () => void,
    handleSignOut: () => void,
};

export const AvatarSection = ({
    user,
    handleMyAccount,
    handleInfo,
    handleSignIn,
    handleSignOut,
}: AvatarProps
) => {
    const menuItems = useMemo(() => {
        if (user) {
            return [
                { key: "My account", icon: CircleUserRoundIcon, label: "Mi cuenta", onPress: handleMyAccount },
                { key: "Info", icon: InfoIcon, label: "Información", onPress: handleInfo },
                { key: "Sign out", icon: LogOutIcon, label: "Cerrar sesión", onPress: handleSignOut, color: "#EF4444" },
            ];
        }
        return [
            { key: "Sign in", icon: LogInIcon, label: "Iniciar sesión", onPress: handleSignIn },
            { key: "Info", icon: InfoIcon, label: "Información", onPress: handleInfo },
        ];
    }, [user, handleMyAccount, handleInfo, handleSignIn, handleSignOut]);

    return (
        <Menu
            placement="bottom right"
            offset={4}
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
            {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                    <MenuItem 
                        key={item.key} 
                        className="flex flex-row gap-3" 
                        onPress={item.onPress} 
                        textValue={item.label}
                    >
                        <IconComponent size={16} color={item.color} className="mr-2" />
                        <MenuItemLabel 
                            size="sm"
                            className={item.color ? "color-red-500" : ""}
                        >
                            {item.label}
                        </MenuItemLabel>
                    </MenuItem>
                );
            })}
        </Menu>
    );
};