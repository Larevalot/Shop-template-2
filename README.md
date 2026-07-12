# MIMO_SHOP

<p align="center">
  <strong>Industrial-styled e-commerce template</strong>
  <br/>
  Astro + TypeScript + TailwindCSS + WhatsApp Checkout
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-7.0-FF5D01?style=flat-square&logo=astro" alt="Astro"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=flat-square" alt="License"/>
</p>

---

## Descripción

**MIMO_SHOP** es un template de e-commerce frontend-only con estética futurista industrial. Diseñado para ser modificado y moldeado según las necesidades de cada proyecto. El checkout se realiza vía WhatsApp, sin pasarela de pagos.

Características principales:

- Catálogo de productos via Astro Content Collections (SEO optimizado)
- Carrito con persistencia en localStorage (nanostores)
- Checkout directo por WhatsApp con mensaje formateado
- Diseño futurista industrial con efectos visuales (noise, scanline, glitch)
- Responsive y mobile-first
- Zero JavaScript innecesario — solo el carrito hidrata en cliente

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| **Astro 7** | Framework principal, SSG |
| **TypeScript** | Tipado estático estricto |
| **TailwindCSS 4** | Estilos via Vite plugin |
| **nanostores** | Estado reactivo del carrito |
| **Content Collections** | Catálogo de productos en Markdown |

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/mimo-template-shop.git
cd mimo-template-shop

# Instalar dependencias (usar pnpm, NO npm)
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu número de WhatsApp

# Servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview
```

## Configuración

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Número de WhatsApp del negocio (sin + ni espacios)
PUBLIC_WHATSAPP_NUMBER=593995341210
```

### Agregar productos

Los productos se definen como archivos Markdown en `src/content/products/`. Cada archivo requiere el siguiente frontmatter:

```markdown
---
id: "mi-producto"
nombre: "Mi Producto"
precio: 29.99
imagen: "/images/mi-producto.jpg"
descripcion: "Descripción corta del producto."
categoria: "mi-categoria"
---

## Detalle del producto

Contenido extendido que aparece en la página de detalle.
```

Las imágenes se colocan en `public/images/` con el nombre especificado en el frontmatter.

### Categorías

Las categorías se generan automáticamente desde el campo `categoria` de cada producto. No requieren configuración adicional.

## Estructura del proyecto

```
mimo-template-shop/
├── public/
│   └── images/              # Imágenes de productos
├── src/
│   ├── content/
│   │   └── products/        # Archivos .md por producto
│   ├── components/
│   │   ├── ProductCard.astro
│   │   ├── CartIcon.astro
│   │   └── CartDrawer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro      # Catálogo con filtros
│   │   └── product/
│   │       └── [...slug].astro  # Detalle de producto
│   ├── scripts/
│   │   ├── cart.ts           # Lógica del carrito
│   │   └── init.ts           # Inicialización y event delegation
│   └── styles/
│       └── global.css        # Paleta industrial y utilidades
├── content.config.ts         # Schema de colecciones
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Personalización

### Paleta de colores

Los colores están definidos en `src/styles/global.css` bajo `@theme`:

```css
--color-neon: #00FF88;      /* Accent principal */
--color-amber: #FFB800;     /* Accent secundario */
--color-carbon: #0A0A0A;    /* Fondo principal */
--color-steel: #1A1A2E;     /* Fondo secundario */
--color-smoke: #8B8B8B;     /* Texto secundario */
--color-light: #E0E0E0;     /* Texto principal */
```

### Tipografía

El template usa JetBrains Mono para elementos de interfaz y tipografía industrial. Para cambiar la fuente, editar el import en `src/layouts/Layout.astro` y las referencias `font-mono` en los componentes.

### Efectos visuales

Los efectos de noise y scanline están en `src/layouts/Layout.astro` bajo `.noise-overlay` y `.scanline-overlay`. Se desactivan automáticamente con `prefers-reduced-motion`.

## Licencia

Este proyecto está licenciado bajo la [GNU General Public License v3.0](LICENSE).

## Créditos

Desarrollado como template de e-commerce con estética industrial. Libre de usar, modificar y distribuir bajo los términos de la GPL-3.0.
