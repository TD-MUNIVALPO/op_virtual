# Historias de Usuario - Oficina de Partes Digital

**Proyecto:** Oficina de Partes Digital
**Cliente:** Municipalidad de Valparaíso
**Versión:** 1.0
**Fecha:** Noviembre 2025

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Épica 1: Gestión de Solicitudes Ciudadanas](#épica-1-gestión-de-solicitudes-ciudadanas)
3. [Épica 2: Gestión de Solicitudes por Funcionarios](#épica-2-gestión-de-solicitudes-por-funcionarios)
4. [Épica 3: Gestión de Solicitudes por Unidad Técnica](#épica-3-gestión-de-solicitudes-por-unidad-técnica)
5. [Épica 4: Características Generales del Sistema](#épica-4-características-generales-del-sistema)
6. [Resumen de Implementación](#resumen-de-implementación)
7. [Roadmap y Planificación](#roadmap-y-planificación)

---

## Resumen Ejecutivo

Este documento describe las **18 historias de usuario** identificadas para el sistema de Oficina de Partes Digital de la Municipalidad de Valparaíso. Las historias están organizadas en **4 épicas** que representan los tres roles principales del sistema más las características transversales.

### Estadísticas Generales

| Métrica | Valor |
|---------|-------|
| **Total de Historias** | 18 |
| **Implementadas** | 12 (67%) |
| **En Progreso** | 3 (17%) |
| **Planeadas** | 3 (17%) |
| **Story Points Totales** | 102 |
| **Sprints Planificados** | 3 |

### Roles del Sistema

#### 🟢 Ciudadano
Usuarios que envían solicitudes a la municipalidad. Tienen acceso limitado solo para crear y consultar sus propias solicitudes.

#### 🔵 Funcionario (Derivador SECMUN)
Personal de la Secretaría Comunal que recibe, clasifica y deriva solicitudes a las unidades técnicas correspondientes.

#### 🟣 Unidad Técnica
Departamentos municipales especializados (Fiscalización, DAT, Parques y Jardines, etc.) que resuelven las solicitudes asignadas.

---

## Épica 1: Gestión de Solicitudes Ciudadanas

**Objetivo:** Como ciudadano, quiero poder enviar y gestionar mis solicitudes municipales de forma fácil y accesible.

**Valor de Negocio:** Facilitar el acceso de los ciudadanos a servicios municipales, reduciendo la necesidad de desplazamiento y tiempos de espera.

---

### HU-01: Enviar solicitud con información personal

**ID:** HU-01
**Prioridad:** 🔴 Alta
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** completar un formulario con mis datos personales (nombre, RUT, email, teléfono, dirección),
**para** enviar una solicitud a la municipalidad.

#### Criterios de Aceptación
- [ ] El formulario valida que todos los campos obligatorios estén completos
- [ ] El RUT debe tener formato chileno válido (12.345.678-9)
- [ ] El email debe tener formato válido
- [ ] El teléfono debe tener al menos 8 dígitos
- [ ] Se muestra mensaje de error claro si la validación falla

#### Notas Técnicas
- Usar validación client-side con JavaScript para feedback inmediato
- Implementar validación server-side para seguridad
- Considerar integración con Registro Civil para validación de RUT

#### Definición de Hecho (DoD)
- ✅ Código revisado y aprobado
- ✅ Tests unitarios pasando
- ✅ Validaciones funcionando correctamente
- ✅ Documentación actualizada

---

### HU-02: Incluir nombre social

**ID:** HU-02
**Prioridad:** 🔴 Alta
**Story Points:** 2
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** poder indicar mi nombre social (opcional),
**para** que me identifiquen con el nombre con el que me siento cómodo.

#### Criterios de Aceptación
- [ ] El campo de nombre social es opcional
- [ ] El formulario acepta cualquier texto válido como nombre social
- [ ] El sistema respeta la identidad de género del solicitante
- [ ] El nombre social se muestra prioritariamente en todas las vistas

#### Valor Social
Esta historia refleja el compromiso de la municipalidad con la inclusión y el respeto a la identidad de género de todos los ciudadanos.

---

### HU-03: Describir solicitud detalladamente

**ID:** HU-03
**Prioridad:** 🟡 Media
**Story Points:** 3
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** escribir una descripción detallada de mi solicitud o problema,
**para** que el funcionario entienda claramente mi necesidad.

#### Criterios de Aceptación
- [ ] El campo de descripción tiene espacio suficiente para texto largo (mínimo 500 caracteres)
- [ ] La descripción debe tener al menos 10 caracteres
- [ ] El campo es obligatorio
- [ ] Se muestra contador de caracteres o placeholder informativo
- [ ] El texto acepta saltos de línea para mejor legibilidad

---

### HU-04: Adjuntar archivos de respaldo

**ID:** HU-04
**Prioridad:** 🟡 Media
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** adjuntar archivos (PDF, imágenes, Word) a mi solicitud,
**para** proporcionar evidencia o documentación adicional.

#### Criterios de Aceptación
- [ ] El sistema acepta archivos PDF, Word (DOCX), JPG, PNG
- [ ] El tamaño máximo permitido es 5MB por archivo
- [ ] Se muestra el nombre del archivo seleccionado
- [ ] Se valida el tipo y tamaño antes de permitir el envío
- [ ] Este campo es opcional
- [ ] Hay feedback visual durante la carga del archivo

#### Consideraciones Técnicas
- Implementar escaneo de virus para archivos subidos
- Almacenar archivos con nombres únicos (UUID)
- Considerar límite de almacenamiento por solicitud

---

### HU-05: Recibir número de seguimiento

**ID:** HU-05
**Prioridad:** 🔴 Alta
**Story Points:** 3
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** recibir un número de seguimiento único al enviar mi solicitud,
**para** poder rastrear el estado de mi trámite.

#### Criterios de Aceptación
- [ ] El número de seguimiento se genera automáticamente
- [ ] El formato es consistente: YYMMDD-XXX (ej: 251112-001)
- [ ] Se muestra prominentemente en pantalla después de enviar
- [ ] El número es único para cada solicitud (sin duplicados)
- [ ] Se envía copia por email con el número de seguimiento

#### Formato de ID
```
[AA][MM][DD]-[XXX]
  └─Año  │  │   └─Número secuencial (001-999)
         │  └─Día
         └─Mes
```

**Ejemplo:** `251112-042` = Solicitud del 12 de noviembre de 2025, número 42 del día

---

### HU-06: Ver resumen de solicitud enviada

**ID:** HU-06
**Prioridad:** 🟢 Baja
**Story Points:** 2
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** ciudadano,
**quiero** ver un resumen de los datos que envié,
**para** confirmar que toda la información es correcta.

#### Criterios de Aceptación
- [ ] Se muestra una pantalla de resumen después del envío exitoso
- [ ] El resumen incluye: nombre, RUT, email, teléfono, descripción
- [ ] Se muestra el número de seguimiento claramente destacado
- [ ] Hay una opción para "Enviar una nueva solicitud"
- [ ] Hay una opción para "Descargar/Imprimir comprobante"

---

## Épica 2: Gestión de Solicitudes por Funcionarios

**Objetivo:** Como funcionario de la Oficina de Partes (SECMUN), quiero gestionar, clasificar y derivar solicitudes de manera eficiente.

**Valor de Negocio:** Optimizar el flujo de trabajo interno, asegurando que cada solicitud llegue a la unidad técnica correcta en el menor tiempo posible.

---

### HU-07: Ver todas las solicitudes en bandeja de entrada

**ID:** HU-07
**Prioridad:** 🔴 Alta
**Story Points:** 8
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** funcionario,
**quiero** ver una lista de todas las solicitudes recibidas,
**para** poder revisarlas y gestionarlas de manera organizada.

#### Criterios de Aceptación
- [ ] Se muestra una tabla con todas las solicitudes
- [ ] La tabla incluye: ID, solicitante, contacto, descripción (resumida), estado, días abierto
- [ ] Las solicitudes se ordenan de más reciente a más antigua por defecto
- [ ] Se muestra un contador de solicitudes totales
- [ ] La tabla es responsive y tiene scroll horizontal en móviles
- [ ] Se puede hacer clic en una fila para ver el detalle

#### Columnas de la Tabla
1. **ID Solicitud** - Con ícono y fecha de creación
2. **Solicitante** - Nombre y RUT
3. **Contacto** - Email y teléfono
4. **Descripción** - Primeros 80 caracteres
5. **Estado** - Badge visual con color
6. **Días Abierto** - Con código de color según antigüedad

---

### HU-08: Filtrar solicitudes por estado de derivación

**ID:** HU-08
**Prioridad:** 🔴 Alta
**Story Points:** 5
**Sprint:** 2
**Estado:** ✅ Implementada

#### Descripción
**Como** funcionario,
**quiero** filtrar las solicitudes por estado (Todas, Pendiente por derivar, Derivadas),
**para** enfocarme en las que requieren mi atención inmediata.

#### Criterios de Aceptación
- [ ] Hay tres botones de filtro visibles: "Todas", "Pendiente por derivar", "Derivadas"
- [ ] "Pendiente por derivar" muestra solicitudes sin unidad técnica asignada
- [ ] "Derivadas" muestra solicitudes con unidad técnica asignada
- [ ] El filtro activo se resalta visualmente
- [ ] El contador se actualiza según el filtro aplicado
- [ ] Los filtros se mantienen al recargar la página (localStorage)

#### Estados de Derivación

| Estado | Descripción | Badge Color |
|--------|-------------|-------------|
| **Pendiente** | Sin unidad técnica asignada | 🔴 Rojo |
| **Derivado** | Asignado a una unidad técnica | 🟣 Púrpura |
| **En Ejecución** | La unidad técnica está trabajando | 🟠 Naranja |
| **Finalizado** | Completado por unidad técnica | 🟢 Verde |
| **Rechazado** | Rechazado por unidad técnica | 🔴 Rojo |

---

### HU-09: Ver detalle completo de una solicitud

**ID:** HU-09
**Prioridad:** 🔴 Alta
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** funcionario,
**quiero** hacer clic en una solicitud para ver todos sus detalles,
**para** analizar el caso completo antes de asignarlo.

#### Criterios de Aceptación
- [ ] Se abre un modal con todos los detalles de la solicitud
- [ ] Se muestra: nombre, nombre social, RUT, email, teléfono, dirección, descripción completa
- [ ] Se muestra el archivo adjunto si existe (con botón de descarga)
- [ ] Se muestra el estado actual y fecha de creación
- [ ] Se muestra días transcurridos desde la creación
- [ ] El modal se puede cerrar con X, botón cancelar o tecla ESC
- [ ] El modal no se cierra al hacer clic dentro del contenido

---

### HU-10: Asignar solicitud a unidad técnica

**ID:** HU-10
**Prioridad:** 🔴 Alta
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** funcionario,
**quiero** asignar una solicitud a una unidad técnica específica,
**para** que el equipo correspondiente se haga cargo del caso.

#### Criterios de Aceptación
- [ ] Hay un selector (dropdown) con las unidades técnicas disponibles
- [ ] Las unidades incluyen:
  - Desarrollo Económico
  - DAT (Dirección de Asesoría Técnica)
  - Parques y Jardines
  - Alumbrado Público
  - Fiscalización
  - Tránsito
  - Patentes Comerciales
- [ ] Al guardar, la asignación se refleja inmediatamente en la tabla
- [ ] El badge de estado se actualiza para mostrar "Derivado a: [Unidad]"
- [ ] Se registra timestamp de la derivación
- [ ] Se puede reasignar a otra unidad si fue un error

#### Unidades Técnicas del Sistema

```javascript
const unidadesTecnicas = [
    { codigo: 'desarrollo-economico', nombre: 'Desarrollo Económico' },
    { codigo: 'dat', nombre: 'DAT' },
    { codigo: 'parques-jardines', nombre: 'Parques y Jardines' },
    { codigo: 'alumbrado-publico', nombre: 'Alumbrado Público' },
    { codigo: 'fiscalizacion', nombre: 'Fiscalización' },
    { codigo: 'transito', nombre: 'Tránsito' },
    { codigo: 'patentes-comerciales', nombre: 'Patentes Comerciales' }
];
```

---

### HU-11: Cambiar estado de solicitud

**ID:** HU-11
**Prioridad:** 🟡 Media
**Story Points:** 3
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** funcionario,
**quiero** cambiar el estado de una solicitud (Pendiente, Revisión, Finalizada),
**para** reflejar el avance en su gestión.

#### Criterios de Aceptación
- [ ] Hay botones para cambiar estado según el estado actual
- [ ] Flujo de estados:
  - Pendiente → "Revisar" → Revisión
  - Revisión → "Finalizar" → Finalizada
- [ ] Los badges de estado se actualizan automáticamente
- [ ] No se pueden revertir estados (flujo unidireccional)
- [ ] Se registra timestamp de cada cambio de estado

#### Diagrama de Estados

```
┌───────────┐    [Revisar]    ┌──────────┐    [Finalizar]    ┌────────────┐
│ Pendiente │ ──────────────> │ Revisión │ ───────────────> │ Finalizada │
└───────────┘                 └──────────┘                   └────────────┘
```

---

### HU-12: Buscar solicitudes por ID o nombre

**ID:** HU-12
**Prioridad:** 🟡 Media
**Story Points:** 5
**Sprint:** 2
**Estado:** 🔄 En Progreso

#### Descripción
**Como** funcionario,
**quiero** buscar solicitudes por ID o nombre del solicitante,
**para** encontrar rápidamente casos específicos.

#### Criterios de Aceptación
- [ ] Hay un campo de búsqueda visible en la vista de funcionario
- [ ] La búsqueda filtra en tiempo real mientras se escribe
- [ ] Se busca tanto en ID como en nombre del solicitante
- [ ] Se busca también en RUT del solicitante
- [ ] Se muestra un mensaje si no hay resultados: "No se encontraron solicitudes"
- [ ] Se puede limpiar la búsqueda con un botón X
- [ ] La búsqueda ignora mayúsculas/minúsculas

#### Implementación Sugerida
```javascript
function buscarSolicitudes(query) {
    const queryLower = query.toLowerCase().trim();
    return solicitudes.filter(s =>
        s.id.toLowerCase().includes(queryLower) ||
        s.nombre.toLowerCase().includes(queryLower) ||
        s.rut.replace(/\./g, '').replace(/-/g, '').includes(queryLower)
    );
}
```

---

## Épica 3: Gestión de Solicitudes por Unidad Técnica

**Objetivo:** Como miembro de una unidad técnica, quiero gestionar y resolver las solicitudes asignadas a mi departamento.

**Valor de Negocio:** Empoderar a las unidades técnicas para que gestionen su trabajo de forma autónoma, mejorando los tiempos de respuesta.

---

### HU-13: Ver solicitudes asignadas a mi unidad

**ID:** HU-13
**Prioridad:** 🔴 Alta
**Story Points:** 8
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** miembro de una unidad técnica (ej: Fiscalización),
**quiero** ver solo las solicitudes asignadas a mi unidad,
**para** enfocarme en los casos que debo resolver.

#### Criterios de Aceptación
- [ ] La vista muestra solo solicitudes de mi unidad técnica
- [ ] La tabla tiene la misma estructura que la vista funcionario
- [ ] El título indica claramente la unidad (ej: "Bandeja de Entrada - Fiscalización")
- [ ] Se muestra un contador de solicitudes asignadas
- [ ] Las solicitudes están ordenadas por antigüedad (más antiguas primero)
- [ ] Se resaltan solicitudes con más de 7 días de antigüedad

#### Acceso por Unidad Técnica

Cada unidad técnica tiene su propia vista filtrada:

- **Fiscalización:** `/bandeja/fiscalizacion`
- **DAT:** `/bandeja/dat`
- **Parques y Jardines:** `/bandeja/parques-jardines`
- etc.

---

### HU-14: Revisar y gestionar solicitudes

**ID:** HU-14
**Prioridad:** 🔴 Alta
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** miembro de unidad técnica,
**quiero** cambiar el estado de las solicitudes de mi unidad,
**para** reflejar el progreso de mi trabajo.

#### Criterios de Aceptación
- [ ] Puedo cambiar estados: En Ejecución, Finalizado, Rechazado
- [ ] Los botones de acción funcionan de la misma manera que para funcionarios
- [ ] Puedo ver el detalle completo haciendo clic en la fila
- [ ] Los cambios se reflejan inmediatamente en la vista
- [ ] Se registra quién y cuándo hizo cada cambio

#### Estados Específicos de Unidad Técnica

| Estado | Descripción | Acción siguiente |
|--------|-------------|------------------|
| **Derivado** | Recién asignado | → Iniciar trabajo |
| **En Ejecución** | En proceso de resolución | → Finalizar o Rechazar |
| **Finalizado** | Caso resuelto exitosamente | N/A (estado final) |
| **Rechazado** | No corresponde a esta unidad | → Reasignar (funcionario) |

---

### HU-15: Agregar notas internas a solicitudes

**ID:** HU-15
**Prioridad:** 🟡 Media
**Story Points:** 8
**Sprint:** 2
**Estado:** 🔄 En Progreso

#### Descripción
**Como** miembro de unidad técnica,
**quiero** agregar notas internas a una solicitud,
**para** documentar avances o comentarios para mi equipo.

#### Criterios de Aceptación
- [ ] Hay un campo de texto en el detalle para agregar notas
- [ ] Las notas se guardan con timestamp y usuario que la creó
- [ ] Las notas son visibles solo para funcionarios y unidades técnicas (no para ciudadanos)
- [ ] Se puede ver el historial completo de notas
- [ ] Las notas se ordenan cronológicamente (más reciente arriba)
- [ ] Se puede editar o eliminar notas propias dentro de 24 horas
- [ ] Se notifica al equipo cuando hay una nueva nota

#### Estructura de Nota

```javascript
{
    id: 'nota-001',
    solicitudId: '251112-042',
    autor: 'Juan Pérez (Fiscalización)',
    timestamp: '2025-11-12T15:30:00Z',
    contenido: 'Se realizó inspección en terreno. Se detectó...',
    editada: false,
    fechaEdicion: null
}
```

---

### HU-16: Contactar al ciudadano desde la plataforma

**ID:** HU-16
**Prioridad:** 🟢 Baja
**Story Points:** 13
**Sprint:** 3
**Estado:** 📅 Planeada

#### Descripción
**Como** miembro de unidad técnica,
**quiero** enviar un mensaje o email al ciudadano desde la plataforma,
**para** solicitar información adicional o notificar sobre el avance.

#### Criterios de Aceptación
- [ ] Hay un botón "Contactar Ciudadano" en el detalle de la solicitud
- [ ] Se abre un formulario para escribir el mensaje
- [ ] El formulario incluye: asunto, mensaje, opción de adjuntar archivo
- [ ] El mensaje se envía al email registrado del ciudadano
- [ ] Se guarda un registro completo de la comunicación
- [ ] El ciudadano recibe el email con formato profesional
- [ ] El email incluye el número de solicitud y un link para responder
- [ ] Las respuestas del ciudadano se vinculan automáticamente a la solicitud

#### Plantillas de Email Sugeridas

1. **Solicitud de información adicional**
2. **Notificación de avance**
3. **Notificación de finalización**
4. **Solicitud de aclaración**

---

## Épica 4: Características Generales del Sistema

**Objetivo:** Proporcionar funcionalidades transversales que mejoren la experiencia de todos los usuarios.

**Valor de Negocio:** Mejorar usabilidad, accesibilidad y satisfacción general del sistema.

---

### HU-17: Cambiar entre tema claro y oscuro

**ID:** HU-17
**Prioridad:** 🟢 Baja
**Story Points:** 5
**Sprint:** 1
**Estado:** ✅ Implementada

#### Descripción
**Como** usuario del sistema,
**quiero** cambiar entre tema claro y oscuro,
**para** usar la aplicación cómodamente según mis preferencias visuales.

#### Criterios de Aceptación
- [ ] Hay un botón "Tema" visible en el header
- [ ] El botón alterna entre ícono de luna (tema oscuro) y sol (tema claro)
- [ ] La preferencia se guarda en localStorage
- [ ] El tema persiste entre sesiones
- [ ] Todos los componentes respetan el tema activo
- [ ] La transición entre temas es suave (animación)
- [ ] Se respeta la preferencia del sistema operativo como tema por defecto

#### Variables CSS de Tema

```css
/* Tema Claro */
--body-bg: #ffffff;
--card-bg: #f8fafc;
--text-primary: #111827;
--text-secondary: #6b7280;

/* Tema Oscuro */
--body-bg: #0f172a;
--card-bg: #1e293b;
--text-primary: #f1f5f9;
--text-secondary: #cbd5e1;
```

---

### HU-18: Diseño responsive para móviles

**ID:** HU-18
**Prioridad:** 🟡 Media
**Story Points:** 8
**Sprint:** 2
**Estado:** 🔄 En Progreso

#### Descripción
**Como** usuario del sistema,
**quiero** que la aplicación funcione correctamente en dispositivos móviles,
**para** poder usarla desde cualquier dispositivo.

#### Criterios de Aceptación
- [ ] La aplicación es usable en pantallas desde 320px de ancho
- [ ] El formulario se adapta a pantallas pequeñas (campos apilados verticalmente)
- [ ] Las tablas tienen scroll horizontal en móviles
- [ ] Los botones y elementos interactivos son táctiles (mínimo 44x44px)
- [ ] El modal se adapta correctamente a móviles (fullscreen en pantallas pequeñas)
- [ ] El header es responsive y colapsa el menú en móviles
- [ ] Los textos son legibles sin hacer zoom
- [ ] Las imágenes y logos se escalan apropiadamente

#### Breakpoints del Sistema

```css
/* Mobile First Approach */
/* xs: 320px - 639px */ Default
/* sm: 640px - 767px */ @media (min-width: 640px)
/* md: 768px - 1023px */ @media (min-width: 768px)
/* lg: 1024px - 1279px */ @media (min-width: 1024px)
/* xl: 1280px+ */ @media (min-width: 1280px)
```

---

## Resumen de Implementación

### Por Sprint

#### Sprint 1 (Implementado ✅)
**Objetivo:** MVP - Funcionalidad básica completa

| ID | Historia | Story Points |
|----|----------|--------------|
| HU-01 | Enviar solicitud con información personal | 5 |
| HU-02 | Incluir nombre social | 2 |
| HU-03 | Describir solicitud detalladamente | 3 |
| HU-04 | Adjuntar archivos de respaldo | 5 |
| HU-05 | Recibir número de seguimiento | 3 |
| HU-06 | Ver resumen de solicitud enviada | 2 |
| HU-07 | Ver todas las solicitudes en bandeja | 8 |
| HU-09 | Ver detalle completo de solicitud | 5 |
| HU-10 | Asignar solicitud a unidad técnica | 5 |
| HU-11 | Cambiar estado de solicitud | 3 |
| HU-13 | Ver solicitudes de mi unidad | 8 |
| HU-14 | Revisar y gestionar solicitudes (UT) | 5 |
| HU-17 | Cambiar tema claro/oscuro | 5 |
| **Total** | **13 historias** | **59 pts** |

#### Sprint 2 (En Progreso 🔄)
**Objetivo:** Mejoras de usabilidad y búsqueda

| ID | Historia | Story Points |
|----|----------|--------------|
| HU-08 | Filtrar solicitudes por estado | 5 |
| HU-12 | Buscar solicitudes por ID o nombre | 5 |
| HU-15 | Agregar notas internas | 8 |
| HU-18 | Diseño responsive para móviles | 8 |
| **Total** | **4 historias** | **26 pts** |

#### Sprint 3 (Planeado 📅)
**Objetivo:** Comunicación y notificaciones

| ID | Historia | Story Points |
|----|----------|--------------|
| HU-16 | Contactar ciudadano desde plataforma | 13 |
| HU-19 | Sistema de notificaciones (futura) | TBD |
| HU-20 | Dashboard con estadísticas (futura) | TBD |
| **Total** | **1+ historias** | **13+ pts** |

---

### Por Estado

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Implementada | 12 | 67% |
| 🔄 En Progreso | 3 | 17% |
| 📅 Planeada | 3 | 17% |
| **Total** | **18** | **100%** |

---

### Por Prioridad

| Prioridad | Cantidad | Story Points |
|-----------|----------|--------------|
| 🔴 Alta | 9 | 57 pts |
| 🟡 Media | 5 | 29 pts |
| 🟢 Baja | 4 | 16 pts |
| **Total** | **18** | **102 pts** |

---

### Por Épica

| Épica | Historias | Story Points | Implementadas |
|-------|-----------|--------------|---------------|
| **Épica 1:** Gestión Ciudadana | 6 | 20 pts | 6/6 (100%) |
| **Épica 2:** Gestión Funcionarios | 6 | 31 pts | 4/6 (67%) |
| **Épica 3:** Gestión Unidad Técnica | 4 | 34 pts | 2/4 (50%) |
| **Épica 4:** Sistema General | 2 | 13 pts | 1/2 (50%) |
| **Total** | **18** | **102 pts** | **13/18 (72%)** |

---

## Roadmap y Planificación

### Fase 1: MVP (Completada ✅)
**Duración:** Sprint 1 (2 semanas)
**Story Points:** 59
**Estado:** Completado

**Entregables:**
- ✅ Formulario ciudadano funcional
- ✅ Bandeja de entrada funcionario
- ✅ Bandeja de entrada unidad técnica
- ✅ Sistema de derivación
- ✅ Cambio de estados
- ✅ Modal de detalle
- ✅ Sistema de temas

### Fase 2: Mejoras de Usabilidad (En Curso 🔄)
**Duración:** Sprint 2 (2 semanas)
**Story Points:** 26
**Estado:** En Progreso

**Entregables:**
- 🔄 Filtros avanzados
- 🔄 Búsqueda de solicitudes
- 🔄 Notas internas
- 🔄 Responsive design completo

### Fase 3: Comunicación y Notificaciones (Planeada 📅)
**Duración:** Sprint 3 (2 semanas)
**Story Points:** 13+
**Estado:** Planeado

**Entregables:**
- 📅 Sistema de mensajería
- 📅 Notificaciones por email
- 📅 Dashboard estadístico
- 📅 Reportes y exportación

### Fase 4: Optimización y Escalabilidad (Futura)
**Duración:** TBD
**Estado:** Conceptual

**Entregables:**
- Backend con base de datos
- API REST
- Autenticación y autorización
- Sistema de roles granular
- Integración con sistemas municipales existentes
- App móvil nativa (opcional)

---

## Historias Futuras (Backlog)

### HU-19: Sistema de notificaciones push
**Prioridad:** Media
**Story Points:** 13

Implementar notificaciones en tiempo real para eventos importantes (nueva solicitud, cambio de estado, mensaje recibido).

### HU-20: Dashboard con estadísticas
**Prioridad:** Media
**Story Points:** 8

Panel con gráficos y métricas: solicitudes por día, tiempos de respuesta, distribución por unidad técnica, etc.

### HU-21: Exportar reportes a PDF/Excel
**Prioridad:** Baja
**Story Points:** 8

Permitir exportar listados de solicitudes y reportes a formatos PDF y Excel.

### HU-22: Historial de cambios (Audit Log)
**Prioridad:** Media
**Story Points:** 5

Registro completo de todos los cambios realizados en cada solicitud (quién, cuándo, qué).

### HU-23: Sistema de permisos granular
**Prioridad:** Alta
**Story Points:** 13

Definir roles y permisos específicos para cada tipo de usuario y acción.

### HU-24: Formularios dinámicos por tipo de solicitud
**Prioridad:** Media
**Story Points:** 13

Diferentes formularios según el tipo de solicitud (Parques requiere campos específicos diferentes a Fiscalización).

### HU-25: Integración con sistema de geolocalización
**Prioridad:** Baja
**Story Points:** 13

Permitir marcar ubicación exacta en mapa para solicitudes que lo requieran.

---

## Anexos

### Anexo A: Glosario de Términos

| Término | Definición |
|---------|------------|
| **SECMUN** | Secretaría Comunal - Oficina de Partes central |
| **Unidad Técnica** | Departamento especializado que resuelve solicitudes |
| **Derivación** | Acción de asignar una solicitud a una unidad técnica |
| **Story Point** | Unidad de medida de complejidad (escala Fibonacci) |
| **Sprint** | Período de 2 semanas de desarrollo |
| **MVP** | Minimum Viable Product - Producto Mínimo Viable |
| **Badge** | Etiqueta visual que indica estado |

### Anexo B: Criterios de Priorización

La prioridad de cada historia se determinó según:

1. **Valor para el usuario** (30%)
2. **Impacto en flujo de trabajo** (30%)
3. **Dependencias técnicas** (20%)
4. **Esfuerzo estimado** (20%)

### Anexo C: Definición de Hecho (DoD) Global

Para considerar una historia como "Completada", debe cumplir:

- ✅ Código implementado y funcionando
- ✅ Todos los criterios de aceptación verificados
- ✅ Tests unitarios pasando (cuando aplique)
- ✅ Revisión de código aprobada
- ✅ Documentación actualizada
- ✅ Probado en múltiples navegadores
- ✅ Responsive design verificado
- ✅ Sin bugs críticos pendientes

---

## Contacto y Actualizaciones

**Product Owner:** [Nombre]
**Scrum Master:** [Nombre]
**Equipo de Desarrollo:** [Nombres]

**Última actualización:** 12 de Noviembre, 2025
**Versión del documento:** 1.0

---

*Este documento es un artefacto vivo y se actualiza regularmente conforme avanza el proyecto.*
