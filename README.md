AseoApp — Mobile Client

Aplicación móvil para la gestión de aseo escolar en la UTTN. Permite a los alumnos recibir alertas de jornadas de limpieza, confirmar su participación y subir evidencias fotográficas desde su dispositivo móvil.

La aplicación consume la API REST de AseoApp, donde se gestionan usuarios, equipos, jornadas y notificaciones.

Funcionalidades

Autenticación de usuario — inicio de sesión para alumnos y jefes de grupo

Notificaciones de jornadas — alertas cuando hay aseo programado

Confirmación de asistencia — los alumnos confirman si participarán

Subida de evidencias — fotografía del salón limpio al finalizar la jornada

Vista de jornadas — historial y estado de las jornadas asignadas

Dashboard del alumno — resumen de tareas pendientes y confirmaciones

Integración con API — consumo de endpoints REST del backend

Stack
Tecnología	Uso
React Native	Framework principal
Expo	Desarrollo y ejecución de la app
JavaScript	Lógica de la aplicación
Axios / Fetch	Consumo de la API
Firebase Cloud Messaging	Recepción de notificaciones push
Estructura del proyecto
AplicacionAseo/
├── app/                 # Pantallas principales de la aplicación
│   ├── login
│   ├── dashboard
│   ├── jornadas
│   └── evidencia
├── components/          # Componentes reutilizables
├── services/            # Conexión con la API
├── navigation/          # Configuración de rutas
├── assets/              # Imágenes e íconos
├── utils/               # Funciones auxiliares
├── App.js               # Punto de entrada
└── package.json
Configuración local
Requisitos

Node.js 18+

Expo CLI

Android Studio o dispositivo físico

API backend corriendo

Repositorio de la API:

https://github.com/PablilloRoy/AplicacionAseo-Api

1. Clona el repositorio
git clone https://github.com/PablilloRoy/AplicacionAseo.git
cd AplicacionAseo
2. Instala las dependencias
npm install
3. Inicia el proyecto
npx expo start

Esto abrirá el panel de Expo donde puedes:

Ejecutar en emulador Android

Ejecutar en dispositivo físico

Ver la app en Expo Go

Conexión con la API

La aplicación consume la API REST desarrollada con Spring Boot.

Endpoint base (ejemplo local):

http://localhost:8080/api

Las operaciones principales incluyen:

autenticación de usuario

consulta de jornadas

confirmación de participación

subida de evidencias

recepción de notificaciones

Seguridad

La aplicación no almacena credenciales sensibles en el repositorio.
Las configuraciones de conexión con la API y Firebase se manejan mediante variables de entorno o archivos de configuración local.

Autor

Luis Pablo — @PablilloRoy

Proyecto personal desarrollado mientras estudio en la UTTN, 2026.
