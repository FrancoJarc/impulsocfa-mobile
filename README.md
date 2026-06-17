# ImpulsoCFA - Mobile

Aplicación móvil de ImpulsoCFA, una plataforma de crowdfunding social desarrollada para conectar personas que necesitan apoyo económico con personas dispuestas a colaborar de forma segura, transparente y organizada.

La aplicación permite a usuarios crear campañas de recaudación, realizar donaciones mediante Mercado Pago, interactuar con la comunidad y hacer seguimiento del progreso de iniciativas sociales.

## 📖 Sobre el proyecto

ImpulsoCFA surge a partir de situaciones reales que evidenciaron problemas de confianza y organización en los mecanismos tradicionales de donaciones.

La plataforma busca ofrecer una alternativa donde cualquier persona pueda crear una campaña de recaudación y recibir apoyo económico de otros usuarios, incorporando herramientas de transparencia que permitan visualizar el impacto generado por cada contribución.

## 🎯 Objetivo

Facilitar la financiación de proyectos, necesidades y causas sociales mediante una aplicación móvil segura que promueva la confianza entre creadores de campañas y donantes.

## 🚀 Funcionalidades principales

* Autenticación de usuarios (email/contraseña y Google OAuth).
* Visualización y gestión de campañas de recaudación.
* Creación y edición de campañas con soporte multimedia.
* Realización de donaciones integradas con Mercado Pago.
* Publicación y seguimiento de historias de impacto.
* Sistema de comentarios para interacción comunitaria.
* Gestión de perfil de usuario e historial de donaciones.
* Filtrado de campañas por categoría.
* Sistema de reportes para moderación.
* Panel de administrador para gestión de la plataforma.
* Panel de validador para supervisión de contenido.

## 🔍 Características diferenciales

### Transparencia

La aplicación incorpora mecanismos que permiten a los usuarios realizar un seguimiento del uso de los fondos recaudados:

* Visualización de campañas con detalle de donaciones recibidas.
* Historias de seguimiento con evidencia multimedia (imágenes y videos).
* Carrusel interactivo de imágenes en campañas.
* Sistema de validación de campañas por administradores.
* Historial completo de donaciones realizadas.

### Integración con Mercado Pago

Las donaciones se procesan mediante Mercado Pago, permitiendo realizar aportes de forma rápida y segura utilizando una plataforma ampliamente adoptada en Argentina.

### Gestión de roles

Sistema diferenciado de acceso según rol:

* **Usuarios regulares:** creación de campañas y donaciones.
* **Validadores:** supervisión de contenido y moderación.
* **Administradores:** gestión completa de la plataforma.

## 📱 Arquitectura

La aplicación implementa una arquitectura modular basada en componentes y servicios:

```text
Screens (Pantallas)
   ↓
Components (Componentes reutilizables)
   ↓
Services (Lógica de negocio / API calls)
   ↓
Backend API (ImpulsoCFA Back)
```

### Responsabilidades

* **Screens** → Pantallas principales de la aplicación.
* **Components** → Componentes reutilizables (formularios, tarjetas, listas).
* **Services** → Llamadas a la API y lógica de negocio.
* **Hooks** → Lógica reutilizable con estado.
* **Context** → Gestión de estado global (UserContext).

## 🔐 Autenticación y Autorización

La autenticación se realiza mediante:

* **Email/Contraseña:** autenticación tradicional.
* **Google OAuth:** login social mediante flujo PKCE.
* **JWT Tokens:** almacenamiento seguro de sesión en AsyncStorage.

### Roles

* Usuario
* Validador
* Administrador

Los permisos se gestionan según el rol del usuario autenticado.

## 📂 Gestión de archivos

Los archivos multimedia se almacenan en Supabase Storage.

### Formatos soportados

Imágenes:

* JPG
* PNG
* WebP

Videos:

* MP4
* MOV

Para la selección de archivos se utilizan `expo-image-picker` y `expo-media-library`.

## 🗄️ Modelo de datos

Principales entidades del sistema:

* Usuario
* Campaña
* Historia
* Categoría
* Comentario
* Donación
* Reporte

Persistencia:

* PostgreSQL (Supabase) — datos del servidor.
* AsyncStorage — sesión local del usuario.

## 🛠️ Tecnologías

### Frontend

* React Native
* Expo
* Expo Router
* React Context API

### Autenticación y base de datos

* Supabase Auth (JWT)
* Supabase Database (PostgreSQL)
* Supabase Storage

### Pagos

* Mercado Pago SDK

### UI y animaciones

* Expo Vector Icons
* Lucide Icons
* Moti
* react-native-reanimated
* react-native-toast-message
* react-native-gesture-handler

### Herramientas

* TypeScript
* Babel
* ESLint
* PNPM

## 📁 Estructura del proyecto

```text
app/
├── (auth)/                 # Pantallas de autenticación
├── (campanas)/             # Pantallas de campañas
├── (tabs)/                 # Navegación con tabs
│   ├── adminPanel/         # Panel de administrador
│   ├── validadorPanel/     # Panel de validador
│   ├── historias/          # Gestión de historias
│   └── perfilPanel/        # Gestión de perfil
└── context/                # Estado global

components/
├── IniciarSesionForm/
├── RegistrarseForm/
├── Campanas/
├── Comentarios/
├── Historias/
├── Perfil/
├── Admin/
├── Validador/
└── ui/

services/
├── auth.service.js
├── campaign.service.js
├── payment.service.js
├── comment.service.js
├── history.service.js
├── user.service.js
├── admin.service.js
├── category.service.js
└── report.service.js

config/
└── api.js
```

## 🔧 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/FrancoJarc/impulsocfa-mobile.git
```

Ingresar al directorio:

```bash
cd impulsocfa-mobile
```

Instalar dependencias:

```bash
pnpm install
```

## ⚙️ Variables de entorno

Crear un archivo `.env` con las siguientes variables:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=https://impulsocfa-back.onrender.com/api
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

## ▶️ Ejecución

Modo desarrollo:

```bash
pnpm start
```

## 🌐 Despliegue

| Servicio | URL |
|---|---|
| Frontend web | https://impulsocfa-front.vercel.app |
| Backend API | https://impulsocfa-back.onrender.com |
| Aplicación móvil (APK) | [Descargar desde Expo](https://expo.dev/accounts/francojarc/projects/impulso-cfa-mobile/builds/333a90ea-1f98-4984-acae-63c2339a3998) |

> La aplicación no se encuentra publicada en tiendas oficiales. El APK puede descargarse e instalarse directamente en dispositivos Android.

## 💡 Desafíos técnicos abordados

* Integración de pagos con Mercado Pago desde dispositivo móvil.
* Implementación de autenticación OAuth con Google mediante flujo PKCE.
* Gestión de estado global con Context API.
* Persistencia de sesión con AsyncStorage.
* Manejo de permisos de cámara y galería en Android.
* Carga y visualización eficiente de contenido multimedia.
* Navegación compleja con Expo Router y control de acceso basado en roles.

## 👨‍💻 Autores

Camila Ocaña y Franco Jarc

Proyecto desarrollado como parte de la carrera de Analista de Sistemas.
