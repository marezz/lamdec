import { TrendingUp } from "lucide-react";
import { Area, CartesianGrid, AreaChart, XAxis } from "recharts";
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
import { useEffect, useState } from "react";

const chartConfig = {
  inscricoes: {
    label: "Inscrições Totais",
    color: "var(--chart-1)",
  },
  quitadas: {
    label: "Quitadas",
    color: "var(--chart-2)",
  },
  canceladas: {
    label: "Canceladas",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Props = {
  className?: string;
};

export default function Inscricoes({ className }: Props) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allRes, cancelRes, quitRes] = await Promise.all([
          api.get("/resumo/inscricoes"),
          api.get("/resumo/inscricoes_canceladas"),
          api.get("/resumo/inscricoes_quitadas"),
        ]);

        // Mesclar os dados por ano
        const merged = allRes.data.map((item) => {
          const ano = item.ano;
          const inscricao =
            allRes.data.find((i) => i.ano === ano)?.Quantidade || 0;
          const quitada =
            quitRes.data.find((q) => q.ano === ano)?.Quantidade || 0;
          const cancelada =
            cancelRes.data.find((c) => c.ano === ano)?.Quantidade || 0;

          return {
            ano,
            inscricoes: inscricao,
            quitadas: quitada,
            canceladas: cancelada,
          };
        });

        setDados(merged);
      } catch (err) {
        console.error("Erro ao buscar todos os dados:", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Inscrições</CardTitle>
        <CardDescription>1971-2024</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={dados}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
              <linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="inscricoes"
              type="natural"
              fill="url(#fill1)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="canceladas"
              type="natural"
              fill="url(#fill2)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
              stackId="a"
            />
            <Area
              dataKey="quitadas"
              type="natural"
              fill="url(#fill3)"
              fillOpacity={0.4}
              stroke="var(--chart-3)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center gap-2 text-sm justify-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="flex flex-row gap-2 leading-none font-medium ">
              <TrendingUp className="h-4 w-4" />
              Crescimento Impressionante!
            </div>
            <div className="text-muted-foreground">
              <p>Evolução das inscrições entre 1971 e 2024</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
