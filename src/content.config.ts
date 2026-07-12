import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    precio: z.number(),
    imagen: z.string(),
    descripcion: z.string(),
    categoria: z.string(),
  }),
});

export const collections = { products };
