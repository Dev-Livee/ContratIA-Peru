# Instrucciones Globales - Torneo de VibeCoding

## Contexto
Este es un proyecto para el **Torneo de VibeCoding** (hackathon de DSC PUCP, 26 junio 2026).
El equipo tiene **11 horas** para construir un producto de software funcional desplegado en producción.

## Rúbrica de Evaluación
| Criterio | Peso |
|----------|------|
| Arquitectura e Ingeniería | 40% |
| Funcionalidad y Despliegue | 30% |
| UX/UI y Adaptación Creativa | 15% |
| Pitch y Caso de Negocio | 15% |

## Estructura del Proyecto
```
vibecoding-hackathon/
├── back/           → Código del backend (API, lógica de negocio)
├── front/          → Código del frontend (UI, experiencia de usuario)
├── docs/           → Documentación técnica
│   └── adr/        → Architecture Decision Records
├── .github/copilot/ → Agentes de IA especializados
└── README.md       → Documentación principal
```

## Reglas Universales para TODOS los agentes

1. **Tiempo es oro**: No sobreingeniería. Hacer lo mínimo viable que funcione bien.
2. **Deploy first**: Desplegar algo funcional lo antes posible.
3. **Explicabilidad**: Todo el código debe ser entendible y explicable por el equipo.
4. **Commits atómicos**: Mensajes descriptivos, historial limpio.
5. **Seguridad**: No commitear secrets. Usar env vars.
6. **Documentación viva**: Actualizar docs conforme se avanza.
7. **IA responsable**: Usar IA para acelerar, no para generar código que no se entiende.

## Entregables Obligatorios
- [ ] README.md completo
- [ ] ERD del modelo de datos en `/docs/erd.md` (primer artefacto del Sprint 0, generado por `@dba`)
- [ ] Diagramas de arquitectura en `/docs/`
- [ ] ADRs en `/docs/adr/` (mínimo `ADR-001-modelo-de-datos.md`)
- [ ] Tests automatizados (happy path + error case)
- [ ] URL de producción funcional
- [ ] GitHub Release "Prototipo de arquitectura"
- [ ] GitHub Release "Entrega final"
- [ ] Diapositivas para pitch

## Timeline del Evento
- 09:00 - Inicio
- 09:30 - Revelación de temática → invocar `@dba` de inmediato para generar el ERD
- 09:50-10:45 - `@architect` diseña sobre el ERD generado
- 10:45-11:30 - Sprint 0 (solo arquitectura y documentación)
- 11:30 - HITO 1: Release "Prototipo de arquitectura"

- 11:30-18:00 - Desarrollo
- 18:00 - HITO 2: Release "Entrega final"
- 18:00-19:15 - HITO 3: Pitches (5 min + 2 min Q&A)
