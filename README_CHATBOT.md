# ChatBot IA - Aplicación de Chat con IA en el navegador

Una aplicación moderna de chatbot impulsada por inteligencia artificial que se ejecuta directamente en tu navegador usando web-llm. Construida con React, TypeScript, Tailwind CSS y vitest.

## ✨ Características

- **IA en el Navegador**: Utiliza web-llm para ejecutar modelos de lenguaje localmente sin necesidad de servidor
- **Tema Moderno y Futurista**: Interfaz hermosa con gradientes, sombras y animaciones suaves
- **Soporte Tema Oscuro/Claro/Sistema**: Cambiar entre temas light, dark o seguir la preferencia del sistema
- **Múltiples Modelos IA**: Selecciona entre diferentes modelos según tus necesidades
  - Qwen2 0.5B (muy ligero y rápido)
  - Phi-3 Mini (equilibrio velocidad-capacidad)
  - Mistral-7B (más potente)
- **Interfaz Responsiva**: Funciona perfectamente en desktop, tablet y móvil
- **Tests Completos**: Suite completa de tests con vitest y @testing-library
- **Buenas Prácticas React**: Hooks, Context API, manejo de estado, componentes reutilizables

## 🚀 Instalación

```bash
# Clonar el repositorio
cd chatapp

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.4** - Librería de UI moderna
- **TypeScript** - Tipado estático para mayor seguridad
- **Tailwind CSS 4.2** - Utilidades CSS para estilos modernos
- **Lucide React** - Iconos de alta calidad

### IA
- **@mlc-ai/web-llm** - Ejecución de LLMs en el navegador

### Desarrollo y Testing
- **Vite** - Bundler y servidor de desarrollo rápido
- **Vitest** - Framework de testing compatible con Vite
- **@testing-library/react** - Utilidades para testing de componentes
- **ESLint** - Linting de código
- **TypeScript** - Compilador y type checker

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ChatContainer.tsx       # Contenedor principal del chat
│   ├── ChatContainer.test.tsx  # Tests del contenedor
│   ├── ThemeToggle.tsx         # Selector de tema
│   └── ThemeToggle.test.tsx    # Tests del selector
├── context/
│   ├── ChatContext.tsx         # Contexto para estado del chat
│   ├── ChatContext.test.tsx    # Tests del contexto
│   ├── ThemeContext.tsx        # Contexto para tema
│   └── ThemeContext.test.tsx   # Tests del tema
├── services/
│   ├── LLMService.ts           # Servicio para web-llm
│   └── LLMService.test.ts      # Tests del servicio
├── utils/
│   ├── helpers.ts              # Funciones utilitarias
│   └── helpers.test.ts         # Tests de utilidades
├── App.tsx                     # Componente principal
├── index.css                   # Estilos globales
└── main.tsx                    # Punto de entrada
```

## 🎨 Características de Tema

La aplicación soporta tres modos de tema:

1. **Light Mode**: Tema claro optimizado para el día
2. **Dark Mode**: Tema oscuro para reducir fatiga visual
3. **System**: Sigue la preferencia del sistema operativo

El tema se persiste en `localStorage` y se sincroniza entre tabs.

## 🤖 Modelo de IA

### Modelos Disponibles

| Modelo | Descripción | Velocidad | Tamaño |
|--------|-------------|-----------|--------|
| Qwen2-0.5B | Modelo ligero y muy rápido | ⚡⚡⚡ | ~300MB |
| Phi-3-mini | Equilibrio velocidad-capacidad | ⚡⚡ | ~2GB |
| Mistral-7B | Modelo más potente | ⚡ | ~4GB |

Puedes cambiar el modelo desde el panel de configuración (icono de engranaje).

## 🧪 Testing

La aplicación cuenta con una suite completa de tests:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm run test:coverage

# Abrir UI de vitest
npm run test:ui
```

### Cobertura de Tests

- **ThemeContext**: Cambio de tema, persistencia, sincronización
- **ChatContext**: Manejo de mensajes, carga de estado
- **ChatContainer**: Renderizado, interacción del usuario
- **ThemeToggle**: Cambio de tema, visual feedback
- **LLMService**: Inicialización, configuración de modelos
- **Helpers**: Utilidades y funciones comunes

## 🔧 Guía de Desarrollo

### Agregar un Nuevo Modelo

Edita `src/services/LLMService.ts`:

```typescript
export type ModelId = 
  | 'Qwen2-0.5B-Instruct-q4f32_1-MLC'
  | 'Phi-3-mini-4k-instruct-q4f32_1-MLC'
  | 'mistral-7b-instruct-v0p2-q4f16_1-MLC'
  | 'tu-nuevo-modelo'  // Agregar aquí

const MODEL_PRESETS: Record<ModelId, string> = {
  // ... modelos existentes
  'tu-nuevo-modelo': 'Mi Modelo - Descripción',
}
```

### Crear un Nuevo Componente

```typescript
import React from 'react'

interface MiComponenteProps {
  prop1: string
  prop2?: number
}

export function MiComponente({ prop1, prop2 = 0 }: MiComponenteProps) {
  return (
    <div className="p-4 rounded-lg">
      {prop1} {prop2}
    </div>
  )
}
```

### Buenas Prácticas React

✅ **Hacer**:
- Usar hooks funcionales
- Memoizar props cuando sea necesario
- Mantener componentes pequeños y enfocados
- Usar TypeScript para type safety
- Escribir tests para componentes críticos

❌ **Evitar**:
- Componentes de clase
- Lógica compleja en componentes
- Props drilling profundo
- Mutación de estado directa

## 🚀 Optimizaciones

- Code splitting automático con Vite
- Tree shaking de dependencias no usadas
- Lazy loading de componentes cuando sea apropiado
- Caché inteligente de mensajes
- Transiciones suaves CSS

## 📝 Notas

- web-llm descargará modelos la primera vez que se inicialicen (~300MB - 4GB dependiendo del modelo)
- Los modelos se guardan en el `IndexedDB` del navegador para futuras sesiones
- La aplicación funciona completamente offline una vez que el modelo está descargado

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Hacer fork del proyecto
2. Crear un branch para tu feature
3. Escribir tests para nuevas funcionalidades
4. Hacer commit de tus cambios
5. Push y abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👨‍💻 Autor

Creado como un ejemplo moderno de aplicación React con IA.

---

**Nota**: Esta aplicación requiere un navegador moderno con soporte para WebAssembly. Se probó con:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
