# ADR-001: Modelo de datos del MVP de VeedorPe

## Estado

Aceptado — Sprint 0 (2026-06-26).

## Contexto

VeedorPe es una plataforma web ciudadana (Torneo VibeCoding DSC PUCP, 11 horas) que cruza datos de SEACE, OSCE, SUNAT y OEFA — todos consumidos vía la API pública de **latinfo.dev** — para mostrar:

1. Buscador de licitaciones.
2. Perfil 360° del proveedor con **semáforo de riesgo** (verde/amarillo/rojo).
3. Perfil 360° de la entidad compradora.
4. **Suscripciones ciudadanas** por entidad / región / RUC con alertas por email cuando se adjudica a un proveedor con red-flags.
5. **Canal de denuncia** con número de seguimiento.

Restricciones que condicionan el modelo:

- **Fuente externa única (latinfo.dev)**: no debemos replicar SEACE/OSCE/SUNAT/OEFA en nuestra BD. Solo cachear lo consultado y lo necesario para reproducir alertas.
- **11 horas de desarrollo**: cada tabla debe ser explicable por cualquiera del equipo ante los jueces.
- **Sin auth compleja**: el usuario solo necesita email para recibir alertas. Magic link / token de verificación, sin password.
- **Privacidad por defecto**: trabajamos con personas jurídicas (RUC `20*`). No almacenamos PII de personas naturales más allá del email del suscriptor.
- **Arquitectura/Ingeniería = 40% de la nota**: el ERD se evalúa, las decisiones se preguntan.

## Decisión

Se adopta un modelo de **6 entidades** que cubre el flujo principal sin sobre-modelar.

### Entidades incluidas

| Entidad             | Razón de existir en el MVP |
|---------------------|----------------------------|
| `subscriber`        | Identidad mínima del ciudadano para recibir alertas (email + verificación passwordless). |
| `subscription`      | Qué vigila el ciudadano (entidad, región o RUC) y a partir de qué nivel de riesgo quiere ser alertado. |
| `provider_snapshot` | Caché del perfil 360° de un RUC con los 6 endpoints de latinfo.dev ya cruzados y el `risk_level` calculado. Evita re-fetch y permite reproducir alertas. |
| `tender_snapshot`   | Caché de licitaciones SEACE (OCDS 1.1) que fueron consultadas o que dispararon alertas. Soporta el buscador y el perfil de entidad. |
| `alert`             | Bitácora inmutable de alertas enviadas; soporta la vista "mis alertas" y deja evidencia de qué red-flags había en el momento de la adjudicación. |
| `complaint`         | Canal de denuncia con `tracking_code` único; admite denuncias anónimas (`subscriber_id` nullable). |

### Entidades / conceptos descartados (explícitamente fuera del MVP)

| Descartado | Razón |
|------------|-------|
| `user` con password, `role`, `permission` | El flujo ciudadano no requiere login con password ni distintos roles. Magic link basta. |
| `entity_snapshot` (caché de entidad compradora) | Se arma on-the-fly desde `tender_snapshot` filtrado por `buyer_ruc` + endpoint OSCE de entidades; no aporta valor persistirlo en el MVP. |
| Replicación completa de SEACE | Costo de almacenamiento y mantenimiento desproporcionado; latinfo.dev ya es la fuente. Cachear bajo demanda es suficiente. |
| Tabla puente `subscription_alert_channel` | El MVP solo envía por email; un campo `channel` en `alert` cubre el caso y deja la puerta abierta sin migración mayor. |
| `audit_log`, `metrics`, `feature_flag` | Observabilidad va a infra (Vercel/Logs), no contamina el modelo de dominio. |
| `comment`, `vote` sobre denuncias o licitaciones | Requiere moderación y abre superficie legal; fuera de alcance de 11h. |
| PII del denunciante (DNI, teléfono, dirección) | Riesgo de privacidad/legal sin beneficio para el MVP. El `tracking_code` es suficiente para seguimiento. |
| FK directa `tender_snapshot.supplier_ruc → provider_snapshot.id` | Ambos son cachés con TTL independiente; cruzar por valor de RUC en query es más simple y evita estados inconsistentes. |

### Convenciones del modelo

- Nombres en **inglés, snake_case**.
- Toda entidad tiene `id uuid PK` y `created_at timestamp`. `updated_at` solo donde hay edición (`complaint`).
- Tipos genéricos en el ERD (`uuid`, `string`, `int`, `decimal`, `timestamp`, `boolean`, `jsonb`). El tipo concreto en Postgres lo decide `@backend`.
- Payloads externos crudos se guardan en columnas `jsonb` (`sunat_data`, `osce_data`, `oefa_data`, `raw`) para no perder información ante cambios de la API.
- Campos sensibles marcados: `subscriber.email`, `subscriber.verification_token`.
- Enums se modelan como `string` en el ERD; la restricción concreta (CHECK o enum nativo) la define `@backend` en la migración.

## Consecuencias

**Positivas**

- Modelo explicable en menos de 2 minutos ante los jueces: 6 tablas, cada una con un rol claro.
- Permite implementar las 5 features prometidas sin re-trabajo de schema.
- Snapshots independientes (`provider_snapshot`, `tender_snapshot`) desacoplan el dominio de la disponibilidad/latencia de latinfo.dev.
- `alert` guarda evidencia reproducible: aunque el riesgo del proveedor cambie mañana, la alerta de hoy sigue mostrando por qué se envió.
- Sin auth con password ni PII innecesaria → superficie de seguridad y cumplimiento mínima.

**Negativas / trade-offs aceptados**

- El cruce `tender_snapshot.supplier_ruc ↔ provider_snapshot.ruc` se hace en query, no por FK. Si el equipo necesita joins muy frecuentes, `@backend` deberá indexar ambos campos por `ruc`.
- Los `jsonb` crudos permiten flexibilidad pero requieren disciplina en el frontend para no acoplarse a campos no normalizados.
- No tener `entity_snapshot` implica recomputar el perfil de entidad en cada visita; aceptable mientras el tráfico sea bajo.
- El MVP no soporta múltiples canales de alerta (solo email). Migrar a multi-canal exigirá una tabla puente.
- Las denuncias anónimas (`subscriber_id` nullable) impiden notificar al denunciante por email salvo que deje uno opcional en el `description` — se acepta para preservar anonimato.

**Próximos pasos para el equipo**

- `@architect`: usa estas 6 entidades como dominio para los contenedores C4.
- `@backend`: genera migraciones, decide tipos concretos (UUID v4, `TEXT` vs `VARCHAR`, enum nativo vs CHECK), define índices (`ruc`, `ocid`, `tracking_code`, `subscriber_id`, `subscription_id`) y políticas de TTL para los snapshots.
- `@frontend`: deriva los tipos TypeScript del cliente a partir de estos nombres de entidades y campos.
