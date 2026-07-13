# Spec: Pixel Field — animación interactiva del hero del home

**Fecha:** 2026-07-13
**Estado:** Aprobado (diseño validado en sesión de brainstorming)
**Reemplaza a:** el shader de "destello" (`components/ui/shader-animation.tsx`) como fondo del home

## Contexto

Hoy el home (`pages/index.js`) monta `<ShaderAnimation />` (Three.js, WebGL) como fondo fijo de **toda** la página (`<div className="fixed inset-0 z-0">`, línea ~114). Todas las secciones flotan encima con `bg-black/50 backdrop-blur-sm`. El efecto se percibe genérico y no conversa con la identidad del sitio (tipografía editorial + fuente pixel Geist PixelSquare en el título `<Developer />` y el marquee). Además Three.js (~150KB) entra al bundle del home y el loop corre siempre, incluso con el hero fuera de pantalla.

## Objetivo

Reemplazar el destello por un **campo de píxeles interactivo** que vive **solo en el hero**, dibujado con Canvas 2D puro (cero dependencias nuevas, Three.js fuera del home), alineado con el lenguaje pixel de la marca.

## Alcance

**Incluye:**
- Nuevo componente `components/ui/pixel-field.tsx`.
- Cambios en `pages/index.js`: quitar el fondo global, montar el efecto dentro del hero, fondo sólido para el resto de la página, limpiar `backdrop-blur` muerto.

**NO incluye (no tocar):**
- `components/ui/shader-animation.tsx` y `pages/shader-demo.tsx` quedan intactos (el demo sigue funcionando; Three.js solo se carga en esa página por code-splitting).
- No se elimina `three` de `package.json`.
- Ningún cambio de copy, layout, colores de texto, marquee, GSAP (`AnimatedHero`, `RevealOnScroll`, etc.) ni otras páginas.
- No pasar el sitio a paleta clara: el home sigue oscuro.

## Diseño visual del efecto

Grilla de cuadrados pequeños sobre el fondo del hero, detrás del contenido:

- **Grilla:** celdas de ~16px en desktop (~20–24px en móvil). Cada celda dibuja un cuadrado de 2–3px CSS centrado. Tope duro: **4.000 celdas** — si `(width/cell) * (height/cell)` lo supera, aumentar el tamaño de celda hasta cumplirlo.
- **Brillo base ("respiración"):** cada píxel tiene brillo `base = f(x, y, t)` combinando 2–3 ondas seno de distinta frecuencia/dirección (pseudo-ruido barato, sin librerías). Ciclo perceptible de ~8s. Rango del brillo base: alpha entre **0.04 y 0.18** sobre blanco (`rgba(255,255,255,a)`). Debe leerse como fondo tenue: el texto blanco del hero siempre gana en contraste.
- **Cursor como linterna:** los píxeles dentro de un radio de **~150px** del cursor suman excitación proporcional a la cercanía (falloff suave, p.ej. `smoothstep`). La excitación tiene **inercia**: cada frame decae multiplicativamente (~1s hasta apagarse), dejando estela al mover el mouse.
- **Acento de color:** los píxeles cuya intensidad total supera un umbral alto (~0.75) se tiñen interpolando hacia `--color-accent` (`#b91c1c`, leer del token o constante con comentario que referencie el token). Solo el pico de la estela debe verse rojizo; el resto queda monocromo.
- **Máscara inferior:** el canvas se desvanece hacia el borde inferior del hero (CSS `mask-image: linear-gradient(to bottom, black 75%, transparent 100%)` o gradiente equivalente dibujado) para que la transición a la siguiente sección sea limpia.
- **Móvil / touch:** sin cursor, la respiración base sola anima el fondo. `touchmove` sobre el hero excita píxeles igual que el mouse (usar `passive: true`, no bloquear el scroll).

## Arquitectura y contrato del componente

`components/ui/pixel-field.tsx`:

- `"use client"`, mismo patrón de ciclo de vida que `shader-animation.tsx`: `useEffect` monta el canvas en un `div` contenedor con ref, y el cleanup cancela el rAF, desconecta observers/listeners y elimina el canvas.
- **Props:** ninguna obligatoria. El componente llena el 100% del contenedor (`div` raíz con `className="w-full h-full"` + estilo `pointer-events: none` en el canvas — la interacción se lee con listeners de `mousemove`/`touchmove` sobre `window` o el contenedor padre, para no robar clics/scroll al hero).
- **Render:** un solo `<canvas>` Canvas 2D. Cada frame: limpiar, iterar la grilla, calcular `intensidad = clamp(base + excitación)`, dibujar `fillRect` por celda visible (saltar celdas con alpha < 0.02).
- **Estado interno:** `Float32Array` con la excitación por celda (evitar crear objetos por frame). Posición del cursor en coordenadas del canvas.

### Rendimiento

- Loop `requestAnimationFrame` que **se pausa por completo** cuando:
  - el hero sale del viewport (`IntersectionObserver` sobre el contenedor), o
  - la pestaña está oculta (`visibilitychange`).
- `devicePixelRatio` manejado (cap a 2) y re-cálculo de grilla en `resize` (con debounce ligero).
- El movimiento debe ser **time-based** (usar el timestamp del rAF), no por conteo de frames, para que la velocidad no dependa del refresh rate.

### Accesibilidad

- `prefers-reduced-motion: reduce` → dibujar **una sola vez** la grilla estática con brillo base fijo (sin loop, sin interacción de cursor).
- El canvas es decorativo: `aria-hidden="true"`.

## Cambios en `pages/index.js`

Convención del archivo: **indentación con tabs**.

1. Eliminar el import de `ShaderAnimation` (línea 8) y el bloque del fondo global (líneas ~113–116):
   ```jsx
   {/* Animated Shader Background */}
   <div className="fixed inset-0 z-0">
   	<ShaderAnimation />
   </div>
   ```
2. Importar `PixelField` desde `@/components/ui/pixel-field`.
3. Al wrapper principal (`<div className="page-transition relative z-10">`) agregarle el fondo sólido del sitio: `bg-[#0a0a09]` (o `bg-black`; usar `#0a0a09` carbón). El `z-10` puede quedarse.
4. En la sección del hero (`<section id="inicio" className="min-h-screen flex items-center pt-24">`): agregar `relative overflow-hidden` y como **primer hijo** montar el efecto:
   ```jsx
   <div className="absolute inset-0 z-0" aria-hidden="true">
   	<PixelField />
   </div>
   ```
   y envolver el contenido existente (el `container-editorial`) para que quede encima (`relative z-10`).
5. Limpieza de vidrio muerto: en las secciones que hoy usan `bg-black/50 backdrop-blur-sm` o `bg-black/60 backdrop-blur-sm` (servicios ~línea 278, about ~320, proyectos ~353), quitar **solo** `backdrop-blur-sm` (ya no hay nada que difuminar y gasta GPU). Los `bg-black/50`–`/60` pueden quedarse (sobre fondo sólido rinden igual). La sección de contacto (`bg-[var(--color-text)]`) no se toca.
6. Verificar que el `AnimatedHero` (GSAP) sigue encontrando sus hooks (`.hero-title`, `.hero-description`, `.hero-accent-line`, `.scroll-indicator`) — no cambiar esas clases.

## Criterios de aceptación

1. `pnpm build` pasa y el chunk del home (`pages/index`) **no incluye Three.js** (verificable en el output de `next build`: el First Load JS de `/` debe bajar notablemente respecto a antes).
2. En `pnpm dev`:
   - El hero muestra la grilla respirando; el mouse enciende píxeles con estela e inercia; el pico de la estela se ve con el acento rojo.
   - Al scrollear más allá del hero, el loop se pausa (verificable: sin trabajo de rAF en el perfilador / `console.count` temporal).
   - El resto de la página se ve igual que antes (secciones oscuras, texto blanco, marquee, animaciones GSAP de entrada intactas).
   - `/shader-demo` sigue funcionando con el shader original.
3. Con `prefers-reduced-motion` activado (emulable en DevTools): grilla estática, sin animación.
4. En viewport móvil (DevTools): el efecto anima solo con la respiración, el scroll sobre el hero no se bloquea, y `touchmove` enciende píxeles.
5. Sin errores en consola al montar/desmontar (navegar a `/portfolio` y volver).

## Notas para el implementador

- Seguir el estilo del repo: tabs en `components/` y `pages/`, tokens del design system antes que colores ad-hoc (el único color nuevo permitido es el carbón `#0a0a09` del fondo).
- No agregar dependencias.
- No hay test suite: la verificación es manual según los criterios de arriba, más `pnpm lint` y `pnpm build`.
