# Joblyst

Joblyst es un rastreador de solicitudes de empleo. Organiza, analiza y gestiona tu búsqueda de trabajo de manera eficiente.

## Descripción

Joblyst es un proyecto personal diseñado para ayudar a la gente que busca empleo a mantener un registro de sus solicitudes, monitorear su progreso y analizar estadísticas de búsqueda de trabajo. La app proporciona un dashboard integral, filtrado avanzado, capacidades de exportación CSV/PDF y notificaciones automáticas por correo electrónico para recordatorios de entrevistas.

## Stack Tecnológico

**Frontend:**

- Next.js 16 (App Router)
- TypeScript 5
- React 19 (con React Compiler)
- TailwindCSS 4
- Lucide React (Iconos)

**Backend y Servicios:**

- Appwrite Cloud (Autenticación, Base de datos, Almacenamiento, Funciones)
- Resend (Notificaciones por correo)
- Rutas API de Node.js

**Build y Deployment:**

- Turbopack (Compilaciones rápidas)
- Vercel (Hosting)
- Upstash (QStash para Cron jobs)

## Características

### Funcionalidad Principal

- Autenticación de usuarios (correo/contraseña)
- Crear, leer, actualizar y eliminar solicitudes de empleo
- Filtrado avanzado (estado, ubicación, rango salarial, favoritos)
- Gestión segura de CVs y cargas de archivos
- Análisis automático de links de ofertas de trabajo

### Análisis e Informes

- Dashboard con estadísticas (total de solicitudes, entrevistas, ofertas, rechazos)
- Seguimiento de solicitudes mensual
- Exportación CSV con campos personalizados
- Generación de reportes PDF con tablas formateadas

### Automatización y Notificaciones

- Notificaciones por correo para recordatorios de entrevistas (diario a las 9 AM)
- Correos resumen semanal (viernes a las 5 PM)
- Seguimiento de no respuestas (lunes a las 8 AM)

## Estructura del Proyecto

```
src/
├── app/                          # Páginas de Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   ├── (protected)/              # Rutas protegidas con middleware
│   ├── api/                      # Rutas API y cron jobs
│   └── globals.css               # Estilos base de Tailwind
├── components/                   # Componentes React
│   ├── applications/             # Componentes de gestión de solicitudes
│   ├── common/                   # Componentes compartidos
│   └── Navbar.tsx               # Navegación
├── services/                     # Integración de Appwrite
│   ├── auth.ts                  # Lógica de autenticación
│   ├── applications.ts          # CRUD de solicitudes
│   └── storage.ts               # Almacenamiento de archivos
├── types/                        # Interfaces de TypeScript
├── utils/                        # Funciones auxiliares
└── context/                      # React context (estado de auth)
```

## Notificaciones por Correo y Cron Jobs

La aplicación incluye tres cron jobs automatizados usando **Upstash QStash** para evitar limitaciones de plan en Vercel.

### Detalles de los Cron Jobs

- **Verificar Entrevistas:** Recuerda al usuario sobre las entrevistas programadas para hoy
- **Verificar Sin Respuesta:** Rastrea las solicitudes sin respuesta durante 2+ semanas
- **Resumen Semanal:** Envía un resumen de las solicitudes de la semana actual

## Uso

1. **Regístrate** con tu correo y contraseña
2. **Agrega solicitudes** manualmente o usa la función de agregar rápidamente con análisis automático de links
3. **Rastrea el progreso** con el dashboard y la vista mensual
4. **Filtra y exporta** solicitudes según sea necesario
5. **Habilita notificaciones** configurando los cron jobs

## Mejoras Futuras

- Estadísticas salariales e insights del mercado
- Integración con APIs de trabajo (LinkedIn, Indeed)
- Motor de recomendación de trabajos
- Aplicación móvil (React Native)
