# Guía de Usuario - ChatBot IA

## 🚀 Primeros Pasos

### 1. Instalar y Ejecutar

```bash
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

### 2. Primera Conversación

1. Espera a que el modelo se cargue (verás "⏳ Loading..." en el header)
2. Una vez que esté listo, verás "✅ Ready" en el header
3. Escribe tu primer mensaje en la caja de entrada
4. Presiona Enter o haz clic en el botón de envío
5. El modelo procesará tu mensaje y responderá

## 🎨 Personalización del Tema

### Cambiar Tema

1. Mira el botón de tema en la esquina superior derecha
2. Tiene tres opciones:
   - ☀️ **Light**: Tema claro
   - 🌙 **Dark**: Tema oscuro
   - 🖥️ **System**: Sigue tu preferencia del SO

### El tema se guarda automáticamente

Una vez que elijas un tema, se recordará la próxima vez que visites la aplicación.

## ⚙️ Configuración

### Abrir Configuración

Haz clic en el icono ⚙️ en la esquina superior derecha

### Opciones Disponibles

#### 1. Seleccionar Modelo

Elige entre tres modelos según tu necesidad:

| Modelo | Velocidad | Capacidad | Tamaño | Uso Recomendado |
|--------|-----------|-----------|--------|-----------------|
| **Qwen2 0.5B** | ⚡⚡⚡ | Básica | ~300MB | Prototipos, testing |
| **Phi-3 Mini** | ⚡⚡ | Buena | ~2GB | Producción, balance |
| **Mistral-7B** | ⚡ | Excelente | ~4GB | Tareas complejas |

⚠️ **Primera descarga**: La primera vez que elijas un modelo, se descargará automáticamente. Esto puede tardar unos minutos.

#### 2. Limpiar Chat

Usa "Clear Chat" para:
- Iniciar una nueva conversación
- Liberar memoria
- Resetear el estado

## 💬 Consejos para Usar el Chat

### Prompts Efectivos

✓ **Buenos prompts**:
```
"Explícame qué es machine learning en términos simples"
"Escribe un programa Python que ordene una lista"
"Dame 5 consejos para aprender programación"
```

✗ **Prompts débiles**:
```
"hola"
"dame todo sobre IA"
"???"
```

### Conversaciones Largas

- El modelo mantiene el contexto de mensajes anteriores
- Las respuestas serán mejores si el contexto es claro
- Si el chat se pone muy largo, considera hacer "Clear Chat"

### Limitaciones

- Máximo ~512 tokens por respuesta
- El modelo se ejecuta en el navegador (recursos limitados)
- Algunos temas específicos pueden no ser precisos
- Sin conexión a internet real después de descargar modelos

## 📊 Monitoreo de Aplicación

### Indicadores en el Header

1. **Estado del Modelo**:
   - ⏳ "Initializing..." - Cargando el modelo
   - ✅ "Ready" - Listo para usar
   - Nombre del modelo - Qué modelo está activo

2. **Icono de Engranaje**:
   - Haz clic para abrir configuración
   - Vuelve a hacer clic para cerrar

### Indicadores en el Input

- **Botón SEND deshabilitado**: Espera a que el modelo esté listo o hay un error
- **Texto gris**: El modelo está pensando

## 🔧 Troubleshooting

### El modelo tarda mucho en cargar

**Causa**: Es normal, web-llm descarga el modelo por primera vez

**Solución**:
- Espera a que se complete (puede tardar 5-10 minutos según conexión)
- El próximo acceso será más rápido (está en caché)

### El chat no responde

**Causa**: El modelo podría estar procesando

**Solución**:
1. Espera 30 segundos
2. Intenta con un mensaje más corto
3. Recarga la página (F5)

### Error "LLM not initialized"

**Causa**: El modelo falló al cargar

**Solución**:
1. Prueba con otro modelo en Configuración
2. Limpia el caché del navegador
3. Recarga la página

### Bajo rendimiento o congelamiento

**Causa**: Tu navegador necesita más recursos

**Solución**:
1. Cierra otras pestañas
2. Usa un modelo más ligero (Qwen2)
3. Limpia el historial del chat

## 💾 Datos y Privacidad

### ¿Dónde se guardan mis conversaciones?

- **Únicamente en tu navegador** (localStorage)
- **No se envía a ningún servidor**
- **No hay datos en la nube**

### ¿Se borran los datos?

Tus datos se borran cuando:
- Haces "Clear Chat"
- Limpias el storage del navegador
- Desinstalas la aplicación

### ¿Qué información se recopila?

**Ninguna**. Esta aplicación funciona completamente sin recopilar datos.

## 🖥️ Requisitos del Sistema

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Recursos Mínimos

- **RAM**: 4GB recomendado
- **Espacio**: ~1-4GB para modelos
- **Conexión**: Solo para descargar modelos (después funciona offline)
- **WebAssembly**: Soporte obligatorio

## 🎯 Casos de Uso

### Ideal Para

1. ✅ Prototipos y experimentación
2. ✅ Educación y aprendizaje
3. ✅ Escritura creativa
4. ✅ Explicaciones técnicas
5. ✅ Brainstorming

### No Recomendado Para

1. ❌ Aplicaciones críticas en producción
2. ❌ Análisis de datos sensibles
3. ❌ Toma de decisiones en salud/legal
4. ❌ Traducción profesional
5. ❌ Tareas que requieren precisión 100%

## 🆘 Soporte y Feedback

### Responder Preguntas

Para mejor soporte, describe:

1. ¿Qué intentabas hacer?
2. ¿Qué sucedió?
3. ¿Qué esperabas que sucediera?
4. Tu navegador y SO
5. Pasos para reproducir

### Reportar Bugs

Abre un issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Captura de pantalla (si aplica)
- Navegador y versión

## 📚 Recursos Adicionales

- [Documentación de web-llm](https://github.com/mlc-ai/web-llm)
- [Modelos disponibles](https://huggingface.co/models)
- [Prompting tips](https://platform.openai.com/docs/guides/prompt-engineering)

---

¡Disfruta usando ChatBot IA! 🚀
