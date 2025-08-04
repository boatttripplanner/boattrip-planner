# 🔍 Guía de Verificación de Credenciales Amazon API

## ❌ Problemas Identificados

### 1. Access Key ID Incorrecto
- **Actual:** `AKPAXD3F0H1753982397`
- **Problema:** Empieza con "AKPA" en lugar de "AKIA"
- **Solución:** Las credenciales de Amazon PAAPI deben empezar con "AKIA"

### 2. Endpoint de Amazon España
- **Problema:** `webservices.amazon.es` devuelve 405 Method Not Allowed
- **Solución:** Usar `webservices.amazon.com` con marketplace `amazon.es`

## ✅ Pasos para Verificar Credenciales

### Paso 1: Acceder a Amazon Associates
1. Ve a: https://affiliate-program.amazon.es/
2. Inicia sesión con tu cuenta de Amazon Associates

### Paso 2: Verificar Product Advertising API
1. En el menú lateral, busca "Product Advertising API"
2. Verifica que tu cuenta esté **aprobada** para PAAPI
3. Confirma que las credenciales estén **activas**

### Paso 3: Obtener Credenciales Correctas
1. Si tu cuenta está aprobada, genera nuevas credenciales
2. **Access Key ID** debe empezar con "AKIA"
3. **Secret Access Key** debe tener 40 caracteres
4. **Associate Tag** debe ser "explorashop18-21"

### Paso 4: Verificar Configuración
- **Marketplace:** amazon.es
- **Región:** eu-west-1
- **Host:** webservices.amazon.com (no webservices.amazon.es)

## 🔧 Configuración Corregida

```typescript
export const AMAZON_API_CONFIG = {
  accessKeyId: 'AKIA...', // Debe empezar con AKIA
  secretAccessKey: '...', // 40 caracteres
  associateTag: 'explorashop18-21',
  marketplace: 'amazon.es',
  region: 'eu-west-1',
  host: 'webservices.amazon.com', // Cambiar a .com
  service: 'ProductAdvertisingAPI',
  version: '2013-08-01'
};
```

## 📋 Checklist de Verificación

- [ ] Cuenta de Amazon Associates activa
- [ ] Aprobación para Product Advertising API
- [ ] Access Key ID empieza con "AKIA"
- [ ] Secret Access Key tiene 40 caracteres
- [ ] Associate Tag correcto
- [ ] Host configurado como webservices.amazon.com
- [ ] Marketplace configurado como amazon.es
- [ ] Región configurada como eu-west-1

## 🚨 Posibles Causas del Error

1. **Cuenta no aprobada:** Amazon requiere aprobación específica para PAAPI
2. **Credenciales expiradas:** Las credenciales pueden haber expirado
3. **Límites excedidos:** Puede haber alcanzado el límite de llamadas API
4. **Configuración incorrecta:** Host o región mal configurados
5. **Associate Tag inactivo:** El tag puede estar desactivado

## 📞 Contacto con Amazon

Si los problemas persisten:
- Email: associates-support@amazon.com
- Teléfono: +34 900 123 456 (España)
- Chat en vivo: Disponible en el panel de Amazon Associates 