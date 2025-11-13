# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Oficina de Partes Digital** - A 100% frontend prototype for a municipal digital service desk system for Valparaíso Municipality. This is a proof-of-concept built entirely with vanilla HTML, CSS (Tailwind), and JavaScript with no backend or database (uses localStorage for persistence).

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS 3.3.0 (CDN), Font Awesome 6.4.0
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Storage**: localStorage for data persistence
- **Build Tools**: None required - can run directly in browser

## Running the Application

```bash
# Option 1: Open directly
# Just open index.html in a browser

# Option 2: With local server (recommended for development)
python -m http.server 8000
# OR
npx http-server
```

Then navigate to `http://localhost:8000`

## Architecture & Code Structure

### Main Application Files

- **index.html** - Single page application with 5 different views (tabs)
- **js/app.js** - Main application logic (~1900 lines)
- **js/data-service.js** - (if exists) Data service abstraction
- **data/solicitudes.json** - Sample data for testing

### Key Views/Tabs

The application has 5 distinct views accessed via tabs:

1. **Vista Ciudadano** (`#vista-ciudadano`) - Citizen form to submit requests
2. **Vista Funcionario Form** (`#vista-funcionario-form`) - Staff form to submit requests on behalf of citizens
3. **Vista Funcionario Específico** (`#vista-funcionario-especifico`) - Staff form with additional fields (e.g., for Parques y Jardines)
4. **Vista Funcionario** (`#vista-funcionario`) - Staff dashboard to manage all requests
5. **Vista Unidad Técnica** (`#vista-unidad-tecnica`) - Technical unit dashboard (e.g., Fiscalización)

### Data Model

Requests (solicitudes) are stored in localStorage with this structure:

```javascript
{
    id: '251112-042',           // Format: YYMMDD-XXX
    nombre: 'Full Name',
    nombreSocial: 'Social Name', // Optional
    rut: '12.345.678-9',
    fechaNacimiento: '1990-01-01',
    genero: 'masculino|femenino|otro',
    email: 'email@example.com',
    email2: 'secondary@example.com', // Optional
    telefono: '+56912345678',
    telefono2: '+56987654321',  // Optional
    direccion: 'Address',
    titulo: 'Request Title',
    descripcion: 'Detailed description',
    cerro: 'cerro-alegre',      // Sector/Hill in Valparaíso
    ubicacionEspecifica: 'Specific location',
    archivoNombre: 'file.pdf',  // Optional
    estado: 'pendiente',        // pendiente | revision | finalizada
    unidadTecnica: 'fiscalizacion', // Target department
    estadoUnidadTecnica: 'en-ejecucion', // en-ejecucion | finalizado | rechazado
    datosParquesJardines: {     // Optional - only for Parques y Jardines
        tipoTerreno: 'privado|publico',
        tipoVegetacion: 'arbol|arbusto|pasto|maleza',
        requiereCamion: 'si|no'
    },
    fechaCreacion: '2025-11-12T10:30:00Z',
    fechaActualizacionUT: '2025-11-12T15:00:00Z'
}
```

### Main Application Object (APP)

Located at the top of `js/app.js`:

```javascript
const APP = {
    solicitudes: [],
    cargarSolicitudes(),      // Load from localStorage
    guardarSolicitudes(),     // Save to localStorage
    generarId(),              // Generate unique ID
    agregarSolicitud(datos),  // Add new request
    asignarUnidadTecnica(id, unidad),
    cambiarEstado(id, nuevoEstado),
    cambiarEstadoUnidadTecnica(id, estadoUT),
    obtenerEstadisticas()
}
```

### Key Modules/Objects

The application is organized into several module objects:

- **TabManager** - Handles view switching
- **EstadosUtil** - Utility for status badges and date calculations
- **Validaciones** - Form validation functions
- **FormularioCiudadano** - Citizen form logic
- **FormularioFuncionario** - Staff form logic
- **FormularioFuncionarioEspecifico** - Staff form with extra fields
- **FuncionarioView** - Staff dashboard with filtering
- **UnidadTecnicaView** - Technical unit dashboard
- **ModalDetalle** - Detail modal for viewing/editing requests
- **DatosDeEjemplo** - Sample data generator

### Technical Units (Unidades Técnicas)

Available departments for request routing:

- `desarrollo-economico` - Desarrollo Económico
- `dat` - DAT (Dirección de Asesoría Técnica)
- `parques-jardines` - Parques y Jardines
- `alumbrado-publico` - Alumbrado Público
- `fiscalizacion` - Fiscalización
- `transito` - Tránsito
- `patentes-comerciales` - Patentes Comerciales

## Design System

This project follows the **MuniValpo Digital Design System**. See `VISUAL_DESIGN_SYSTEM.md` for complete details.

### Key Design Principles

1. **Minimalism** - Clean design without excessive animations
2. **Consistency** - All components follow same visual structure
3. **Themes** - Automatic dark/light mode support via CSS variables
4. **Responsive** - Mobile-first approach
5. **Iconography** - Consistent badge icons: `w-10 h-10 bg-muni-blue rounded-lg`

### Color System

**Corporate Colors:**
```css
--muni-blue: #294589;        /* Primary blue */
--muni-yellow: #ffdc04;      /* Accent yellow */
```

**Theme Variables:**
All colors use CSS variables that change based on theme:
```css
--body-bg, --card-bg, --section-bg
--text-primary, --text-secondary, --text-muted
--input-bg, --input-border, --input-text
--badge-success-bg, --badge-error-bg, etc.
```

### Status Badges

Status badges use specific CSS classes:

- `.badge-derivacion-pendiente` - Pending derivation (red)
- `.badge-derivado` - Derived to unit (purple)
- `.badge-revision` - In review (orange)
- `.badge-finalizada` - Completed (green)
- `.badge-ut-en-ejecucion` - Unit executing (orange)
- `.badge-ut-finalizado` - Unit finished (green)
- `.badge-ut-rechazado` - Unit rejected (red)

## Common Development Tasks

### Adding a New Field to the Form

1. Add HTML input in `index.html` (search for similar fields)
2. Add validation in `FormularioCiudadano.validarCampo()` or respective form object
3. Add field to data collection in `enviarSolicitud()` method
4. Update modal display in `ModalDetalle.abrir()` if needed

### Adding a New Technical Unit

1. Add option to `<select id="modal-unidad-tecnica">` in HTML
2. Add mapping in `EstadosUtil.unidadesNombres` object
3. Update any filtering logic if needed

### Creating Sample Data

Sample data is auto-loaded from `DatosDeEjemplo.cargarSolicitudesDeEjemplo()` when fewer than 10 requests exist in localStorage.

To force reload sample data:
```javascript
// In browser console:
localStorage.removeItem('solicitudes_op');
location.reload();
```

### Debugging

**View localStorage data:**
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('solicitudes_op')));
```

**Check current theme:**
```javascript
console.log(document.documentElement.classList.contains('theme-light') ? 'Light' : 'Dark');
```

**View all requests:**
```javascript
console.log(APP.solicitudes);
```

## Important Implementation Details

### ID Generation

IDs use format `YYMMDD-XXX`:
- First 6 digits: Year (2), Month (2), Day (2)
- Last 3 digits: Random number (001-999)
- Example: `251112-042` = November 12, 2025, request #42

### State Management

**Request States (estado):**
- `pendiente` → Initial state
- `revision` → Being reviewed
- `finalizada` → Completed

**Technical Unit States (estadoUnidadTecnica):**
- `en-ejecucion` → Unit is working on it
- `finalizado` → Unit completed work
- `rechazado` → Unit rejected (doesn't correspond to them)

### Filtering in Staff View

The staff view has 3 filters:
- **Todas** - All requests
- **Pendiente por derivar** - Requests without assigned unit
- **Derivadas** - Requests with assigned unit

Filter is managed by `FuncionarioView.filtroActual` and applied in `obtenerSolicitudesFiltradas()`.

### Modal Opening

The detail modal can be opened from two contexts:
- **Funcionario view** - Shows unit assignment selector
- **Unidad Técnica view** - Shows unit state selector

This is controlled by the `origenVista` parameter in `ModalDetalle.abrir(solicitudId, origenVista)`.

### Special Logic: Parques y Jardines

When assigning to `parques-jardines` unit, the modal shows 3 additional required questions:
- Tipo de terreno (privado/público)
- Tipo de vegetación (árbol/arbusto/pasto/maleza)
- Requiere camión (sí/no)

This is handled by `ModalDetalle.manejarCambioUnidadTecnica()`.

## File Upload Simulation

File upload is simulated (frontend only):
- Input accepts files up to 5MB
- File name is stored in `archivoNombre` field
- Actual file content is NOT stored (would need backend)
- Validation is in `actualizarNombreArchivo()` function

## Limitations

This is a **prototype** with the following limitations:

- No real backend or database
- Data only in browser localStorage (lost if cleared)
- No authentication or user management
- No actual email sending
- No real file upload/storage
- Single browser session (no data sync)
- No search functionality (yet)
- No pagination (all data loaded at once)

## Testing Workflow

1. **Test Citizen Form**: Submit a request via "Vista Ciudadano"
2. **Test Staff View**: Switch to "Vista Funcionario" to see the request
3. **Test Assignment**: Click row, assign to a technical unit
4. **Test Unit View**: Switch to "Vista Unidad Técnica" to see assigned requests
5. **Test State Changes**: Update status from unit view
6. **Test Theme**: Toggle light/dark mode with theme button

## User Stories Reference

See `HISTORIAS_DE_USUARIO.md` for complete user stories documentation:
- 18 total user stories across 4 epics
- Sprint-based organization
- Acceptance criteria for each story

## Migration Guides

Available migration documentation:
- `GUIA_MIGRACION.md` - General migration guide
- `GUIA_MIGRACION_MONGODB.md` - MongoDB migration guide
- `GUIA_USO_JSON.md` - JSON usage guide

## Key Validation Rules

- **RUT**: Chilean format with optional dots and dash (12.345.678-9)
- **Email**: Standard email format
- **Phone**: 8-12 digits (accepts +56 prefix)
- **Name fields**: Minimum 2 characters
- **Description**: Minimum 10 characters
- **Title**: Minimum 5 characters

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- All data is loaded into memory on page load
- No lazy loading or pagination (suitable for ~100-500 requests)
- For production with thousands of requests, backend pagination needed

## Security Considerations (for future backend)

When implementing backend:
- Validate ALL inputs server-side
- Sanitize HTML to prevent XSS
- Implement CAPTCHA on public form
- Add rate limiting
- Scan uploaded files for malware
- Use HTTPS only
- Implement proper authentication/authorization

## Key Functions to Know

**Form Validation:**
```javascript
Validaciones.validarRUT(rut)
Validaciones.validarEmail(email)
Validaciones.validarTelefono(telefono)
```

**State Management:**
```javascript
APP.agregarSolicitud(datos)
APP.asignarUnidadTecnica(id, unidad)
APP.cambiarEstadoUnidadTecnica(id, estado)
```

**View Updates:**
```javascript
FuncionarioView.actualizar()
UnidadTecnicaView.actualizar()
FuncionarioView.renderizarTabla()
```

**Modal Control:**
```javascript
ModalDetalle.abrir(solicitudId, origenVista)
ModalDetalle.cerrar()
```

## Styling Notes

- Use Tailwind utility classes for layout and spacing
- Use CSS variables for all colors (support themes)
- Icons are Font Awesome 6 (via CDN)
- Badge icons are always `w-10 h-10 rounded-lg` with appropriate background
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

## Troubleshooting

**Data not persisting?**
- Check browser localStorage quota
- Check browser console for errors
- Try clearing localStorage and reloading

**Styles not applying?**
- Verify Tailwind CDN is loaded
- Check CSS variable values in browser dev tools
- Verify theme class on `<html>` element

**Modal not opening?**
- Check console for errors
- Verify modal HTML exists in DOM
- Check that `ModalDetalle.init()` was called

**Form validation failing?**
- Check exact validation rules in `FormularioCiudadano.validarCampo()`
- Verify required fields are not empty
- Check format requirements (RUT, email, phone)
