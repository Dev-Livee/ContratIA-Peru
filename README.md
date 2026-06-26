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
5. **Comparta la obra** vía URL pública o código QR.
6. **Se suscriba** a alertas de un distrito o entidad, o **denuncie** irregularidades con número de seguimiento.

---

## 👥 Roles del Sistema

El MVP usa **3 roles únicamente** (sin RBAC granular, sin OAuth2, sin 2FA):

| Rol | Autenticación | Capacidades |
|---|---|---|
| `ROLE_CIUDADANO` | **Sin login** — acceso público total | Busca, ve obras, compara proveedores, escanea QR. Email opcional para alertas (magic link). |
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
│  Detalle de la obra (URL pública + QR)          │
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
│  [Resumen IA]  [Comparar]  [QR]  [Denunciar]   │
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
| **OpenAI / Anthropic** | Resumen en lenguaje natural del perfil del proveedor |
| **Resend** | Magic links y alertas por email (3,000/mes gratis) |
| **`qrcode` npm** | Generación de QR por obra lado servidor |

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
- **Rate limiting** por IP en búsquedas y endpoint de resumen IA.
- **Allowlist de emails admin** en variable de entorno — nunca en código.
- **Sin PII de personas naturales** más allá del email del suscriptor.
- **Solo personas jurídicas** (RUC `20*`) en los datos consultados.
- **API keys** (latinfo, OpenAI, Resend) en variables de entorno de Vercel.
- **Denuncias anónimas** permitidas (`subscriber_id` nullable).

---

## 📋 Rúbrica de Evaluación

| Criterio | Peso | Cómo lo cubre ContrataIA Perú |
|---|---|---|
| **Arquitectura e Ingeniería** | 40% | ERD 6 entidades + ADR-001 + diagramas C4 + stack justificado |
| **Funcionalidad y Despliegue** | 30% | Datos reales desde latinfo.dev desde el día 1 · Deploy en Vercel |
| **UX/UI y Adaptación Creativa** | 15% | Semáforo visual · Línea de tiempo · QR compartible · Resumen IA |
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
#   OPENAI_API_KEY=sk-...
#   RESEND_API_KEY=re_...
#   DATABASE_URL=postgresql://...

# 4. Aplica migraciones
npx prisma migrate dev

# 5. Levanta el servidor
npm run dev
# → http://localhost:3000
```

---

## 🗺️ Roadmap V1.0+ (fuera del MVP de 11h)

- Gestión documental con S3 + firma digital homologada
- `ROLE_ENTIDAD_PUBLICA` — gestión del ciclo completo de proyectos
- `ROLE_PERIODISTA` — dashboards y exportes especializados
- Notificaciones SMS y push
- Predicción de retrasos con ML
- Detección de patrones de contratación inusuales
- App móvil
- API pública para interoperabilidad

---

*Hackathon VibeCoding · DSC PUCP · 26 junio 2026 · Temática: Estado Peruano*
**Cuándo usarlo:** APENAS se revela la temática (09:30). Es el primer agente que debes invocar, antes que `@architect`.
```
@dba La temática es [X]. Genera el ERD del MVP en /docs/erd.md
     y el ADR-001 justificando las entidades elegidas.
```
**Lo que hace:**
- Identifica las entidades core del dominio (5–8 máx para el MVP)
- Genera el ERD en Mermaid en `/docs/erd.md`
- Crea `ADR-001-modelo-de-datos.md` justificando qué entró y qué quedó fuera
- Entrega un handoff explícito a `@architect` y `@backend`
- Bloquea modelado innecesario para que el equipo no pierda tiempo

---

### 1. `@architect` - Arquitecto de Software
**Cuándo usarlo:** Sprint 0, al inicio del desarrollo, cuando necesites tomar decisiones técnicas.
```
@architect Diseña la arquitectura para una app de [temática]. 
           Necesitamos [requisitos]. Crea los diagramas y ADRs.
```
**Lo que hace:**
- Diseña la arquitectura del sistema
- Crea diagramas C4 en Mermaid
- Escribe ADRs (Architecture Decision Records)
- Recomienda stack tecnológico con justificación
- Define cómo se comunican Backend y Frontend

---

### 2. `@backend` - Desarrollador Backend
**Cuándo usarlo:** Durante el desarrollo de la API, lógica de negocio y base de datos.
```
@backend Crea el endpoint POST /api/[recurso] que [descripción].
         Incluye validación y error handling.
```
**Lo que hace:**
- Implementa APIs RESTful
- Modela la base de datos
- Escribe lógica de negocio
- Configura autenticación
- Maneja errores de forma consistente

---

### 3. `@frontend` - Desarrollador Frontend
**Cuándo usarlo:** Durante el desarrollo de la interfaz y experiencia de usuario.
```
@frontend Crea la página de [funcionalidad] con [componentes necesarios].
          Debe conectarse al endpoint [X] del backend.
```
**Lo que hace:**
- Crea componentes UI reutilizables
- Implementa flujos de usuario
- Conecta con el backend (API calls)
- Maneja estados (loading, error, success)
- Optimiza para responsive y performance

---

### 4. `@testing` - QA Engineer
**Cuándo usarlo:** Después de implementar la funcionalidad core, antes de la entrega final.
```
@testing Crea tests para la funcionalidad [X]. Necesito el happy path 
         y al menos un caso de error.
```
**Lo que hace:**
- Identifica qué testear (funcionalidad crítica)
- Escribe tests de happy path
- Escribe tests de casos de error
- Configura el framework de testing
- Valida que el código generado por IA funcione

---

### 5. `@devops` - DevOps Engineer
**Cuándo usarlo:** Al inicio (primer deploy), durante desarrollo (deploy continuo), y antes de la entrega.
```
@devops Necesito desplegar el frontend en Vercel y el backend en Railway.
        Configura todo para producción.
```
**Lo que hace:**
- Despliega frontend (Vercel)
- Despliega backend (Railway/Render/Fly.io)
- Configura variables de entorno
- Crea GitHub Releases
- Verifica que todo funcione en producción

---

### 6. `@reviewer` - Tech Lead / Code Reviewer
**Cuándo usarlo:** Cada 1-2 horas durante el desarrollo, y antes de la entrega final.
```
@reviewer Revisa el código del backend y frontend. 
          Dame feedback priorizado para mejorar antes de entregar.
```
**Lo que hace:**
- Revisa código de `/back/` y `/front/`
- Detecta bugs, vulnerabilidades, code smells
- Da feedback priorizado (🔴 Crítico → 🟡 Importante → 🟢 Sugerencia)
- Prepara al equipo para preguntas del jurado
- Identifica código de IA que el equipo podría no entender

---

### 7. `@pitch` - Experto en Presentaciones
**Cuándo usarlo:** 1-2 horas antes del pitch, para preparar la presentación.
```
@pitch Ayúdame a estructurar un pitch de 5 minutos para [nombre del proyecto].
       El problema es [X] y nuestra solución es [Y].
```
**Lo que hace:**
- Estructura el pitch de 5 minutos
- Crea guión para la demo en vivo
- Prepara respuestas para Q&A del jurado
- Sugiere estructura de slides
- Actualiza el README final

---

## ⚡ Flujo de Trabajo Recomendado

### Sprint 0 (09:30 - 11:30) - Modelo de datos y Arquitectura
```
0. @dba       → Generar ERD del MVP en /docs/erd.md (PRIMERO, apenas se revele la temática)
1. @architect → Diseñar arquitectura y crear diagramas C4 usando el ERD como dominio
2. @architect → Crear ADRs de decisiones principales
3. @devops    → Hacer primer deploy vacío (Hello World)
4. @devops    → Crear GitHub Release "Prototipo de arquitectura"
```

### Sprint 1 (11:30 - 14:00) - MVP
```
5. @backend  → Implementar endpoints core
6. @frontend → Crear UI principal con conexión a API
7. @devops   → Deploy continuo para validar
```

### Sprint 2 (14:00 - 16:30) - Completar
```
8. @backend  → Completar funcionalidades
9. @frontend → Pulir UI/UX
10. @reviewer → Review intermedio del código
11. @testing  → Escribir tests obligatorios
```

### Sprint 3 (16:30 - 18:00) - Entrega
```
12. @reviewer → Review final completo
13. @devops   → Deploy final y verificación
14. @devops   → Crear GitHub Release "Entrega final"
15. @pitch    → Preparar presentación
```

### Pitch (18:00 - 19:15)
```
16. @pitch → Practicar y refinar el pitch
```

---

## 📋 Rúbrica de Evaluación

| Criterio | Peso | Agentes que ayudan |
|----------|------|-------------------|
| Arquitectura e Ingeniería | 40% | `@dba`, `@architect`, `@reviewer` |
| Funcionalidad y Despliegue | 30% | `@backend`, `@frontend`, `@devops` |
| UX/UI y Adaptación Creativa | 15% | `@frontend` |
| Pitch y Caso de Negocio | 15% | `@pitch` |

---

## 🚀 Cómo Empezar

1. **Abre esta carpeta en VS Code** como workspace
2. **Abre GitHub Copilot Chat** (Ctrl+Shift+I)
3. **Empieza con `@dba`** apenas se revele la temática (genera el ERD del MVP)
4. **Continúa con `@architect`** usando el ERD como base del diseño
5. **Sigue el flujo de trabajo** de arriba
6. **Usa `@reviewer` frecuentemente** para mantener la calidad

---

## 📦 Entregables del Torneo

- [ ] README.md completo (este archivo, actualizado)
- [ ] ERD del modelo de datos en `/docs/erd.md`
- [ ] Diagramas de arquitectura en `/docs/`
- [ ] ADRs en `/docs/adr/` (mínimo ADR-001 de modelo de datos)
- [ ] Código backend en `/back/`
- [ ] Código frontend en `/front/`
- [ ] Tests automatizados (happy path + error case)
- [ ] URL de producción funcional
- [ ] GitHub Release "Prototipo de arquitectura - [Nombre]"
- [ ] GitHub Release "Entrega final - [Nombre]"
- [ ] Diapositivas para pitch

---

## 👥 Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| | | |
| | | |
| | | |

---

## 🔗 Enlaces

- **Producción**: [URL pendiente]
- **Documentación**: [/docs](./docs/)
- **ADRs**: [/docs/adr](./docs/adr/)

---

## 🛠️ Cómo correr localmente

### Backend
```bash
cd back
npm install
cp .env.example .env  # Configurar variables
npm run dev
```

### Frontend
```bash
cd front
npm install
cp .env.example .env  # Configurar variables
npm run dev
```

---

## 🤖 Modelos y Herramientas de IA Utilizados

| Herramienta | Uso |
|-------------|-----|
| GitHub Copilot | Asistencia de código con agentes especializados |
| | |
| | |

---

*Proyecto creado para el Torneo de VibeCoding - DSC PUCP 2026*
