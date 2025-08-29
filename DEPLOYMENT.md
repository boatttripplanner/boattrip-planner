# 🚀 Guía de Deploy - Boat Trip Planner

## Configuración Inicial

### 1. Configurar Vercel (Primera vez)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Configurar el proyecto
vercel

# Seguir las instrucciones en pantalla:
# - Conectar tu cuenta de GitHub
# - Seleccionar el repositorio
# - Configurar el dominio personalizado (opcional)
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# API Keys
VITE_UNSPLASH_ACCESS_KEY=tu_api_key_aqui
VITE_ACCUWEATHER_API_KEY=tu_api_key_aqui
VITE_AMAZON_API_KEY=tu_api_key_aqui

# URLs
VITE_WEBSITE_URL=https://www.boattrip-planner.com
VITE_API_BASE_URL=https://tu-api-url.com
```

## Deploy Automatizado

### Opción 1: Script PowerShell (Recomendado)

```powershell
# Ejecutar el script de deploy
.\deploy.ps1
```

### Opción 2: Comandos Manuales

```bash
# 1. Actualizar repositorio
git pull origin master

# 2. Instalar dependencias
npm install

# 3. Build del proyecto
npm run build

# 4. Deploy a Vercel
vercel --prod
```

### Opción 3: Deploy Automático con GitHub Actions

El deploy se ejecuta automáticamente cuando haces push a la rama `master`.

## Verificación del Deploy

### 1. Verificar Build
- Revisar que se genere el directorio `dist/`
- Verificar que no haya errores en la consola

### 2. Verificar Deploy
- Revisar el dashboard de Vercel
- Verificar que la URL de producción esté funcionando
- Probar funcionalidades principales

### 3. Verificar SEO
- Verificar que `robots.txt` esté accesible
- Verificar que `sitemap.xml` esté accesible
- Probar meta tags y Open Graph

## Troubleshooting

### Error: Build falla
```bash
# Limpiar cache
npm run clean
rm -rf node_modules
npm install
```

### Error: Deploy falla
```bash
# Verificar configuración de Vercel
vercel --debug

# Reconfigurar proyecto
vercel --force
```

### Error: Variables de entorno
- Verificar que `.env.local` esté configurado
- Verificar que las variables estén en Vercel Dashboard
- Reiniciar el deploy después de cambiar variables

## Monitoreo

### 1. Vercel Analytics
- Revisar métricas de rendimiento
- Monitorear errores en producción
- Verificar velocidad de carga

### 2. Logs
```bash
# Ver logs de Vercel
vercel logs

# Ver logs específicos de función
vercel logs --function=api/function-name
```

## Optimizaciones

### 1. Performance
- Imágenes optimizadas con WebP
- Lazy loading implementado
- Service Worker para cache

### 2. SEO
- Meta tags dinámicos
- Sitemap automático
- Robots.txt configurado

### 3. Security
- Headers de seguridad configurados
- HTTPS forzado
- CSP headers (opcional)

## Contacto

Para soporte técnico o preguntas sobre el deploy:
- Revisar logs de Vercel
- Verificar configuración en `.vercel/project.json`
- Consultar documentación de Vercel
