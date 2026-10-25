# Demostración de controles de carcasa

Se añadió un panel accesible bajo el visor 3D de CHAJÁ y Golondrina. Los controles ejecutan únicamente respuestas simuladas en la interfaz y no envían comandos a dispositivos ni maquinaria.

- CHAJÁ: CONFIG (configuración), TEST (diagnóstico), ACK (reconocimiento de alertas).
- Golondrina: STATUS (estado), PAIR (vinculación).

Estas funciones son propuestas de producto, no capacidades de hardware verificadas. El panel no convierte automáticamente las mallas 3D en áreas clickeables: la interacción se realiza mediante botones claramente identificados debajo del visor. Antes de habilitar controles industriales reales se requieren evaluación de riesgos, ingeniería y validaciones aplicables.

Validación pendiente: instalar dependencias y ejecutar `npm run lint` y `npm run build`.
