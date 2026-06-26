# Backend

Carpeta para el código del backend (API, lógica de negocio, base de datos).

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Estructura sugerida
```
back/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   ├── routes/
│   └── index.ts
├── tests/
├── .env.example
├── package.json
└── tsconfig.json
```
