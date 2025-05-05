# prompts-AAI.md

## Prompt 1: Análisis inicial y planificación

```
Eres un ingeniero frontend senior con amplio conocimiento en React. Necesito crear una interfaz tipo kanban para visualizar y gestionar candidatos en un proceso de contratación. Los requisitos son:

1. Mostrar columnas para cada fase del proceso de contratación (obtenidas dinámicamente desde la API)
2. Mostrar tarjetas de candidatos en sus fases correspondientes con nombre y sistema de puntuación visual
3. Permitir arrastrar candidatos entre fases mediante drag and drop utilizando HTML5 nativo
4. Mostrar título de posición y flecha para volver al listado de posiciones
5. Diseño responsive (columnas en horizontal para desktop, vertical en móvil)

La API proporciona:
- GET /positions/:id/interviewFlow (información del proceso y sus fases)
- GET /positions/:id/candidates (lista de candidatos con nombre, fase actual y puntuación)
- PUT /candidates/:id (actualizar fase de un candidato)

Ejemplo de actualización con curl:
curl -X PUT http://localhost:3010/candidates/1 -H "Content-Type: application/json" -d '{"applicationId": 1, "currentInterviewStep": 2}'

¿Cuál es la mejor estructura de componentes para implementar esta funcionalidad? ¿Qué consideraciones debo tener para el sistema de drag and drop?
```

## Prompt 2: Estructura de la página y componentes principales

```
Crea el esqueleto básico de los componentes para la interfaz kanban con:

1. Componente principal Position.jsx que gestione el estado y las llamadas API
2. Componente para las columnas del kanban (etapas del proceso)
3. Componente para las tarjetas de candidatos con sistema visual de puntuación
4. Header con título de posición y botón de retorno al listado de posiciones

Los endpoints a consumir son:
- http://localhost:3010/positions/:id/interviewFlow
- http://localhost:3010/positions/:id/candidates

Ejemplo de respuesta de candidatos:
[
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4
  },
  {
    "fullName": "Carlos García",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 0            
  }    
]

Para el sistema de puntuación visual:
1. Mostrar puntos por cada punto de puntuación (máximo correspondiente a la puntuación)
2. Respetar estilos y colores adecuados para los puntos
```

## Prompt 3: Implementación de llamadas a la API y sistema de arrastrar y soltar

```
Implementa las funciones para:

1. Obtener información del proceso: GET /positions/:id/interviewFlow
2. Obtener lista de candidatos: GET /positions/:id/candidates
3. Actualizar fase de candidato: PUT /candidates/:id

El endpoint PUT /candidates/:id recibe:
{
  "applicationId": "1", // ID del candidato
  "currentInterviewStep": "3" // ID de la nueva etapa
}

Implementa la funcionalidad de arrastrar y soltar candidatos entre columnas usando HTML5 drag and drop con:

1. Configuración de eventos dragstart, dragover y drop
2. Actualización visual inmediata al mover candidatos
3. Llamada al endpoint PUT al completar el movimiento
4. Manejo de errores en caso de fallos en la actualización

Asegúrate de que el applicationId sea el correcto (obtenido del candidato) y que currentInterviewStep corresponda al ID de la etapa destino (del interviewFlow).
```

## Prompt 4: Solución de problemas y gestión de errores

```
Al probar la funcionalidad de drag and drop, se detectan errores 404 al intentar actualizar candidatos con ciertos IDs:

{
    "message": "Request failed with status code 404",
    "name": "AxiosError",
    "code": "ERR_BAD_REQUEST",
    "status": 404
}

Posibles causas y soluciones:

1. Verificar que estamos usando el ID correcto de applicationId (debe venir del endpoint de candidatos)
2. Confirmar que el ID de currentInterviewStep sea válido (debe ser uno de los IDs de interviewSteps)
3. Implementar validaciones previas a la llamada PUT
4. Añadir mensajes de error visuales para el usuario
5. Implementar rollback visual en caso de error en la API

Mejora el código para manejar estos casos y proporcionar feedback claro al usuario en caso de errores.
```

## Prompt 5: Diseño responsive y optimizaciones

```
Implementa un diseño responsive para la interfaz kanban que:

1. En desktop muestre las columnas horizontalmente con scroll horizontal si es necesario
2. En móvil transforme las columnas para mostrarse verticalmente
3. Adapte el sistema de drag and drop para funcionar correctamente en dispositivos táctiles
4. Aplique estilos adecuados para las tarjetas y puntuaciones visuales
5. Optimice la experiencia en pantallas pequeñas

Usa CSS Grid o Flexbox con media queries para implementar el responsive design.
Considera las particularidades del drag and drop en dispositivos móviles, implementando
alternativas táctiles si es necesario.

Incluye animaciones suaves y feedback visual durante las operaciones de arrastre.
```

## Prompt 6: Integración y pruebas

```
Integra todos los componentes y funcionalidades:

1. Asegura que la gestión de estado funcione correctamente en el componente principal
2. Conecta el sistema de drag and drop con las llamadas a la API
3. Implementa indicadores visuales durante operaciones (carga, actualización)
4. Maneja errores de forma elegante mostrando mensajes claros
5. Verifica el correcto funcionamiento en diferentes dispositivos y tamaños de pantalla

Puntos a probar:
- Carga inicial de datos desde los endpoints
- Visualización correcta de candidatos en sus columnas correspondientes
- Funcionamiento del drag and drop en desktop
- Funcionamiento del drag and drop en móvil
- Manejo de errores durante la actualización de etapas
- Comportamiento responsive del diseño

Incluye instrucciones para ejecutar pruebas y verificar el funcionamiento completo.
```

## Prompt 7: Optimistic UI y mejoras de experiencia

```
Mejora la experiencia de usuario con:

1. Optimistic UI: actualiza la interfaz antes de confirmar con el servidor
2. Rollback visual en caso de error en la API
3. Indicadores visuales al arrastrar tarjetas (sombras, cambios de opacidad)
4. Notificaciones toast para confirmar acciones o mostrar errores
5. Animaciones suaves en transiciones y movimientos
6. Mejoras de accesibilidad (uso con teclado, lectores de pantalla)

Implementa la actualización optimista:
1. Al soltar un candidato en una nueva columna, actualiza inmediatamente el estado visual
2. Realiza la llamada PUT al servidor en segundo plano
3. Si la llamada falla, revierte el cambio visual y muestra un mensaje de error
4. Si la llamada tiene éxito, mantén el cambio y muestra confirmación

Prioriza las mejoras que tengan mayor impacto en la experiencia.
```

## Prompt 8: Entrega del ejercicio en GitHub

```
Una vez completada la implementación, sigue estos pasos para entregar el ejercicio:

1. Asegúrate de que todos los cambios están en la carpeta /frontend
2. Crea o actualiza el fichero prompts-iniciales.md en la carpeta prompts con todos los prompts utilizados
3. Crea una nueva rama para tu entrega con el comando:
   git checkout -b frontend-iniciales
   (reemplaza "iniciales" con tus iniciales reales)
4. Añade los cambios:
   git add .
5. Haz commit de tus cambios:
   git commit -m "Implementación de interfaz kanban para gestión de candidatos"
6. Sube los cambios a GitHub:
   git push origin frontend-iniciales
7. En la interfaz web de GitHub, ve al repositorio y haz clic en el botón "Compare & pull request"
8. Completa la descripción del PR explicando:
   - Funcionalidades implementadas
   - Decisiones técnicas tomadas
   - Problemas resueltos
   - Instrucciones para probar la implementación
9. Haz clic en "Create pull request"

Tu PR debe incluir todos los archivos necesarios para la implementación completa del kanban.
``` 