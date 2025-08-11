import { useState, useMemo, useEffect, useRef } from "react";
import { Label, Pie, PieChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import api from "@/api";

const chartConfig = {
  Quantidade: {
    label: "Quantidade",
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

export default function Quantidade({ className }: Props) {
  const [dados, setDados] = useState<CdaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Measure container height and listen for resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      setContainerHeight(containerRef.current!.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const totalQuantidade = useMemo(() => {
    return dados.reduce((acc, curr) => acc + curr.Quantidade, 0);
  }, [dados]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get("/resumo/quantidade_cdas");
        console.log("Dados API:", res.data);

        const data = Array.isArray(res.data) ? res.data : [];

        // Sort descending by Quantidade
        const sortedData = data.sort((a, b) => b.Quantidade - a.Quantidade);

        // Add colors
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
        console.error("Erro ao buscar dados de quantidade:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate radii as a fraction of container height
  // Provide sensible defaults in case containerHeight is 0 at first render
  const outerRadius = containerHeight ? containerHeight * 0.4 : 80;
  const innerRadius = containerHeight ? containerHeight * 0.25 : 50;

  return (
    <Card className={className}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Quantidade de CDAs por Tipo</CardTitle>
        <CardDescription>Distribuição percentual</CardDescription>
      </CardHeader>

      {/* Set a fixed height for CardContent so measurement works */}
      <CardContent className="h-full" ref={containerRef}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={dados}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                dataKey="Quantidade"
                nameKey="name"
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalQuantidade.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          IPTU é quase 75% das entradas!
        </div>
        <div className="text-muted-foreground leading-none">
          Baseado nos dados mais recentes
        </div>
      </CardFooter>
    </Card>
  );
}
