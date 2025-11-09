import React, { use, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useSharedValue } from "react-native-reanimated";

type graphProps = {
  onNewData: (value: { label: string[], values: number[] }) => void
};

export default function IndexScreen(onNewData: graphProps) {
  const [data, setData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [tick, setTick] = useState(0);

  const API_URL =
    "https://tribrachic-inconsiderable-ollie.ngrok-free.dev/victims.csv";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        // Count last-name frequency
        const counts: Record<string, number> = {};
        const lines = text.trim().split("\n");
        lines.shift();
        for (const line of lines) {
          const [city, numStr] = line.split(",").map((v) => v.trim());
          const num = Number(numStr);
          counts[city] = isNaN(num) ? 0 : num;
        }
        onNewData.onNewData({ label: Object.keys(counts), values: Object.values(counts) });

        const labels = Object.keys(counts);
        const values = Object.values(counts);
        setData({ labels, values });
      } catch (e) {
        console.error("Fetch error:", e);
      }
    })();
  }, [tick]);

  useEffect(() => {
    //s();
  }, []);
  const interval = useRef<number | null>(null);
  function s() {
    interval.current = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 10000) as unknown as number;
  }

  const screenW = Dimensions.get("window").width;
  const perBar = 60; // pixels per bar
  const chartWidth = data ? Math.max(screenW - 20, data.labels.length * perBar) : screenW;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
          Name Frequency Chart
        </Text>

        {data ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: data.labels,
                datasets: [{ data: data.values }],
              }}
              width={chartWidth}
              height={200}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              verticalLabelRotation={20}
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f0f0f0",
                backgroundGradientTo: "#e0e0e0",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForBackgroundLines: { strokeDasharray: "4 6" },
              }}
              style={{

                borderRadius: 12,
                paddingRight: 40,
                paddingLeft: 10,
              }}
            />
          </ScrollView>
        ) : (
          <Text style={{ color: "#666" }}>Fetching data…</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
