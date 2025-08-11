import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { CdaData } from "./Parametros";

type Props = {
  dados: CdaData[];
};

export default function Tabela({ dados }: Props) {
  return (
    <div className="">
      {/* Desktop table */}
      <div className="hidden md:block max-h-[75vh] shadow-sm rounded-lg overflow-y-scroll">
        <Table className="min-w-[600px] bg-white">
          <TableHeader className="bg-secondary-foreground text-white sticky top-0 z-10">
            <TableRow>
              <TableHead>Numero CDA</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Natureza</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.numCDA}</TableCell>
                <TableCell>{item.score}</TableCell>
                <TableCell>{item.valor_saldo_atualizado}</TableCell>
                <TableCell>{item.qtde_anos_idade_cda}</TableCell>
                <TableCell>{item.agrupamento_situacao}</TableCell>
                <TableCell>{item.natureza}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile stacked cards */}
      <div className="block md:hidden space-y-4">
        {dados.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
          >
            <dl className="grid grid-cols-2 overflow-clip">
              <dt className="font-semibold">Número CDA</dt>
              <dd>{item.numCDA}</dd>

              <dt className="font-semibold">Score</dt>
              <dd>{item.score}</dd>

              <dt className="font-semibold">Saldo</dt>
              <dd>{item.valor_saldo_atualizado}</dd>

              <dt className="font-semibold">Idade</dt>
              <dd>{item.qtde_anos_idade_cda}</dd>

              <dt className="font-semibold">Situação</dt>
              <dd>{item.agrupamento_situacao}</dd>

              <dt className="font-semibold">Natureza</dt>
              <dd>{item.natureza}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
