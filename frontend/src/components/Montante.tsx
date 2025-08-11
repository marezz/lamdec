"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { XAxis, CartesianGrid, LineChart, Line } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import api from "@/api";

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

type Props = {
  className?: string;
};

export default function Montante({ className }: Props) {
  const [data, setData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lineKeys, setLineKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get("/resumo/montante_acumulado");
        const apiData = Array.isArray(res.data) ? res.data : [];

        setData(apiData);

        if (apiData.length > 0) {
          const keys = Object.keys(apiData[0]).filter(
            (key) => key !== "Percentual"
          );
          setLineKeys(keys);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig: ChartConfig = lineKeys.reduce((acc, key, idx) => {
    acc[key] = { label: key, color: colors[idx % colors.length] };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Montante por Percentual</CardTitle>
        <CardDescription>Gráfico de linhas com dots</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full h-full p-2" // largura total e altura fixa
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              {/* Eixo X com Percentual numérico */}
              <XAxis
                dataKey="Percentual"
                type="number"
                domain={[0, 100]}
                tickCount={11}
                unit={"%"}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />}></ChartLegend>
              {Object.keys(chartConfig).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig[key].color}
                  strokeWidth={2}
                  dot={true}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Tendência positiva <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
