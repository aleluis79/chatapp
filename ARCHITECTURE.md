# Guía de Arquitectura - ChatBot IA

## Visión General

Esta aplicación implementa un chatbot moderno con IA que se ejecuta en el navegador usando web-llm. La arquitectura está diseñada para ser escalable, testeable y fácil de mantener.

## Patrones y Principios

### 1. Context API para Estado Global

Se utiliza React Context API para manejar dos aspectos principales:

**ThemeContext**: Gestiona el tema de la aplicación
```typescript
- theme: 'light' | 'dark' | 'system'
- resolvedTheme: El tema actual computado
- setTheme(): Cambia el tema
```

**ChatContext**: Gestiona el estado de conversación
```typescript
- messages: Array de mensajes
- addMessage(): Agregar mensaje
- clearMessages(): Limpiar chat
- isLoading: Estado de carga
```

### 2. Servicio para Lógica de Negocio

`LLMService` encapsula toda la lógica de web-llm:
- Inicialización de modelos
- Gestión de conversaciones
- Cambio de modelos
- Cleanup de recursos

### 3. Componentes Funcionales

Solo usamos componentes funcionales con hooks:

```typescript
// ✓ Bueno
export function MiComponente() {
  const [estado, setEstado] = useState()
  return <div>{estado}</div>
}

// ✗ Evitar
export class MiComponente extends React.Component {
  // ...
}
```

### 4. TypeScript Strict Mode

Se utiliza TypeScript en modo estricto para máxima seguridad:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

## Estructura de Carpetas

```
src/
├── components/     # Componentes UI reutilizables
├── context/        # Contextos de React
├── services/       # Lógica de negocio y API
├── utils/          # Funciones utilitarias
├── App.tsx         # Componente raíz
└── main.tsx        # Punto de entrada
```

## Flujo de Datos

```
App (ThemeProvider + ChatProvider)
  ↓
ChatContainer (componente principal)
  ├── ChatInput (input del usuario)
  ├── MessageList (lista de mensajes)
  ├── Settings (panel de config)
  └── ThemeToggle (selector de tema)

Estado → Context → Componentes
```

## Ciclo de Vida de un Mensaje

1. Usuario escribe mensaje y presiona enviar
2. `ChatContainer` captura el evento
3. Se agrega el mensaje a `ChatContext`
4. El nuevo mensaje se muestra inmediatamente
5. Se llama a `LLMService.chat()`
6. La respuesta del modelo se va agregando token por token
7. Se agrega el mensaje de respuesta a `ChatContext`

## Manejo de Temas

### Sistema de Temas

1. **localStorage**: persiste el tema seleccionado
2. **Media Query**: escucha cambios de preferencia del sistema
3. **DOM Class**: aplica la clase "dark" al elemento root
4. **Transiciones CSS**: cambios suaves entre temas

### Flujo de Cambio de Tema

```typescript
usuario selecciona tema
    ↓
setTheme() en ThemeContext
    ↓
localStorage actualiza
    ↓
useEffect aplica cambios visuales
    ↓
componentes re-renderizan
```

## Testing

### Estrategia de Testing

- **Unit Tests**: Para funciones puras (helpers)
- **Component Tests**: Para componentes con @testing-library
- **Integration Tests**: Para contextos y providers

### Ejemplos de Test

```typescript
// Test de componente
it('should render button', () => {
  render(<MiComponente />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Test de contexto
it('should provide context', () => {
  render(
    <MiProvider>
      <Consumidor />
    </MiProvider>
  )
  // assertions...
})
```

## Performance

### Optimizaciones Implementadas

1. **Code Splitting**: Vite maneja automáticamente
2. **Tree Shaking**: Dependencias no usadas se eliminan
3. **Lazy Loading**: web-llm se carga solo cuando se usa
4. **CSS Transitions**: Hardware-accelerated con GPU
5. **memoization**: Para props y cálculos costosos

### Mejoras Futuras

- React.memo para componentes puros
- useMemo para cálculos costosos
- useCallback para funciones en props
- Virtualization para listas grandes

## Seguridad

### Consideraciones

1. **No hay backend**: Todo se ejecuta en el cliente
2. **Datos persistidos localmente**: IndexedDB para modelos
3. **Sin env secrets**: No hay variables sensibles
4. **Content Security Policy**: Headers recomendados

### Headers de Seguridad (para producción)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Escalabilidad

### Cómo Extender

1. **Agregar nuevo modelo**: Actualizar `ModelId` en `LLMService`
2. **Nuevo contexto**: Crear archivo `context/NuevoContext.tsx`
3. **Nuevo componente**: Crear en `components/Nuevo.tsx`
4. **Nueva utilidad**: Agregar en `utils/helpers.ts`

### Plugins Eventuales

- Sistema de plugins para extensiones
- Temas personalizados
- Modelos adicionales
- Integraciones con APIs externas

## Debugging

### DevTools

1. React DevTools - inspeccionar componentes
2. Redux DevTools - para Context API (si se implementa)
3. Vitest UI - visualizar tests
4. Network tab - monitorear descargas de modelos

### Logging

```typescript
// En desarrollo
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}

// En producción
if (error) {
  console.error('Error:', error)
  // Enviar a service de logging
}
```

## Deployment

### Consideraciones

1. **Tamaño del bundle**: ~2MB minificado (sin modelos)
2. **Modelos**: Se descargan bajo demanda (~300MB-4GB)
3. **WebAssembly**: Requiere servidor HTTPS
4. **Cache**: Los modelos se guardan en IndexedDB

### Plataformas Recomendadas

- **Vercel**: Excelente para Next.js/SPA
- **Netlify**: Simple deployment con CI/CD
- **GitHub Pages**: Para aplicaciones estáticas
- **Azure Static Web Apps**: Con serverless functions

## Recursos

- [React Docs](https://react.dev)
- [web-llm GitHub](https://github.com/mlc-ai/web-llm)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Docs](https://vitest.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

Última actualización: Marzo 31, 2026
