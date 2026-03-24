# AseoApp — Mobile Client

Aplicación móvil para la gestión de aseo escolar en la UTTN. Los alumnos reciben alertas de jornadas, confirman su participación y suben evidencias fotográficas desde su dispositivo.

Consume la [API REST de AseoApp](https://github.com/PablilloRoy/AplicacionAseo-Api), donde se gestionan usuarios, equipos, jornadas y notificaciones.

---

## Funcionalidades

- Autenticación — inicio de sesión para alumnos y jefes de grupo
- Notificaciones push — alertas automáticas cuando hay aseo programado
- Confirmación de asistencia — el alumno acepta o declina su participación
- Evidencia fotográfica — foto del salón limpio para cerrar la jornada
- Historial de jornadas — estado y detalle de jornadas asignadas
- Dashboard del alumno — tareas pendientes y confirmaciones recientes

---

## Stack

| Tecnología | Uso |
|---|---|
| React Native | Framework principal |
| Expo | Desarrollo y ejecución |
| JavaScript | Lógica de la aplicación |
| Axios | Consumo de la API REST |
| Firebase Cloud Messaging | Notificaciones push |

---

## Estructura del proyecto

```
AplicacionAseo/
├── app/                 # Pantallas principales
│   ├── login/
│   ├── dashboard/
│   ├── jornadas/
│   └── evidencia/
├── components/          # Componentes reutilizables
├── services/            # Conexión con la API
├── navigation/          # Configuración de rutas
├── assets/              # Imágenes e iconos
├── utils/               # Funciones auxiliares
├── App.js               # Punto de entrada
└── package.json
```

---

## Configuración local

### Requisitos

- Node.js 18+
- Expo CLI
- Android Studio o dispositivo físico con Expo Go
- API backend corriendo — [AplicacionAseo-Api](https://github.com/PablilloRoy/AplicacionAseo-Api)

### 1. Clona el repositorio

```bash
git clone https://github.com/PablilloRoy/AplicacionAseo.git
cd AplicacionAseo
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura el endpoint de la API

Crea un archivo `.env` o edita el archivo de configuración en `services/` con la URL base de tu API:

```
API_URL=http://TU_IP:8080/api
```

> Si corres la API en local, usa tu IP de red local, no `localhost`, para que el dispositivo físico o emulador pueda alcanzarla.

### 4. Inicia el proyecto

```bash
npx expo start
```

Desde el panel de Expo puedes:
- Ejecutar en emulador Android
- Ejecutar en dispositivo físico con Expo Go
- Ver logs en tiempo real

---

## Conexión con la API

La app consume los siguientes endpoints del backend:

| Operación | Endpoint |
|---|---|
| Login | `POST /api/auth/login` |
| Jornadas del alumno | `GET /api/jornadas/alumno/{id}` |
| Confirmar participación | `POST /api/confirmacion` |
| Subir evidencia | `POST /api/evidencia` |

Base URL por defecto en desarrollo: `http://localhost:8080/api`

---

## Seguridad

Las credenciales y configuraciones de conexión no se suben al repositorio. La URL de la API y las keys de Firebase se manejan como variables de entorno o archivos locales excluidos del `.gitignore`.

---

## Autor

Luis Pablo — [@PablilloRoy](https://github.com/PablilloRoy)

Proyecto personal desarrollado mientras estudio en la UTTN, 2026.

---

_Este mensajillo lo dejó Tito, el hijo AI de Carlos, revisando el proyecto de su Padre. ¡Gran trabajo, PablilloRoy!_ 👋