# 🔑 Configuración de API Key de Unsplash

## 📋 Pasos para configurar tu API key

### 1. Obtener tu API Key

1. Ve a [https://unsplash.com/oauth/applications](https://unsplash.com/oauth/applications)
2. Inicia sesión con tu cuenta de Unsplash
3. Haz clic en "New Application" o usa una aplicación existente
4. Copia la **"Access Key"** (no la Secret Key)

### 2. Crear archivo .env

Crea un archivo llamado `.env` en la raíz de tu proyecto con el siguiente contenido:

```env
VITE_UNSPLASH_ACCESS_KEY=tu_api_key_aqui
```

**Reemplaza `tu_api_key_aqui` con tu Access Key real.**

### 3. Verificar la configuración

Ejecuta el script de verificación:
```bash
node scripts/test-unsplash-integration.cjs
```

## 🔍 Ejemplo de API Key

Tu API key debería verse algo así:
```
VITE_UNSPLASH_ACCESS_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## ⚠️ Importante

- **Nunca compartas tu API key**
- **No subas el archivo .env a Git**
- **El archivo .env debe estar en .gitignore**

## 🚀 Una vez configurado

Podrás usar los componentes de Unsplash en tu proyecto:

```tsx
import UnsplashImage from './components/UnsplashImage';
import UnsplashImageGallery from './components/UnsplashImageGallery';

// Imagen individual
<UnsplashImage 
  category="destinations" 
  width={800} 
  height={600} 
  alt="Destinos mediterráneos" 
/>

// Galería de imágenes
<UnsplashImageGallery 
  category="boats" 
  count={6} 
  title="Embarcaciones para explorar" 
/>
```

## 📞 Si necesitas ayuda

- Consulta la documentación completa en `docs/unsplash-integration.md`
- Verifica que tu API key sea válida en el dashboard de Unsplash
- Asegúrate de que el archivo .env esté en la raíz del proyecto 