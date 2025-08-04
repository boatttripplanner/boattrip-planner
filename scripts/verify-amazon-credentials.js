import crypto from 'crypto';
import fetch from 'node-fetch';
import fs from 'fs';

console.log('🔍 VERIFICACIÓN DE CREDENCIALES AMAZON API');
console.log('==========================================\n');

// Leer credenciales directamente del archivo constants.ts
const constantsContent = fs.readFileSync('./constants.ts', 'utf8');
const accessKeyMatch = constantsContent.match(/accessKeyId:\s*['"`]([^'"`]+)['"`]/);
const secretKeyMatch = constantsContent.match(/secretAccessKey:\s*['"`]([^'"`]+)['"`]/);
const associateTagMatch = constantsContent.match(/associateTag:\s*['"`]([^'"`]+)['"`]/);
const marketplaceMatch = constantsContent.match(/marketplace:\s*['"`]([^'"`]+)['"`]/);
const regionMatch = constantsContent.match(/region:\s*['"`]([^'"`]+)['"`]/);
const hostMatch = constantsContent.match(/host:\s*['"`]([^'"`]+)['"`]/);

const AMAZON_API_CONFIG = {
    accessKeyId: accessKeyMatch ? accessKeyMatch[1] : 'NO_ENCONTRADO',
    secretAccessKey: secretKeyMatch ? secretKeyMatch[1] : 'NO_ENCONTRADO',
    associateTag: associateTagMatch ? associateTagMatch[1] : 'NO_ENCONTRADO',
    marketplace: marketplaceMatch ? marketplaceMatch[1] : 'amazon.es',
    region: regionMatch ? regionMatch[1] : 'eu-west-1',
    host: hostMatch ? hostMatch[1] : 'webservices.amazon.es',
    service: 'ProductAdvertisingAPI',
    version: '2013-08-01'
};

// 1. Verificar configuración básica
console.log('1️⃣ VERIFICANDO CONFIGURACIÓN BÁSICA:');
console.log(`   Access Key ID: ${AMAZON_API_CONFIG.accessKeyId.substring(0, 10)}...`);
console.log(`   Secret Key: ${AMAZON_API_CONFIG.secretAccessKey.substring(0, 10)}...`);
console.log(`   Associate Tag: ${AMAZON_API_CONFIG.associateTag}`);
console.log(`   Marketplace: ${AMAZON_API_CONFIG.marketplace}`);
console.log(`   Region: ${AMAZON_API_CONFIG.region}`);
console.log(`   Host: ${AMAZON_API_CONFIG.host}`);
console.log('   ✅ Configuración cargada correctamente\n');

// 2. Verificar formato de credenciales
console.log('2️⃣ VERIFICANDO FORMATO DE CREDENCIALES:');
const accessKeyPattern = /^AKIA[A-Z0-9]{16}$/;
const secretKeyPattern = /^[A-Za-z0-9+/]{40}$/;

if (accessKeyPattern.test(AMAZON_API_CONFIG.accessKeyId)) {
    console.log('   ✅ Access Key ID tiene formato válido (AKIA...)');
} else {
    console.log('   ❌ Access Key ID no tiene formato válido');
    console.log('      Debe empezar con "AKIA" y tener 20 caracteres');
    console.log(`      Actual: ${AMAZON_API_CONFIG.accessKeyId}`);
}

if (secretKeyPattern.test(AMAZON_API_CONFIG.secretAccessKey)) {
    console.log('   ✅ Secret Access Key tiene formato válido (40 caracteres)');
} else {
    console.log('   ❌ Secret Access Key no tiene formato válido');
    console.log('      Debe tener exactamente 40 caracteres alfanuméricos');
    console.log(`      Actual: ${AMAZON_API_CONFIG.secretAccessKey.length} caracteres`);
}

console.log('');

// 3. Generar firma de prueba
console.log('3️⃣ GENERANDO FIRMA DE PRUEBA:');
function generateSignatureV4(method, service, host, region, action, payload = '') {
    const algorithm = 'AWS4-HMAC-SHA256';
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);
    
    // Canonical Request
    const canonicalUri = '/paapi5/searchitems';
    const canonicalQuerystring = '';
    const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-date';
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
    
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    
    // String to Sign
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;
    
    // Signature
    const kDate = crypto.createHmac('sha256', `AWS4${AMAZON_API_CONFIG.secretAccessKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
    
    return {
        signature,
        amzDate,
        credentialScope,
        authorizationHeader: `${algorithm} Credential=${AMAZON_API_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    };
}

try {
    const signatureData = generateSignatureV4(
        'POST',
        AMAZON_API_CONFIG.service,
        AMAZON_API_CONFIG.host,
        AMAZON_API_CONFIG.region,
        'SearchItems'
    );
    
    console.log('   ✅ Firma generada correctamente');
    console.log(`   Signature: ${signatureData.signature.substring(0, 20)}...`);
    console.log(`   Date: ${signatureData.amzDate}`);
    console.log(`   Scope: ${signatureData.credentialScope}`);
    console.log('');
} catch (error) {
    console.log('   ❌ Error generando firma:', error.message);
    console.log('');
}

// 4. Probar conexión básica
console.log('4️⃣ PROBANDO CONEXIÓN BÁSICA:');
async function testBasicConnection() {
    try {
        const response = await fetch(`https://${AMAZON_API_CONFIG.host}/paapi5/searchitems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Amz-Date': new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''),
                'Host': AMAZON_API_CONFIG.host
            },
            body: JSON.stringify({
                Keywords: 'test',
                SearchIndex: 'All',
                ItemCount: 1
            })
        });
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            console.log('   ✅ Conexión básica exitosa');
        } else {
            console.log('   ⚠️ Conexión básica falló (esperado sin autenticación)');
        }
    } catch (error) {
        console.log('   ❌ Error de conexión:', error.message);
    }
}

await testBasicConnection();
console.log('');

// 5. Verificar endpoints específicos
console.log('5️⃣ VERIFICANDO ENDPOINTS ESPECÍFICOS:');
const endpoints = [
    'https://webservices.amazon.es/paapi5/searchitems',
    'https://webservices.amazon.com/paapi5/searchitems',
    'https://webservices.amazon.co.uk/paapi5/searchitems'
];

for (const endpoint of endpoints) {
    try {
        const response = await fetch(endpoint, {
            method: 'HEAD'
        });
        console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.log(`   ${endpoint}: ❌ ${error.message}`);
    }
}
console.log('');

// 6. Recomendaciones
console.log('6️⃣ RECOMENDACIONES PARA VERIFICAR CREDENCIALES:');
console.log('   📋 Pasos a seguir en Amazon Associates:');
console.log('   1. Inicia sesión en https://affiliate-program.amazon.es/');
console.log('   2. Ve a "Product Advertising API" en el menú');
console.log('   3. Verifica que tu cuenta esté aprobada para PAAPI');
console.log('   4. Confirma que las credenciales estén activas');
console.log('   5. Verifica que el Associate Tag sea correcto');
console.log('   6. Asegúrate de que la región sea "eu-west-1" para España');
console.log('   7. Confirma que el marketplace sea "amazon.es"');
console.log('');
console.log('   🔧 Posibles problemas identificados:');
console.log('   - Cuenta de Amazon Associates no aprobada para PAAPI');
console.log('   - Credenciales expiradas o revocadas');
console.log('   - Associate Tag incorrecto o inactivo');
console.log('   - Región o marketplace incorrectos');
console.log('   - Límites de API excedidos');
console.log('');

console.log('✅ Verificación completada. Revisa las recomendaciones arriba.'); 