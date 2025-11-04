# Oficina de Partes Digital - Prototipo

Prototipo funcional 100% frontend de una Oficina de Partes Digital para municipios, desarrollado con HTML, Tailwind CSS, JavaScript y Font Awesome.

## Características

### Vista Ciudadano
- Formulario de solicitud completo con validaciones
- Campos: Nombre, RUT, Correo, Teléfono, Descripción
- Validación en tiempo real de todos los campos
- Generación automática de ID único de seguimiento
- Resumen de solicitud enviada con todos los datos

### Vista Funcionario
- Panel de estadísticas en tiempo real
- Tabla con todas las solicitudes recibidas
- Estados: Pendiente, En Revisión, Finalizada
- Acciones: Marcar como en revisión y finalizar
- Información detallada de cada solicitud

### Características Generales
- Persistencia de datos usando localStorage
- Sistema de temas claro/oscuro
- Diseño 100% responsive
- Interfaz moderna siguiendo el sistema de diseño MuniValpo Digital
- Sin dependencias de backend o base de datos

## Estructura del Proyecto

```
oficina_partes_digital/
├── index.html           # Página principal
├── css/
│   └── styles.css      # Estilos personalizados y variables de tema
├── js/
│   └── app.js          # Lógica de la aplicación
├── images/             # Carpeta para imágenes (vacía en prototipo)
└── README.md           # Este archivo
```

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor web (puede abrirse directamente)

### Pasos para ejecutar

1. **Descargar o clonar el proyecto**
   ```bash
   cd oficina_partes_digital
   ```

2. **Abrir el archivo index.html en tu navegador**
   - Doble clic en `index.html`
   - O arrastra el archivo al navegador
   - O usa el comando (si tienes un servidor local):
     ```bash
     # Python 3
     python -m http.server 8000

     # Node.js (si tienes http-server)
     npx http-server
     ```

3. **Listo para usar**
   - La aplicación se abre con la vista de ciudadano por defecto
   - Usa las pestañas superiores para cambiar entre vistas

## Guía de Uso

### Para Ciudadanos

1. **Completar el formulario**
   - Todos los campos son obligatorios
   - El RUT debe estar en formato 12.345.678-9
   - El correo debe ser válido
   - El teléfono debe tener al menos 8 dígitos
   - La descripción debe tener al menos 10 caracteres

2. **Enviar solicitud**
   - Clic en "Enviar Solicitud"
   - Se genera un ID único automáticamente
   - Se muestra un resumen con todos los datos

3. **Guardar ID de seguimiento**
   - Anota el número de seguimiento para futuras consultas
   - El formato es: OP-{timestamp}-{random}

### Para Funcionarios

1. **Cambiar a Vista Funcionario**
   - Clic en la pestaña "Vista Funcionario"

2. **Ver estadísticas**
   - Total de solicitudes
   - Solicitudes pendientes
   - Solicitudes en revisión
   - Solicitudes finalizadas

3. **Gestionar solicitudes**
   - **Solicitudes pendientes**: Botón "Revisar" para marcar como en revisión
   - **Solicitudes en revisión**: Botón "Finalizar" para completar
   - **Solicitudes finalizadas**: No requieren acción

## Características Técnicas

### Validaciones Implementadas

- **Nombre**: Mínimo 3 caracteres
- **RUT**: Formato chileno válido (con o sin puntos y guión)
- **Correo**: Formato de email válido
- **Teléfono**: 8-12 dígitos numéricos
- **Descripción**: Mínimo 10 caracteres

### Almacenamiento

- Todas las solicitudes se guardan en **localStorage** del navegador
- Los datos persisten entre sesiones
- Cada solicitud incluye:
  - ID único generado
  - Todos los datos del formulario
  - Estado (pendiente/revision/finalizada)
  - Fecha y hora de creación

### Temas

- **Tema Oscuro**: Modo por defecto
- **Tema Claro**: Activar con el botón "Tema" en el header
- La preferencia se guarda en localStorage

### Sistema de Estados

1. **Pendiente**: Estado inicial al crear solicitud
2. **En Revisión**: Cuando el funcionario comienza a revisar
3. **Finalizada**: Cuando el funcionario completa el proceso

## Personalización

### Colores Corporativos

Los colores están definidos en `css/styles.css`:

```css
--muni-blue: #294589;        /* Azul corporativo */
--muni-yellow: #ffdc04;      /* Amarillo corporativo */
```

### Agregar Nuevos Campos

1. Agregar HTML del campo en `index.html` (dentro del formulario)
2. Agregar validación en `js/app.js` (método `validarCampo`)
3. Incluir el campo en el objeto de datos (método `enviarSolicitud`)

### Modificar Estados

Para agregar o modificar estados, editar en `js/app.js`:
- Método `crearBadgeEstado()`: Define los badges visuales
- Método `crearBotonesAccion()`: Define las acciones disponibles

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Tailwind CSS 3.3.0**: Framework CSS (CDN)
- **Font Awesome 6.4.0**: Iconos (CDN)
- **JavaScript (ES6+)**: Lógica de aplicación
- **localStorage**: Persistencia de datos

## Limitaciones del Prototipo

Este es un prototipo 100% frontend, por lo que tiene las siguientes limitaciones:

- No hay backend real ni base de datos
- Los datos solo se guardan en el navegador local
- No hay autenticación de usuarios
- No hay envío de emails o notificaciones
- No hay carga de archivos adjuntos
- No hay búsqueda o filtros avanzados
- Los datos se pierden si se limpia el localStorage del navegador

## Próximos Pasos (Para Implementación Real)

Para convertir esto en una aplicación real, se necesitaría:

1. **Backend**
   - API REST con ASP.NET Core, Node.js, o similar
   - Base de datos (PostgreSQL, MySQL, SQL Server)
   - Sistema de autenticación y autorización

2. **Funcionalidades Adicionales**
   - Carga de archivos adjuntos
   - Sistema de notificaciones por email
   - Búsqueda y filtros avanzados
   - Paginación de resultados
   - Exportación de datos (PDF, Excel)
   - Dashboard con gráficos estadísticos
   - Sistema de comentarios/observaciones
   - Historial de cambios de estado

3. **Seguridad**
   - HTTPS obligatorio
   - Validación de datos en servidor
   - Protección contra SQL injection
   - Rate limiting para prevenir spam
   - Captcha en formulario público

## Soporte

Para preguntas o problemas:
- Revisar el código JavaScript en `js/app.js`
- Inspeccionar la consola del navegador (F12)
- Verificar que localStorage esté habilitado

## Licencia

Este es un prototipo de demostración para fines educativos.

## Créditos

Desarrollado siguiendo el sistema de diseño visual de MuniValpo Digital.

---

**Versión**: 1.0
**Fecha**: Noviembre 2025
**Proyecto**: Oficina de Partes Digital - Prototipo Frontend
