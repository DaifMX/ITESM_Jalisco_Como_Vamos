import { View, Text, StyleSheet, Pressable } from "react-native";
import { DynamicPieChart } from "@/components/graphs/DynamicPieChart";
import { DynamicBarChart } from "@/components/graphs/DynamicBarChart";
import { PieChartIcon, BarChart3Icon } from "lucide-react-native";

interface ChartDataItem {
    name: string;
    value: number;
    label: string;
}

interface ChartCardProps {
    title: string;
    subtitle: string;
    chartData: ChartDataItem[];
    chartType: "pie" | "bar";
    onChartTypeChange: (type: "pie" | "bar") => void;
    actionButtons?: React.ReactNode;
}

export function ChartCard({
    title,
    subtitle,
    chartData,
    chartType,
    onChartTypeChange,
    actionButtons,
}: ChartCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.chartToggleContainer}>
                <Pressable
                    onPress={() => onChartTypeChange("pie")}
                    className={chartType === "pie" ? "bg-pantone-light-blue rounded-xl p-2.5" : "bg-gray-300 rounded-xl p-2.5"}
                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                    <PieChartIcon 
                        size={20} 
                        color={chartType === "pie" ? "#ffffff" : "#6b7280"} 
                    />
                </Pressable>
                <Pressable
                    onPress={() => onChartTypeChange("bar")}
                    className={chartType === "bar" ? "bg-pantone-light-blue rounded-xl p-2.5" : "bg-gray-300 rounded-xl p-2.5"}
                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                    <BarChart3Icon 
                        size={20} 
                        color={chartType === "bar" ? "#ffffff" : "#6b7280"} 
                    />
                </Pressable>
                {actionButtons && (
                    <View style={styles.actionButtonsWrapper}>
                        {actionButtons}
                    </View>
                )}
            </View>

            {chartType === "pie" ? (
                <DynamicPieChart
                    data={chartData}
                    height={240}
                />
            ) : (
                <DynamicBarChart
                    data={chartData}
                    height={260}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "rgb(0, 61, 165)",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        alignItems: "flex-start",
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#000" 
    },
    cardSubtitle: { 
        fontSize: 12, 
        color: "rgb(153, 179, 214)",
        marginTop: 2,
    },
    chartToggleContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    actionButtonsWrapper: {
        flexDirection: "row",
        gap: 8,
        marginLeft: "auto",
    },
});
