import { useEffect, useState } from "react";

import Parametros from "../components/Parametros.tsx";
import type { CdaData } from "../components/Parametros.tsx";
import Tabela from "../components/Tabela.tsx";

import api from "@/api.ts";
import { Label } from "@/components/ui/label.tsx";

function CDA() {
  const [dados, setDados] = useState<CdaData[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/cda/search");
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar todos os dados", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div>
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-center gap-4 p-5">
          <Tabela dados={dados} />
          <div className="flex flex-col gap-4">
            <Label className="w-full text-center justify-center text-xl">
              Consulta de CDA
            </Label>
            <Parametros onDataFetched={setDados}></Parametros>
            <h6 className="text-sm">
              Situação:
              <ul>
                <li>-1: Cancelada</li>
                <li>0: Em Cobrança</li>
                <li>1: Quitada</li>
              </ul>
            </h6>
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <div className="h-screen flex flex-wrap items-center justify-center gap-4 p-5">
          <div className="flex flex-col gap-4">
            <Label className="w-full text-center justify-center text-xl">
              Consulta de CDA
            </Label>
            <Parametros onDataFetched={setDados}></Parametros>
            <h6 className="text-sm">
              Situação:
              <ul>
                <li>-1: Cancelada</li>
                <li>0: Em Cobrança</li>
                <li>1: Quitada</li>
              </ul>
            </h6>
          </div>
          <Tabela dados={dados} />
        </div>
      </div>
    </div>
  );
}

export default CDA;
