#!/bin/bash

# 🖥️ Script de Diagnóstico Automático para Mac
# Uso: chmod +x mac_diagnostic_script.sh && ./mac_diagnostic_script.sh

echo "🖥️  DIAGNÓSTICO AUTOMÁTICO DE MAC"
echo "=================================="
echo ""

# Crear directorio para el reporte
REPORT_DIR="$HOME/Desktop/MacDiagnostic_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$REPORT_DIR"

echo "📁 Reporte se guardará en: $REPORT_DIR"
echo ""

# Función para guardar información en archivo
save_info() {
    echo "$1" >> "$REPORT_DIR/diagnostic_report.txt"
}

# Función para ejecutar comando y guardar resultado
run_command() {
    echo "🔍 Ejecutando: $1"
    echo "=== $1 ===" >> "$REPORT_DIR/diagnostic_report.txt"
    eval "$1" >> "$REPORT_DIR/diagnostic_report.txt" 2>&1
    echo "" >> "$REPORT_DIR/diagnostic_report.txt"
    echo ""
}

# Información básica del sistema
echo "📋 Recopilando información básica del sistema..."
save_info "=== INFORMACIÓN BÁSICA DEL SISTEMA ==="
run_command "sw_vers"
run_command "uname -a"
run_command "system_profiler SPHardwareDataType"

# Información de memoria
echo "🧠 Verificando memoria..."
save_info "=== INFORMACIÓN DE MEMORIA ==="
run_command "system_profiler SPHardwareDataType | grep Memory"
run_command "vm_stat"
run_command "top -l 1 | head -n 10"

# Información de disco
echo "💾 Verificando disco..."
save_info "=== INFORMACIÓN DE DISCO ==="
run_command "df -h"
run_command "diskutil list"
run_command "diskutil info /dev/disk0"

# Verificar disco de arranque
echo "🔍 Verificando integridad del disco de arranque..."
save_info "=== VERIFICACIÓN DE DISCO DE ARRANQUE ==="
BOOT_DISK=$(diskutil info / | grep "Device Identifier" | awk '{print $3}')
run_command "diskutil verifyDisk $BOOT_DISK"
run_command "diskutil verifyVolume ${BOOT_DISK}s1"

# Información de batería (si es portátil)
echo "🔋 Verificando batería..."
save_info "=== INFORMACIÓN DE BATERÍA ==="
run_command "pmset -g batt"
run_command "system_profiler SPPowerDataType"

# Logs del sistema
echo "📝 Analizando logs del sistema..."
save_info "=== LOGS DEL SISTEMA ==="
run_command "log show --predicate 'process == \"kernel\"' --last 1h | tail -20"
run_command "log show --predicate 'eventMessage CONTAINS \"boot\"' --last 1d | tail -20"

# Verificar kernel panics
echo "🚨 Verificando kernel panics..."
save_info "=== KERNEL PANICS ==="
run_command "log show --predicate 'process == \"kernel\"' --last 1d | grep -i panic"

# Información de procesos
echo "⚙️ Analizando procesos del sistema..."
save_info "=== PROCESOS DEL SISTEMA ==="
run_command "ps aux | sort -nr -k 3 | head -10"
run_command "ps aux | sort -nr -k 4 | head -10"

# Extensiones del sistema
echo "🔌 Verificando extensiones..."
save_info "=== EXTENSIONES DEL SISTEMA ==="
run_command "kextstat | grep -v com.apple"
run_command "systemextensionsctl list"

# Estado de seguridad
echo "🔐 Verificando estado de seguridad..."
save_info "=== ESTADO DE SEGURIDAD ==="
run_command "csrutil status"
run_command "spctl --status"

# Información de red
echo "🌐 Verificando red..."
save_info "=== INFORMACIÓN DE RED ==="
run_command "ifconfig"
run_command "networksetup -listallnetworkservices"

# Aplicaciones instaladas
echo "📱 Listando aplicaciones..."
save_info "=== APLICACIONES INSTALADAS ==="
run_command "ls /Applications/ | head -20"
run_command "ls ~/Applications/ | head -20"

# Verificar permisos del sistema
echo "🔧 Verificando permisos del sistema..."
save_info "=== VERIFICACIÓN DE PERMISOS ==="
run_command "sudo /usr/libexec/repair_packages --verify --standard-pkgs"

# Información de rendimiento
echo "📊 Analizando rendimiento..."
save_info "=== INFORMACIÓN DE RENDIMIENTO ==="
run_command "top -l 1"
run_command "launchctl list | head -20"

# Verificar archivos de swap
echo "💿 Verificando archivos de swap..."
save_info "=== ARCHIVOS DE SWAP ==="
run_command "ls -la /private/var/vm/"

# Información de temperatura (si está disponible)
echo "🌡️ Verificando temperatura..."
save_info "=== INFORMACIÓN DE TEMPERATURA ==="
run_command "sudo powermetrics --samplers smc -n 1 | grep -i temp"

# Verificar firewall
echo "🔥 Verificando firewall..."
save_info "=== ESTADO DEL FIREWALL ==="
run_command "sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate"

# Información de Time Machine
echo "⏰ Verificando Time Machine..."
save_info "=== INFORMACIÓN DE TIME MACHINE ==="
run_command "tmutil listlocalsnapshots /"

# Generar resumen
echo "📋 Generando resumen..."
save_info "=== RESUMEN DE DIAGNÓSTICO ==="
save_info "Fecha y hora: $(date)"
save_info "Usuario: $(whoami)"
save_info "Directorio del reporte: $REPORT_DIR"

# Crear archivo de comandos útiles
echo "🛠️ Generando comandos útiles..."
cat > "$REPORT_DIR/useful_commands.txt" << 'EOF'
# Comandos útiles para reparación

# Reparar disco
sudo diskutil repairDisk /dev/disk0
sudo diskutil repairVolume /dev/disk0s1

# Reparar permisos
sudo /usr/libexec/repair_packages --repair --standard-pkgs --volume /

# Limpiar cache
sudo rm -rf /Library/Caches/*
sudo rm -rf ~/Library/Caches/*

# Limpiar logs
sudo rm -rf /private/var/log/*.log.*

# Reset NVRAM/PRAM
# Reiniciar manteniendo Cmd + Option + P + R

# Reset SMC
# Apagar, mantener Shift + Control + Option + botón de encendido

# Modo seguro
# Reiniciar manteniendo Shift

# Modo recuperación
# Reiniciar manteniendo Cmd + R

# Apple Hardware Test
# Reiniciar manteniendo D
EOF

# Crear archivo de recomendaciones
echo "💡 Generando recomendaciones..."
cat > "$REPORT_DIR/recommendations.txt" << 'EOF'
RECOMENDACIONES BASADAS EN EL DIAGNÓSTICO:

1. VERIFICAR ESPACIO EN DISCO:
   - Si hay menos del 10% de espacio libre, liberar espacio
   - Usar "Acerca de este Mac" > "Almacenamiento" > "Gestionar"

2. VERIFICAR MEMORIA:
   - Si hay muchos archivos de swap, considerar más RAM
   - Verificar si hay procesos consumiendo mucha memoria

3. VERIFICAR LOGS:
   - Revisar logs de kernel panic si existen
   - Verificar errores de arranque

4. VERIFICAR PERMISOS:
   - Ejecutar reparación de permisos si es necesario
   - Verificar integridad del sistema

5. VERIFICAR BATERÍA (portátiles):
   - Si hay problemas de batería, considerar reemplazo
   - Verificar ciclos de batería

6. VERIFICAR TEMPERATURA:
   - Si hay sobrecalentamiento, limpiar ventiladores
   - Verificar uso de CPU

7. VERIFICAR EXTENSIONES:
   - Deshabilitar extensiones de terceros si causan problemas
   - Verificar compatibilidad con macOS

8. VERIFICAR APLICACIONES:
   - Actualizar aplicaciones a versiones compatibles
   - Verificar aplicaciones que puedan causar conflictos

9. VERIFICAR RED:
   - Verificar configuración de red
   - Verificar DNS

10. VERIFICAR SEGURIDAD:
    - Verificar estado de SIP
    - Verificar configuración de firewall
EOF

echo ""
echo "✅ DIAGNÓSTICO COMPLETADO"
echo "========================="
echo ""
echo "📁 Archivos generados en: $REPORT_DIR"
echo "   - diagnostic_report.txt (reporte completo)"
echo "   - useful_commands.txt (comandos útiles)"
echo "   - recommendations.txt (recomendaciones)"
echo ""
echo "🔍 Para ver el reporte completo:"
echo "   open $REPORT_DIR/diagnostic_report.txt"
echo ""
echo "💡 Para ver recomendaciones:"
echo "   open $REPORT_DIR/recommendations.txt"
echo ""
echo "🛠️ Para ver comandos útiles:"
echo "   open $REPORT_DIR/useful_commands.txt"
echo ""

# Abrir el directorio del reporte
open "$REPORT_DIR"

echo "🎯 Próximos pasos:"
echo "1. Revisar el reporte completo"
echo "2. Seguir las recomendaciones"
echo "3. Ejecutar comandos de reparación si es necesario"
echo "4. Probar en modo seguro si hay problemas"
echo "5. Considerar reinstalación si los problemas persisten"
echo ""
echo "📞 Si necesitas ayuda adicional, consulta:"
echo "   - Soporte de Apple: https://support.apple.com"
echo "   - Foros de Apple: https://discussions.apple.com"
echo "" 