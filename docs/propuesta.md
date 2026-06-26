# ContrataIA Perú

> **Plataforma Inteligente para la Búsqueda, Seguimiento y Evaluación de Contrataciones Públicas**
>
> *"Contrata con confianza. Decide con inteligencia."*

---

## 1. Introducción

**ContrataIA Perú** es una plataforma web que centraliza información oficial del Estado Peruano (SEACE, OSCE, SUNAT, OEFA) y la combina con inteligencia artificial para:

- Que **cualquier ciudadano** pueda buscar una obra por su **código público**, por **distrito** o por **entidad**, y ver su seguimiento en una línea de tiempo clara.
- Que **empresas privadas** mantengan un perfil técnico consolidado y visible.
- Que los **administradores** moderen denuncias ciudadanas y aseguren la calidad del contenido.

A diferencia del Tablero oficial del OECE (Power BI agregado), ContrataIA Perú está pensada como una experiencia **ciudadana, individual y reproducible**: cada obra tiene su URL pública, su QR, su semáforo de riesgo y su comparativa de proveedores.

---

## 2. Problemática

- Información dispersa en SEACE, OSCE, SUNAT y OEFA. El ciudadano no sabe dónde buscar.
- No hay una vista por **obra individual** con presupuesto, proveedor y avance en lenguaje claro.
- No existe una forma simple de **comparar dos proveedores** que postulan al mismo proyecto.
- Las obras no se pueden compartir fácilmente (sin URL pública, sin QR).
- Periodistas, vecinos y postulantes deben armar el rompecabezas a mano.

---

## 3. Objetivo

Construir una plataforma donde **cualquier persona, en 30 segundos**, pueda:

1. **Buscar una obra** por código, distrito o entidad.
2. **Ver su seguimiento** (línea de tiempo + presupuesto + proveedor adjudicado + semáforo de riesgo).
3. **Comparar al proveedor** con otros del mismo rubro.
4. **Compartir la obra** vía URL pública o QR.
5. **Suscribirse** a alertas de su distrito o denunciar irregularidades.

---

## 4. Propuesta de Valor

| Para… | ContrataIA Perú entrega… |
|---|---|
| **Ciudadanos** | Búsqueda en lenguaje natural, línea de tiempo tipo "tracking de pedido", QR público, sin login. |
| **Empresas** | Perfil técnico consolidado y visible, evita preparar dossiers desde cero. |
| **Periodistas / veedores** | Comparativa lado-a-lado, exportación, código de obra para citar en investigaciones. |
| **Administradores** | Panel para atender denuncias y mantener la calidad del contenido. |

---

## 5. Roles del Sistema (capa de seguridad)

El MVP usa **3 roles** únicamente. Sin OAuth2, sin OTP, sin 2FA, sin RBAC granular.

### `ROLE_CIUDADANO` (sin autenticación)
Es el rol por defecto. **No requiere registro** para buscar y consultar.
- Buscar obras por código, distrito o entidad compradora.
- Ver el seguimiento de una obra (línea de tiempo + presupuesto + proveedor + semáforo).
- Comparar 2–3 proveedores lado a lado.
- Escanear QR público.
- **Opcionalmente** dejar un email para:
  - Suscribirse a alertas de un distrito o entidad.
  - Recibir el `tracking_code` de una denuncia ciudadana.

> Implementación: **magic link por email** (sin password). El email queda en `subscriber`. No es un "login" tradicional — es solo verificación para recibir notificaciones.

### `ROLE_EMPRESA` (autenticación passwordless)
Empresa privada que se registra con su RUC para administrar su perfil público.
- Registro con RUC (validado contra SUNAT vía latinfo.dev) + email del representante.
- Acceso vía magic link al email institucional.
- Administra: descripción, rubros, contactos, certificaciones cargadas como links externos (sin storage propio en V0.1).
- Ve evaluaciones históricas y comparativas donde aparece su empresa.

### `ROLE_ADMIN` (autenticación passwordless)
Equipo interno de moderación.
- Acceso vía magic link a email del dominio admin (allowlist en variable de entorno).
- Atiende denuncias (`complaint`): cambia estado, agrega notas internas.
- Modera perfiles de empresa reportados.
- Ve métricas básicas (suscripciones, alertas enviadas, denuncias por estado).

> **Roles descartados del MVP** (entran en el roadmap): `ROLE_PERIODISTA` (dashboard especializado), `ROLE_AUDITOR` (vista interna de fiscalización), `ROLE_ENTIDAD_PUBLICA` (gestión de proyectos del lado del Estado).

---

## 6. Flujo Principal (Ciudadano)

Este es el flujo central del producto. Todo lo demás es accesorio.

```
[Inicio] Caja de búsqueda única
   │
   ├─ Busca por código de obra (ej: "ocds-dgv273-seacev3-2024-28-148")
   ├─ Busca por distrito (ej: "Distrito de Ate")
   ├─ Busca por entidad (ej: "Municipalidad de San Borja")
   └─ Busca por nombre de proyecto (ej: "Puente San Martín")
        │
        ▼
[Resultados] Lista de obras con:
   • Código (OCID) — copiable
   • Título de la obra
   • Entidad compradora
   • Distrito / región
   • Monto en S/
   • Estado (Planificación / Convocada / Adjudicada / En ejecución / Finalizada)
        │
        ▼
[Detalle de la obra] Página pública compartible
   ┌──────────────────────────────────────────────┐
   │  Código:  ocds-dgv273-seacev3-2024-28-148    │
   │  Obra:    Puente San Martín — Ate            │
   │  Entidad: Municipalidad Distrital de Ate     │
   │  Monto:   S/ 2,450,000                       │
   │                                               │
   │  ─── Línea de tiempo ───                      │
   │  ● Planificación                              │
   │  ● Convocatoria publicada — 12/03/2026        │
   │  ● Adjudicada a: Constructora XYZ S.A.C.      │
   │  ○ En ejecución (45% reportado)               │
   │  ○ Finalizada                                 │
   │                                               │
   │  ─── Proveedor adjudicado ───                 │
   │  Constructora XYZ S.A.C.  RUC 20XXXXXXXXX     │
   │  🟡 Riesgo MEDIO                              │
   │  · SUNAT activo y habido                      │
   │  · 1 multa OSCE 2024                          │
   │  · Sin sanciones ambientales                  │
   │  [ Resumen IA ] [ Ver perfil 360° ]           │
   │                                               │
   │  [ Comparar con otras empresas ]              │
   │  [ Compartir ] [ QR ] [ Denunciar ]           │
   │  [ Suscribirme a este distrito ]              │
   └──────────────────────────────────────────────┘
```

### Comparador (lanzado desde el detalle)

Selecciona 2 o 3 RUCs y muestra una tabla lado-a-lado:

| Indicador | Empresa A | Empresa B | Empresa C |
|---|---|---|---|
| Estado SUNAT | Activo · Habido | Activo · Habido | Activo · No habido |
| Sanciones OSCE activas | 0 | 1 | 3 |
| Multas OSCE 2 últimos años | 0 | 1 | 5 |
| Sanciones ambientales OEFA | 0 | 0 | 2 |
| Deuda coactiva SUNAT | No | No | Sí |
| Contratos previos en SEACE | 24 | 11 | 47 |
| **Semáforo de riesgo** | 🟢 BAJO | 🟡 MEDIO | 🔴 ALTO |

### QR público
Cada página de detalle genera un QR que abre la misma URL pública. Pensado para fiscales, pegado en cartel de obra, o compartido por vecinos.

### Resumen con IA (LLM)
En la página de detalle, un párrafo generado por LLM resume en lenguaje claro qué significan los red-flags del proveedor adjudicado. Cacheado en `provider_snapshot` para no llamar al LLM en cada visita.

---

## 7. Funcionalidades del MVP (V0.1 — 11h)

| # | Funcionalidad | Rol que la usa |
|---|---|---|
| 1 | Buscador unificado (código / distrito / entidad / nombre) | Ciudadano |
| 2 | Página de detalle de obra con línea de tiempo OCDS | Ciudadano |
| 3 | Perfil 360° del proveedor con semáforo de riesgo | Ciudadano |
| 4 | Comparador lado-a-lado de 2–3 proveedores | Ciudadano |
| 5 | Resumen en lenguaje natural del proveedor (LLM) | Ciudadano |
| 6 | QR público y URL compartible por obra | Ciudadano |
| 7 | Suscripción a alertas de un distrito o entidad (magic link) | Ciudadano |
| 8 | Denuncia ciudadana con `tracking_code` (puede ser anónima) | Ciudadano |
| 9 | Registro y perfil público de empresa (magic link al RUC) | Empresa |
| 10 | Panel de moderación de denuncias y empresas | Admin |

---

## 8. Fuera del MVP (Roadmap V1.0+)

Vendemos esta sección en el pitch como visión. No se codea en 11h.

- Gestión documental con S3 + versionado + firma digital homologada.
- Notificaciones SMS y push.
- 2FA, OTP institucional, OAuth2.
- `ROLE_ENTIDAD_PUBLICA` que crea proyectos y administra el ciclo completo.
- `ROLE_PERIODISTA` con dashboards y exportes especializados.
- `ROLE_AUDITOR` con vista de fiscalización.
- Predicción de retrasos con ML.
- Detección de patrones de contratación inusuales / conflictos de interés.
- App móvil.
- API pública para interoperabilidad.

---

## 9. APIs Integradas

### Estado Peruano (vía latinfo.dev — `https://api.latinfo.dev`)
Un solo proveedor agrega 4 fuentes oficiales con autenticación única:
- **SEACE / OECE** — licitaciones, OCDS 1.1 (`GET /pe/licitaciones`)
- **SUNAT** — padrón RUC + deuda coactiva
- **OSCE** — sancionados, multas, penalidades, RNP, entidades
- **OEFA** — sanciones ambientales
- **KYB cross-source** — `GET /pe/ruc/{ruc}` agrega todo lo anterior en un solo response

### Externas
- **LLM (OpenAI o Anthropic Claude)** — para el resumen en lenguaje natural del proveedor.
- **Resend** — envío de magic links y alertas por email (plan gratis 3,000/mes).

---

## 10. Stack Tecnológico

Stack ligero y monolítico para ejecutar en 11h y desplegar a producción en un solo comando.

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend + Backend | **Next.js 14 (App Router) + TypeScript** | Un solo repo, una sola plataforma de deploy, Server Components para SEO de las páginas públicas de obras. |
| UI | **Tailwind CSS + shadcn/ui** | Componentes accesibles y rápidos. |
| Base de datos | **PostgreSQL (Neon o Supabase free tier)** | Soporta `jsonb` para los snapshots crudos de latinfo. |
| ORM | **Prisma** | Migraciones tipadas + generador de cliente TypeScript. |
| Cache externo | **latinfo.dev** | No necesitamos Redis — latinfo ya es la fuente cacheada. |
| Email | **Resend** | Magic links y alertas. |
| LLM | **OpenAI SDK** (o Anthropic) | Resumen en lenguaje natural. |
| QR | **`qrcode` npm** | Generación lado servidor. |
| Deploy | **Vercel** | Las bases del torneo lo mencionan; deploy en minutos. |

> **Lo que SE descarta vs. propuesta inicial:** Spring Boot, Spring Security, Spring AI, Redis, S3, Docker, Nginx, GitHub Actions complejas. Cada uno suma horas de setup sin valor en el MVP.

---

## 11. Capa de Seguridad (V0.1)

- **HTTPS** forzado por Vercel.
- **Magic link** con token de un solo uso y expiración corta (15 min) para `ROLE_EMPRESA` y `ROLE_ADMIN`.
- **`ROLE_CIUDADANO` no autenticado**: todas las páginas de búsqueda y detalle son públicas. Solo la suscripción y la denuncia opcional dejan email (verificado por magic link).
- **Rate limiting** por IP en las rutas de búsqueda y en el endpoint de resumen IA (para no quemar la cuota de latinfo y del LLM).
- **Allowlist de emails admin** en variable de entorno.
- **Variables sensibles** (API keys de latinfo, OpenAI, Resend) en variables de entorno de Vercel, nunca en el repo.
- **Solo personas jurídicas** en los datos consultados (RUC `20*`). Sin PII de personas naturales más allá del email del suscriptor.
- **Denuncias anónimas** permitidas (`subscriber_id` nullable en `complaint`).

---

## 12. Arquitectura (resumen)

```
                  ┌─────────────────────────┐
                  │   Navegador / QR        │
                  │   (Ciudadano público)   │
                  └────────────┬────────────┘
                               │ HTTPS
                  ┌────────────▼────────────┐
                  │   Next.js en Vercel     │
                  │  ┌───────────────────┐  │
                  │  │ App Router (RSC)  │  │  ← páginas públicas SEO-friendly
                  │  │ API Routes        │  │  ← búsqueda, suscripción, denuncia
                  │  │ Server Actions    │  │  ← comparador, resumen IA
                  │  └─────────┬─────────┘  │
                  └────────────┼────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
 ┌──────────────┐      ┌──────────────┐       ┌──────────────┐
 │ PostgreSQL   │      │ latinfo.dev  │       │ OpenAI / Resend │
 │ (Neon)       │      │ SEACE+OSCE+  │       │ Resumen IA +    │
 │ 6 entidades  │      │ SUNAT+OEFA   │       │ magic links     │
 └──────────────┘      └──────────────┘       └──────────────┘
```

El detalle de contenedores y componentes lo entrega `@architect` en `/docs/architecture.md`.

---

## 13. Modelo de Datos

Ver [`/docs/erd.md`](./erd.md) y [`/docs/adr/ADR-001-modelo-de-datos.md`](./adr/ADR-001-modelo-de-datos.md).

Resumen: **6 entidades** (`subscriber`, `subscription`, `provider_snapshot`, `tender_snapshot`, `alert`, `complaint`). El campo `tender_snapshot.ocid` es el **código público de la obra** que el ciudadano usa para buscar, compartir y generar QR.

---

## 14. Beneficios

**Ciudadanos** — Una sola URL/QR para entender una obra completa.
**Empresas** — Perfil consolidado sin tener que armar dossier en cada postulación.
**Periodistas** — Comparador y código de obra estable para citar en investigaciones.
**Administradores** — Panel único para moderar denuncias y mantener calidad.
**Estado** — Complementa al Tablero del OECE con la capa ciudadana que hoy no tiene.
