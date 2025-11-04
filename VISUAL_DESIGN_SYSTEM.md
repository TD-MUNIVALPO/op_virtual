# Sistema de Diseño Visual - MuniValpo Digital

Este documento es una guía completa del sistema de diseño visual del proyecto MuniValpo Digital. Incluye todos los componentes, estilos, convenciones y herramientas necesarias para replicar el look & feel del proyecto en nuevas aplicaciones.

---

## Tabla de Contenidos

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Sistema de Colores](#sistema-de-colores)
4. [Tipografía](#tipografía)
5. [Variables CSS de Temas](#variables-css-de-temas)
6. [Configuración Tailwind](#configuración-tailwind)
7. [Layouts y Estructura](#layouts-y-estructura)
8. [Componentes Reutilizables](#componentes-reutilizables)
9. [Patrones de Diseño](#patrones-de-diseño)
10. [Iconografía](#iconografía)
11. [Estados y Badges](#estados-y-badges)
12. [Formularios](#formularios)
13. [Tablas](#tablas)
14. [Animaciones y Transiciones](#animaciones-y-transiciones)
15. [Sistema de Temas (Claro/Oscuro)](#sistema-de-temas)
16. [Assets y Recursos](#assets-y-recursos)
17. [Herramientas de Desarrollo](#herramientas-de-desarrollo)

---

## Filosofía de Diseño

### Principios Fundamentales

1. **Minimalismo**: Diseño limpio sin animaciones excesivas ni efectos llamativos
2. **Consistencia**: Todos los componentes siguen la misma estructura visual
3. **Temas**: Soporte automático para modo claro y oscuro usando variables CSS
4. **Responsive**: Adaptable a diferentes tamaños de pantalla
5. **Iconografía uniforme**: Todos los iconos de badge usan `w-10 h-10 bg-muni-blue rounded-lg`
6. **Accesibilidad**: Contraste adecuado y elementos semánticos

### Restricciones de Diseño

**NO usar:**
- Gradientes (excepto en casos específicos ya definidos)
- Animaciones como fadeIn, slideIn, etc.
- Sombras elaboradas más allá de las variables del tema
- Efectos visuales excesivos

**SÍ usar:**
- Tailwind CSS para utilidades
- Font Awesome 6 para iconos
- Variables CSS del tema para todos los colores
- Transiciones sutiles (`transition-opacity hover:opacity-75`)

---

## Stack Tecnológico

### Framework y Herramientas

- **Backend**: ASP.NET Core Razor Pages
- **CSS Framework**: Tailwind CSS 3.3.0
- **Iconos**: Font Awesome 6.4.0
- **JavaScript**: Alpine.js 3.x (para interactividad)
- **Build Tools**:
  - Vite 7.1.5 (bundler)
  - PostCSS 8.4.0
  - Autoprefixer 10.4.0

### Dependencias NPM

```json
{
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "vite": "^7.1.5"
  }
}
```

---

## Sistema de Colores

### Colores Corporativos (Marca)

```css
/* Azul Municipal - Color principal */
--muni-blue: #294589;           /* Azul corporativo principal */
--muni-blue-dark: #1e3a72;      /* Azul oscuro para hover */
--muni-blue-darkest: #0b2447;   /* Azul más oscuro */
--muni-blue-light: #60a5fa;     /* Azul claro para acentos */

/* Amarillo Municipal - Color secundario */
--muni-yellow: #ffdc04;         /* Amarillo vibrante para acentos */
```

### Paleta de Colores de Iconos

Colores recomendados para badges de headers de secciones:

```css
/* Estadísticas */
--icon-purple: #9333ea;         /* purple-600 */

/* Módulos */
--icon-green: #10b981;          /* emerald-500 */

/* Accesos Rápidos */
--icon-amber: #f59e0b;          /* amber-500 */

/* Filtros y Tablas */
--icon-blue: #294589;           /* bg-muni-blue */

/* Información */
--icon-cyan: #06b6d4;           /* cyan-500 */
```

### Paleta Completa de Colores Funcionales

El proyecto usa una paleta extensa de colores para diferentes contextos:

**Rojos** (Errores, Peligro, Inactivo)
- `#ef4444` (red-500)
- `#b91c1c` (red-800)
- `#fca5a5` (red-300) - tema oscuro
- `#991b1b` (red-800) - tema claro

**Verdes** (Éxito, Activo, Confirmación)
- `#22c55e` (green-500)
- `#15803d` (green-700)
- `#86efac` (green-300) - tema oscuro
- `#166534` (green-800) - tema claro

**Azules** (Primarios, Información)
- `#3b82f6` (blue-500)
- `#1d4ed8` (blue-700)
- `#93c5fd` (blue-300) - tema oscuro
- `#1e40af` (blue-800) - tema claro

**Amarillos/Ámbar** (Advertencia, En Proceso)
- `#f59e0b` (amber-500)
- `#d97706` (amber-600)
- `#fcd34d` (yellow-300) - tema oscuro
- `#a16207` (yellow-700) - tema claro

**Púrpuras** (Pendiente, Especial)
- `#a855f7` (purple-500)
- `#7e22ce` (purple-700)
- `#d8b4fe` (purple-300) - tema oscuro
- `#6b21a8` (purple-800) - tema claro

---

## Tipografía

### Fuentes

```css
/* Sistema de fuentes por defecto */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
  font-size: 14px; /* Base en mobile */
  line-height: 1.5;
}

@media (min-width: 768px) {
  html {
    font-size: 16px; /* Base en desktop */
  }
}
```

### Jerarquía Tipográfica

```html
<!-- Headers de página -->
<h1 class="text-2xl font-bold">Título Principal</h1>
<h2 class="text-xl font-semibold">Subtítulo</h2>
<h3 class="text-lg font-semibold">Sección</h3>

<!-- Headers de componentes -->
<h3 class="text-sm font-semibold">Título de Card</h3>
<p class="text-xs">Descripción de Card</p>

<!-- Textos generales -->
<p class="text-sm" style="color: var(--text-secondary);">Texto secundario</p>
<span class="text-xs font-medium">Label pequeño</span>
```

### Convenciones de Títulos

Los headers de página usan un formato tricolor:

```cshtml
@{
    ViewData["BlackTitle"] = "Parte en Negro";
    ViewData["YellowTitle"] = "Parte en Amarillo";
    ViewData["BlueTitle"] = "Parte en Azul";
}

<!-- Se renderiza como: -->
<h2>
    <span style="color: var(--text-primary);">Parte en Negro</span>
    <span class="text-muni-yellow">Parte en Amarillo</span>
    <span class="text-muni-blue">Parte en Azul</span>
</h2>
```

---

## Variables CSS de Temas

El sistema usa un archivo central `_theme-vars.css` que define todas las variables para modo oscuro (default) y modo claro.

### Estructura Base

```css
:root {
    /* Variables para tema oscuro (default) */
}

html.theme-light {
    /* Overrides para tema claro */
}
```

### Variables Principales

#### Fondos

```css
/* TEMA OSCURO (default) */
--body-bg: #0f172a;                 /* Fondo body (slate-900) */
--card-bg: #1e293b;                 /* Cards/tarjetas (slate-800) */
--section-bg: #334155;              /* Secciones internas (slate-700) */

/* TEMA CLARO */
html.theme-light {
    --body-bg: #ffffff;             /* Fondo blanco */
    --card-bg: #f8fafc;             /* Cards gris claro (slate-50) */
    --section-bg: #f1f5f9;          /* Secciones gris claro (slate-100) */
}
```

#### Textos

```css
/* TEMA OSCURO */
--text-primary: #f1f5f9;            /* Texto principal (slate-100) */
--text-secondary: #94a3b8;          /* Texto secundario (slate-400) */
--text-muted: #64748b;              /* Texto atenuado (slate-500) */

/* TEMA CLARO */
html.theme-light {
    --text-primary: #111827;        /* Texto oscuro (gray-900) */
    --text-secondary: #6b7280;      /* Texto gris (gray-500) */
    --text-muted: #9ca3af;          /* Texto claro (gray-400) */
}
```

#### Bordes

```css
/* TEMA OSCURO */
--border-card: rgba(148,163,184,0.2);      /* Bordes de cards */
--border-subtle: rgba(100,116,139,0.25);   /* Bordes sutiles */

/* TEMA CLARO */
html.theme-light {
    --border-card: rgba(148,163,184,0.2);
    --border-subtle: rgba(148,163,184,0.35);
}
```

#### Tablas

```css
/* TEMA OSCURO */
--table-header-bg: rgba(100, 116, 139, 0.1);
--table-header-text: #94a3b8;
--table-row-hover: rgba(100, 116, 139, 0.05);
--table-border: rgba(100, 116, 139, 0.2);

/* TEMA CLARO */
html.theme-light {
    --table-header-bg: #f8fafc;
    --table-header-text: #6b7280;
    --table-row-hover: #f9fafb;
    --table-border: #e5e7eb;
}
```

#### Formularios

```css
/* TEMA OSCURO */
--input-bg: #1e293b;
--input-border: #334155;
--input-text: #e2e8f0;
--input-placeholder: #64748b;
--input-focus-border: #3b82f6;
--input-focus-ring: rgba(59, 130, 246, 0.3);

/* TEMA CLARO */
html.theme-light {
    --input-bg: #ffffff;
    --input-border: #d1d5db;
    --input-text: #111827;
    --input-placeholder: #9ca3af;
    --input-focus-border: #3b82f6;
    --input-focus-ring: rgba(59, 130, 246, 0.3);
}
```

#### Badges de Estado

```css
/* TEMA OSCURO */
--badge-success-bg: rgba(34, 197, 94, 0.2);
--badge-success-text: #86efac;
--badge-warning-bg: rgba(251, 191, 36, 0.2);
--badge-warning-text: #fcd34d;
--badge-error-bg: rgba(239, 68, 68, 0.2);
--badge-error-text: #fca5a5;
--badge-info-bg: rgba(59, 130, 246, 0.2);
--badge-info-text: #93c5fd;

/* TEMA CLARO */
html.theme-light {
    --badge-success-bg: #d1fae5;
    --badge-success-text: #166534;
    --badge-warning-bg: #fef3c7;
    --badge-warning-text: #a16207;
    --badge-error-bg: #fee2e2;
    --badge-error-text: #991b1b;
    --badge-info-bg: #dbeafe;
    --badge-info-text: #1e40af;
}
```

#### Alertas

```css
/* TEMA OSCURO */
--alert-success-bg: rgba(34, 197, 94, 0.15);
--alert-success-border: rgba(34, 197, 94, 0.3);
--alert-success-text: #86efac;
--alert-error-bg: rgba(239, 68, 68, 0.15);
--alert-error-border: rgba(239, 68, 68, 0.3);
--alert-error-text: #fca5a5;

/* TEMA CLARO */
html.theme-light {
    --alert-success-bg: #f0fdf4;
    --alert-success-border: #86efac;
    --alert-success-text: #166534;
    --alert-error-bg: #fef2f2;
    --alert-error-border: #fca5a5;
    --alert-error-text: #991b1b;
}
```

#### Botones

```css
/* Ambos temas usan los mismos colores vibrantes */
--btn-primary-bg: #3b82f6;
--btn-primary-hover: #2563eb;
--btn-secondary-bg: #64748b;
--btn-secondary-hover: #475569;
--btn-success-bg: #22c55e;
--btn-success-hover: #16a34a;
--btn-danger-bg: #ef4444;
--btn-danger-hover: #dc2626;
```

### Sombras

```css
/* TEMA OSCURO */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);

/* TEMA CLARO */
html.theme-light {
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}
```

---

## Configuración Tailwind

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './Pages/**/*.cshtml',
    './wwwroot/**/*.js',
    './wwwroot/**/*.css'
  ],
  theme: {
    extend: {
      colors: {
        'muni-blue': '#294589',
        'muni-blue-dark': '#1e3a72',
        'muni-blue-darkest': '#0b2447',
        'muni-blue-light': '#60a5fa',
        'muni-yellow': '#ffdc04',
        'secondary': {
          500: '#6c757d',
          600: '#5a6268'
        }
      }
    },
  },
  plugins: [],
}
```

### wwwroot/css/input.css

```css
/* Importar variables de tema antes de Tailwind */
@import '../_theme-vars.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados municipales */
@layer components {
  .btn-primary {
    @apply bg-muni-blue hover:bg-muni-blue-dark text-white px-4 py-2 rounded-md font-medium transition duration-150 ease-in-out;
  }

  .btn-secondary {
    @apply bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md font-medium transition duration-150 ease-in-out;
  }

  .form-input-muni {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-muni-blue focus:border-transparent transition-all;
  }

  .form-label-muni {
    @apply block text-sm font-medium text-muni-blue-dark mb-2;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}

@layer base {
  body {
    @apply font-sans antialiased;
  }

  input:focus {
    --tw-ring-color: #294589;
  }

  html {
    scroll-behavior: smooth;
  }
}
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "tailwind:build": "tailwindcss -i ./wwwroot/css/input.css -o ./wwwroot/css/output.css --minify",
    "tailwind:watch": "tailwindcss -i ./wwwroot/css/input.css -o ./wwwroot/css/output.css --watch"
  }
}
```

---

## Layouts y Estructura

### Layout Principal con Sidebar

El proyecto usa un layout con sidebar fijo y contenido flexible.

#### Estructura HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - Muni-Digital</title>
    <link rel="stylesheet" href="~/_theme-vars.css" />
    <link rel="stylesheet" href="~/css/output.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <style>
        :root { --sidebar-w: 16rem; }
        body { background: var(--body-bg); }
    </style>
</head>
<body class="min-h-screen flex">
    <!-- Sidebar -->
    @await Html.PartialAsync("Shared/Layouts/_Sidebar")

    <!-- Contenido Principal -->
    <div id="content-wrapper" class="flex-1 flex flex-col transition-all duration-300"
         style="margin-left: var(--sidebar-w);">

        <!-- Header del Módulo -->
        @await Html.PartialAsync("/Pages/Shared/Components/_ModuleHeader.cshtml")

        <!-- Main Content -->
        <main id="main-content" class="flex-1 p-6 sm:p-8">
            <!-- Breadcrumb -->
            @await Html.PartialAsync("/Pages/Shared/Components/_Breadcrumb.cshtml")

            @RenderBody()
        </main>
    </div>

    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/js/site.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
```

### Sidebar

El sidebar es fijo, colapsable y contiene:
- Logo y título del módulo
- Navegación dinámica con indicador activo
- Switch de tema (claro/oscuro)
- Información del usuario
- Botón de cerrar sesión

#### Características del Sidebar

```css
/* Sidebar base */
#sidebar {
    width: 16rem; /* 256px */
    position: fixed;
    left: 0;
    top: 0;
    z-index: 40;
    height: 100vh;
    background: #1f2937; /* gray-800 */
    border-right: 1px solid #374151; /* gray-700 */
}

/* Sidebar minimizado */
#sidebar.minimized {
    width: 4rem; /* 64px */
    overflow: hidden;
}

/* Nav links con indicador activo */
.nav-link {
    position: relative;
    padding-left: 0.75rem;
    border-radius: 0.5rem;
    color: var(--nav-label);
    transition: all 0.2s ease;
}

.nav-link.active {
    background: linear-gradient(90deg, var(--nav-active-bg-start), var(--nav-active-bg-end));
    color: var(--text-primary);
    font-weight: 600;
}

/* Indicador vertical izquierdo para links activos */
.nav-link .active-indicator {
    position: absolute;
    left: 0.25rem;
    top: 50%;
    transform: translateY(-50%) scaleY(0.4);
    width: 4px;
    height: 60%;
    border-radius: 2px;
    background: linear-gradient(to bottom, var(--active-ind-start), var(--active-ind-end));
    opacity: 0;
    transition: opacity .25s ease, transform .25s ease;
}

.nav-link.active .active-indicator {
    opacity: 1;
    transform: translateY(-50%) scaleY(1);
}
```

### Estructura de Página Estándar

```cshtml
@page "/Ruta"
@model Namespace.IndexModel
@{
    ViewData["ModuloNombre"] = "Nombre del Módulo";
    ViewData["ModuloDescripcion"] = "Descripción breve";
    ViewData["ModuloIcono"] = "fa-icon-name";
    Layout = "~/Pages/Shared/Layouts/_SidebarLayout.cshtml";
}

<!-- Layout Principal con espaciado vertical -->
<div class="space-y-8">
    <!-- Estadísticas Globales -->
    @await Html.PartialAsync("~/Pages/.../Components/_GlobalStats.cshtml", Model)

    <!-- Cards de Módulos -->
    @await Html.PartialAsync("~/Pages/.../Components/_MainCards.cshtml", Model)

    <!-- Otros componentes -->
</div>
```

---

## Componentes Reutilizables

### 1. Header de Página (_HeaderHome.cshtml)

Muestra el título tricolor de la página.

```cshtml
@{
    var blackTitle = ViewData["BlackTitle"] as string ?? "";
    var yellowTitle = ViewData["YellowTitle"] as string ?? "";
    var blueTitle = ViewData["BlueTitle"] as string ?? "";
    var descripcion = ViewData["HeaderDescripcion"] as string ?? "";
}

<div class="p-4">
    <h2 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">
        @blackTitle
        <span class="text-muni-yellow">@yellowTitle</span>
        <span class="text-muni-blue">@blueTitle</span>
    </h2>
    <p style="color: var(--text-secondary);">@descripcion</p>
</div>
```

**Uso:**
```cshtml
@{
    ViewData["BlackTitle"] = "Gestión de";
    ViewData["YellowTitle"] = "Roles";
    ViewData["BlueTitle"] = "y Permisos";
    ViewData["HeaderDescripcion"] = "Administra los roles y permisos del sistema.";
}

<div class="p-4 sm:p-8 rounded-lg mb-6" style="background: var(--card-bg); border: 1px solid var(--border-card);">
    @await Html.PartialAsync("~/Pages/Components/_HeaderHome.cshtml")
</div>
```

### 2. Estadísticas Globales (_GlobalStats.cshtml)

Barra horizontal de estadísticas con iconos y números.

```cshtml
@model TuModelo

<!-- Estadísticas del Sistema -->
<div class="rounded-lg border overflow-hidden" style="background: var(--card-bg); border-color: var(--border-card);">
    <!-- Header del componente -->
    <div class="px-5 py-3 border-b" style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #9333ea;">
                <i class="fas fa-chart-bar text-white text-sm"></i>
            </div>
            <div>
                <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Estadísticas del Sistema</h3>
                <p class="text-xs" style="color: var(--text-secondary);">Vista general de todos los registros</p>
            </div>
        </div>
    </div>

    <!-- Estadísticas -->
    <div class="flex gap-3 p-4">
        <!-- Estadística Individual -->
        <a href="/ruta" class="flex-1 flex items-center gap-2 px-3 py-2 rounded border transition-opacity hover:opacity-75"
           style="background: var(--section-bg); border-color: var(--border-card);">
            <div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-users text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-xs leading-none mb-1 truncate" style="color: var(--text-secondary);">Total Usuarios</div>
                <div class="text-lg font-bold leading-none" style="color: var(--text-primary);">@Model.TotalUsuarios</div>
            </div>
        </a>

        <!-- Repetir para cada estadística -->
    </div>
</div>
```

**Características:**
- Layout: `flex gap-3` para distribución horizontal
- Cada card usa `flex-1` para ocupar el mismo ancho
- Iconos: `w-10 h-10 bg-muni-blue rounded-lg`
- Header con gradiente horizontal
- Label arriba (pequeño), número abajo (grande)

### 3. Cards de Módulos (_MainCards.cshtml)

Cards clickeables con icono, título y estadísticas internas.

```cshtml
@model TuModelo

<!-- Módulos del Sistema -->
<div class="rounded-lg overflow-hidden" style="background: var(--card-bg); border: 1px solid var(--border-card);">
    <!-- Header -->
    <div class="px-5 py-3 border-b" style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #10b981;">
                <i class="fas fa-puzzle-piece text-white text-sm"></i>
            </div>
            <div>
                <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Módulos del Sistema</h3>
                <p class="text-xs" style="color: var(--text-secondary);">Accede a las diferentes áreas</p>
            </div>
        </div>
    </div>

    <!-- Grid de cards -->
    <div class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card Individual -->
            <a href="/ruta" class="block group">
                <div class="rounded-lg border transition-all duration-200 hover:border-opacity-60"
                     style="background: var(--card-bg); border-color: var(--border-card);">
                    <div class="p-5">
                        <!-- Header del Card -->
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-shield-halved text-white text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="text-lg font-semibold mb-0.5" style="color: var(--text-primary);">Seguridad</h3>
                                <p class="text-xs truncate" style="color: var(--text-secondary);">Roles y permisos</p>
                            </div>
                        </div>

                        <!-- Estadísticas Internas (formato horizontal) -->
                        <div class="flex gap-4 text-sm">
                            <div class="py-2">
                                <span class="font-bold" style="color: var(--text-primary);">@Model.TotalRoles</span>
                                <span style="color: var(--text-secondary);"> Roles</span>
                            </div>
                            <div class="py-2">
                                <span class="font-bold" style="color: var(--text-primary);">@Model.TotalPermisos</span>
                                <span style="color: var(--text-secondary);"> Permisos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>

            <!-- Repetir para cada módulo -->
        </div>
    </div>
</div>
```

**Características:**
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Icono y texto horizontal: `flex items-center gap-3`
- Hover sutil: `hover:border-opacity-60`
- Estadísticas internas en formato: "5 Roles  10 Permisos"

### 4. Accesos Rápidos (_QuickAccess.cshtml)

Grid de enlaces de acción rápida.

```cshtml
<!-- Accesos Rápidos -->
<div class="rounded-lg border overflow-hidden" style="background: var(--card-bg); border-color: var(--border-card);">
    <!-- Header -->
    <div class="px-5 py-3 border-b" style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #f59e0b;">
                <i class="fas fa-bolt text-white text-sm"></i>
            </div>
            <div>
                <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Accesos Rápidos</h3>
                <p class="text-xs" style="color: var(--text-secondary);">Atajos a funciones frecuentes</p>
            </div>
        </div>
    </div>

    <!-- Grid de enlaces -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        <a href="/ruta" class="flex items-center gap-3 p-3 rounded border transition-opacity hover:opacity-75"
           style="background: var(--section-bg); border-color: var(--border-card);">
            <div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-plus text-white text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm mb-0.5" style="color: var(--text-primary);">Crear Nuevo Rol</div>
                <div class="text-xs truncate" style="color: var(--text-secondary);">Agregar rol al sistema</div>
            </div>
        </a>

        <!-- Repetir para cada acceso rápido -->
    </div>
</div>
```

### 5. Filtros (_Filters.cshtml)

Formulario de filtros con selectores y botones.

```cshtml
@model TuModelo

<!-- Filtros -->
<div class="rounded-lg border overflow-hidden" style="background: var(--card-bg); border-color: var(--border-card);">
    <!-- Header -->
    <div class="px-5 py-3 border-b" style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-filter text-white text-sm"></i>
            </div>
            <div>
                <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Filtros de Búsqueda</h3>
                <p class="text-xs" style="color: var(--text-secondary);">Refina tu búsqueda</p>
            </div>
        </div>
    </div>

    <!-- Formulario -->
    <div class="p-4">
        <form method="get" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Tipo</label>
                <select asp-for="TipoFiltro" class="w-full px-3 py-2 border rounded-lg"
                        style="background: var(--input-bg); border-color: var(--input-border); color: var(--input-text);">
                    <option value="">Todos</option>
                    <option value="SISTEMA">Sistema</option>
                    <option value="PERSONALIZADO">Personalizado</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Estado</label>
                <select asp-for="EstadoFiltro" class="w-full px-3 py-2 border rounded-lg"
                        style="background: var(--input-bg); border-color: var(--input-border); color: var(--input-text);">
                    <option value="">Todos</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                </select>
            </div>

            <div class="flex items-end space-x-2">
                <button type="submit" class="flex-1 px-4 py-2 rounded-lg transition-colors text-white"
                        style="background: var(--btn-primary-bg);">
                    <i class="fas fa-search mr-2"></i>Filtrar
                </button>
                <a href="/ruta" class="px-4 py-2 rounded-lg transition-colors text-white"
                   style="background: var(--btn-secondary-bg);">
                    <i class="fas fa-times"></i>
                </a>
            </div>
        </form>
    </div>
</div>
```

### 6. Tabla de Datos (_Table.cshtml)

Tabla con hover, iconos y acciones.

```cshtml
@model TuModelo

<!-- Tabla -->
<div class="rounded-lg border overflow-hidden" style="background: var(--card-bg); border-color: var(--border-card);">
    <!-- Header -->
    <div class="px-5 py-3 border-b" style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-table text-white text-sm"></i>
            </div>
            <div>
                <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Lista de Registros</h3>
                <p class="text-xs" style="color: var(--text-secondary);">@Model.Items.Count() registros encontrados</p>
            </div>
        </div>
    </div>

    @if (Model.Items.Any())
    {
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y" style="border-color: var(--table-border);">
                <thead style="background: var(--table-header-bg);">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase"
                            style="color: var(--table-header-text);">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase"
                            style="color: var(--table-header-text);">Descripción</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase"
                            style="color: var(--table-header-text);">Estado</th>
                        <th class="px-6 py-3 text-right text-xs font-medium uppercase"
                            style="color: var(--table-header-text);">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y" style="border-color: var(--table-border);">
                    @foreach (var item in Model.Items)
                    {
                        <tr class="transition-colors"
                            style="background: var(--card-bg);"
                            onmouseover="this.style.background='var(--table-row-hover)'"
                            onmouseout="this.style.background='var(--card-bg)'">
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-user-shield text-white"></i>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium" style="color: var(--text-primary);">@item.Nombre</div>
                                        <div class="text-sm" style="color: var(--text-secondary);">ID: @item.Id</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm" style="color: var(--text-secondary);">
                                @item.Descripcion
                            </td>
                            <td class="px-6 py-4">
                                @if (item.Activo)
                                {
                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                          style="background: var(--badge-success-bg); color: var(--badge-success-text);">
                                        Activo
                                    </span>
                                }
                                else
                                {
                                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                          style="background: var(--badge-error-bg); color: var(--badge-error-text);">
                                        Inactivo
                                    </span>
                                }
                            </td>
                            <td class="px-6 py-4 text-right text-sm">
                                <a href="/Ruta/Ver/@item.Id" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <a href="/Ruta/Editar/@item.Id" class="text-yellow-600 hover:text-yellow-900 mr-3">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button type="button" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    }
    else
    {
        <!-- Estado vacío -->
        <div class="text-center py-12">
            <i class="fas fa-inbox text-4xl mb-4" style="color: var(--text-muted);"></i>
            <h3 class="text-lg font-medium mb-2" style="color: var(--text-primary);">No hay registros</h3>
            <p class="mb-4" style="color: var(--text-secondary);">No se encontraron registros con los filtros aplicados</p>
            <a href="/Ruta/Crear" class="inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors"
               style="background: var(--btn-primary-bg);">
                <i class="fas fa-plus mr-2"></i>Crear Nuevo
            </a>
        </div>
    }
</div>
```

**Características:**
- Hover en filas con JavaScript inline
- Iconos consistentes en primera columna
- Estado vacío con icono y mensaje
- Badges de estado integrados

### 7. Caja de Información (_InfoBox.cshtml)

```cshtml
<!-- Información -->
<div class="rounded-lg border overflow-hidden" style="background: var(--card-bg); border-color: var(--border-card);">
    <div class="px-5 py-3 border-b" style="border-color: var(--border-card);">
        <div class="flex items-center gap-2">
            <i class="fas fa-info-circle" style="color: var(--text-primary);"></i>
            <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Información Importante</h3>
        </div>
    </div>

    <div class="p-4 space-y-3 text-sm">
        <div>
            <p style="color: var(--text-secondary);">
                <strong style="color: var(--text-primary);">Roles:</strong>
                Los roles definen conjuntos de permisos que se asignan a los usuarios.
            </p>
        </div>
        <div>
            <p style="color: var(--text-secondary);">
                <strong style="color: var(--text-primary);">Permisos:</strong>
                Los permisos otorgan acceso a recursos específicos del sistema.
            </p>
        </div>
    </div>
</div>
```

### 8. Alertas (_Alert.cshtml)

```cshtml
<!-- Alerta de Éxito -->
@if (TempData["SuccessMessage"] != null)
{
    <div class="rounded-lg px-4 py-3 flex items-center mb-4"
         style="background: var(--alert-success-bg); border: 1px solid var(--alert-success-border); color: var(--alert-success-text);">
        <i class="fas fa-check-circle mr-2"></i>
        @TempData["SuccessMessage"]
    </div>
}

<!-- Alerta de Error -->
@if (TempData["ErrorMessage"] != null)
{
    <div class="rounded-lg px-4 py-3 flex items-center mb-4"
         style="background: var(--alert-error-bg); border: 1px solid var(--alert-error-border); color: var(--alert-error-text);">
        <i class="fas fa-exclamation-circle mr-2"></i>
        @TempData["ErrorMessage"]
    </div>
}

<!-- Alerta de Advertencia -->
@if (TempData["WarningMessage"] != null)
{
    <div class="rounded-lg px-4 py-3 flex items-center mb-4"
         style="background: var(--alert-warning-bg); border: 1px solid var(--alert-warning-border); color: var(--alert-warning-text);">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        @TempData["WarningMessage"]
    </div>
}

<!-- Alerta de Información -->
@if (TempData["InfoMessage"] != null)
{
    <div class="rounded-lg px-4 py-3 flex items-center mb-4"
         style="background: var(--alert-info-bg); border: 1px solid var(--alert-info-border); color: var(--alert-info-text);">
        <i class="fas fa-info-circle mr-2"></i>
        @TempData["InfoMessage"]
    </div>
}
```

---

## Patrones de Diseño

### Headers de Componentes

Todos los headers de secciones/componentes incluyen:
- Badge con icono al lado izquierdo
- Gradiente horizontal de blanco a azul
- Título y descripción

```html
<div class="px-5 py-3 border-b"
     style="background: linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%); border-color: var(--border-card);">
    <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #color-hex;">
            <i class="fas fa-icon-name text-white text-sm"></i>
        </div>
        <div>
            <h3 class="text-sm font-semibold" style="color: var(--text-primary);">Título de la Sección</h3>
            <p class="text-xs" style="color: var(--text-secondary);">Descripción de la sección</p>
        </div>
    </div>
</div>
```

**Características:**
- Gradiente: `linear-gradient(to right, rgba(255, 255, 255, 0.02) 0%, rgba(59, 130, 246, 0.12) 100%)`
- Badge: `w-8 h-8` (32x32px)
- Gap entre elementos: `gap-3`

### Grid Responsivo

#### Estadísticas Horizontales
```html
<div class="flex gap-3 p-4">
    <div class="flex-1"><!-- Estadística 1 --></div>
    <div class="flex-1"><!-- Estadística 2 --></div>
    <div class="flex-1"><!-- Estadística 3 --></div>
</div>
```

#### Cards de Módulos
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Cards aquí -->
</div>
```

#### Accesos Rápidos
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
    <!-- Enlaces aquí -->
</div>
```

#### Filtros
```html
<form class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Campos aquí -->
</form>
```

### Espaciado

```css
/* Layout principal: separación de 32px entre secciones */
.space-y-8 {
    gap: 2rem; /* 32px */
}

/* Padding de contenedores */
.p-4 { padding: 1rem; }     /* 16px - mobile */
.p-6 { padding: 1.5rem; }   /* 24px */
.p-8 { padding: 2rem; }     /* 32px - desktop */

/* Padding responsive */
.p-4.sm:p-8 {
    padding: 1rem;            /* Mobile */
}
@media (min-width: 640px) {
    .p-4.sm:p-8 {
        padding: 2rem;        /* Desktop */
    }
}
```

---

## Iconografía

### Font Awesome 6

El proyecto usa Font Awesome 6.4.0 para todos los iconos.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

### Formato Estándar de Iconos de Badge

Todos los iconos tipo "badge" siguen este formato:

```html
<div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
    <i class="fas fa-icon-name text-white text-lg"></i>
</div>
```

**Características:**
- Tamaño: `w-10 h-10` (40x40px)
- Fondo: `bg-muni-blue` (o color específico)
- Bordes redondeados: `rounded-lg`
- Icono: `text-white text-lg`

### Iconos Comunes por Contexto

```css
/* Seguridad y Usuarios */
fa-user-shield      /* Roles */
fa-shield-alt       /* Permisos */
fa-key              /* Permisos alternativos */
fa-users            /* Usuarios/Funcionarios */
fa-shield-halved    /* Seguridad general */

/* Sistema y Administración */
fa-puzzle-piece     /* Módulos */
fa-cube             /* Recursos */
fa-microchip        /* Sistema */
fa-cog              /* Configuración */

/* Organización */
fa-building         /* Direcciones/Edificios */
fa-sitemap          /* Organización/Jerarquía */

/* Acciones */
fa-bolt             /* Acciones/Accesos rápidos */
fa-plus             /* Crear/Agregar */
fa-edit             /* Editar */
fa-trash            /* Eliminar */
fa-eye              /* Ver/Visualizar */

/* Filtros y Búsqueda */
fa-filter           /* Filtros */
fa-search           /* Búsqueda */
fa-table            /* Tabla/Lista */

/* Información */
fa-info-circle      /* Información */
fa-chart-bar        /* Estadísticas */
fa-check-circle     /* Activo/Éxito */
fa-exclamation-circle    /* Error */
fa-exclamation-triangle  /* Advertencia */
```

### Iconos en Headers de Componentes

Para headers, usar iconos más pequeños:

```html
<div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #color;">
    <i class="fas fa-icon-name text-white text-sm"></i>
</div>
```

---

## Estados y Badges

### Badge de Estado Activo/Inactivo

```cshtml
@model bool

@if (Model)
{
    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
          style="background: var(--badge-success-bg); color: var(--badge-success-text);">
        Activo
    </span>
}
else
{
    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
          style="background: var(--badge-error-bg); color: var(--badge-error-text);">
        Inactivo
    </span>
}
```

### Badge de Tipo/Categoría

```cshtml
<span class="px-2 py-1 text-xs rounded @(tipo switch {
    "SISTEMA" => "bg-blue-100 text-blue-700",
    "PERSONALIZADO" => "bg-purple-100 text-purple-700",
    "DIRECCION" => "bg-green-100 text-green-700",
    _ => "bg-gray-100 text-gray-700"
})">
    @tipo
</span>
```

### Badge de Estado de Solicitud

```cshtml
<span class="px-2 py-1 text-xs rounded @(estado switch {
    "Ingresada" => "bg-blue-100 text-blue-800",
    "EnProceso" => "bg-yellow-100 text-yellow-800",
    "EnRevision" => "bg-orange-100 text-orange-800",
    "Resuelta" => "bg-green-100 text-green-800",
    "Rechazada" => "bg-red-100 text-red-800",
    "PendienteInfo" => "bg-purple-100 text-purple-800",
    _ => "bg-gray-100 text-gray-800"
})">
    @estado
</span>
```

### Badge de Prioridad

```cshtml
<span class="px-2 py-1 text-xs font-semibold rounded @(prioridad switch {
    "Alta" => "bg-red-100 text-red-800",
    "Media" => "bg-yellow-100 text-yellow-800",
    "Baja" => "bg-green-100 text-green-800",
    _ => "bg-gray-100 text-gray-800"
})">
    @prioridad
</span>
```

---

## Formularios

### Campo de Formulario Estándar

```cshtml
<div class="mb-4">
    <label asp-for="Nombre" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
        Nombre
    </label>
    <input asp-for="Nombre" type="text"
           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
           style="background: var(--input-bg); border-color: var(--input-border); color: var(--input-text);"
           placeholder="Ingrese el nombre">
    <span asp-validation-for="Nombre" class="text-red-500 text-xs mt-1"></span>
</div>
```

### Select/Dropdown

```cshtml
<div class="mb-4">
    <label asp-for="TipoId" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
        Tipo
    </label>
    <select asp-for="TipoId" asp-items="Model.Tipos"
            class="w-full px-3 py-2 border rounded-lg"
            style="background: var(--input-bg); border-color: var(--input-border); color: var(--input-text);">
        <option value="">Seleccione una opción</option>
    </select>
    <span asp-validation-for="TipoId" class="text-red-500 text-xs mt-1"></span>
</div>
```

### Textarea

```cshtml
<div class="mb-4">
    <label asp-for="Descripcion" class="block text-sm font-medium mb-2" style="color: var(--text-primary);">
        Descripción
    </label>
    <textarea asp-for="Descripcion" rows="4"
              class="w-full px-3 py-2 border rounded-lg resize-none"
              style="background: var(--input-bg); border-color: var(--input-border); color: var(--input-text);"
              placeholder="Ingrese la descripción"></textarea>
    <span asp-validation-for="Descripcion" class="text-red-500 text-xs mt-1"></span>
</div>
```

### Checkbox

```cshtml
<div class="mb-4">
    <label class="flex items-center">
        <input asp-for="Activo" type="checkbox" class="rounded mr-2">
        <span class="text-sm" style="color: var(--text-primary);">Activo</span>
    </label>
</div>
```

### Botones de Formulario

```cshtml
<!-- Botón Primario -->
<button type="submit" class="inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors"
        style="background: var(--btn-primary-bg);">
    <i class="fas fa-save mr-2"></i>Guardar
</button>

<!-- Botón Secundario -->
<a href="/Ruta" class="inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors"
   style="background: var(--btn-secondary-bg);">
    <i class="fas fa-times mr-2"></i>Cancelar
</a>

<!-- Botón Peligro -->
<button type="button" class="inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors"
        style="background: var(--btn-danger-bg);">
    <i class="fas fa-trash mr-2"></i>Eliminar
</button>

<!-- Botón Éxito -->
<button type="submit" class="inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors"
        style="background: var(--btn-success-bg);">
    <i class="fas fa-check mr-2"></i>Confirmar
</button>
```

---

## Tablas

### Tabla Completa con Todos los Estilos

Ver el componente _Table.cshtml en la sección de [Componentes Reutilizables](#6-tabla-de-datos-_tablecshtml).

### Paginación

```cshtml
@if (Model.TotalPages > 1)
{
    <div class="flex items-center justify-between px-6 py-4 border-t" style="border-color: var(--border-card);">
        <div class="text-sm" style="color: var(--text-secondary);">
            Mostrando @Model.PageNumber de @Model.TotalPages páginas
        </div>
        <div class="flex gap-2">
            @if (Model.HasPreviousPage)
            {
                <a href="?pageNumber=@(Model.PageNumber - 1)"
                   class="px-3 py-1 rounded border transition-colors"
                   style="background: var(--section-bg); border-color: var(--border-card); color: var(--text-primary);">
                    <i class="fas fa-chevron-left"></i>
                </a>
            }

            @for (int i = 1; i <= Model.TotalPages; i++)
            {
                <a href="?pageNumber=@i"
                   class="px-3 py-1 rounded border transition-colors @(i == Model.PageNumber ? "font-bold" : "")"
                   style="background: @(i == Model.PageNumber ? "var(--btn-primary-bg)" : "var(--section-bg)");
                          border-color: var(--border-card);
                          color: @(i == Model.PageNumber ? "#ffffff" : "var(--text-primary)");">
                    @i
                </a>
            }

            @if (Model.HasNextPage)
            {
                <a href="?pageNumber=@(Model.PageNumber + 1)"
                   class="px-3 py-1 rounded border transition-colors"
                   style="background: var(--section-bg); border-color: var(--border-card); color: var(--text-primary);">
                    <i class="fas fa-chevron-right"></i>
                </a>
            }
        </div>
    </div>
}
```

---

## Animaciones y Transiciones

### Principio: Transiciones Sutiles

El proyecto usa transiciones sutiles, **NO animaciones complejas**.

### Transiciones Permitidas

```css
/* Transición general para elementos interactivos */
.transition-all {
    transition: all 0.2s ease;
}

/* Transición de opacidad (hover en links y cards) */
.transition-opacity {
    transition: opacity 0.2s ease;
}

.hover:opacity-75:hover {
    opacity: 0.75;
}

/* Transición de colores (botones) */
.transition-colors {
    transition: background-color 0.2s ease, color 0.2s ease;
}

/* Sidebar collapse/expand */
#sidebar {
    transition: width 0.3s ease;
}

/* Hover en cards - sutil elevación */
.card:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}
```

### Efectos de Hover

```css
/* Links generales */
a:hover:not(.nav-link) {
    opacity: 0.9;
}

/* Botones */
button:hover,
.btn:hover {
    filter: brightness(1.15);
}

/* Nav links del sidebar */
.nav-link:hover {
    background: var(--nav-hover-bg);
    transform: translateX(2px);
}

/* Cards interactivas */
.card:hover,
.rounded-lg:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Animaciones PROHIBIDAS

**NO usar:**
- `fadeIn`, `fadeOut`
- `slideIn`, `slideOut`
- `bounce`, `shake`
- `rotate`, `flip`
- Cualquier animación de keyframes compleja

---

## Sistema de Temas

### Implementación del Switch de Tema

El proyecto incluye un switch de tema claro/oscuro en el sidebar.

#### HTML del Switch

```html
<button id="theme-toggle" type="button" role="switch" aria-checked="false"
    class="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md gap-3 group transition-all duration-200 nav-item"
    title="Cambiar tema (claro/oscuro)">
    <!-- Left: icon + label -->
    <div class="flex items-center gap-3">
        <i class="fas fa-paint-brush icon-change text-indigo-300"></i>
        <span class="nav-label">Tema</span>
    </div>

    <!-- Right: switch -->
    <div class="flex items-center gap-3">
        <div class="toggle-track">
            <!-- Moon icon (dark mode) -->
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <!-- Sun icon (light mode) -->
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" stroke-width="1.5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-width="1.5"/>
            </svg>
            <div class="toggle-thumb"></div>
        </div>
    </div>
</button>
```

#### CSS del Switch

```css
/* Track del switch */
#theme-toggle .toggle-track {
    width: 60px;
    height: 28px;
    background: rgba(230,238,246,0.03);
    border-radius: 9999px;
    position: relative;
    transition: background .18s ease;
}

#theme-toggle .toggle-track.toggled {
    background: linear-gradient(90deg,#06b6d4,#60a5fa);
}

/* Thumb (círculo móvil) */
#theme-toggle .toggle-thumb {
    width: 18px;
    height: 18px;
    background: #f8fafc;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    transition: left .18s ease;
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
}

#theme-toggle .toggle-track.toggled .toggle-thumb {
    left: calc(100% - 3px - 18px);
}

/* Iconos sol/luna */
#theme-toggle .toggle-track .icon-moon,
#theme-toggle .toggle-track .icon-sun {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    transition: opacity .18s ease;
    z-index: 2;
    opacity: 0.6;
}

#theme-toggle .toggle-track .icon-sun {
    left: 6px;
    color: #ffd166;
}

#theme-toggle .toggle-track .icon-moon {
    right: 6px;
    color: #c7d2e6;
}

/* Cuando NO está toggled: moon activa */
#theme-toggle .toggle-track:not(.toggled) .icon-moon {
    opacity: 1;
}

#theme-toggle .toggle-track:not(.toggled) .icon-sun {
    opacity: 0.5;
}

/* Cuando está toggled: sun activa */
#theme-toggle .toggle-track.toggled .icon-sun {
    opacity: 1;
}

#theme-toggle .toggle-track.toggled .icon-moon {
    opacity: 0.5;
}
```

#### JavaScript para el Switch

```javascript
// sidebar.js
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleTrack = themeToggle.querySelector('.toggle-track');
    const html = document.documentElement;

    // Leer preferencia guardada
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.add('theme-light');
        toggleTrack.classList.add('toggled');
        themeToggle.setAttribute('aria-checked', 'true');
    }

    // Toggle del tema
    themeToggle.addEventListener('click', function() {
        const isLight = html.classList.toggle('theme-light');
        toggleTrack.classList.toggle('toggled');
        themeToggle.setAttribute('aria-checked', isLight ? 'true' : 'false');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});
```

### Aplicación de Temas en Componentes

Todos los componentes deben usar variables CSS para que se adapten automáticamente al tema:

```html
<!-- MAL: hardcodear colores -->
<div style="background: #1e293b; color: #f1f5f9;">
    Contenido
</div>

<!-- BIEN: usar variables CSS -->
<div style="background: var(--card-bg); color: var(--text-primary);">
    Contenido
</div>
```

---

## Assets y Recursos

### Logos

El proyecto incluye logos para ambos temas:

```
wwwroot/images/
├── Municipalidad-de-Valparaiso_logo_blanco.png  (para tema oscuro)
└── Municipalidad-de-Valparaiso_logo_negro.png   (para tema claro - si existe)
```

#### Uso en Sidebar

```html
<div id="sidebar-logo" class="flex items-center transition-all duration-300">
    <!-- Logo para tema oscuro (default) -->
    <img src="~/images/Municipalidad-de-Valparaiso_logo_blanco.png"
         class="logo-dark max-h-full max-w-full object-contain"
         alt="Municipalidad de Valparaíso" />

    <!-- Logo para tema claro (oculto por defecto) -->
    <img src="~/images/Municipalidad-de-Valparaiso_logo_negro.png"
         class="logo-light max-h-full max-w-full object-contain"
         alt="Municipalidad de Valparaíso"
         style="display: none;" />
</div>
```

```css
/* Control de visibilidad según tema */
#sidebar-logo .logo-dark { display: block; }
#sidebar-logo .logo-light { display: none; }

html.theme-light #sidebar-logo .logo-dark { display: none; }
html.theme-light #sidebar-logo .logo-light { display: block; }
```

### Imágenes de Fondo (Opcional)

Si tu proyecto necesita fondos:

```css
/* Fondo de Valparaíso */
.valparaiso-background {
    background-image: url('/images/valparaiso_ilustracion.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Fondo de hero */
.hero-background {
    background-image: url('/images/hero.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
```

---

## Herramientas de Desarrollo

### Setup Inicial

1. **Instalar Node.js** (versión 16 o superior)

2. **Instalar dependencias:**
```bash
npm install
```

3. **Compilar Tailwind CSS:**
```bash
# Una vez (producción)
npm run tailwind:build

# Modo watch (desarrollo)
npm run tailwind:watch
```

4. **Ejecutar Vite (opcional):**
```bash
npm run dev
```

### Estructura de Archivos CSS

```
wwwroot/
├── _theme-vars.css           # Variables CSS de temas
├── sidebar.css               # Estilos del sidebar
├── css/
│   ├── input.css            # Tailwind + custom (source)
│   ├── output.css           # CSS compilado (generado)
│   └── site.css             # Estilos adicionales
└── js/
    ├── sidebar.js           # JavaScript del sidebar
    └── site.js              # JavaScript general
```

### Workflow de Desarrollo

1. **Editar estilos:**
   - Variables de tema: `wwwroot/_theme-vars.css`
   - Estilos de Tailwind custom: `wwwroot/css/input.css`
   - Estilos de sidebar: `wwwroot/sidebar.css`

2. **Compilar:**
```bash
npm run tailwind:watch
```

3. **Probar en navegador:**
   - Los cambios en `_theme-vars.css` y `sidebar.css` se aplican inmediatamente
   - Los cambios en `input.css` requieren recompilar Tailwind

### Scripts Útiles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "tailwind:build": "tailwindcss -i ./wwwroot/css/input.css -o ./wwwroot/css/output.css --minify",
    "tailwind:watch": "tailwindcss -i ./wwwroot/css/input.css -o ./wwwroot/css/output.css --watch"
  }
}
```

### Debugging de Estilos

#### Ver qué tema está activo:

```javascript
// En la consola del navegador
console.log(document.documentElement.classList.contains('theme-light') ? 'Tema Claro' : 'Tema Oscuro');
```

#### Ver valores de variables CSS:

```javascript
// En la consola del navegador
const root = document.documentElement;
const bodyBg = getComputedStyle(root).getPropertyValue('--body-bg');
console.log('Body background:', bodyBg);
```

#### Inspeccionar sidebar:

```javascript
// Ver si está minimizado
console.log(document.getElementById('sidebar').classList.contains('minimized'));
```

---

## Checklist para Nueva Vista

Al crear una nueva vista, verificar:

- [ ] Usa el layout `_SidebarLayout.cshtml`
- [ ] Define `ViewData["ModuloNombre"]`, `ViewData["ModuloDescripcion"]`, `ViewData["ModuloIcono"]`
- [ ] Todos los colores usan variables CSS del tema
- [ ] Los componentes están en carpeta `Components/`
- [ ] Los headers de secciones tienen icono al lado izquierdo del título con gradiente
- [ ] Los iconos de badges siguen el estándar `w-10 h-10 bg-muni-blue rounded-lg`
- [ ] Las estadísticas están en formato horizontal con `flex gap-3`
- [ ] Los cards de módulos tienen texto e icono horizontal
- [ ] Las tablas usan `var(--table-*)` para colores
- [ ] Los formularios usan `var(--input-*)` para inputs
- [ ] Las alertas usan `var(--alert-*)` para mensajes
- [ ] El layout principal usa `space-y-8` (32px entre secciones)
- [ ] Sin animaciones excesivas (solo `transition-opacity hover:opacity-75`)
- [ ] Grid responsivo configurado correctamente
- [ ] Hover en filas de tabla con JavaScript inline
- [ ] Estados vacíos con icono y mensaje

---

## Ejemplos de Referencia

Ver las siguientes páginas como referencia completa:

1. **Dashboard Principal**: `/Pages/Administrador/Pages/Home/Index.cshtml`
2. **Vista de Módulo**: `/Pages/Administrador/Pages/Seguridad/Index.cshtml`
3. **Vista de Listado con Tabla**: `/Pages/Administrador/Pages/Seguridad/Roles/Index.cshtml`

---

## Convenciones de Nomenclatura

### Archivos de Componentes

- Todos los componentes parciales empiezan con `_` (underscore)
- Nombres descriptivos en PascalCase: `_GlobalStats.cshtml`, `_MainCards.cshtml`
- Carpeta `Components/` por sección

### Variables CSS

- Kebab-case: `--body-bg`, `--card-bg`, `--text-primary`
- Agrupadas por categoría: `--table-*`, `--input-*`, `--btn-*`

### Clases CSS

- Tailwind utilities para layout y spacing
- Variables CSS para colores y temas
- Clases custom en `input.css` con `@layer components`

### ViewData Keys

```csharp
// Módulo
ViewData["ModuloNombre"] = "Nombre del Módulo";
ViewData["ModuloDescripcion"] = "Descripción breve";
ViewData["ModuloIcono"] = "fa-icon-name";

// Header tricolor
ViewData["BlackTitle"] = "Parte en Negro";
ViewData["YellowTitle"] = "Parte en Amarillo";
ViewData["BlueTitle"] = "Parte en Azul";
ViewData["HeaderDescripcion"] = "Descripción del header";

// Botones
ViewData["text"] = "Guardar";
ViewData["type"] = "submit";
ViewData["icon"] = "<i class='fas fa-save'></i>";
```

---

## Preguntas Frecuentes

### ¿Cómo agrego un nuevo color al tema?

1. Agregar variable en `_theme-vars.css`:
```css
:root {
    --mi-nuevo-color: #123456;
}

html.theme-light {
    --mi-nuevo-color: #abcdef;
}
```

2. Usar en componentes:
```html
<div style="background: var(--mi-nuevo-color);">
    Contenido
</div>
```

### ¿Cómo agrego un nuevo módulo al sidebar?

El sidebar se configura en `SidebarConfigurationService.cs` (backend). No requiere cambios en el CSS.

### ¿Cómo cambio el ancho del sidebar?

Editar la variable CSS en `_SidebarLayout.cshtml`:

```html
<style>
    :root { --sidebar-w: 20rem; } <!-- Cambiar de 16rem a 20rem -->
</style>
```

### ¿Puedo usar otros frameworks CSS además de Tailwind?

No es recomendado. El proyecto está diseñado para usar Tailwind + variables CSS. Agregar otro framework puede causar conflictos.

### ¿Cómo creo un componente reutilizable?

1. Crear archivo en `Pages/Shared/Components/_MiComponente.cshtml`
2. Usar variables CSS para todos los colores
3. Seguir la estructura de headers con gradiente e icono
4. Incluir en páginas con `@await Html.PartialAsync()`

---

## Recursos Adicionales

- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Font Awesome 6 Icons**: https://fontawesome.com/icons
- **Alpine.js Documentation**: https://alpinejs.dev/
- **ASP.NET Core Razor Pages**: https://docs.microsoft.com/en-us/aspnet/core/razor-pages/

---

## Notas Finales

Este sistema de diseño es el resultado de un desarrollo iterativo enfocado en:
- **Consistencia visual** en todos los módulos
- **Accesibilidad** con contrastes adecuados
- **Performance** con CSS mínimo y optimizado
- **Mantenibilidad** con variables CSS centralizadas
- **Responsive design** que funciona en todos los dispositivos

Para cualquier duda o mejora, referirse a los archivos de ejemplo mencionados en este documento.

---

**Versión del Documento**: 1.0
**Última Actualización**: Noviembre 2025
**Proyecto**: MuniValpo Digital
