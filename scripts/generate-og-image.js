const fs = require('fs');
const path = require('path');

// Crear una imagen de vista previa optimizada para redes sociales
// Basada en el logo alex5.svg con un fondo atractivo

const ogImageHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BoatTrip Planner - OG Image</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #0d9488 0%, #0891b2 25%, #0ea5e9 50%, #3b82f6 75%, #6366f1 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        /* Efectos de fondo */
        .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%);
            z-index: 1;
        }
        
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 40px;
        }
        
        .logo {
            width: 200px;
            height: 200px;
            margin-bottom: 30px;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
        }
        
        .title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            line-height: 1.2;
        }
        
        .subtitle {
            font-size: 24px;
            font-weight: 400;
            opacity: 0.9;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 30px;
        }
        
        .features {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
        }
        
        .feature {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 500;
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .feature-icon {
            font-size: 24px;
        }
        
        .domain {
            position: absolute;
            bottom: 30px;
            right: 40px;
            font-size: 20px;
            font-weight: 600;
            opacity: 0.8;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        /* Animaciones sutiles */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .logo {
            animation: float 6s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="background-pattern"></div>
    
    <div class="content">
        <img src="/alex5.svg" alt="BoatTrip Planner Logo" class="logo">
        
        <h1 class="title">BoatTrip Planner</h1>
        <p class="subtitle">Planifica tu ruta en barco con inteligencia artificial</p>
        
        <div class="features">
            <div class="feature">
                <span class="feature-icon">🗺️</span>
                <span>Rutas Marinas</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🤖</span>
                <span>IA Inteligente</span>
            </div>
            <div class="feature">
                <span class="feature-icon">⛵</span>
                <span>Navegación</span>
            </div>
        </div>
    </div>
    
    <div class="domain">boattrip-planner.com</div>
</body>
</html>
`;

// Crear el archivo HTML
const outputPath = path.join(__dirname, '../public/og-image.html');
fs.writeFileSync(outputPath, ogImageHTML);

console.log('✅ Archivo og-image.html creado en public/');
console.log('📝 Para generar la imagen PNG, puedes usar herramientas como:');
console.log('   - Puppeteer (headless browser)');
console.log('   - Playwright');
console.log('   - Servicios online como og-image.vercel.app');
console.log('   - Herramientas de diseño como Figma o Canva');
console.log('');
console.log('🎨 La imagen debería ser de 1200x630px para optimizar en redes sociales'); 