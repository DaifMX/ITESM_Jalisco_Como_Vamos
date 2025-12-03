import { Dimensions, View, Text as RNText, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useMemo } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = Math.min(SCREEN_WIDTH - 64);

interface PieChartDataItem {
    name: string;
    value: number;
    color?: string;
    legendFontColor?: string;
    legendFontSize?: number;
}

interface DynamicPieChartProps {
    data: PieChartDataItem[];
    width?: number;
    height?: number;
    colors?: string[];
    legendFontColor?: string;
    legendFontSize?: number;
    hasLegend?: boolean;
    center?: [number, number];
}

const DEFAULT_COLORS = [
    "#003DA5",
    "#F37021",
    "#C4D600",
    "#E4002B",
    "#FEDD00",
    "#99B3D6",
];

export function DynamicPieChart({
    data,
    width = CHART_WIDTH,
    height = 220,
    colors = DEFAULT_COLORS,
    legendFontColor = "#003DA5",
    legendFontSize = 12,
    hasLegend = true,
    center = [0, 0],
}: DynamicPieChartProps) {
    const chartData = useMemo(() => {
        return data.map((item, index) => ({
            name: item.name,
            population: item.value,
            color: item.color || colors[index % colors.length],
            legendFontColor: legendFontColor,
            legendFontSize: legendFontSize,
        }));
    }, [data, colors, legendFontColor, legendFontSize]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <RNText style={styles.legendText}>No hay datos disponibles</RNText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PieChart
                data={chartData}
                width={width}
                height={height}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => legendFontColor,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={hasLegend}
                absolute={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    legendText: {
        fontSize: 14,
        color: "#003DA5",
    },
});