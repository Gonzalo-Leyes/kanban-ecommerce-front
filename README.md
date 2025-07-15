# Dashboard Kanban + Catálogo E-commerce



## 🚀 Características

### Dashboard Kanban
- **3 columnas**: Por Hacer, En Progreso, Completado
- **Drag & Drop**: Mover tareas entre columnas
- **Edición inline**: Editar tareas directamente en las tarjetas
- **Prioridades**: Alta, Media, Baja con indicadores visuales
- **Filtros**: Por estado y prioridad
- **Modo oscuro/claro**: Toggle de tema persistente

### Catálogo E-commerce
- **Grid responsivo**: 4/2/1 columnas según breakpoint
- **Product Cards**: Con imágenes lazy loading y skeleton
- **Filtros avanzados**: Por categoría, precio, rating
- **Búsqueda**: Con debounce de 300ms
- **Formato de precios**: Localización con Intl.NumberFormat
- **Rating visual**: Con estrellas y puntuación
- **Descuentos**: Badges de porcentaje de descuento

## 🛠️ Tecnologías

- **React 18+** con TypeScript 5+
- **Vite** para build y desarrollo
- **React Router** para navegación
- **CSS Variables** para theming
- **Testing Library** para tests
- **Vitest** para testing
- **ESLint** para linting

## 📦 Instalación

```bash
# Instalar dependencias
yarn install

# Ejecutar en desarrollo
yarn dev

# Build para producción
yarn build

# Ejecutar tests
yarn test

# Ejecutar tests con cobertura
yarn test:coverage
```

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con navegación
│   ├── ThemeToggle.tsx # Toggle de tema claro/oscuro
│   ├── ProductCard.tsx # Tarjeta de producto
│   ├── ProductFilters.tsx # Filtros del catálogo
│   ├── KanbanColumn.tsx # Columna del tablero Kanban
│   ├── TaskCard.tsx    # Tarjeta de tarea
│   └── TaskForm.tsx    # Formulario de nueva tarea
├── pages/              # Páginas principales
│   ├── Kanban.tsx      # Dashboard Kanban
│   └── Products.tsx    # Catálogo de productos
├── hooks/              # Custom hooks
│   └── useTheme.tsx    # Hook para gestión de tema
├── services/           # Servicios de API
│   └── productService.ts # Servicio de productos
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces principales
├── styles/             # Estilos globales
│   └── index.css       # CSS con variables de tema
└── tests/              # Configuración de tests
    └── setup.ts        # Setup de testing
```

## 🎨 Diseño y UX

- **Identidad visual propia**: Paleta de colores personalizada
- **Responsive design**: Mobile-first con breakpoints optimizados
- **Accesibilidad**: WCAG 2.1 AA, ARIA labels, keyboard navigation
- **Performance**: Lazy loading, code splitting, optimizaciones
- **Iconografía**: SVG icons integrados (🌞/🌚, 🛒, ⭐)

## 🔧 Configuración

### Variables de entorno
```env
VITE_API_URL=https://dummyjson.com/products
```

### Scripts disponibles
- `yarn dev` - Servidor de desarrollo
- `yarn build` - Build de producción
- `yarn preview` - Preview del build
- `yarn test` - Ejecutar tests
- `yarn lint` - Linting del código
- `yarn type-check` - Verificación de tipos

## 📱 Responsive Breakpoints

- **Mobile**: ≤ 767px (1 columna)
- **Tablet**: 768px - 1279px (2 columnas)
- **Desktop**: ≥ 1280px (4 columnas)

## 🧪 Testing

Cobertura de tests ≥ 80% en componentes críticos:
- ProductCard
- KanbanColumn
- TaskCard
- ThemeToggle

---

**Criterios de Tecnologías implementadas:**
- React 18+
- TypeScript 5+
- Vite
- React Router
- CSS Variables
- Vitest
- ESLint
- Zustand (facil de implementar, flexible y eficiente)
- Styled Components (utilizado ampliamente, simple, y ofrece buena compatibilidad con Framer Motion)
- Framer Motion ( un paquete un tanto pesado, pero de los mas completos, versátiles, personalizables, y robusto.)
- dnd kit (compatible con SortableJS, y ofrece un gran número de funcionalidades. Sobre todo, compatible con React 18+)



## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

