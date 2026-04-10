# Sistema-de-gestion-de-tareas
Desarrollar una aplicación web moderna para gestionar tus tareas de forma sencilla y eficiente.

## Características

**Crear tareas** - Agrega nuevas tareas a tu lista
**Listar tareas** - Visualiza todas tus tareas organizadas
**Marcar como completadas** - Marca tareas con un checkbox cuando las termines
**Eliminar tareas** - Elimina tareas que ya no necesites
**Filtros** - Visualiza todas, pendientes o completadas
**Estadísticas** - Ve cantidad total, completadas y pendientes
**Persistencia** - Las tareas se guardan en localStorage (sobreviven a recargas de página)

## ¿Cómo usar?

### Crear una tarea
1. Escribe el texto de la tarea en el campo de entrada
2. Presiona el botón "+ Agregar" o la tecla Enter
3. La tarea aparecerá en la lista

### Marcar una tarea como completada
1. Haz clic en el checkbox al lado de la tarea
2. La tarea se mostrará tachada
3. Se actualizarán automáticamente las estadísticas

### Eliminar una tarea
1. Haz clic en el botón "Eliminar" de la tarea que desees quitar
2. Se te pedirá confirmación
3. La tarea será eliminada de la lista

### Filtrar tareas
Usa los botones de filtro para ver:
- **Todas** - Todas las tareas
- **Pendientes** - Solo tareas no completadas
- **Completadas** - Solo tareas completadas

## Archivos

- `index.html` - Estructura HTML de la aplicación
- `styles.css` - Estilos y diseño responsivo
- `script.js` - Lógica de la aplicación

## Características técnicas

- **Almacenamiento local** - Usa localStorage para guardar las tareas
- **Responsive** - Se adapta a cualquier tamaño de pantalla
- **Validación** - Valida entrada de usuario
- **XSS Protection** - Protegido contra inyección de HTML
- **UX Moderno** - Interfaz limpia y moderna con animaciones suaves

## Navegadores soportados

- Chrome/Chromium
- Firefox
- Safari
- Edge
- Opera

## Nota de seguridad

La aplicación escapa automáticamente caracteres HTML maliciosos, por lo que es seguro usar.
