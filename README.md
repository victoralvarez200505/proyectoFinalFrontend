# 🎮 Gestor de Videojuegos - Frontend

Una aplicación web moderna para gestionar tu biblioteca personal de videojuegos, construida con React, TypeScript y Vite.

## 📋 Descripción

Este proyecto es un gestor completo de videojuegos que te permite:

- **Gestionar tu biblioteca**: Agregar, editar y eliminar juegos de tu colección personal
- **Organizar por géneros**: Clasificar juegos en 11 géneros diferentes (Acción, Aventura, RPG, etc.)
- **Seguimiento de progreso**: Marcar juegos como completados, pendientes o favoritos
- **Sistema de reseñas**: Escribir y gestionar reseñas detalladas con calificaciones
- **Búsqueda avanzada**: Encontrar juegos rápidamente por nombre, género o plataforma
- **Interfaz responsiva**: Diseño moderno y adaptable a cualquier dispositivo

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **React Router 7** - Navegación entre páginas
- **CSS Modules** - Estilos modulares y encapsulados

### UI/UX
- **Radix UI** - Componentes accesibles y primitivos
- **Lucide React** - Iconografía moderna
- **Sonner** - Sistema de notificaciones
- **CSS Grid/Flexbox** - Layout responsivo

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas específicas para TypeScript
- **Express** - Servidor de desarrollo (opcional)

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Inicio/          # Componentes de la página principal
│   ├── Resenias/        # Sistema de reseñas
│   └── ui/              # Componentes de interfaz base
├── config/              # Configuraciones de la aplicación
├── hooks/               # Custom hooks de React
├── layouts/             # Layouts de página
├── lib/                 # Utilidades y helpers
├── pages/               # Páginas principales
├── router/              # Configuración de rutas
├── services/            # Servicios API
├── styles/              # Estilos CSS organizados
└── types/               # Definiciones de TypeScript
```

## 🎯 Características Principales

### 🎮 Gestión de Juegos
- Agregar nuevos juegos con información completa (nombre, año, género, plataforma, sinopsis)
- Editar información existente
- Eliminar juegos con confirmación
- Subir imágenes de portada
- Estados personalizables (completado, favorito, pendiente)

### 📊 Dashboard y Estadísticas
- Resumen visual de la biblioteca
- Contador de juegos por género
- Estadísticas de juegos completados vs pendientes
- Límites configurables para favoritos y pendientes

### 🔍 Búsqueda y Filtrado
- Búsqueda en tiempo real por nombre
- Filtrado por género y plataforma
- Navegación paginada
- Indicadores de resultados encontrados

### ⭐ Sistema de Reseñas
- Escribir reseñas detalladas
- Sistema de calificación por estrellas
- Indicador de dificultad
- Registro de horas jugadas
- Recomendaciones personales

### 🎨 Interfaz Moderna
- Diseño responsive para móviles y escritorio
- Tema personalizable
- Animaciones suaves
- Feedback visual inmediato
- Componentes accesibles

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd proyectoFinalFrontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
# Crear archivo .env.local
VITE_API_URL=http://localhost:3000/api
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para encontrar problemas
```

## ⚙️ Configuración

### Modo Offline
La aplicación incluye un modo offline que utiliza datos mock para desarrollo:

```typescript
// En config/appSettings.json
{
  "featureFlags": {
    "habilitarModoOffline": true
  }
}
```

### API Configuration
Configura la URL del backend en las variables de entorno o en la configuración:

```typescript
// config/index.ts
export const apiConfig = {
  baseUrl: "http://localhost:3000/api",
  usarMock: false,
  timeoutMs: 10000
}
```

## 🎮 Géneros Soportados

- Acción
- Aventura
- Rol (RPG)
- Estrategia
- Simulación
- Deportes
- Carreras
- Plataformas
- Puzzle
- Metroidvania
- Indie

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es un proyecto final educativo.

## 🐛 Reportar Problemas

Si encuentras algún error o tienes sugerencias, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ usando React + TypeScript + Vite
