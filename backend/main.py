import json, os, uvicorn

from fastapi import FastAPI,HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Annotated

class ItemCDA(BaseModel):
    numCDA: str
    score: float
    valor_saldo_atualizado: float
    qtde_anos_idade_cda: int
    agrupamento_situacao: int
    natureza: str

dir = os.path.dirname(__file__)
app = FastAPI(debug=True, title="Lamdec")
caminho = os.path.join(dir,'data','cdas.json')
file = open(caminho)
fake_db = json.load(file)

origins = [
    "http://localhost:5173",
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/resumo/{nome}")
async def get_resumo(nome):
    path = os.path.join(dir,'data',('{filename}.json'.format(filename = nome)))
    if os.path.exists(path):
        file = open(path)
        return json.load(file)
    else:
        raise HTTPException(status_code=404, detail=f"Não encontramos o arquivo {nome}")

@app.get("/cda/search", summary="Pesquisa dentro das cdas", response_model=List[ItemCDA]|ItemCDA)
def buscar_cdas(
    natureza: Optional[str] = None,
    score: Optional[float] = None,
    score_type: Optional[str] = None,
    idade_min: Optional[int] = None,
    idade_max: Optional[int] = None,
    situacao: Optional[int] = None,
    numCDA: Optional[str] = None,
    referencia: Optional[str] = None,     # "idade" ou "saldo"
    ordem: Optional[str] = "asc"           # "asc" ou "desc"
):
    resultados = fake_db

    if natureza is not None:
        resultados = [cda for cda in resultados if cda["natureza"].upper() == natureza.upper()]

    if score is not None:
        if score_type =="max":
            resultados = [cda for cda in resultados if cda["score"] <= score]
        elif score_type =="min":
            resultados = [cda for cda in resultados if cda["score"] >= score]

    if situacao is not None:
        resultados = [cda for cda in resultados if cda['agrupamento_situacao'] == situacao]

    if numCDA is not None:
        resultados = [cda for cda in resultados if cda["numCDA"] == numCDA]

    # Ordenação
    if referencia:
        reverse = ordem == "desc"

        if referencia == "idade":
            resultados = sorted(resultados, key=lambda cda: cda["qtde_anos_idade_cda"], reverse=reverse)
        elif referencia == "saldo":
            resultados = sorted(resultados, key=lambda cda: cda["valor_saldo_atualizado"], reverse=reverse)

    return resultados

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)