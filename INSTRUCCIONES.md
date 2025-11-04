# Instrucciones para Ver los Casos de Ejemplo

## Paso 1: Abrir la aplicación
Abre el archivo `index.html` en tu navegador web preferido.

## Paso 2: Verificar la carga de datos
1. Abre la **Consola del Desarrollador** (F12 o Clic derecho → Inspeccionar → Consola)
2. Deberías ver mensajes como:
   ```
   📋 Iniciando carga de solicitudes...
   📊 Solicitudes en localStorage: X
   ✅ X ejemplos creados
   ```

## Paso 3: Ver los casos de prueba
1. Haz clic en la pestaña **"Vista Funcionario"** en la parte superior
2. Deberías ver:
   - Estadísticas con el número de solicitudes (Total, Pendientes, En Revisión, Finalizadas)
   - Una tabla con 8 solicitudes de ejemplo

## Si NO ves los datos:

### Opción A: Ejecutar desde la consola
En la consola del navegador, ejecuta:
```javascript
cargarEjemplosDePrueba()
```
Esto limpiará el localStorage y recargará la página con datos frescos.

### Opción B: Limpiar manualmente
1. En la consola, ejecuta:
```javascript
localStorage.clear()
location.reload()
```

### Opción C: Verificar en la consola
Ejecuta en la consola:
```javascript
console.log(APP.solicitudes)
```
Si ves un array con 8 objetos, los datos están cargados pero puede haber un problema de renderizado.

## Los 8 Casos de Ejemplo Incluyen:

1. **Carlos Alberto Mendoza** - Cambio de domicilio (FINALIZADA)
2. **María Francisca Rodríguez López** - Pensión alimenticia (EN REVISIÓN)
3. **Jorge Luis García Fernández** - Reclamo recolección basura (PENDIENTE)
4. **Patricia Elena Soto Morales** - Permiso evento comunitario (FINALIZADA)
5. **Roberto Manuel Pérez Valenzuela** - Certificado de dominio (EN REVISIÓN)
6. **Verónica Alejandra González Parra** - Beneficios sociales (PENDIENTE)
7. **Andrés Felipe Contreras Díaz** - Infraestructura vial (FINALIZADA)
8. **Claudia Marcela Flores Gutierrez** - Información electoral (PENDIENTE)

## Colores del Formulario

En modo claro, los inputs del formulario tienen un fondo azulado (`#eff6ff`) para mejor contraste con los colores corporativos de la municipalidad.
