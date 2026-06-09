# 🌱 CosmoGarden — Frontend

Sistema de gestión de vivero construido con React + Vite.

## Estructura del proyecto

```
cosmogarden/
├── src/
│   ├── components/
│   │   ├── Login.jsx       → Pantalla de inicio de sesión
│   │   ├── Dashboard.jsx   → Panel principal con estadísticas
│   │   ├── Products.jsx    → Inventario de plantas
│   │   ├── Sales.jsx       → Registro de ventas
│   │   └── Users.jsx       → Gestión de usuarios
│   ├── styles/
│   │   └── global.css      → Estilos globales (tema botánico oscuro)
│   ├── api.js              → Helpers para llamadas al backend
│   ├── main.jsx            → Punto de entrada React
│   └── App.jsx             → Componente raíz + navegación
├── index.html
├── vite.config.js
└── package.json
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el backend
# Edita src/api.js y cambia la variable API a la URL de tu backend NestJS

# 3. Correr en desarrollo
npm run dev

# 4. Build para producción
npm run build
```

## Backend

El frontend consume una API REST en NestJS con los endpoints:
- `POST /users/login`
- `GET/POST /products` · `PUT/DELETE /products/:id`
- `GET/POST /sales`
- `GET/POST /users`
