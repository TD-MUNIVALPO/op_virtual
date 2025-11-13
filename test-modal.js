// Script de prueba para verificar el modal de unidad técnica
console.log('🧪 Iniciando pruebas del modal...');

// 1. Verificar que el objeto ModalDetalle existe
if (typeof ModalDetalle !== 'undefined') {
    console.log('✅ ModalDetalle existe');
} else {
    console.error('❌ ModalDetalle no está definido');
}

// 2. Verificar que APP existe y tiene solicitudes
if (typeof APP !== 'undefined') {
    console.log('✅ APP existe con', APP.solicitudes.length, 'solicitudes');
    
    // Mostrar las primeras 3 solicitudes
    console.log('📋 Primeras solicitudes:', APP.solicitudes.slice(0, 3).map(s => ({
        id: s.id,
        nombre: s.nombre,
        unidadTecnica: s.unidadTecnica
    })));
    
    // Filtrar solicitudes de fiscalización
    const solicitudesFiscalizacion = APP.solicitudes.filter(s => s.unidadTecnica === 'fiscalizacion');
    console.log('🏢 Solicitudes de Fiscalización:', solicitudesFiscalizacion.length);
    
    if (solicitudesFiscalizacion.length > 0) {
        // Probar abrir modal con la primera solicitud de fiscalización
        const primeraId = solicitudesFiscalizacion[0].id;
        console.log('🔍 Probando modal con ID:', primeraId);
        
        try {
            ModalDetalle.abrir(primeraId);
            console.log('✅ Modal abierto correctamente');
        } catch (error) {
            console.error('❌ Error al abrir modal:', error);
        }
    }
} else {
    console.error('❌ APP no está definido');
}

// 3. Verificar que UnidadTecnicaView existe
if (typeof UnidadTecnicaView !== 'undefined') {
    console.log('✅ UnidadTecnicaView existe');
    console.log('📋 Unidad configurada:', UnidadTecnicaView.unidadCodigo);
} else {
    console.error('❌ UnidadTecnicaView no está definido');
}