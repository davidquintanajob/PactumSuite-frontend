# Modificar Campo Número Consecutivo en ContratoModal.vue

## Tareas Pendientes

- [x] Cambiar el tipo del input de "number" a "text" y agregar @input handler
- [x] Implementar la función handleConsecutivoInput para validar y auto-agregar "/"
- [x] Probar el comportamiento del input en el modal
- [x] Verificar que no haya cambios disruptivos en la funcionalidad existente

## Detalles de Implementación

- Campo: Número Consecutivo en ContratoModal.vue
- Cambios: Tipo a text, agregar validación personalizada
- Lógica: Solo números si no hay "/", números a la izquierda de "/" si lo hay, auto-agregar "/" al primer carácter no numérico
