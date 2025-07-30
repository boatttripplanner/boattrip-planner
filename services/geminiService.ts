
import { GoogleGenAI } from "@google/genai";
import { UserPreferences, experienceLevelOptions, DesiredExperienceType, desiredExperienceTypeOptions, boatingLicenseTypeOptions, PlanningMode, WeatherData } from '../types';
import { GEMINI_MODEL_NAME, budgetLevelOptions, SYSTEM_NAUTICAL_PLANNER_PROMPT, planningModeOptions } from '../constants';







// Temporary verification log
console.log("🔧 Build verification - checking environment variables...");

// Use Vite's injected environment variables
const geminiApiKey = import.meta.env.VITE_API_KEY || "MISSING_API_KEY";

console.log("🔍 Environment check:", {
  viteApiKey: import.meta.env.VITE_API_KEY ? 'SET' : 'NOT_SET',
  finalKey: geminiApiKey === "MISSING_API_KEY" ? "MISSING" : "SET"
});



if (geminiApiKey === "MISSING_API_KEY") {
  console.error("❌ La variable de entorno API_KEY o GEMINI_API_KEY no está configurada para Gemini.");
  console.error("📝 Para desarrollo local: Crea un archivo .env.local con VITE_API_KEY=tu_api_key");
  console.error("🌐 Para GitHub Pages: Configura el secret GEMINI_API_KEY en GitHub");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey }); 

export const constructPrompt = (preferences: UserPreferences): string => {
  const desiredExperienceTypeOption = desiredExperienceTypeOptions.find(opt => opt.value === preferences.desiredExperienceType);
  const desiredExperienceTypeDisplay = desiredExperienceTypeOption ? desiredExperienceTypeOption.label : 'No especificado';
  
  const planningModeOption = planningModeOptions.find(opt => opt.value === preferences.planningMode);
  const planningModeDisplay = planningModeOption ? planningModeOption.label : 'No especificado';

  let prompt = SYSTEM_NAUTICAL_PLANNER_PROMPT;

  prompt = prompt.replace('{planning_mode}', planningModeDisplay);
  
  if (preferences.planningMode === PlanningMode.OWN_BOAT && preferences.boatTransferDetails) {
    let boatDetailsOwnStr = "";
    if (preferences.boatTransferDetails.model) boatDetailsOwnStr += `Modelo: ${preferences.boatTransferDetails.model}, `;
    if (preferences.boatTransferDetails.length) boatDetailsOwnStr += `Eslora: ${preferences.boatTransferDetails.length}m, `;
    // Add other relevant details
    boatDetailsOwnStr = boatDetailsOwnStr.length > 0 ? boatDetailsOwnStr.slice(0, -2) : "Detalles no especificados";
    prompt = prompt.replace('{boat_details_own}', boatDetailsOwnStr);
    prompt = prompt.replace('{barco_rental_preference}', "N/A (Barco Propio)");
  } else {
    prompt = prompt.replace('{boat_details_own}', "N/A (Alquiler)");
    prompt = prompt.replace('{barco_rental_preference}', preferences.boatType || "No especificado");
  }

  prompt = prompt.replace('{zona}', preferences.destination);
  prompt = prompt.replace('{dias}', preferences.numTripDays ? preferences.numTripDays.toString() : (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY ? "Varios (usuario especificará)" : "1"));
  
  const experienceOption = experienceLevelOptions.find(opt => opt.value === preferences.experience);
  prompt = prompt.replace('{experiencia}', experienceOption ? experienceOption.label : "No especificado");
  
  // Procesar actividades específicas de manera más detallada
  let actividadesEspecificasStr = "";
  if (preferences.activities && preferences.activities.length > 0) {
    actividadesEspecificasStr = preferences.activities.join(', ');
  } else {
    actividadesEspecificasStr = "No especificadas (IA debe sugerir actividades relevantes para el Tipo de Experiencia Deseada)";
  }
  prompt = prompt.replace('{actividades_especificas}', actividadesEspecificasStr);
  
  let prefsStr = "";
  if (preferences.activities.length > 0) prefsStr += `Actividades: ${preferences.activities.join(', ')}. `;
  if (preferences.otherActivities) prefsStr += `Otras: ${preferences.otherActivities}. `;
  // Add other preferences as needed
  prompt = prompt.replace('{preferencias}', prefsStr.length > 0 ? prefsStr : "No especificadas");


  prompt += `

---
**A continuación, los detalles proporcionados por el usuario para su solicitud de viaje en barco:**
`;

  prompt += `*   **Modo de Planificación:** ${planningModeDisplay}\n`;

  const experienceDisplay = experienceOption ? experienceOption.label : 'No especificado';

  prompt += `*   **Tipo de Experiencia Deseada por el Usuario:** ${desiredExperienceTypeDisplay}\n`;
  prompt += `    *   **INSTRUCCIÓN CRÍTICA PARA TIPO DE EXPERIENCIA:** DEBES ADAPTAR TODO EL PLAN al tipo de experiencia seleccionada en el desplegable. Cada tipo tiene características específicas que debes respetar:\n`;
  
  // Añadir instrucciones específicas para cada tipo de experiencia
  if (preferences.desiredExperienceType === DesiredExperienceType.FULL_DAY) {
    prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Día Completo:** Es una experiencia de día completo (aproximadamente 8-10 horas). Debes incluir desayuno/almuerzo, actividades principales, tiempo de relax, y cena. El itinerario debe ser completo y variado para aprovechar todo el día.\n`;
  } else if (preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_MORNING) {
    prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Medio Día/Mañana:** Es una experiencia de medio día por la mañana (aproximadamente 4-5 horas). Enfócate en actividades matutinas, desayuno/almuerzo temprano, y termina antes del mediodía. El itinerario debe ser más concentrado.\n`;
  } else if (preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_AFTERNOON) {
    prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Medio Día/Tarde:** Es una experiencia de medio día por la tarde (aproximadamente 4-5 horas). Comienza después del mediodía, incluye almuerzo tardío, actividades vespertinas, y puede incluir puesta de sol. El itinerario debe ser apropiado para la tarde.\n`;
  } else if (preferences.desiredExperienceType === DesiredExperienceType.SUNSET) {
    prompt += `    *   **INSTRUCCIÓN CRÍTICA para Puesta de Sol:** Es una experiencia de 1 día (3-4 horas). DEBES generar SOLO 1 día de itinerario. NO generes 2 días bajo ninguna circunstancia. TODO el itinerario debe girar en torno a la observación del atardecer. Programa la navegación para llegar a puntos de observación al oeste 1-2 horas antes del atardecer. Incluye aperitivos o cena romántica durante la puesta de sol.\n`;
    prompt += `    *   **ADVERTENCIA CRÍTICA:** Si generas más de 1 día para "Puesta de Sol", la recomendación será completamente incorrecta.\n`;
  } else if (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
    prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Varios Días:** Es una experiencia de varios días. Debes generar un itinerario completo para cada día, incluyendo pernoctas, comidas, y actividades variadas. Cada día debe tener su propio programa completo.\n`;
  } else if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
    prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Traslado:** Es un servicio de transporte marítimo. El itinerario debe enfocarse en la navegación de un punto a otro, con paradas técnicas si es necesario. No incluyas actividades recreativas extensas.\n`;
    prompt += `    *   **INSTRUCCIÓN CRÍTICA para Traslado:** OMITE COMPLETAMENTE la sección "🚤 Tipo de Embarcación Recomendada". Los traslados son servicios de transporte, no experiencias recreativas.\n`;
    prompt += `    *   **INSTRUCCIÓN para Itinerario de Traslado:** El itinerario debe ser simple y directo: salida del puerto de origen, navegación directa al puerto de destino, con posibles paradas técnicas para repostaje si es necesario.\n`;
  }
  
  prompt += `*   **Zona de Navegación:** ${preferences.destination}\n`;
  
  // Validación y corrección de número de días según tipo de experiencia
  let correctedNumDays = preferences.numTripDays || 1;
  if (preferences.desiredExperienceType === DesiredExperienceType.SUNSET || 
      preferences.desiredExperienceType === DesiredExperienceType.FULL_DAY ||
      preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_MORNING ||
      preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_AFTERNOON) {
    correctedNumDays = 1;
  }
  
  prompt += `*   **Número de Días:** ${correctedNumDays} día(s)\n`;
  prompt += `    *   **INSTRUCCIÓN CRÍTICA:** Debes generar EXACTAMENTE ${correctedNumDays} día(s) de itinerario. NO más, NO menos.\n`;
  prompt += `    *   **VALIDACIÓN CRUZADA:** El tipo de experiencia "${desiredExperienceTypeDisplay}" requiere EXACTAMENTE ${correctedNumDays} día(s).\n`;
  prompt += `*   **Número de Personas:** ${preferences.numPeople}\n`;
  prompt += `*   **Nivel de Experiencia del Patrón:** ${experienceDisplay}\n`;

  if (preferences.planningMode === PlanningMode.OWN_BOAT && preferences.boatTransferDetails) {
    let boatDetailsStr = "";
    if (preferences.boatTransferDetails.model) boatDetailsStr += `Modelo: ${preferences.boatTransferDetails.model}, `;
    if (preferences.boatTransferDetails.length) boatDetailsStr += `Eslora: ${preferences.boatTransferDetails.length}m, `;
    if (preferences.boatTransferDetails.beam) boatDetailsStr += `Manga: ${preferences.boatTransferDetails.beam}, `;
    if (preferences.boatTransferDetails.draft) boatDetailsStr += `Calado: ${preferences.boatTransferDetails.draft}m, `;
    if (preferences.boatTransferDetails.cruisingSpeed) boatDetailsStr += `Velocidad de Crucero: ${preferences.boatTransferDetails.cruisingSpeed}, `;
    if (preferences.boatTransferDetails.tankCapacity) boatDetailsStr += `Capacidad del Depósito: ${preferences.boatTransferDetails.tankCapacity}, `;
    if (preferences.boatTransferDetails.averageConsumption) boatDetailsStr += `Consumo Medio: ${preferences.boatTransferDetails.averageConsumption}`;
    boatDetailsStr = boatDetailsStr.length > 0 ? boatDetailsStr.slice(0, -2) : "Detalles no especificados";
    prompt += `*   **Detalles del Barco Propio:** ${boatDetailsStr}\n`;
  } else {
    prompt += `*   **Tipo de Barco Preferido (Alquiler):** ${preferences.boatType || "No especificado"}\n`;
  }
  
  if (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
    prompt += `*   **Duración del Viaje:** ${preferences.numTripDays} días\n`;
    if (preferences.isSamePortForMultiDay !== undefined) {
      prompt += `*   **Mismo Puerto de Salida y Llegada:** ${preferences.isSamePortForMultiDay ? "Sí" : "No"}\n`;
    }
    if (!preferences.isSamePortForMultiDay && preferences.arrivalPortForMultiDay) {
      prompt += `*   **Puerto de Llegada:** ${preferences.arrivalPortForMultiDay}\n`;
    }
    if (preferences.multiDayTripNotes) {
      prompt += `*   **Notas Específicas para el Viaje de Varios Días:** ${preferences.multiDayTripNotes}\n`;
    }
  } else if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
    if (preferences.transferDestinationPort) {
      prompt += `*   **Puerto de Destino para Traslado:** ${preferences.transferDestinationPort}\n`;
    }
  }

  if (preferences.boatingLicense) {
    const licenseOption = boatingLicenseTypeOptions.find(opt => opt.value === preferences.boatingLicense);
    prompt += `*   **Titulación Náutica:** ${licenseOption ? licenseOption.label : preferences.boatingLicense}\n`;
  }

  if (preferences.budgetLevel) { 
    const budgetOption = budgetLevelOptions.find(opt => opt.value === preferences.budgetLevel);
    prompt += `*   **Nivel de Presupuesto (por el usuario):** ${budgetOption ? budgetOption.label : preferences.budgetLevel}\n`;
    prompt += `    *   **Instrucción para la IA (Presupuesto por Nivel):** Considera este nivel de presupuesto al elaborar el plan.\n`;
  } else { 
    prompt += `*   **Nivel de Presupuesto (por el usuario):** No especificado\n`;
    prompt += `    *   **Instrucción para la IA (Presupuesto No Especificado):** El usuario no ha indicado un presupuesto. Ofrece una recomendación basada en un nivel 'Estándar'. Menciona que los costos pueden variar y que especificar un presupuesto puede ayudar a refinar el plan.\n`;
  }

  if (preferences.budgetNotes) { // Se refiere a las notas generales del viaje
    prompt += `*   **Notas Adicionales del Usuario sobre el Viaje (MUY IMPORTANTE):** ${preferences.budgetNotes}\n`;
    prompt += `    *   **Instrucción para la IA (Notas Adicionales Generales):** Estas son notas importantes del usuario que pueden afectar destinos, ruta, tipo de experiencia, o restricciones (ej. no querer amarres en puerto). DEBES TENERLAS MUY EN CUENTA al diseñar TODO el plan.\n`;
  }

  // Procesar actividades específicas de manera más detallada
  if (preferences.desiredExperienceType !== DesiredExperienceType.TRANSFER && preferences.activities && preferences.activities.length > 0) {
    prompt += `*   **Actividades Específicas Seleccionadas (MUY IMPORTANTE):** ${preferences.activities.join(', ')}\n`;
    prompt += `    *   **INSTRUCCIÓN CRÍTICA PARA ACTIVIDADES:** DEBES ADAPTAR TODO EL PLAN (itinerario, destinos, horarios, consejos, checklist) EXCLUSIVAMENTE a estas actividades específicas. NO generes actividades genéricas que no correspondan a lo seleccionado.\n`;
    prompt += `    *   **VALIDACIÓN DE COHERENCIA:** Verifica que cada actividad seleccionada sea coherente con el tipo de experiencia "${desiredExperienceTypeDisplay}".\n`;
    
    // Añadir instrucciones específicas para cada actividad
    if (preferences.activities.includes('Observación de Puestas de Sol desde el Mar')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Puestas de Sol:** TODO el itinerario debe girar en torno a la observación de atardeceres. Programa TODAS las actividades para terminar en puntos de observación al oeste 1-2 horas antes del atardecer. Sugiere SOLO fondeaderos con vistas espectaculares al oeste. El objetivo principal es ver el atardecer desde el mar.\n`;
    }
    if (preferences.activities.includes('Snorkel')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Snorkel:** TODO el itinerario debe enfocarse en snorkel. Prioriza EXCLUSIVAMENTE calas con aguas cristalinas, fondos rocosos, y vida marina. Programa las actividades en horarios de mejor visibilidad (10:00-16:00). Incluye consejos específicos de snorkel en cada parada.\n`;
    }
    if (preferences.activities.includes('Familiar (con Niños)')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Familias:** TODO el itinerario debe ser apropiado para niños. Enfoca EXCLUSIVAMENTE en calas de aguas poco profundas, actividades seguras, y destinos con facilidades para familias. Incluye actividades específicas para niños en cada parada.\n`;
    }
    if (preferences.activities.includes('Romántico (Parejas)')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Parejas:** TODO el itinerario debe ser romántico. Prioriza EXCLUSIVAMENTE calas íntimas, restaurantes románticos, y experiencias privadas. Enfoca en crear momentos románticos en cada parada.\n`;
    }
    if (preferences.activities.includes('Pesca Recreativa')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Pesca:** TODO el itinerario debe enfocarse en pesca. Incluye EXCLUSIVAMENTE zonas de pesca conocidas, mejores horarios para pesca, y consejos específicos sobre permisos y técnicas. Cada parada debe tener oportunidades de pesca.\n`;
    }
    if (preferences.activities.includes('Buceo (con equipo propio o guía)') || preferences.activities.includes('Buceo con botella (submarinismo)')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Buceo:** TODO el itinerario debe enfocarse en buceo. Prioriza EXCLUSIVAMENTE destinos con puntos de buceo, aguas claras, y consejos sobre equipamiento y certificaciones. Cada parada debe incluir oportunidades de buceo.\n`;
    }
    if (preferences.activities.includes('Fotografía Paisajística y Marina')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Fotografía:** TODO el itinerario debe enfocarse en fotografía. Sugiere EXCLUSIVAMENTE puntos panorámicos, mejores horarios de luz, y destinos fotogénicos. Cada parada debe incluir oportunidades fotográficas específicas.\n`;
    }
    if (preferences.activities.includes('Deportes Acuáticos (Esquí, Wakeboard, Donut)')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Deportes Acuáticos:** TODO el itinerario debe enfocarse en deportes acuáticos. Enfoca EXCLUSIVAMENTE en calas con espacio para deportes, aguas tranquilas, y facilidades para equipamiento. Cada parada debe incluir oportunidades para practicar estos deportes.\n`;
    }
    if (preferences.activities.includes('Celebraciones Especiales (Cumpleaños, Aniversarios)')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Celebraciones:** TODO el itinerario debe enfocarse en la celebración. Sugiere EXCLUSIVAMENTE destinos especiales, restaurantes con ambiente festivo, y actividades de celebración. Cada parada debe incluir elementos festivos.\n`;
    }
    if (preferences.activities.includes('Tomar el Sol y Relajarse en Cubierta')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Relax:** TODO el itinerario debe enfocarse en relax. Prioriza EXCLUSIVAMENTE calas tranquilas, menos turísticas, y experiencias de paz. Enfoca en momentos de descanso y relajación en cada parada.\n`;
    }
    if (preferences.activities.includes('Avistamiento de Delfines o Fauna Marina')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Avistamiento:** TODO el itinerario debe enfocarse en avistamiento de fauna marina. Prioriza EXCLUSIVAMENTE zonas conocidas por delfines y vida marina, mejores horarios para avistamiento, y consejos específicos sobre cómo maximizar las posibilidades de ver fauna marina.\n`;
    }
    if (preferences.activities.includes('Grupo de Amigos')) {
      prompt += `    *   **INSTRUCCIÓN OBLIGATORIA para Grupos:** TODO el itinerario debe enfocarse en actividades grupales. Enfoca EXCLUSIVAMENTE en espacios amplios, actividades sociales, y destinos con ambiente para grupos. Cada parada debe incluir actividades apropiadas para grupos.\n`;
    }
  } else if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
    prompt += `*   **Actividades para Traslado:** N/A - Los traslados son servicios de transporte, no experiencias recreativas.\n`;
    prompt += `    *   **INSTRUCCIÓN CRÍTICA PARA TRASLADOS:** NO incluyas actividades recreativas como snorkel, pesca, o visitas turísticas. El enfoque debe ser únicamente en la navegación de un puerto a otro.\n`;
  }

  if (preferences.otherActivities) {
    prompt += `*   **Otras Actividades o Solicitudes Especiales (por el usuario):** ${preferences.otherActivities}\n`;
  }
  
  // Sección de adaptación meteorológica
  prompt += `
  
  **🌤️ INSTRUCCIONES CRÍTICAS PARA ADAPTACIÓN METEOROLÓGICA:**
  
  Como un patrón experimentado, DEBES adaptar TODO el itinerario según las condiciones meteorológicas que se proporcionarán. Las siguientes instrucciones son OBLIGATORIAS:
  
  **ADAPTACIÓN POR VELOCIDAD DEL VIENTO:**
  *   **Viento < 10 km/h:** Condiciones ideales. Puedes planificar navegación a vela, actividades acuáticas, y fondeos en calas expuestas.
  *   **Viento 10-20 km/h:** Condiciones buenas. Mantén actividades planificadas pero considera calas más protegidas para fondeo.
  *   **Viento 20-30 km/h:** Condiciones moderadas. Adapta la ruta para buscar calas protegidas, evita navegación a vela si no es experto.
  *   **Viento 30-40 km/h:** Condiciones difíciles. Prioriza calas muy protegidas, considera puertos como alternativa, evita actividades acuáticas.
  *   **Viento > 40 km/h:** Condiciones peligrosas. Sugiere puertos protegidos, evita navegación, considera cancelar o reprogramar.
  
  **ADAPTACIÓN POR DIRECCIÓN DEL VIENTO:**
  *   **Viento del Oeste:** Busca calas protegidas al este, evita costas occidentales expuestas.
  *   **Viento del Este:** Busca calas protegidas al oeste, evita costas orientales expuestas.
  *   **Viento del Norte:** Busca calas protegidas al sur, evita costas septentrionales.
  *   **Viento del Sur:** Busca calas protegidas al norte, evita costas meridionales.
  
  **ADAPTACIÓN POR TEMPERATURA:**
  *   **Temperatura < 15°C:** Enfócate en actividades a bordo, considera puertos con restaurantes, evita actividades acuáticas extensas.
  *   **Temperatura 15-25°C:** Condiciones ideales para actividades acuáticas y navegación.
  *   **Temperatura > 25°C:** Prioriza calas con sombra, actividades acuáticas, y horarios tempranos/tardíos.
  
  **ADAPTACIÓN POR CONDICIONES GENERALES:**
  *   **Soleado:** Mantén el itinerario planificado, prioriza calas con vistas y actividades al aire libre.
  *   **Nublado:** Considera puertos con actividades culturales, mantén actividades acuáticas pero con precaución.
  *   **Lluvia:** Adapta para puertos con restaurantes cubiertos, actividades culturales, o considera reprogramar.
  
  **INSTRUCCIÓN OBLIGATORIA:** Cuando recibas los datos meteorológicos, DEBES modificar el itinerario para:
  1. Seleccionar calas y fondeos protegidos según la dirección del viento
  2. Ajustar horarios según las condiciones (ej: actividades tempranas si hay viento fuerte por la tarde)
  3. Sugerir alternativas seguras si las condiciones son adversas
  4. Priorizar la seguridad náutica en todas las decisiones
  5. Explicar las razones de cada adaptación meteorológica
  
  **FORMATO DE ADAPTACIÓN:** Incluye en cada sección del itinerario una nota como:
  "🌤️ **Adaptación meteorológica:** [Explicar por qué se eligió esta cala/horario según el viento/temperatura]"
  `;
  
      prompt += `
  Ahora, por favor, genera la recomendación detallada, con un enfoque profesional y experto, para este usuario, siguiendo estrictamente TODAS las directrices de contenido, estructura, tono (profesional, claro, informativo, experto, conciso, fácil de escanear, convincente, bien fundamentado, impecable, preciso, estructurado, pulido) indicadas anteriormente, y prestando ESPECIAL ATENCIÓN a adaptar toda la recomendación al "Tipo de Experiencia Deseada": ${desiredExperienceTypeDisplay}, al "Modo de Planificación": ${planningModeDisplay}, y a las "Actividades Específicas Seleccionadas": ${actividadesEspecificasStr}.
  
  **🌤️ IMPORTANTE:** Los datos meteorológicos se obtendrán después de generar esta recomendación inicial. Una vez que tengas acceso a la previsión del tiempo, DEBES adaptar el itinerario según las instrucciones meteorológicas proporcionadas anteriormente.
  
Asegúrate de incluir el bloque "Datos para API de Clima (Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN)" al final de tu respuesta, completando los campos CiudadPrincipal, CodigoPais y RegionOpcional basados en la recomendación principal. Por ejemplo, si la recomendación es para "Port de Palma (Palma de Mallorca, Spain)", CiudadPrincipal sería "Palma de Mallorca", CodigoPais "ES", y RegionOpcional "Mallorca" o "Islas Baleares".

   ⚠️ **ADVERTENCIA FINAL CRÍTICA SOBRE DURACIÓN:**
  El usuario ha especificado EXACTAMENTE ${preferences.numTripDays ? preferences.numTripDays.toString() : "1"} día(s) para su viaje. 
  DEBES generar un itinerario de EXACTAMENTE ${preferences.numTripDays ? preferences.numTripDays.toString() : "1"} día(s), NO más, NO menos.
  Si generas más días de los especificados, la recomendación será incorrecta y no útil para el usuario.

  ⚠️ **ADVERTENCIA FINAL CRÍTICA SOBRE ACTIVIDADES:**
  El usuario ha seleccionado estas actividades específicas: ${preferences.activities.join(', ')}.
  DEBES generar un itinerario que se enfoque EXCLUSIVAMENTE en estas actividades.
  NO incluyas actividades que no correspondan a lo seleccionado.
  Cada parada del itinerario debe estar relacionada directamente con las actividades seleccionadas.
  Si no sigues esta instrucción, la recomendación será inútil para el usuario.

       ⚠️ **ADVERTENCIA FINAL CRÍTICA SOBRE TIPO DE EXPERIENCIA:**
  El usuario ha seleccionado el tipo de experiencia: "${desiredExperienceTypeDisplay}" en el desplegable.
  DEBES generar un itinerario que se ajuste EXACTAMENTE a este tipo de experiencia.
  Si seleccionó "Día Completo", debe ser un día completo. Si seleccionó "Puesta de Sol", debe enfocarse en el atardecer.
  Si seleccionó "Medio Día", debe ser apropiado para medio día. Si seleccionó "Traslado", debe ser un servicio de transporte.
  NO generes un itinerario genérico que no corresponda al tipo seleccionado.
  Si no sigues esta instrucción, la recomendación será inútil para el usuario.
  
  ⚠️ **VALIDACIÓN FINAL OBLIGATORIA:**
  ${preferences.desiredExperienceType === DesiredExperienceType.SUNSET ? 
    'El usuario seleccionó "Puesta de Sol". DEBES generar EXACTAMENTE 1 día de itinerario. NO 2 días. NO 3 días. SOLO 1 día.' : 
    preferences.desiredExperienceType === DesiredExperienceType.FULL_DAY ? 
    'El usuario seleccionó "Día Completo". DEBES generar EXACTAMENTE 1 día de itinerario. NO 2 días. NO 3 días. SOLO 1 día.' :
    preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_MORNING || preferences.desiredExperienceType === DesiredExperienceType.HALF_DAY_AFTERNOON ?
    'El usuario seleccionó "Medio Día". DEBES generar EXACTAMENTE 1 día de itinerario. NO 2 días. NO 3 días. SOLO 1 día.' :
    'Genera el número exacto de días especificado por el usuario.'
  }
  
  ⚠️ **INSTRUCCIÓN FINAL DE VERIFICACIÓN:**
  ANTES de generar la respuesta, verifica que:
  1. El número de días coincida EXACTAMENTE con el tipo de experiencia seleccionado
  2. Todas las actividades mencionadas correspondan a las seleccionadas por el usuario
  3. El itinerario se adapte al tipo de experiencia (duración, horarios, actividades)
  4. No incluyas actividades genéricas que no estén en la lista del usuario
  5. El enfoque del viaje sea coherente con las preferencias expresadas
  
  Si detectas alguna inconsistencia, CORRÍGELA antes de generar la respuesta final.
`;
  return prompt;
};

export const constructWeatherAdaptationPrompt = (originalRecommendation: string, weatherData: WeatherData): string => {
  const windSpeed = weatherData.dayWindSpeed;
  const windDirection = weatherData.dayWindDirection || 'No especificada';
  const temperature = weatherData.temperatureMax;
  const conditions = weatherData.dayIconPhrase;
  
  let windCategory = '';
  if (windSpeed < 10) windCategory = 'Viento < 10 km/h (Condiciones ideales)';
  else if (windSpeed < 20) windCategory = 'Viento 10-20 km/h (Condiciones buenas)';
  else if (windSpeed < 30) windCategory = 'Viento 20-30 km/h (Condiciones moderadas)';
  else if (windSpeed < 40) windCategory = 'Viento 30-40 km/h (Condiciones difíciles)';
  else windCategory = 'Viento > 40 km/h (Condiciones peligrosas)';
  
  let tempCategory = '';
  if (temperature < 15) tempCategory = 'Temperatura < 15°C (Frío)';
  else if (temperature < 25) tempCategory = 'Temperatura 15-25°C (Ideal)';
  else tempCategory = 'Temperatura > 25°C (Calor)';
  
  return `
**🌤️ ADAPTACIÓN METEOROLÓGICA DEL ITINERARIO**

Basándote en la siguiente previsión meteorológica, DEBES generar SOLO las adaptaciones meteorológicas que se aplicarán al itinerario original:

**DATOS METEOROLÓGICOS ACTUALES:**
- **Velocidad del viento:** ${windSpeed} ${weatherData.dayWindUnit} (${windCategory})
- **Dirección del viento:** ${windDirection}
- **Temperatura máxima:** ${temperature}°${weatherData.temperatureUnit} (${tempCategory})
- **Condiciones generales:** ${conditions}

**ITINERARIO ORIGINAL (SOLO PARA REFERENCIA):**
${originalRecommendation}

**INSTRUCCIONES CRÍTICAS PARA ADAPTACIÓN:**

⚠️ **IMPORTANTE:** NO generes un itinerario completo nuevo. Solo genera las adaptaciones meteorológicas específicas.

1. **ANÁLISIS DE VIENTO:** Según ${windSpeed} ${weatherData.dayWindUnit} desde ${windDirection}, determina:
   - ¿Qué calas están protegidas de este viento?
   - ¿Qué horarios son mejores para navegación?
   - ¿Qué actividades acuáticas son seguras?

2. **ANÁLISIS DE TEMPERATURA:** Según ${temperature}°${weatherData.temperatureUnit}, considera:
   - ¿Qué horarios son mejores para actividades al aire libre?
   - ¿Qué tipo de fondeos son más cómodos?
   - ¿Qué actividades son más apropiadas?

3. **FORMATO DE RESPUESTA OBLIGATORIO:**
   - Genera SOLO las adaptaciones meteorológicas específicas
   - Usa el formato de blockquote (>) para destacar las adaptaciones
   - Incluye explicaciones breves de por qué se hacen estos cambios
   - NO repitas el itinerario completo
   - NO generes secciones de título principales (## o ###)
   - Solo genera las notas de adaptación meteorológica

4. **EJEMPLO DE FORMATO CORRECTO:**
   > 💨 **Adaptación por Viento:** Con viento de ${windDirection} a ${windSpeed} ${weatherData.dayWindUnit}, se recomienda buscar calas protegidas al oeste.
   > 
   > ⏰ **Ajuste de Horarios:** Las mejores horas para navegación serán entre 10:00-14:00 cuando el viento sea más suave.
   > 
   > 🏊 **Actividades Adaptadas:** El snorkel se recomienda en calas con aguas más tranquilas.

**OBJETIVO:** Como un patrón experimentado, genera SOLO las adaptaciones meteorológicas específicas que se aplicarán al itinerario existente, sin duplicar el contenido completo.
`;
};

export async function* generateBoatTripRecommendationStream(preferences: UserPreferences): AsyncGenerator<string, void, undefined> {
  if (geminiApiKey === "MISSING_API_KEY") { 
    console.error("Error: La API_KEY de Google Gemini no está configurada en el entorno.");
    throw new Error("La API_KEY no está configurada. Por favor, asegúrate de que la variable de entorno API_KEY esté definida correctamente. No se puede conectar a la API de Gemini.");
  }
  
  const prompt = constructPrompt(preferences);
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.6, 
        topK: 40,
        topP: 0.95,
      }
    });
    
    let yieldedContent = false;
    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText && chunkText.trim() !== "") {
        yieldedContent = true;
        yield chunkText;
      } else if (chunkText === "") { 
        yield ""; 
      }
    }

    if (!yieldedContent) {
        console.warn("Advertencia: El stream de la IA se completó sin generar contenido textual significativo para el prompt:", prompt.substring(0, 500) + "..."); 
    }

  } catch (error) {
    console.error("Error llamando a la API de Gemini o durante el streaming:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || 
            error.message.includes("API_KEY_INVALID") || 
            error.message.toLowerCase().includes("permission denied") || 
            error.message.toLowerCase().includes("api key is missing") ||
            error.message.toLowerCase().includes("authentication failed")) { 
             throw new Error("Error de autenticación con la API de Gemini: Clave API inválida, con permisos insuficientes, o no proporcionada. Por favor, verifica la configuración de tu clave API (API_KEY) en el entorno.");
        }
        const geminiError = error as any; 
        if (geminiError?.message?.toLowerCase().includes("blocked") || 
            geminiError?.response?.promptFeedback?.blockReason || 
            geminiError?.promptFeedback?.blockReason) {
             const blockReason = geminiError?.response?.promptFeedback?.blockReason || geminiError?.promptFeedback?.blockReason || "no especificada";
             console.warn("Respuesta bloqueada por la API de Gemini. Razón:", blockReason);
             throw new Error(`Tu solicitud no pudo ser procesada porque el contenido fue bloqueado por razones de seguridad o política de la IA (Razón: ${blockReason}). Intenta reformular tus preferencias.`);
        }
         throw new Error(`La solicitud a la API de Gemini falló con el mensaje: ${error.message}. Por favor, inténtalo de nuevo más tarde.`);
    }
    throw new Error("Ocurrió un error desconocido al comunicarse con la API de Gemini. Por favor, inténtalo de nuevo más tarde.");
  }
}
