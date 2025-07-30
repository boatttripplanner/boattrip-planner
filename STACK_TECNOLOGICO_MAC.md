# 🖥️ Stack Tecnológico - Problema de Arranque en Mac

## 📋 Información del Sistema

### Sistema Operativo
- **macOS**: Versión específica (verificar en "Acerca de este Mac")
- **Arquitectura**: Apple Silicon (M1/M2/M3) o Intel
- **Modelo**: MacBook Pro/Air, iMac, Mac Pro, etc.

### Hardware
- **Procesador**: Apple M1/M2/M3 o Intel Core i5/i7/i9
- **Memoria RAM**: Cantidad instalada
- **Almacenamiento**: SSD/HDD, capacidad y espacio libre
- **GPU**: Integrada o dedicada

## 🔧 Herramientas de Diagnóstico

### 1. Herramientas Nativas de macOS

#### Modo Recuperación
```bash
# Reiniciar en Modo Recuperación
# Mantener Cmd + R durante el arranque
# O Cmd + Option + R para recuperación por internet
```

#### Modo Seguro
```bash
# Reiniciar en Modo Seguro
# Mantener Shift durante el arranque
```

#### Utilidad de Discos
```bash
# Verificar y reparar disco
diskutil verifyDisk /dev/disk0
diskutil repairDisk /dev/disk0
```

#### Información del Sistema
```bash
# Información detallada del hardware
system_profiler SPHardwareDataType
```

### 2. Terminal y Comandos Útiles

#### Verificar Estado del Sistema
```bash
# Información del sistema
uname -a
sw_vers

# Estado de la batería (portátiles)
pmset -g batt

# Información de memoria
vm_stat
top -l 1 | head -n 10

# Espacio en disco
df -h
```

#### Verificar Logs del Sistema
```bash
# Logs de arranque
log show --predicate 'process == "kernel"' --last 1h

# Logs de sistema
log show --predicate 'process == "system"' --last 1h

# Logs específicos de arranque
log show --predicate 'eventMessage CONTAINS "boot"' --last 1d
```

#### Verificar Permisos y Archivos del Sistema
```bash
# Verificar permisos de archivos del sistema
sudo /usr/libexec/repair_packages --verify --standard-pkgs

# Reparar permisos
sudo /usr/libexec/repair_packages --repair --standard-pkgs --volume /

# Verificar integridad del sistema
csrutil status
```

## 🚨 Problemas Comunes y Soluciones

### 1. Problemas de Arranque

#### Pantalla Gris/Blanca
```bash
# Reset NVRAM/PRAM
# Reiniciar manteniendo Cmd + Option + P + R

# Reset SMC
# Apagar, mantener Shift + Control + Option + botón de encendido
```

#### Kernel Panic
```bash
# Verificar logs de kernel panic
log show --predicate 'process == "kernel"' --last 1d | grep -i panic

# Verificar extensiones de kernel
kextstat | grep -v com.apple
```

#### Problemas de Disco
```bash
# Verificar disco de arranque
diskutil verifyDisk /dev/disk0
diskutil verifyVolume /dev/disk0s1

# Reparar disco
diskutil repairDisk /dev/disk0
diskutil repairVolume /dev/disk0s1
```

### 2. Problemas de Memoria

#### Verificar Memoria RAM
```bash
# Información de memoria
system_profiler SPHardwareDataType | grep Memory

# Estado de memoria virtual
vm_stat
```

#### Problemas de Swap
```bash
# Verificar archivos de swap
ls -la /private/var/vm/

# Limpiar archivos de swap
sudo rm /private/var/vm/swapfile*
```

### 3. Problemas de Batería (Portátiles)

#### Información de Batería
```bash
# Estado de la batería
pmset -g batt

# Información detallada
system_profiler SPPowerDataType

# Ciclos de batería
ioreg -l | grep "Cycle Count"
```

#### Reset de Batería
```bash
# Reset SMC
# Apagar, mantener Shift + Control + Option + botón de encendido

# Calibración de batería
# Cargar al 100%, usar hasta 0%, cargar al 100% sin interrupciones
```

## 🔍 Diagnóstico Avanzado

### 1. Modo Verbose
```bash
# Arranque verbose para ver mensajes detallados
# Reiniciar manteniendo Cmd + V
```

### 2. Modo Single User
```bash
# Arranque en modo single user
# Reiniciar manteniendo Cmd + S

# Comandos útiles en modo single user
/sbin/fsck -fy
/sbin/mount -uw /
```

### 3. Herramientas de Terceros

#### MemTest86
- Descargar versión para Mac
- Crear USB booteable
- Ejecutar test de memoria

#### Apple Hardware Test
```bash
# Reiniciar manteniendo D
# O Cmd + Option + D para test por internet
```

## 📊 Información de Rendimiento

### Monitoreo del Sistema
```bash
# Actividad del sistema
top -l 1

# Uso de CPU por proceso
ps aux | sort -nr -k 3 | head -10

# Uso de memoria por proceso
ps aux | sort -nr -k 4 | head -10

# Procesos del sistema
launchctl list
```

### Información de Red
```bash
# Interfaces de red
ifconfig

# Estado de red
networksetup -listallnetworkservices

# DNS
scutil --dns
```

## 🛠️ Herramientas de Reparación

### 1. Utilidad de Discos
- Verificar disco
- Reparar permisos
- Reparar disco
- Restaurar desde Time Machine

### 2. Terminal
```bash
# Reparar permisos del sistema
sudo /usr/libexec/repair_packages --repair --standard-pkgs

# Limpiar cache del sistema
sudo rm -rf /Library/Caches/*
sudo rm -rf ~/Library/Caches/*

# Limpiar logs antiguos
sudo rm -rf /private/var/log/*.log.*
```

### 3. Modo Recuperación
- Restaurar desde Time Machine
- Reinstalar macOS
- Utilidad de Discos
- Terminal

## 📱 Información de Aplicaciones

### Aplicaciones Instaladas
```bash
# Listar aplicaciones instaladas
ls /Applications/

# Aplicaciones de usuario
ls ~/Applications/

# Información de aplicaciones
system_profiler SPApplicationsDataType
```

### Extensiones del Sistema
```bash
# Extensiones de kernel
kextstat

# Extensiones de sistema
systemextensionsctl list
```

## 🔐 Seguridad y Permisos

### Estado de Seguridad
```bash
# Estado de SIP (System Integrity Protection)
csrutil status

# Estado de Gatekeeper
spctl --status

# Permisos de aplicaciones
tccutil list
```

### Firewall y Seguridad
```bash
# Estado del firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Reglas del firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

## 📋 Checklist de Diagnóstico

### 1. Información Básica
- [ ] Modelo exacto del Mac
- [ ] Versión de macOS
- [ ] Arquitectura (Intel/Apple Silicon)
- [ ] Cantidad de RAM
- [ ] Espacio libre en disco

### 2. Síntomas del Problema
- [ ] ¿Cuándo empezó el problema?
- [ ] ¿Qué cambios recientes se hicieron?
- [ ] ¿Aparecen mensajes de error?
- [ ] ¿El problema es intermitente?
- [ ] ¿Funciona en modo seguro?

### 3. Diagnóstico Inicial
- [ ] Verificar espacio en disco
- [ ] Verificar memoria RAM
- [ ] Verificar logs del sistema
- [ ] Verificar integridad del disco
- [ ] Verificar permisos del sistema

### 4. Pruebas de Hardware
- [ ] Apple Hardware Test
- [ ] MemTest86 (si es necesario)
- [ ] Verificar temperatura
- [ ] Verificar ventiladores
- [ ] Verificar batería (portátiles)

## 🚀 Próximos Pasos

1. **Recopilar información básica** del sistema
2. **Ejecutar diagnósticos iniciales** con herramientas nativas
3. **Verificar logs del sistema** para identificar errores
4. **Probar en modo seguro** para aislar el problema
5. **Ejecutar reparaciones básicas** (permisos, disco)
6. **Considerar reinstalación** si es necesario

## 📞 Recursos Adicionales

- **Soporte de Apple**: https://support.apple.com
- **Foros de Apple**: https://discussions.apple.com
- **Documentación de macOS**: https://developer.apple.com/documentation/macos
- **Guías de reparación**: https://www.ifixit.com

---

**Nota**: Este stack tecnológico proporciona todas las herramientas y comandos necesarios para diagnosticar y resolver problemas de arranque en Mac. La otra IA puede usar esta información para guiar el proceso de reparación paso a paso. 