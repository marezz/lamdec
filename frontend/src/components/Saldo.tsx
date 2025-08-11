import {
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/api";
import { useEffect, useState } from "react";

const chartConfig = {
  Saldo: {
    label: "Saldo",
    color: "var(--chart-1)",
  },
  Quantidade: {
    label: "Quantidade",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface CdaData {
  name: string;
  Quantidade: number;
  Saldo: number;
}

type Props = {
  className?: string;
};

export default function Saldo({ className }: Props) {
  const [dados, setDados] = useState<CdaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get("/resumo/saldo_cdas");
        const data = Array.isArray(res.data) ? res.data : [];

        // Ordena descendentemente por Saldo
        const sortedData = data.sort((a, b) => b.Saldo - a.Saldo);

        // Define cores para cada item
        const colors = [
          "var(--chart-1)",
          "var(--chart-2)",
          "var(--chart-3)",
          "var(--chart-4)",
          "var(--chart-5)",
          "var(--chart-6)",
        ];

        const withColors = sortedData.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length],
        }));

        setDados(withColors);
      } catch (err) {
        console.error("Erro ao buscar dados de saldo:", err);
        setError("Não foi possível carregar os dados de saldo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaldo();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Saldo por Tipo de CDAs</CardTitle>
        <CardDescription>Visualização por tipo de tributo</CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center text-red-500">
            <p>{error}</p>
          </div>
        ) : dados.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer>
              <BarChart data={dados} barCategoryGap={10} barGap={5}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Saldo" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-gray-500">Nenhum dado disponível.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
