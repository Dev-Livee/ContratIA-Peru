# ContrataIA Perú

> **Plataforma Inteligente para la Búsqueda, Seguimiento y Evaluación de Contrataciones Públicas**
>
> *"Contrata con confianza. Decide con inteligencia."*
>
> Desarrollado en el **Torneo de VibeCoding — DSC PUCP, 26 de junio de 2026**

---

## 📁 Estructura del Proyecto

```
ContratIA-Peru/
├── front/                   → Next.js 14 (App Router) — UI + API Routes + Server Actions
├── docs/
│   ├── propuesta.md         → Propuesta de producto completa
│   ├── erd.md               → Modelo de datos (ERD Mermaid)
│   └── adr/
│       └── ADR-001-modelo-de-datos.md
├── .github/
│   └── agents/              → Agentes IA especializados (Copilot Chat)
└── README.md                → Este archivo
```

---

## 🎯 El Problema

El Estado peruano gasta **S/ 70,000 millones al año** en compras públicas. Sin embargo:

- La información está dispersa entre SEACE, OSCE, SUNAT y OEFA.
- No existe una vista unificada por **obra individual** con presupuesto, proveedor y avance en lenguaje ciudadano.
- Los ciudadanos no pueden buscar obras por su **distrito** ni compartirlas fácilmente.
- No hay forma rápida de saber si el proveedor adjudicado tiene **sanciones, multas o deuda tributaria**.
- El Tablero oficial del OECE (Power BI) es estadístico y agregado — no permite seguir una obra específica.

---

## 💡 La Solución

**ContrataIA Perú** permite que cualquier ciudadano, en 30 segundos:

1. **Busque una obra** por código, distrito, entidad o nombre.
2. **Vea su seguimiento** — línea de tiempo tipo "tracking de pedido" con presupuesto, estado y proveedor.
3. **Consulte el semáforo de riesgo** del proveedor adjudicado (verde / amarillo / rojo) cruzando SUNAT + OSCE + OEFA.
4. **Compare 2–3 proveedores** lado a lado en una tabla de indicadores.
5. **Comparta la obra** vía URL pública.
6. **Se suscriba** a alertas de un distrito o entidad, o **denuncie** irregularidades con número de seguimiento.

---

## 👥 Roles del Sistema

El MVP usa **3 roles únicamente** (sin RBAC granular, sin OAuth2, sin 2FA):

| Rol | Autenticación | Capacidades |
|---|---|---|
| `ROLE_CIUDADANO` | **Sin login** — acceso público total | Busca, ve obras, compara proveedores. Email opcional para alertas (magic link). |
| `ROLE_EMPRESA` | Magic link al email del RUC | Administra su perfil público: descripción, rubros, contacto, certificaciones. |
| `ROLE_ADMIN` | Magic link (email en allowlist) | Modera denuncias y perfiles de empresa reportados. |

---

## 🔍 Flujo Principal del Ciudadano

```
┌─────────────────────────────────────────────────┐
│  Buscar una obra                                │
│                                                 │
│  Por código:    ocds-dgv273-seacev3-2024-28-148 │
│  Por distrito:  "Ate" / "San Borja"             │
│  Por entidad:   "Municipalidad de Miraflores"   │
│  Por nombre:    "Puente San Martín"             │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│  Lista de obras                                 │
│  Código · Título · Entidad · Monto · Estado     │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│  Detalle de la obra (URL pública)               │
│                                                 │
│  Línea de tiempo:                               │
│  ● Planificación                                │
│  ● Convocatoria — 12/03/2026                    │
│  ● Adjudicada — Constructora XYZ S.A.C.         │
│  ○ En ejecución (45%)                           │
│  ○ Finalizada                                   │
│                                                 │
│  Presupuesto: S/ 2,450,000                      │
│                                                 │
│  Proveedor: Constructora XYZ S.A.C.             │
│  🟡 Riesgo MEDIO                               │
│  · SUNAT activo y habido                        │
│  · 1 multa OSCE 2024                            │
│  · Sin sanciones ambientales                    │
│                                                 │
│  [Comparar]  [Denunciar]                        │
│  [Suscribirme a este distrito]                  │
└─────────────────────────────────────────────────┘
```

---

## 🆚 Comparador de Proveedores

| Indicador | Empresa A | Empresa B | Empresa C |
|---|---|---|---|
| Estado SUNAT | Activo · Habido | Activo · Habido | Activo · No habido |
| Sanciones OSCE activas | 0 | 1 | 3 |
| Multas OSCE | 0 | 1 | 5 |
| Sanciones OEFA | 0 | 0 | 2 |
| Deuda coactiva SUNAT | No | No | Sí |
| **Semáforo** | 🟢 BAJO | 🟡 MEDIO | 🔴 ALTO |

---

## 🔌 APIs Integradas

### Fuente principal — [latinfo.dev](https://latinfo.dev)
Una sola integración que agrega SEACE, OSCE, SUNAT y OEFA con autenticación única:

| Endpoint | Datos |
|---|---|
| `GET /pe/licitaciones?q=&buyer=&status=&min_amount=` | 900K+ licitaciones SEACE (OCDS 1.1) |
| `GET /pe/ruc/{ruc}` | KYB cross-source: SUNAT + OSCE + OEFA en un solo response |
| `GET /pe/sunat/padron/ruc/{ruc}` | Estado tributario, condición, ubigeo |
| `GET /pe/sunat/coactiva/ruc/{ruc}` | Deuda tributaria activa |
| `GET /pe/osce/sanctioned/ruc/{ruc}` | Inhabilitación OSCE activa |
| `GET /pe/osce/fines/ruc/{ruc}` | Multas a contratistas |
| `GET /pe/osce/penalidades/ruc/{ruc}` | Penalidades contractuales |
| `GET /pe/oefa/sanctions/ruc/{ruc}` | Sanciones ambientales firmes |

### Servicios adicionales
| Servicio | Uso |
|---|---|
| **Resend** | Magic links y alertas por email (3,000/mes gratis) |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend + API + Server Actions | **Next.js 14 (App Router) + TypeScript** | Un solo repo, deploy en Vercel en minutos, Server Components para SEO de páginas públicas de obras |
| UI | **Tailwind CSS + shadcn/ui** | Componentes accesibles listos, sin tiempo en diseño base |
| Base de datos | **PostgreSQL — Neon (free tier)** | Soporta `jsonb` para snapshots crudos de latinfo.dev |
| ORM | **Prisma** | Migraciones tipadas y cliente TypeScript generado |
| Deploy | **Vercel** | Mencionado en las bases del torneo; deploy en un comando |

---

## 🗄️ Modelo de Datos (6 entidades)

| Entidad | Propósito |
|---|---|
| `subscriber` | Ciudadano con email verificado para alertas (magic link, sin password) |
| `subscription` | Qué vigila — entidad / distrito / RUC — y umbral de riesgo para alertar |
| `provider_snapshot` | Caché del perfil 360° de un RUC: SUNAT + OSCE + OEFA + semáforo calculado |
| `tender_snapshot` | Caché de obra/licitación SEACE con `ocid`, `ubigeo`, `buyer_name`, `status`, `amount` |
| `alert` | Bitácora inmutable de alertas enviadas con evidencia reproducible |
| `complaint` | Denuncia ciudadana con `tracking_code` único (admite anónimas) |

Ver diagrama completo en [`/docs/erd.md`](./docs/erd.md)
Ver decisiones en [`/docs/adr/ADR-001-modelo-de-datos.md`](./docs/adr/ADR-001-modelo-de-datos.md)

---

## 🔐 Seguridad

- **HTTPS** forzado por Vercel.
- **Magic link** (token único, expiración 15 min) para `ROLE_EMPRESA` y `ROLE_ADMIN`.
- **Rate limiting** por IP en búsquedas y en el endpoint de suscripción.
- **Allowlist de emails admin** en variable de entorno — nunca en código.
- **Sin PII de personas naturales** más allá del email del suscriptor.
- **Solo personas jurídicas** (RUC `20*`) en los datos consultados.
- **API keys** (latinfo, Resend) en variables de entorno de Vercel.
- **Denuncias anónimas** permitidas (`subscriber_id` nullable).

---

## 📋 Rúbrica de Evaluación

| Criterio | Peso | Cómo lo cubre ContrataIA Perú |
|---|---|---|
| **Arquitectura e Ingeniería** | 40% | ERD 6 entidades + ADR-001 + diagramas C4 + stack justificado |
| **Funcionalidad y Despliegue** | 30% | Datos reales desde latinfo.dev desde el día 1 · Deploy en Vercel |
| **UX/UI y Adaptación Creativa** | 15% | Semáforo visual · Línea de tiempo · Comparador lado a lado |
| **Pitch y Caso de Negocio** | 15% | S/70Bn/año · 9.2K empresas inhabilitadas · API pública validada |

---

## 📦 Entregables del Torneo

- [x] ERD del modelo de datos — [`/docs/erd.md`](./docs/erd.md)
- [x] ADR-001 modelo de datos — [`/docs/adr/ADR-001-modelo-de-datos.md`](./docs/adr/ADR-001-modelo-de-datos.md)
- [x] Propuesta de producto — [`/docs/propuesta.md`](./docs/propuesta.md)
- [ ] Diagramas de arquitectura C4 — `/docs/architecture.md`
- [ ] ADR-002 stack tecnológico
- [ ] Código frontend en `/front/`
- [ ] Tests automatizados (happy path + error case)
- [ ] URL de producción funcional
- [ ] GitHub Release "Prototipo de arquitectura"
- [ ] GitHub Release "Entrega final"
- [ ] Diapositivas para pitch

---

## 👥 Equipo

| Nombre | Rol | GitHub |
|---|---|---|
| | | |
| | | |
| | | |

---

## 🔗 Enlaces

| | |
|---|---|
| **Producción** | URL pendiente |
| **Repositorio** | https://github.com/Dev-Livee/ContratIA-Peru |
| **Propuesta de producto** | [/docs/propuesta.md](./docs/propuesta.md) |
| **Modelo de datos** | [/docs/erd.md](./docs/erd.md) |
| **ADRs** | [/docs/adr/](./docs/adr/) |

---

## 🚀 Cómo correr localmente

```bash
# 1. Clona el repositorio
git clone https://github.com/Dev-Livee/ContratIA-Peru.git
cd ContratIA-Peru

# 2. Instala dependencias
cd front
npm install

# 3. Configura variables de entorno
cp .env.example .env.local
# Editar .env.local con:
#   LATINFO_API_KEY=lat_...
#   RESEND_API_KEY=re_...
#   DATABASE_URL=postgresql://...

# 4. Aplica migraciones
npx prisma migrate dev

# 5. Levanta el servidor
npm run dev
# → http://localhost:3000
```

---

*Hackathon VibeCoding · DSC PUCP · 26 junio 2026 · Temática: Estado Peruano*
