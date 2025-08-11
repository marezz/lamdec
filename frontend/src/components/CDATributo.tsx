import { LucideBrain } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/api";

// Configuração do gráfico com as chaves exatas do JSON
const chartConfig = {
  Quitada: {
    label: "Quitada",
    color: "hsl(var(--chart-1))",
  },
  "Em cobranÃ§a": {
    label: "Em Cobrança",
    color: "hsl(var(--chart-2))",
  },
  Cancelada: {
    label: "Cancelada",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type Props = {
  className?: string;
};

export default function CDATributo({ className }: Props) {
  const [dados, setDados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get("/resumo/distribuicao_cdas");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setError(
          "Não foi possível carregar os dados. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distribuição de CDAs por Situação</CardTitle>
        <CardDescription>Visualização por tipo de tributo</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        {isLoading && (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        )}
        {error && (
          <div className="flex h-[300px] items-center justify-center text-red-500">
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && dados.length > 0 && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={dados}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => String(value)}
              />
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="Quitada" stackId="a" fill="var(--chart-1)" />
              <Bar dataKey="Em cobranÃ§a" stackId="a" fill="var(--chart-2)" />
              <Bar dataKey="Cancelada" stackId="a" fill="var(--chart-3)" />
            </BarChart>
          </ChartContainer>
        )}
        {!isLoading && !error && dados.length === 0 && (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-gray-500">Nenhum dado disponível.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <LucideBrain className="h-4 w-4" />
          Insights
        </div>
        <div className="leading-none text-muted-foreground text">
          <ul>
            <li>IPTU: Alta taxa de quitação (70%)</li>
            <li>ISS: Maior parte em cobrança (67%)</li>
            <li>Taxas: Alto índice de cancelamento (80%)</li>
            <li>ITBI: Distribuição equilibrada entre status</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
}
