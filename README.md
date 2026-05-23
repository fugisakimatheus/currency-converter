# Conversor de moedas

**Idioma:** Português · [English](README.en.md)

Aplicação web para conversão de moedas em tempo real, com histórico de cotação dos últimos 30 dias e suporte a tema claro/escuro com animação circular a partir do botão de troca.

## Funcionalidades

- Conversão entre dezenas de moedas suportadas pela API [Frankfurter](https://www.frankfurter.app/)
- Cotação atual e valor convertido ao alterar moedas ou valor
- Inversão rápida do par de moedas (origem ↔ destino)
- Gráfico de área com histórico dos últimos 30 dias (ApexCharts)
- Cache em `localStorage` para reduzir requisições repetidas
- Tema claro/escuro persistido, com transição animada
- Layout responsivo (mobile e desktop) com estilo “glassmorphism”

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | React 18, TypeScript |
| Build | Vite 4 |
| Estilos | Tailwind CSS 3, Sass |
| Gráficos | ApexCharts (`react-apexcharts`) |
| Ícones | `react-icons` |
| API | Frankfurter (via proxy na mesma origem) |

## Estrutura do projeto

```
currency-converter/
├── index.html              # Shell HTML + script anti-flash de tema
├── vite.config.ts          # Dev/preview + proxy /api/frankfurter
├── vercel.json             # Rewrite da API em produção (Vercel)
├── tailwind.config.cjs
├── postcss.config.cjs
└── src/
    ├── main.tsx            # Bootstrap React + providers
    ├── App.tsx             # Layout principal
    ├── index.scss          # Estilos globais e componentes
    ├── components/
    │   ├── converter-fields.tsx
    │   ├── exchange-chart.tsx
    │   ├── input.tsx              # CurrencyInput
    │   ├── theme-toggle.tsx
    │   └── theme-transition-overlay.tsx
    ├── contexts/
    │   ├── currency.tsx           # Estado do conversor
    │   └── theme.tsx              # Tema + animação
    ├── hooks/
    │   └── use-currency-pair.ts   # Fetch, cache e dados do gráfico
    ├── lib/
    │   ├── format.ts
    │   └── theme-transition.ts
    └── services/
        ├── exchange-rates.ts
        └── exchange-rates-cache.ts
```

### Fluxo de dados

1. **`CurrencyProvider`** mantém moedas, valor digitado e valor convertido.
2. **`useCurrencyPair`** busca cotação atual + série histórica, com cache local.
3. **`ThemeProvider`** controla tema, animação de revelação e aplica classes em `<html>`.
4. **`App`** compõe conversor, gráfico e overlay de transição de tema.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado)
- npm (ou compatível)

## Instalação e execução

```bash
# Clonar e entrar no diretório do projeto
cd currency-converter

# Instalar dependências
npm install

# Servidor de desenvolvimento (porta padrão 5000)
npm run dev
```

Variável opcional `APP_PORT` no `.env` altera a porta do Vite.

```bash
# Build de produção
npm run build

# Pré-visualizar o build
npm run preview
```

## API e proxy

As requisições usam o caminho `/api/frankfurter`, reescrito para `https://api.frankfurter.app` para evitar CORS:

- **Desenvolvimento / preview:** proxy no `vite.config.ts`
- **Produção (Vercel):** `rewrites` em `vercel.json`

Sem esse proxy (ou rewrite equivalente), o navegador pode bloquear chamadas diretas à API.

## Tema claro / escuro

- Preferência salva em `localStorage` (`currency-converter-theme`)
- Script inline em `index.html` evita flash na primeira carga
- Ao alternar o tema, uma animação circular expande a partir do clique; o botão de troca permanece visível acima do overlay
- Respeita `prefers-reduced-motion: reduce` (troca instantânea, sem animação)

## Deploy

O projeto inclui configuração para [Vercel](https://vercel.com/) via `vercel.json`. Após o deploy, confirme que o rewrite `/api/frankfurter` está ativo para as cotações funcionarem.

## Scripts npm

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `tsc` + build Vite em `dist/` |
| `npm run preview` | Serve o build localmente |

---

Documentação em inglês: [README.en.md](README.en.md)
