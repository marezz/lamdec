import React, { useState } from "react";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import api from "../api";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export type CdaData = {
  numCDA: string;
  score: number;
  valor_saldo_atualizado: number;
  qtde_anos_idade_cda: number;
  agrupamento_situacao: number;
  natureza: string;
};

type Props = {
  onDataFetched: (data: CdaData[]) => void;
};

type FormState = {
  numCDA?: string;
  score?: number;
  scoreType?: "min" | "max";
  referencia?: "idade" | "saldo";
  ordem?: "asc" | "desc";
  situacao?: number;
  natureza?: string;
};

const situacaoLabels: Record<number, string> = {
  [-1]: "Cancelada",
  0: "Em cobrança",
  1: "Quitada",
};

export default function Parametros({ onDataFetched }: Props) {
  const [form, setForm] = useState<FormState>({
    referencia: "saldo",
    ordem: "desc",
  });

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEnviar = async () => {
    try {
      const res = await api.get("/cda/search", {
        params: Object.fromEntries(
          Object.entries(form).filter(([, v]) => v !== undefined && v !== "")
        ),
      });
      onDataFetched(res.data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
    }
  };

  return (
    <div className="flex flex-col w-fit gap-2 p-5 rounded-lg shadow-md drop-shadow-black bg-white md:w-full">
      <Input
        placeholder="Número da CDA"
        value={form.numCDA ?? ""}
        onChange={(e) => updateForm("numCDA", e.target.value || undefined)}
      />

      <div className="flex flex-row gap-2">
        <Input
          placeholder="Score"
          type="number"
          value={form.score ?? ""}
          onChange={(e) =>
            updateForm(
              "score",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
        <ToggleGroup
          type="single"
          value={form.scoreType}
          onValueChange={(v) =>
            updateForm("scoreType", v as FormState["scoreType"])
          }
        >
          <ToggleGroupItem value="min" aria-label="Mínimo">
            Min
          </ToggleGroupItem>
          <ToggleGroupItem value="max" aria-label="Máximo">
            Max
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Select
        value={form.situacao?.toString() ?? ""}
        onValueChange={(value) =>
          updateForm("situacao", value ? Number(value) : undefined)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Situação" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos</SelectLabel>
            {Object.entries(situacaoLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={form.natureza ?? ""}
        onValueChange={(v) => updateForm("natureza", v || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Natureza" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos</SelectLabel>
            {["IPTU", "ISS", "ITBI", "Taxas", "Multas", "Outros"].map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex flex-row gap-2 justify-between">
        <Select
          value={form.referencia ?? ""}
          onValueChange={(v) =>
            updateForm("referencia", v as FormState["referencia"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ordenar por:</SelectLabel>
              <SelectItem value="saldo">Saldo</SelectItem>
              <SelectItem value="idade">Idade</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={form.ordem}
          onValueChange={(v) =>
            updateForm("ordem", v ? (v as FormState["ordem"]) : undefined)
          }
        >
          <ToggleGroupItem value="asc" aria-label="Ordem crescente">
            <FaArrowUp />
          </ToggleGroupItem>
          <ToggleGroupItem value="desc" aria-label="Ordem decrescente">
            <FaArrowDown />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button onClick={handleEnviar}>
        <Tooltip>
          <TooltipTrigger className="w-full">Enviar</TooltipTrigger>
          <TooltipContent>
            <p>Enviar os parâmetros para a Query</p>
          </TooltipContent>
        </Tooltip>
      </Button>
    </div>
  );
}
