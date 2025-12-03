import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useMemo } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = Math.min(SCREEN_WIDTH - 64);

interface BarChartDataItem {
    label: string;
    value: number;
}

interface DynamicBarChartProps {
    data: BarChartDataItem[];
    width?: number;
    height?: number;
    fromZero?: boolean;
    showValuesOnTopOfBars?: boolean;
    color?: string;
    fillColor?: string;
}

const DEFAULT_COLOR = "#003DA5";

export function DynamicBarChart({
    data,
    width = CHART_WIDTH,
    height = 260,
    fromZero = true,
    showValuesOnTopOfBars = true,
    color = DEFAULT_COLOR,
    fillColor = DEFAULT_COLOR,
}: DynamicBarChartProps) {
    const chartData = useMemo(() => ({
        labels: data.map((item) => item.label),
        datasets: [{
            data: data.map((item) => Math.round(item.value * 10) / 10),
        }]
    }), [data]);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <View style={{ width, height }}>
            <BarChart
                data={chartData}
                width={width}
                height={height}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero={fromZero}
                showValuesOnTopOfBars={showValuesOnTopOfBars}
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 1,
                    color: (opacity = 1) => fillColor,
                    labelColor: (opacity = 1) => color,
                    style: {
                        borderRadius: 16,
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: "",
                        stroke: "#99B3D6",
                        strokeWidth: 1,
                    },
                    barPercentage: 0.7,
                }}
                style={{
                    borderRadius: 16,
                }}
            />
        </View>
    );
}
