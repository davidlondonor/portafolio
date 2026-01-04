# Resumen del Proyecto - Portafolio David Dev

## Descripción General

Portafolio personal desarrollado con **Next.js** que presenta una página hero con un efecto de texto dinámico (typing effect). El proyecto muestra habilidades en desarrollo frontend con un diseño minimalista y llamativo.

---

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 12.0.10 | Framework React con SSR/SSG |
| React | 17.0.2 | Librería UI |
| Tailwind CSS | 3.0.18 | Framework CSS utility-first |
| next-translate | 2.0.6 | Internacionalización (instalado, sin implementar) |
| gh-pages | 3.2.3 | Despliegue a GitHub Pages |
| ESLint | 8.8.0 | Linter de código |

---

## Estructura del Proyecto

```
portafolio/
├── pages/
│   ├── _app.js          # Componente raíz
│   ├── index.js         # Página principal (Hero)
│   └── api/
│       └── hello.js     # API de ejemplo
├── components/
│   └── useTypingText.js # Hook personalizado para efecto typing
├── styles/
│   ├── globals.css      # Estilos globales (Tailwind)
│   └── Home.module.css  # CSS Modules
├── public/
│   └── favicon.ico
├── next.config.js       # Configuración Next.js
├── tailwind.config.js   # Configuración Tailwind
└── package.json         # Dependencias y scripts
```

---

## Funcionalidades Principales

### 1. Efecto de Texto Dinámico (Typing Effect)
- Hook personalizado `useTypingText.js`
- Anima palabras letra por letra con efecto de escritura y borrado
- Palabras rotativas:
  - "Accessibility"
  - "Frontend Developer"
  - "User Interface"
  - "Web designer"

### 2. Página Hero
- Fondo amarillo llamativo (`bg-yellow-400`)
- Texto principal: "I like [palabra animada]"
- Botón CTA con emojis
- Diseño responsive

### 3. Diseño Responsive
- Mobile-first con Tailwind CSS
- Breakpoints configurados (sm:, lg:)

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo (localhost:3000)
npm run build     # Compilar para producción
npm start         # Servidor de producción
npm run lint      # Ejecutar ESLint
npm run deploy    # Desplegar a GitHub Pages
```

---

## Configuración

### Next.js
- React Strict Mode activado

### Tailwind CSS
- Escanea `pages/` y `components/` para purgar CSS
- Tema default sin personalizaciones

---

## Estado de Internacionalización

- **next-translate** está instalado pero **no implementado**
- No existen archivos de traducción ni configuración i18n
- Preparado para futura implementación multilenguaje

---

## Despliegue

- **Plataforma**: GitHub Pages
- **Homepage**: https://github.com/davidlondonor/portafolio
- **Método**: gh-pages package

---

## Flujo de la Aplicación

```
Usuario visita → Next.js renderiza index.js → Hook useTypingText se activa
    ↓
Ciclo de animación:
    1. Escribe letra por letra (130ms cada una)
    2. Pausa al completar palabra
    3. Borra letra por letra
    4. Siguiente palabra del array
    5. Repetir infinitamente
```

---

## Archivos Clave

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `pages/index.js` | 45 | Página principal con hero y animación |
| `components/useTypingText.js` | 82 | Lógica del efecto typing |
| `styles/globals.css` | 3 | Imports de Tailwind CSS |

---

## Mejoras Potenciales

1. Implementar internacionalización con next-translate
2. Agregar más secciones (proyectos, contacto, sobre mí)
3. Añadir animaciones adicionales
4. Implementar modo oscuro
5. Agregar tests unitarios
6. Optimizar para SEO

---

## Autor

**David Londono** - Frontend Developer
