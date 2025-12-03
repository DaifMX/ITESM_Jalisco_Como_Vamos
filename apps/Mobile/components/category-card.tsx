import { Badge, BadgeText } from "@/components/ui/badge";
import { icons } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/icon";
import { useEffect } from "react";


export const CategoryCard = ({ bgColor, color, icon, text, onPress, selected }: { bgColor: string, color: string, icon: keyof typeof icons, text: string, onPress: any, selected: boolean }) =>{
   
    const selectedStyle = selected ? 'border border-black' : ''
    return (
        <Pressable onPress={onPress} >
            <Badge
                className={`rounded-xl h-12 px-4 ${selectedStyle} `}
                style={{ backgroundColor: bgColor}}
            >   
                <View style={{ marginRight: 8 }}>
                    <Icon 
                        name={icon}
                        color={color}
                        size={20}
                    />
                </View>
                <BadgeText
                    className="font-semibold"
                    style={{ color: color }}
                >
                    {text}
                </BadgeText>
            </Badge>
        </Pressable>
    )
};