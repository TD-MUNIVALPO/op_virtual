# 📄 Guía de Uso - Modo JSON

Esta guía explica cómo funciona el sistema de datos con archivo JSON para demos y presentaciones.

---

## 🎯 ¿Qué cambió?

Tu aplicación ahora puede cargar datos desde **dos fuentes**:

1. **Archivo JSON** (`data/solicitudes.json`) - Para demos y servidor web
2. **localStorage** - Para desarrollo local

El sistema **detecta automáticamente** cuál usar según cómo abras la aplicación.

---

## 🚀 Cómo Usar

### Opción 1: Desarrollo Local (file://)

Cuando abres `index.html` directamente haciendo doble click:

```
📍 Modo: localStorage (desarrollo local)
✅ Puedes CREAR, EDITAR y ELIMINAR solicitudes
💾 Los datos se guardan en el navegador
```

**Ideal para:** Desarrollo y pruebas locales

---

### Opción 2: Servidor Web (http://)

Cuando usas un servidor web (Live Server, GitHub Pages, etc.):

```
📍 Modo: JSON (servidor)
📖 Los datos se cargan desde data/solicitudes.json
✅ Puedes CONSULTAR solicitudes
⚠️  Las nuevas solicitudes se guardan en localStorage (no en el JSON)
```

**Ideal para:** Demos, presentaciones, compartir con clientes

---

## 🔧 Configuración

### Estructura de Archivos

```
op_virtual/
├── index.html
├── js/
│   ├── app-optimized.js
│   └── data-service.js        ← NUEVO servicio
├── data/
│   └── solicitudes.json        ← NUEVO archivo de datos
└── README.md
```

### Archivo de Datos (data/solicitudes.json)

El archivo JSON contiene un array de solicitudes:

```json
[
  {
    "id": "25-0001",
    "nombre": "Juan Pérez González",
    "rut": "12.345.678-9",
    "email": "juan.perez@email.com",
    "telefono": "+56912345678",
    "descripcion": "Solicitud de ejemplo...",
    "estado": "pendiente",
    "unidadTecnica": "",
    "fechaCreacion": "2024-11-10T10:30:00.000Z"
  }
]
```

---

## 📝 Modificar Datos del JSON

### Método 1: Editar Manualmente

1. Abre `data/solicitudes.json` en un editor
2. Modifica, agrega o elimina solicitudes
3. Guarda el archivo
4. Recarga la página

### Método 2: Exportar desde la App

Si creaste solicitudes en modo localStorage y quieres guardarlas en JSON:

```javascript
// En la consola del navegador (F12)
dataService.exportToJSON(APP.solicitudes);
```

Esto descarga un archivo `solicitudes.json` con todos los datos actuales.

---

## 🎨 Casos de Uso

### Para una DEMO/PRESENTACIÓN

1. **Preparación:**
   - Edita `data/solicitudes.json` con los datos de ejemplo que quieres mostrar
   - Sube el proyecto a GitHub Pages o cualquier servidor

2. **Durante la demo:**
   - Comparte el link: `https://tu-usuario.github.io/op_virtual/`
   - Todos verán los mismos datos del JSON
   - Puedes crear solicitudes de prueba (se guardan en localStorage local)

3. **Ventajas:**
   - ✅ Datos consistentes para todos
   - ✅ No necesitas backend
   - ✅ Gratis (GitHub Pages)
   - ✅ Fácil de compartir

---

### Para DESARROLLO LOCAL

1. **Trabajar normalmente:**
   - Abre `index.html` directamente
   - Crea, edita, elimina solicitudes
   - Todo se guarda en localStorage

2. **Exportar cuando termines:**
   ```javascript
   dataService.exportToJSON(APP.solicitudes);
   ```

3. **Reemplazar el JSON:**
   - Mueve el archivo descargado a `data/solicitudes.json`
   - Ahora esos datos estarán en el servidor

---

## 🔍 Comandos Útiles (Consola del Navegador)

### Ver información del modo actual

```javascript
dataService.getInfo();
```

Respuesta:
```javascript
{
  mode: "json",              // Modo actual
  hasCache: true,            // ¿Tiene datos en cache?
  cacheSize: 14,             // Cantidad de solicitudes
  jsonUrl: "./data/solicitudes.json",
  localStorageKey: "solicitudes_op"
}
```

### Forzar un modo específico

```javascript
// Forzar modo JSON
dataService.setMode('json');
await APP.cargarSolicitudes();

// Forzar modo localStorage
dataService.setMode('localStorage');
await APP.cargarSolicitudes();
```

### Invalidar cache y recargar

```javascript
dataService.invalidateCache();
await APP.cargarSolicitudes();
location.reload();
```

### Exportar datos actuales

```javascript
// Exporta todas las solicitudes a un archivo JSON
dataService.exportToJSON(APP.solicitudes);
```

---

## 🌐 Desplegar en GitHub Pages

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de que todos los archivos estén commiteados
git add .
git commit -m "feat: Sistema de datos con JSON"
git push origin main
```

### Paso 2: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. Click en **Pages** (menú lateral)
4. En **Source**, selecciona **main** branch
5. Click **Save**
6. Espera 1-2 minutos

### Paso 3: Acceder

Tu app estará disponible en:
```
https://tu-usuario.github.io/op_virtual/
```

---

## ⚙️ Configuración Avanzada

### Cambiar la ubicación del JSON

Edita `js/data-service.js`:

```javascript
constructor() {
    this.mode = 'auto';
    this.jsonUrl = './data/solicitudes.json';  // ← Cambia aquí
    // ...
}
```

### Siempre usar JSON (sin detección automática)

Edita `js/data-service.js`:

```javascript
constructor() {
    this.mode = 'json';  // ← En lugar de 'auto'
    // ...
}
```

### Siempre usar localStorage

```javascript
constructor() {
    this.mode = 'localStorage';  // ← En lugar de 'auto'
    // ...
}
```

---

## 🐛 Troubleshooting

### Problema: No carga el JSON

**Error en consola:**
```
❌ Error cargando JSON: Failed to fetch
```

**Soluciones:**
1. Verifica que el archivo exista en `data/solicitudes.json`
2. Verifica la ruta en `data-service.js`
3. Usa un servidor web (no file://)
4. Revisa la consola para más detalles

---

### Problema: Los datos no se guardan

**Comportamiento:**
- Creo una solicitud
- Recargo y desaparece

**Explicación:**
En modo JSON, las nuevas solicitudes se guardan en **localStorage**, no en el archivo JSON (porque el navegador no puede modificar archivos del servidor por seguridad).

**Solución:**
1. Para desarrollo: Usa modo local (file://)
2. Para producción: Exporta y reemplaza el JSON manualmente
3. O mejor: Migra a MongoDB (ver `GUIA_MIGRACION_MONGODB.md`)

---

### Problema: Datos duplicados

**Causa:**
El JSON se cargó y también hay datos en localStorage.

**Solución:**
```javascript
// Limpiar localStorage
localStorage.removeItem('solicitudes_op');
location.reload();
```

---

## 📊 Comparación de Modos

| Característica | localStorage | JSON |
|----------------|-------------|------|
| **Acceso** | Solo tu navegador | Todos (servidor web) |
| **Crear solicitudes** | ✅ Sí | ⚠️ Solo local |
| **Editar datos** | ✅ Sí | ⚠️ Solo local |
| **Persistencia** | Navegador local | Archivo en servidor |
| **Compartible** | ❌ No | ✅ Sí |
| **Ideal para** | Desarrollo | Demos/Presentaciones |

---

## 🎯 Recomendaciones

### Para DEMOS (Opción recomendada):

1. ✅ Usa el sistema JSON actual
2. ✅ Prepara datos de ejemplo en `data/solicitudes.json`
3. ✅ Despliega en GitHub Pages
4. ✅ Comparte el link con clientes/stakeholders

### Para DESARROLLO:

1. ✅ Trabaja en local con file://
2. ✅ Usa localStorage para datos temporales
3. ✅ Exporta cuando necesites datos persistentes

### Para PRODUCCIÓN REAL:

1. ❌ JSON no es suficiente (solo lectura)
2. ✅ Migra a MongoDB (ver `GUIA_MIGRACION_MONGODB.md`)
3. ✅ Implementa backend con Node.js + Express

---

## 💡 Próximos Pasos

### Corto Plazo (Ya implementado)
- ✅ Sistema híbrido JSON + localStorage
- ✅ Detección automática de modo
- ✅ Exportación de datos

### Mediano Plazo (Opcional)
- 🔄 API REST simple con JSON Server
- 🔄 Sistema de autenticación básico

### Largo Plazo (Producción)
- 🔄 Backend con MongoDB
- 🔄 Sistema de usuarios
- 🔄 Upload de archivos real

---

## 📚 Referencias

- [Guía de Migración a MongoDB](./GUIA_MIGRACION_MONGODB.md) - Para pasar a base de datos real
- [GitHub Pages Docs](https://pages.github.com/) - Para despliegue gratuito
- [JSON.org](https://www.json.org/json-es.html) - Especificación de JSON

---

**Última actualización:** 12 de Noviembre, 2025
**Versión:** 1.0
