# Desafio Lamdec

Essa dashboard é uma aplicação web que integra um backend em Python (FastAPI) e um frontend em TypeScript (React). Este guia explica como rodar o projeto por completo e detalha os passos e dependências necessárias.

---

## Tecnologias Principais

- **Backend:** Python (FastAPI)
- **Frontend:** TypeScript (React)
- **Estilização:** Tailwind CSS

---

## Requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (recomenda-se versão 16 ou superior)
- [npm](https://www.npmjs.com/)
- [Python 3.8+](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)

---

## Instalação e Inicialização

### 1. Backend (FastAPI)

Acesse o diretório do backend e instale as dependências do Python:

```bash
cd backend
pip install -r requirements.txt
```

Inicie o servidor FastAPI com Uvicorn:

```bash
uvicorn main:app --reload
```

> **Dica:** Certifique-se de que o arquivo principal é o `main.py` e o objeto FastAPI é chamado `app`. Caso sejam diferentes, ajuste o comando conforme necessário.

O backend estará disponível, por padrão, em `http://localhost:8000`.

---

### 2. Frontend (React + TypeScript)

Acesse o diretório do frontend:

```bash
cd frontend
```

Instale todas as dependências do Node.js:

```bash
npm install
```
### Dependências adicionais (além do React + Vite)

Este projeto utiliza as seguintes bibliotecas extras:

- Radix UI:  
  `@radix-ui/react-dialog`, `@radix-ui/react-hover-card`, `@radix-ui/react-label`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`
- Tailwind e utilitários:  
  `@tailwindcss/vite`, `tailwindcss`, `tailwind-merge`, `class-variance-authority`, `clsx`, `tw-animate-css`
- Ícones e gráficos:  
  `lucide-react`, `react-icons`, `recharts`

Estes pacotes são instalados automaticamente pelo comando `npm install`.

Inicie o servidor de desenvolvimento do frontend:

```bash
cd frontend
npm run dev
```

O frontend estará disponível, normalmente, em `http://localhost:5173`.

---

## Estrutura de Pastas Sugerida

```
lamdec/
├── backend/
│   ├── main.py
│   ├── requirements.txt
├── frontend/
│   ├── package.json
│   └── src/
└── README.md
```

---

## Observações Importantes

- Caso o frontend faça chamadas à API do backend, certifique-se de configurar corretamente o endereço do backend (ex: variáveis de ambiente ou arquivos de configuração).

---
