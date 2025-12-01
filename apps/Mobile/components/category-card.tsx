import { Badge, BadgeText } from "@/components/ui/badge";
import { icons } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/icon";


export const CategoryCard = ({ bgColor, color, icon, text }: { bgColor: string, color: string, icon: keyof typeof icons, text: string }) =>{
    return (
        <Pressable>
            <Badge
                className="rounded-xl h-12 px-4 shadow-sm"
                style={{ backgroundColor: bgColor }}
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