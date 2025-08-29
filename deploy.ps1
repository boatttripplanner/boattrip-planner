# Script de Deploy Automatizado para Boat Trip Planner
# Este script automatiza el proceso de build y deploy

Write-Host "🚀 Iniciando proceso de deploy..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar que Git esté configurado
Write-Host "📋 Verificando estado de Git..." -ForegroundColor Yellow
git status

# Hacer pull de los últimos cambios
Write-Host "⬇️  Haciendo pull de los últimos cambios..." -ForegroundColor Yellow
git pull origin master

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Ejecutar tests (si existen)
if (Test-Path "package.json" -and (Get-Content "package.json" | Select-String "test")) {
    Write-Host "🧪 Ejecutando tests..." -ForegroundColor Yellow
    npm test
}

# Build del proyecto
Write-Host "🔨 Construyendo proyecto..." -ForegroundColor Yellow
npm run build

# Verificar que el build fue exitoso
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: El build falló. No se generó el directorio dist." -ForegroundColor Red
    exit 1
}

# Commit y push de cambios
Write-Host "💾 Haciendo commit de cambios..." -ForegroundColor Yellow
git add .
git commit -m "Auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin master

# Deploy a Vercel (si está configurado)
if (Test-Path ".vercel") {
    Write-Host "🚀 Desplegando a Vercel..." -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "⚠️  Vercel no está configurado. Ejecuta 'vercel' para configurar el deploy." -ForegroundColor Yellow
}

Write-Host "✅ Deploy completado exitosamente!" -ForegroundColor Green
Write-Host "🌐 Tu aplicación debería estar disponible en unos minutos." -ForegroundColor Green 