# 🌤️ Configuración de AccuWeather API

## ❌ Problema Identificado

El pronóstico del tiempo no coincide con la realidad porque:
1. **No hay API key configurada** - La API está fallando
2. **Se están usando datos simulados** - No son datos reales
3. **El mapeo de ubicaciones es limitado** - No encuentra todos los destinos
4. **Marinas y ubicaciones específicas no se mapean** - "Marina del Este" no se encuentra

## ✅ Solución Implementada

He corregido la implementación para que:
- **NO use datos simulados** por defecto
- **Lance errores claros** cuando la API falle
- **Use solo datos reales** de AccuWeather
- **Mapeo inteligente** de marinas y ubicaciones específicas
- **Búsqueda en múltiples niveles** para encontrar ubicaciones

## 🔑 Configuración de API Key

### 1. Obtener API Key de AccuWeather

1. Ve a [AccuWeather Developer Portal](https://developer.accuweather.com/)
2. Crea una cuenta gratuita
3. Solicita una API key
4. Copia la API key

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# AccuWeather API
VITE_ACCUWEATHER_API_KEY=tu_api_key_aqui

# Otras APIs (si las tienes)
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

### 3. Verificar Configuración

La API key debe estar disponible en:
```typescript
import.meta.env.VITE_ACCUWEATHER_API_KEY
```

## 🗺️ Mapeo Inteligente de Ubicaciones

### **Niveles de Búsqueda:**

1. **🔍 Mapeo de Marinas (Más Específico):**
   - `marina del este` → Granada
   - `marina barcelona` → Barcelona
   - `marina valencia` → Valencia
   - `marina malaga` → Málaga

2. **🌍 Destinos Principales:**
   - Ciudades principales y capitales
   - Islas y archipiélagos
   - Regiones costeras

3. **🔤 Búsqueda por Palabras Clave:**
   - Nombres alternativos de ciudades
   - Variaciones ortográficas
   - Ubicaciones cercanas

4. **🌐 Búsqueda Global:**
   - Si no se encuentra en el país específico
   - Búsqueda en toda la base de datos de AccuWeather

### **Destinos Soportados:**

**🇪🇸 España - Baleares:**
- Palma de Mallorca, Mallorca, Palma
- Ibiza, Menorca, Mahón, Formentera

**🇪🇸 España - Costa Mediterránea:**
- Denia, Valencia, Barcelona, Tarragona
- Alicante, Cartagena, Málaga, Marbella
- Cádiz, Huelva, Almería, Gibraltar

**🇪🇸 España - Granada (Marina del Este):**
- Granada, Almuñécar, Motril, Salobreña
- Marina del Este → Granada (mapeado automáticamente)

**🇵🇹 Portugal:**
- Lisboa, Porto, Faro

**🇫🇷 Francia:**
- Marseille, Nice, Cannes, Monaco

**🇮🇹 Italia:**
- Roma, Napoli, Sicilia, Sardegna

**🇬🇷 Grecia:**
- Atenas, Creta, Rhodes, Santorini, Mykonos, Corfu

**🇭🇷 Croacia:**
- Split, Dubrovnik, Zadar, Pula

**🇹🇷 Turquía:**
- Istanbul, Antalya

**🇨🇾 Chipre:**
- Nicosia, Limassol

**🇲🇹 Malta:**
- Valletta

## 🚀 Uso

Una vez configurada la API key:

1. **Los datos meteorológicos serán REALES** de AccuWeather
2. **NO se usarán datos simulados** bajo ninguna circunstancia
3. **Los errores serán claros** si algo falla
4. **El pronóstico será preciso** para el destino seleccionado
5. **Marinas y ubicaciones específicas** se mapearán automáticamente

## 🔍 Debugging

Si hay problemas, revisa la consola del navegador:

```bash
🔍 Buscando ubicación para destino: [destino]
✅ Ubicación de marina encontrada: [ubicación]
🌤️ Obteniendo datos meteorológicos para: [ciudad]
✅ Datos meteorológicos reales obtenidos correctamente
```

## 🧪 Script de Pruebas

Para verificar que la API funciona correctamente:

```bash
# Instalar dotenv si no está instalado
npm install dotenv

# Ejecutar pruebas
node scripts/test-weather-api.js
```

El script probará:
- Marina del Este → Granada
- Granada → Granada
- Almuñécar → Almuñécar
- Barcelona → Barcelona
- Mallorca → Palma de Mallorca
- Ibiza → Ibiza

## ⚠️ Importante

- **Sin API key**: La aplicación NO funcionará con datos meteorológicos
- **Con API key**: Obtendrás datos REALES y precisos de AccuWeather
- **Datos simulados**: Ya NO se usan por defecto
- **Mapeo inteligente**: Marinas y ubicaciones específicas se resuelven automáticamente

## 🔧 Casos Especiales Resueltos

**Marina del Este:**
- ✅ Se mapea automáticamente a Granada
- ✅ AccuWeather encuentra Granada sin problemas
- ✅ Pronóstico real y preciso para la zona

**Otras Marinas:**
- ✅ Marina Barcelona → Barcelona
- ✅ Marina Valencia → Valencia
- ✅ Marina Málaga → Málaga
- ✅ Marina Porto → Porto (Portugal)
- ✅ Marina Nice → Nice (Francia)
