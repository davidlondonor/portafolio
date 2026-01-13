# Animaciones GSAP - Guía de Uso

Tu portafolio ahora tiene **animaciones profesionales con GSAP** similar a cappen.com.

## 📦 Componentes Creados

### 1. **AnimatedHero**

Anima el hero con fade in, slide y efectos escalonados.

```jsx
import AnimatedHero from "@/components/AnimatedHero";

<AnimatedHero>
	<section>
		<h1 className="hero-title">Título</h1>
		<p className="hero-description">Descripción</p>
		<div className="hero-accent-line"></div>
	</section>
</AnimatedHero>;
```

**Elementos que anima:**

-  `.hero-title` - Fade in + slide from bottom (escalonado)
-  `.hero-description` - Fade in después del título
-  `.hero-accent-line` - ScaleX animation
-  `.scroll-indicator` - Aparece al final

---

### 2. **RevealOnScroll**

Revela elementos cuando entran en viewport.

```jsx
import RevealOnScroll from "@/components/RevealOnScroll";

<RevealOnScroll className="grid" stagger={true}>
	<div className="reveal-item">Item 1</div>
	<div className="reveal-item">Item 2</div>
</RevealOnScroll>;
```

**Props:**

-  `stagger={true}` - Anima los `.reveal-item` con delay escalonado
-  `className` - Classes Tailwind personalizadas

---

### 3. **CardAnimation**

Anima tarjetas con fade in y hover effect.

```jsx
import CardAnimation from "@/components/CardAnimation";

<CardAnimation delay={0.1}>
	<div className="card">
		<h3>Proyecto</h3>
		<p>Descripción</p>
	</div>
</CardAnimation>;
```

**Props:**

-  `delay` - Delay inicial en segundos (para stagger)
-  **Hover:** Se mueve -10px hacia arriba

---

### 4. **SplitTextAnimation**

Anima texto carácter por carácter.

```jsx
import SplitTextAnimation from "@/components/SplitTextAnimation";

<SplitTextAnimation triggerOnScroll={true} className="display-lg">
	Texto que se anima
</SplitTextAnimation>;
```

**Props:**

-  `triggerOnScroll={true}` - Anima al entrar en viewport
-  `triggerOnScroll={false}` - Anima inmediatamente

---

### 5. **Componentes Avanzados**

#### **HoverMagnetic**

Efecto magnético en hover (el elemento se mueve hacia el mouse).

```jsx
import HoverMagnetic from "@/components/HoverMagnetic";

<HoverMagnetic strength={30}>
	<button>Click me</button>
</HoverMagnetic>;
```

#### **TextStaggerAnimation**

Anima palabras con stagger.

```jsx
import TextStaggerAnimation from "@/components/TextStaggerAnimation";

<TextStaggerAnimation
	text="Hola mundo creativo"
	className="display-lg"
	trigger={true}
/>;
```

#### **MorphingShapes**

Formas abstractas que flotan animadas.

```jsx
import MorphingShapes from "@/components/MorphingShapes";

<MorphingShapes />;
```

#### **NumberCounter**

Cuenta números con animación (útil para estadísticas).

```jsx
import NumberCounter from "@/components/NumberCounter";

<NumberCounter value={150} duration={2} suffix="+" />;
```

---

## 🎨 Nuevos Estilos CSS

Se añadieron estos estilos en `globals.css`:

```css
/* Caracteres individuales para animación */
.char {
	opacity: 0;
	transform: translateY(20px);
	display: inline-block;
}
```

---

## 🚀 Próximos Pasos

1. **Prueba el sitio:**

   ```bash
   npm run dev
   # o
   pnpm dev
   ```

2. **Personaliza las animaciones:**

   -  Cambia `duration` en los componentes
   -  Ajusta `ease` (power2.out, power3.out, elastic.out, etc.)
   -  Modifica `stagger` values

3. **Añade más animaciones:**
   -  Usa `gsap.to()` / `gsap.from()` para animar elementos custom
   -  Integra `ScrollTrigger` para efectos en scroll
   -  Crea parallax con `gsap` + `ScrollTrigger`

---

## 📚 Plugins GSAP Registrados

-  `ScrollTrigger` - Animaciones basadas en scroll
-  `MotionPath` (opcional) - Animar elementos por rutas SVG
-  `Draggable` (opcional) - Elementos arrastrables

---

## 🎯 Ejemplos Usados en tu Sitio

✅ **Hero Section** - AnimatedHero  
✅ **Services** - CardAnimation + RevealOnScroll  
✅ **About Title** - SplitTextAnimation  
✅ **Projects** - CardAnimation + RevealOnScroll  
✅ **Contact** - RevealOnScroll

---

## 💡 Tips Avanzados

### Crear Timeline Personalizado

```jsx
useEffect(() => {
	const tl = gsap.timeline();
	tl.from(".element1", { opacity: 0, duration: 1 }, 0)
		.from(".element2", { opacity: 0, duration: 1 }, 0.3)
		.to(".element3", { x: 100, duration: 1 }, 0.5);
}, []);
```

### Trigger en Scroll

```jsx
gsap.to(".element", {
	scrollTrigger: {
		trigger: ".element",
		start: "top 80%",
		end: "bottom 20%",
		scrub: 1, // smooth scrubbing
		markers: true, // debug
	},
	duration: 1,
	y: -50,
});
```

---

**¡Listo! Disfruta de tus nuevas animaciones profesionales.** 🎉
