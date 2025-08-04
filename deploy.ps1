# Script para hacer commit y deploy
Write-Host "🚀 Iniciando proceso de commit y deploy..." -ForegroundColor Green

# Agregar todos los cambios
Write-Host "📁 Agregando archivos al staging..." -ForegroundColor Yellow
git add .

# Hacer commit
Write-Host "💾 Haciendo commit..." -ForegroundColor Yellow
git commit -m "Actualización completa: mejoras en componentes y optimizaciones"

# Push al repositorio
Write-Host "📤 Haciendo push al repositorio..." -ForegroundColor Yellow
git push origin master

# Deploy con Vercel
Write-Host "🌐 Desplegando en Vercel..." -ForegroundColor Yellow
npm run deploy

Write-Host "✅ Proceso completado!" -ForegroundColor Green 