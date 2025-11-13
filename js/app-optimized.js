// ============================================
// OFICINA DE PARTES DIGITAL - VERSIÓN OPTIMIZADA
// ============================================

// ============================================
// 1. ADAPTADOR PARA DATA SERVICE
// ============================================
// NOTA: StorageManager ahora usa dataService que soporta JSON y localStorage

class StorageManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.saveTimeout = null;
        this.DEBOUNCE_DELAY = 500; // ms
    }

    // Cargar datos (usa dataService)
    async load() {
        try {
            const data = await dataService.load();
            return data || [];
        } catch (error) {
            console.error('Error al cargar datos:', error);
            return [];
        }
    }

    // Guardar datos (con debouncing)
    save(data) {
        // Cancelar guardado previo pendiente
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        // Programar nuevo guardado
        this.saveTimeout = setTimeout(async () => {
            try {
                await dataService.save(data);
            } catch (e) {
                console.error('❌ Error al guardar datos:', e);
            }
        }, this.DEBOUNCE_DELAY);
    }

    // Invalidar cache
    invalidateCache() {
        dataService.invalidateCache();
    }
}


// ============================================
// 2. ESTADO GLOBAL DE LA APLICACIÓN
// ============================================

const APP = {
    storage: new StorageManager('solicitudes_op'),
    solicitudes: [],

    // Cargar solicitudes (async)
    async cargarSolicitudes() {
        this.solicitudes = await this.storage.load();
        console.log(`📊 ${this.solicitudes.length} solicitudes cargadas`);
    },

    // Guardar solicitudes
    guardarSolicitudes() {
        this.storage.save(this.solicitudes);
    },

    // Generar ID único
    generarId() {
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 9999) + 1;
        return `${year}-${random.toString().padStart(4, '0')}`;
    },

    // Agregar nueva solicitud
    agregarSolicitud(datos) {
        const nuevaSolicitud = {
            id: this.generarId(),
            ...datos,
            estado: 'pendiente',
            unidadTecnica: '',
            fechaCreacion: new Date().toISOString()
        };

        this.solicitudes.push(nuevaSolicitud);
        this.guardarSolicitudes();
        return nuevaSolicitud;
    },

    // Buscar solicitud por ID
    buscarSolicitud(id) {
        return this.solicitudes.find(s => s.id === id);
    },

    // Actualizar solicitud
    actualizarSolicitud(id, cambios) {
        const solicitud = this.buscarSolicitud(id);
        if (solicitud) {
            Object.assign(solicitud, cambios);
            this.guardarSolicitudes();
            return true;
        }
        return false;
    },

    // Asignar unidad técnica
    asignarUnidadTecnica(id, unidad) {
        const solicitud = this.buscarSolicitud(id);
        if (solicitud) {
            const ahora = new Date().toISOString();
            const cambios = { unidadTecnica: unidad };

            // Registrar fecha de derivación si no existe
            if (!solicitud.fechaDerivacion) {
                cambios.fechaDerivacion = ahora;
            }

            // Registrar fecha de inicio en unidad técnica si no existe
            if (!solicitud.fechaInicioUnidadTecnica) {
                cambios.fechaInicioUnidadTecnica = ahora;
            }

            // Inicializar estado de unidad técnica si no existe
            if (!solicitud.estadoUnidadTecnica) {
                cambios.estadoUnidadTecnica = 'en-ejecucion';
            }

            return this.actualizarSolicitud(id, cambios);
        }
        return false;
    },

    // Cambiar estado
    cambiarEstado(id, nuevoEstado) {
        return this.actualizarSolicitud(id, { estado: nuevoEstado });
    },

    // Cambiar estado de unidad técnica
    cambiarEstadoUnidadTecnica(id, estadoUT) {
        const solicitud = this.buscarSolicitud(id);
        if (solicitud) {
            const ahora = new Date().toISOString();
            const cambios = {
                estadoUnidadTecnica: estadoUT,
                fechaActualizacionUT: ahora
            };

            // Registrar fecha de finalización si el estado es "finalizado"
            if (estadoUT === 'finalizado' && !solicitud.fechaFinUnidadTecnica) {
                cambios.fechaFinUnidadTecnica = ahora;
                console.log(`📅 Fecha de finalización registrada para ${id}`);
            }

            return this.actualizarSolicitud(id, cambios);
        }
        return false;
    },

    // Obtener estadísticas
    obtenerEstadisticas() {
        return {
            total: this.solicitudes.length,
            pendientes: this.solicitudes.filter(s => s.estado === 'pendiente').length,
            revision: this.solicitudes.filter(s => s.estado === 'revision').length,
            finalizadas: this.solicitudes.filter(s => s.estado === 'finalizada').length
        };
    }
};


// ============================================
// 3. TAB MANAGER OPTIMIZADO
// ============================================

class TabManager {
    constructor() {
        this.tabs = new Map();
        this.activeTab = null;
    }

    // Registrar tab
    register(tabId, vistaId, onActivate = null) {
        const tabElement = document.getElementById(tabId);
        const vistaElement = document.getElementById(vistaId);

        if (!tabElement || !vistaElement) {
            console.warn(`Tab o vista no encontrada: ${tabId}, ${vistaId}`);
            return;
        }

        this.tabs.set(tabId, {
            tabElement,
            vistaElement,
            onActivate
        });

        // Event listener
        tabElement.addEventListener('click', () => this.activate(tabId));
    }

    // Activar tab
    activate(tabId) {
        const tab = this.tabs.get(tabId);
        if (!tab) return;

        // Desactivar todos
        this.tabs.forEach(({ tabElement, vistaElement }) => {
            tabElement.classList.remove('active');
            vistaElement.classList.add('hidden');
        });

        // Activar el seleccionado
        tab.tabElement.classList.add('active');
        tab.vistaElement.classList.remove('hidden');
        this.activeTab = tabId;

        // Callback
        if (tab.onActivate) {
            tab.onActivate();
        }

        console.log(`✅ Tab activada: ${tabId}`);
    }

    // Inicializar
    init() {
        // Registrar todas las tabs
        this.register('tab-ciudadano', 'vista-ciudadano');
        this.register('tab-funcionario-form', 'vista-funcionario-form');
        this.register('tab-funcionario-especifico', 'vista-funcionario-especifico');
        this.register('tab-funcionario-correspondencia', 'vista-funcionario-correspondencia');
        this.register('tab-funcionario', 'vista-funcionario', () => FuncionarioView.actualizar());
        this.register('tab-unidad-tecnica', 'vista-unidad-tecnica', () => UnidadTecnicaView.actualizar());
    }
}


// ============================================
// 4. UTILIDADES GLOBALES
// ============================================

const EstadosUtil = {
    unidadesNombres: {
        'desarrollo-economico': 'Desarrollo Económico',
        'dat': 'DAT',
        'parques-jardines': 'Parques y Jardines',
        'alumbrado-publico': 'Alumbrado Público',
        'fiscalizacion': 'Fiscalización',
        'transito': 'Tránsito',
        'patentes-comerciales': 'Patentes Comerciales'
    },

    // Umbrales de días esperados por etapa
    umbralesEtapas: {
        'recepcion': 3,
        'derivacion': 2,
        'fiscalizacion': 10,
        'resolucion': 5
    },

    crearBadgeEstado(solicitud) {
        const estado = solicitud.estado;
        const unidadTecnica = solicitud.unidadTecnica;
        const estadoUT = solicitud.estadoUnidadTecnica;

        if (estadoUT) {
            const nombreUnidad = this.unidadesNombres[unidadTecnica] || unidadTecnica;
            const estadosUT = {
                'en-ejecucion': `<span class="badge badge-ut-en-ejecucion"><i class="fas fa-cog mr-1"></i>En ejecución - ${nombreUnidad}</span>`,
                'finalizado': `<span class="badge badge-ut-finalizado"><i class="fas fa-check-circle mr-1"></i>Finalizado - ${nombreUnidad}</span>`,
                'rechazado': `<span class="badge badge-ut-rechazado"><i class="fas fa-times-circle mr-1"></i>Rechazado - ${nombreUnidad}</span>`
            };
            return estadosUT[estadoUT] || estadosUT['en-ejecucion'];
        }

        if (unidadTecnica && unidadTecnica !== '') {
            const nombreUnidad = this.unidadesNombres[unidadTecnica] || unidadTecnica;
            return `<span class="badge badge-derivado"><i class="fas fa-share mr-1"></i>Derivado a: ${nombreUnidad}</span>`;
        }

        const badges = {
            'pendiente': '<span class="badge badge-derivacion-pendiente"><i class="fas fa-clock mr-1"></i>Derivación pendiente según</span>',
            'revision': '<span class="badge badge-revision"><i class="fas fa-spinner mr-1"></i>En Revisión</span>',
            'finalizada': '<span class="badge badge-finalizada"><i class="fas fa-check mr-1"></i>Finalizada</span>'
        };
        return badges[estado] || badges.pendiente;
    },

    calcularDiasAbierto(fechaCreacion) {
        const fechaCreacionDate = new Date(fechaCreacion);
        const ahora = new Date();
        const diferenciaTiempo = ahora - fechaCreacionDate;
        const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (dias === 0) {
            return '<span class="text-sm font-medium" style="color: var(--text-primary);">Hoy</span>';
        } else if (dias === 1) {
            return '<span class="text-sm font-medium" style="color: var(--text-secondary);">1 día</span>';
        } else if (dias <= 7) {
            return `<span class="text-sm font-medium" style="color: var(--text-secondary);">${dias} días</span>`;
        } else if (dias <= 30) {
            return `<span class="text-sm font-medium" style="color: #f59e0b;">${dias} días</span>`;
        } else {
            return `<span class="text-sm font-medium" style="color: #ef4444;">${dias} días</span>`;
        }
    },

    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const opciones = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return fecha.toLocaleDateString('es-CL', opciones);
    },

    // Función para calcular desglose de tiempos por etapa
    calcularDesgloseEtapas(solicitud) {
        const etapas = [];
        const ahora = new Date();

        // Etapa 1: Recepción (desde creación hasta derivación)
        const fechaCreacion = new Date(solicitud.fechaCreacion);
        let fechaDerivacion = solicitud.fechaDerivacion ? new Date(solicitud.fechaDerivacion) : null;

        // Si no hay fecha de derivación pero hay unidad técnica, usar fechaCreacion + estimación
        if (!fechaDerivacion && solicitud.unidadTecnica) {
            fechaDerivacion = new Date(fechaCreacion.getTime() + 24 * 60 * 60 * 1000); // +1 día
        }

        if (fechaDerivacion) {
            const diasRecepcion = Math.floor((fechaDerivacion - fechaCreacion) / (1000 * 60 * 60 * 24));
            etapas.push({
                nombre: 'Recepción',
                dias: diasRecepcion,
                completada: true,
                excedido: diasRecepcion > this.umbralesEtapas.recepcion
            });
        } else {
            // Todavía en recepción
            const diasRecepcion = Math.floor((ahora - fechaCreacion) / (1000 * 60 * 60 * 24));
            etapas.push({
                nombre: 'Recepción',
                dias: diasRecepcion,
                completada: false,
                excedido: diasRecepcion > this.umbralesEtapas.recepcion
            });
            return etapas;
        }

        // Etapa 2: Derivación
        if (solicitud.unidadTecnica && solicitud.unidadTecnica !== '') {
            const fechaInicioUT = solicitud.fechaInicioUnidadTecnica ? new Date(solicitud.fechaInicioUnidadTecnica) : fechaDerivacion;
            const diasDerivacion = Math.floor((fechaInicioUT - fechaDerivacion) / (1000 * 60 * 60 * 24));
            const diasMostrar = diasDerivacion === 0 ? 1 : diasDerivacion;

            etapas.push({
                nombre: 'Derivación',
                dias: diasMostrar,
                completada: true,
                excedido: diasMostrar > this.umbralesEtapas.derivacion
            });

            // Etapa 3: Unidad Técnica
            const nombreUnidad = this.unidadesNombres[solicitud.unidadTecnica] || solicitud.unidadTecnica;
            const fechaFinUT = solicitud.fechaFinUnidadTecnica ? new Date(solicitud.fechaFinUnidadTecnica) : null;

            if (fechaFinUT) {
                const diasUT = Math.floor((fechaFinUT - fechaInicioUT) / (1000 * 60 * 60 * 24));
                etapas.push({
                    nombre: nombreUnidad,
                    dias: diasUT,
                    completada: true,
                    excedido: diasUT > this.umbralesEtapas.fiscalizacion
                });
            } else {
                const diasUT = Math.floor((ahora - fechaInicioUT) / (1000 * 60 * 60 * 24));
                etapas.push({
                    nombre: nombreUnidad,
                    dias: diasUT,
                    completada: false,
                    excedido: diasUT > this.umbralesEtapas.fiscalizacion
                });
            }
        }

        return etapas;
    },

    // Función para renderizar desglose de tiempos inline
    // ACTUALIZADO: Iconos 1.6em - Version 2024-11-13-v2
    renderizarDesgloseInline(solicitud) {
        const fechaCreacion = new Date(solicitud.fechaCreacion);
        const ahora = new Date();
        const diasTotales = Math.floor((ahora - fechaCreacion) / (1000 * 60 * 60 * 24));

        const etapas = this.calcularDesgloseEtapas(solicitud);

        // Color del total según días
        let colorTotal = 'var(--text-secondary)';
        if (diasTotales > 30) {
            colorTotal = '#ef4444'; // rojo
        } else if (diasTotales > 7) {
            colorTotal = '#f59e0b'; // amarillo
        }

        // HTML del total
        let html = `<div class="text-left" style="min-width: 180px;">`;
        html += `<div class="text-base font-bold mb-1" style="color: ${colorTotal};">${diasTotales} días</div>`;

        // Desglose de etapas
        if (etapas.length > 0) {
            html += `<div class="text-xs" style="line-height: 1.6;">`;

            etapas.forEach((etapa, index) => {
                const esUltima = index === etapas.length - 1;
                const prefijo = esUltima ? '└─' : '├─';

                // Color según estado
                let colorEtapa = 'var(--text-secondary)'; // gris para completadas
                let icono = '✓'; // check para completadas

                if (!etapa.completada) {
                    colorEtapa = '#3b82f6'; // azul para en curso
                    icono = '⏳';
                    if (etapa.excedido) {
                        colorEtapa = '#ef4444'; // rojo si excede
                        icono = '⚠️';
                    }
                } else if (etapa.excedido) {
                    colorEtapa = '#f59e0b'; // amarillo para completadas con exceso
                }

                html += `<div style="color: ${colorEtapa};">`;
                html += `${prefijo} ${etapa.nombre}: ${etapa.dias}d <span style="font-size: 1.6em;">${icono}</span>`;
                html += `</div>`;
            });

            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }
};


// ============================================
// 5. SISTEMA DE VALIDACIONES UNIFICADO
// ============================================

const Validaciones = {
    reglas: {
        rut: {
            test: (valor) => {
                const rutLimpio = valor.replace(/\./g, '').replace(/-/g, '');
                if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
                const rutPattern = /^[0-9]+-[0-9kK]{1}$/;
                return rutPattern.test(valor) || /^[0-9]{7,8}[0-9kK]{1}$/.test(rutLimpio);
            },
            mensaje: 'RUT inválido (formato: 12.345.678-9)'
        },
        email: {
            test: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
            mensaje: 'Correo electrónico inválido'
        },
        telefono: {
            test: (valor) => {
                const telefonoLimpio = valor.replace(/\s/g, '').replace(/\+/g, '').replace(/-/g, '');
                return /^[0-9]{8,12}$/.test(telefonoLimpio);
            },
            mensaje: 'Teléfono inválido (mínimo 8 dígitos)'
        },
        requerido: {
            test: (valor) => valor.trim().length > 0,
            mensaje: 'Este campo es obligatorio'
        },
        minLength: (min) => ({
            test: (valor) => valor.trim().length >= min,
            mensaje: `Debe tener al menos ${min} caracteres`
        })
    },

    validarCampo(campo, reglas) {
        const valor = campo.value;

        for (const regla of reglas) {
            const validacion = typeof regla === 'function' ? regla : this.reglas[regla];

            if (validacion && !validacion.test(valor)) {
                this.mostrarError(campo, validacion.mensaje);
                return false;
            }
        }

        this.limpiarError(campo);
        return true;
    },

    mostrarError(campo, mensaje) {
        const errorSpan = campo.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = mensaje;
            errorSpan.classList.remove('hidden');
        }
        campo.classList.add('border-red-500');
    },

    limpiarError(campo) {
        const errorSpan = campo.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
        }
        campo.classList.remove('border-red-500');
    },

    limpiarTodosErrores() {
        document.querySelectorAll('.error-message').forEach(span => {
            span.textContent = '';
            span.classList.add('hidden');
        });
        document.querySelectorAll('input, textarea, select').forEach(campo => {
            campo.classList.remove('border-red-500');
        });
    }
};


// ============================================
// 6. SISTEMA DE FORMULARIOS UNIFICADO
// ============================================

class FormularioBase {
    constructor(config) {
        this.config = config;
        this.form = document.getElementById(config.formId);
        this.resumen = document.getElementById(config.resumenId);
        this.init();
    }

    init() {
        if (!this.form) {
            console.warn(`Formulario no encontrado: ${this.config.formId}`);
            return;
        }

        // Submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarSolicitud();
        });

        // Botón limpiar
        const btnLimpiar = document.getElementById(this.config.btnLimpiarId);
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFormulario());
        }

        // Botón nueva solicitud
        const btnNueva = document.getElementById(this.config.btnNuevaId);
        if (btnNueva) {
            btnNueva.addEventListener('click', () => {
                this.ocultarResumen();
                this.limpiarFormulario();
            });
        }

        // Validación en tiempo real
        this.agregarValidacionTiempoReal();
    }

    agregarValidacionTiempoReal() {
        this.config.campos.forEach(({ id, validaciones }) => {
            const campo = document.getElementById(id);
            if (!campo) return;

            campo.addEventListener('blur', () => {
                Validaciones.validarCampo(campo, validaciones || ['requerido']);
            });

            campo.addEventListener('input', () => {
                if (campo.classList.contains('border-red-500')) {
                    Validaciones.limpiarError(campo);
                }
            });
        });
    }

    validarFormulario() {
        let valido = true;

        this.config.campos.forEach(({ id, validaciones, opcional }) => {
            if (opcional) return;

            const campo = document.getElementById(id);
            if (campo && !Validaciones.validarCampo(campo, validaciones || ['requerido'])) {
                valido = false;
            }
        });

        return valido;
    }

    recogerDatos() {
        const datos = {};

        this.config.campos.forEach(({ id, key, combinar }) => {
            const campo = document.getElementById(id);
            if (!campo) return;

            const valor = campo.value.trim();

            if (combinar) {
                if (!datos[combinar.target]) {
                    datos[combinar.target] = '';
                }
                datos[combinar.target] += (datos[combinar.target] ? ' ' : '') + valor;
            } else {
                datos[key || id] = valor || null;
            }
        });

        return datos;
    }

    enviarSolicitud() {
        Validaciones.limpiarTodosErrores();

        if (!this.validarFormulario()) {
            return;
        }

        // Validar archivo
        const inputArchivo = document.getElementById(this.config.archivoId);
        if (inputArchivo && inputArchivo.files.length > 0) {
            const archivo = inputArchivo.files[0];
            const maxSize = 5 * 1024 * 1024;

            if (archivo.size > maxSize) {
                Validaciones.mostrarError(inputArchivo, 'El archivo no debe superar los 5MB');
                return;
            }
        }

        const datos = this.recogerDatos();

        // Agregar archivo
        if (inputArchivo && inputArchivo.files.length > 0) {
            datos.archivoNombre = inputArchivo.files[0].name;
        }

        const solicitud = APP.agregarSolicitud(datos);
        this.mostrarResumen(solicitud);

        if (this.resumen) {
            this.resumen.scrollIntoView({ behavior: 'smooth' });
        }
    }

    mostrarResumen(solicitud) {
        this.form.parentElement.parentElement.style.display = 'none';

        if (this.resumen) {
            this.resumen.classList.remove('hidden');

            // Llenar datos del resumen
            this.config.camposResumen.forEach(({ elementId, solicitudKey }) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = solicitud[solicitudKey] || '';
                }
            });
        }
    }

    ocultarResumen() {
        this.form.parentElement.parentElement.style.display = 'block';

        if (this.resumen) {
            this.resumen.classList.add('hidden');
        }
    }

    limpiarFormulario() {
        this.form.reset();

        const nombreArchivo = document.getElementById(this.config.nombreArchivoId);
        if (nombreArchivo) {
            nombreArchivo.textContent = 'Seleccionar archivo...';
        }

        Validaciones.limpiarTodosErrores();
    }
}


// ============================================
// 7. FUNCIÓN GLOBAL PARA ARCHIVO
// ============================================

function actualizarNombreArchivo(input) {
    let targetId = 'nombre-archivo';
    if (input.id === 'archivo-func') {
        targetId = 'nombre-archivo-func';
    } else if (input.id === 'archivo-esp') {
        targetId = 'nombre-archivo-esp';
    } else if (input.id === 'archivo-corresp') {
        targetId = 'nombre-archivo-corresp';
    }

    const nombreArchivo = document.getElementById(targetId);
    if (input.files.length > 0) {
        const archivo = input.files[0];
        nombreArchivo.textContent = archivo.name;

        const maxSize = 5 * 1024 * 1024;
        if (archivo.size > maxSize) {
            Validaciones.mostrarError(input, 'El archivo no debe superar los 5MB');
            input.value = '';
            nombreArchivo.textContent = 'Seleccionar archivo...';
        }
    } else {
        nombreArchivo.textContent = 'Seleccionar archivo...';
    }
}


// ============================================
// 8. RENDERIZADOR DE TABLAS OPTIMIZADO
// ============================================

class TablaRenderer {
    constructor(config) {
        this.config = config;
        this.tbody = document.getElementById(config.tbodyId);
        this.container = document.getElementById(config.containerId);
        this.estadoVacio = document.getElementById(config.estadoVacioId);
        this.countSpan = document.getElementById(config.countId);
        this.renderCache = new Map();
    }

    render(solicitudes) {
        if (!this.tbody) return;

        const count = solicitudes.length;

        if (this.countSpan) {
            this.countSpan.textContent = count;
        }

        if (count === 0) {
            this.mostrarEstadoVacio();
            return;
        }

        this.mostrarTabla();
        this.renderizarFilas(solicitudes);
    }

    mostrarEstadoVacio() {
        if (this.container) this.container.style.display = 'none';
        if (this.estadoVacio) this.estadoVacio.style.display = 'block';
    }

    mostrarTabla() {
        if (this.container) this.container.style.display = 'block';
        if (this.estadoVacio) this.estadoVacio.style.display = 'none';
    }

    renderizarFilas(solicitudes) {
        // Usar DocumentFragment para mejor rendimiento
        const fragment = document.createDocumentFragment();
        const solicitudesOrdenadas = [...solicitudes].reverse();

        solicitudesOrdenadas.forEach(solicitud => {
            const fila = this.crearFila(solicitud);
            fragment.appendChild(fila);
        });

        // Limpiar y agregar todo de una vez
        this.tbody.innerHTML = '';
        this.tbody.appendChild(fragment);
    }

    crearFila(solicitud) {
        const tr = document.createElement('tr');
        tr.style.background = 'var(--card-bg)';
        tr.style.cursor = 'pointer';

        tr.addEventListener('click', (e) => {
            if (!e.target.closest('.action-button')) {
                ModalDetalle.abrir(solicitud.id, this.config.origenVista || 'funcionario');
            }
        });

        tr.innerHTML = this.generarHTMLFila(solicitud);
        return tr;
    }

    generarHTMLFila(solicitud) {
        const titulo = solicitud.titulo || 'Sin título';
        const tituloCorto = titulo.length > 60
            ? titulo.substring(0, 60) + '...'
            : titulo;

        return `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background: ${this.config.iconoBg || '#294589'};">
                        <i class="fas fa-file-alt text-white"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.id}</div>
                        <div class="text-sm" style="color: var(--text-secondary);">${EstadosUtil.formatearFecha(solicitud.fechaCreacion)}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.nombre}</div>
                <div class="text-sm" style="color: var(--text-secondary);">RUT: ${solicitud.rut}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm" style="color: var(--text-primary);">
                    <div class="flex items-center gap-2 mb-1">
                        <i class="fas fa-envelope text-xs" style="color: var(--text-secondary);"></i>
                        <span>${solicitud.email}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-phone text-xs" style="color: var(--text-secondary);"></i>
                        <span>${solicitud.telefono}</span>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium" style="color: var(--text-primary);">${tituloCorto}</div>
            </td>
            <td class="px-6 py-4">
                ${EstadosUtil.crearBadgeEstado(solicitud)}
            </td>
            <td class="px-6 py-4">
                ${this.crearColumnaDiasAbierto(solicitud)}
            </td>
        `;
    }

    crearColumnaDiasAbierto(solicitud) {
        // Si es vista de unidad técnica O tiene unidad técnica asignada, usar desglose inline
        if (this.config.origenVista === 'unidad-tecnica' || (solicitud.unidadTecnica && solicitud.unidadTecnica !== '')) {
            return EstadosUtil.renderizarDesgloseInline(solicitud);
        }

        // Vista normal con o sin botón de notificación (para solicitudes sin derivar)
        if (this.config.mostrarBotonNotificar) {
            return `
                <div class="flex items-center justify-center gap-2">
                    ${EstadosUtil.calcularDiasAbierto(solicitud.fechaCreacion)}
                    <button class="p-1.5 rounded-lg transition-colors hover:bg-blue-100 action-button"
                            onclick="FuncionarioView.confirmarEnvioRecordatorio(APP.buscarSolicitud('${solicitud.id}'))"
                            title="Enviar recordatorio">
                        <i class="fas fa-envelope text-blue-600 text-sm"></i>
                    </button>
                </div>
            `;
        }
        return `<div class="text-center">${EstadosUtil.calcularDiasAbierto(solicitud.fechaCreacion)}</div>`;
    }
}


// ============================================
// 9. VISTA FUNCIONARIO OPTIMIZADA
// ============================================

const FuncionarioView = {
    filtroActual: 'todas',
    renderer: null,

    init() {
        this.renderer = new TablaRenderer({
            tbodyId: 'tabla-solicitudes-body',
            containerId: 'tabla-solicitudes-container',
            estadoVacioId: 'estado-vacio',
            countId: 'count-solicitudes',
            origenVista: 'funcionario',
            iconoBg: '#294589',
            mostrarBotonNotificar: true
        });

        this.initFiltros();
    },

    initFiltros() {
        const filtros = [
            { id: 'filtro-todas', tipo: 'todas' },
            { id: 'filtro-pendiente-derivar', tipo: 'pendiente-derivar' },
            { id: 'filtro-derivadas', tipo: 'derivadas' }
        ];

        filtros.forEach(({ id, tipo }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.aplicarFiltro(tipo, btn));
            }
        });
    },

    aplicarFiltro(filtro, boton) {
        document.querySelectorAll('.filtro-btn').forEach(btn =>
            btn.classList.remove('filtro-activo')
        );
        boton.classList.add('filtro-activo');
        this.filtroActual = filtro;
        this.actualizar();
    },

    obtenerSolicitudesFiltradas() {
        let solicitudes = APP.solicitudes;

        if (this.filtroActual === 'pendiente-derivar') {
            solicitudes = solicitudes.filter(s => !s.unidadTecnica || s.unidadTecnica === '');
        } else if (this.filtroActual === 'derivadas') {
            solicitudes = solicitudes.filter(s => s.unidadTecnica && s.unidadTecnica !== '');
        }

        return solicitudes;
    },

    actualizar() {
        const solicitudes = this.obtenerSolicitudesFiltradas();
        this.renderer.render(solicitudes);
    },

    confirmarEnvioRecordatorio(solicitud) {
        if (!solicitud) return;

        const diasAbiertos = Math.floor((Date.now() - new Date(solicitud.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24));

        const confirmacion = confirm(
            `¿Estás seguro que quieres enviar un recordatorio?\n\n` +
            `Solicitud: ${solicitud.id}\n` +
            `Ciudadano: ${solicitud.nombre}\n` +
            `Días abiertos: ${diasAbiertos}\n\n` +
            `Se notificará que esta solicitud está con retraso.`
        );

        if (confirmacion) {
            this.enviarRecordatorio(solicitud);
        }
    },

    enviarRecordatorio(solicitud) {
        console.log('📧 Enviando recordatorio para solicitud:', solicitud.id);

        alert(
            `✅ Recordatorio enviado exitosamente\n\n` +
            `Solicitud: ${solicitud.id}\n` +
            `Se ha notificado sobre el retraso de esta solicitud.`
        );
    }
};


// ============================================
// 10. VISTA UNIDAD TÉCNICA OPTIMIZADA
// ============================================

const UnidadTecnicaView = {
    unidadCodigo: 'fiscalizacion',
    renderer: null,

    init() {
        this.renderer = new TablaRenderer({
            tbodyId: 'tabla-solicitudes-ut-body',
            containerId: 'tabla-solicitudes-ut-container',
            estadoVacioId: 'estado-vacio-ut',
            countId: 'count-solicitudes-ut',
            origenVista: 'unidad-tecnica',
            iconoBg: '#9333ea',
            mostrarBotonNotificar: false
        });
    },

    obtenerSolicitudesUnidad() {
        return APP.solicitudes.filter(sol => sol.unidadTecnica === this.unidadCodigo);
    },

    actualizar() {
        const solicitudes = this.obtenerSolicitudesUnidad();
        this.renderer.render(solicitudes);
    }
};


// ============================================
// 11. MODAL DE DETALLE (mantenido igual por compatibilidad)
// ============================================

const ModalDetalle = {
    solicitudActual: null,

    init() {
        const modal = document.getElementById('modal-detalle');
        const btnCerrar = document.getElementById('btn-cerrar-modal');
        const btnCancelar = document.getElementById('btn-cancelar-modal');
        const btnGuardar = document.getElementById('btn-guardar-asignacion');
        const btnGuardarEstadoUT = document.getElementById('btn-guardar-estado-ut');

        if (btnCerrar) btnCerrar.addEventListener('click', () => this.cerrar());
        if (btnCancelar) btnCancelar.addEventListener('click', () => this.cerrar());

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.cerrar();
            });
        }

        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => this.guardarAsignacion());
        }

        if (btnGuardarEstadoUT) {
            btnGuardarEstadoUT.addEventListener('click', () => this.guardarEstadoUnidadTecnica());
        }

        const selectUnidadTecnica = document.getElementById('modal-unidad-tecnica');
        if (selectUnidadTecnica) {
            selectUnidadTecnica.addEventListener('change', (e) =>
                this.manejarCambioUnidadTecnica(e.target.value)
            );
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.cerrar();
            }
        });
    },

    abrir(solicitudId, origenVista = 'funcionario') {
        const solicitud = APP.buscarSolicitud(solicitudId);
        if (!solicitud) {
            console.error('❌ No se encontró solicitud con ID:', solicitudId);
            return;
        }

        this.solicitudActual = solicitud;
        this.llenarDatos(solicitud, origenVista);
        this.mostrar();
    },

    llenarDatos(solicitud, origenVista) {
        const campos = {
            'modal-id-solicitud': solicitud.id,
            'modal-nombre': solicitud.nombre,
            'modal-rut': solicitud.rut,
            'modal-email': solicitud.email,
            'modal-telefono': solicitud.telefono,
            'modal-titulo': solicitud.titulo || 'Sin título',
            'modal-descripcion': solicitud.descripcion,
            'modal-fecha': EstadosUtil.formatearFecha(solicitud.fechaCreacion)
        };

        Object.entries(campos).forEach(([id, valor]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = valor;
        });

        // Archivo adjunto
        const archivoContainer = document.getElementById('modal-archivo-container');
        const archivoNombre = document.getElementById('modal-archivo-nombre');
        if (solicitud.archivoNombre) {
            if (archivoContainer) archivoContainer.classList.remove('hidden');
            if (archivoNombre) archivoNombre.textContent = solicitud.archivoNombre;
        } else {
            if (archivoContainer) archivoContainer.classList.add('hidden');
        }

        // Estado badge
        const badgeEstado = document.getElementById('modal-estado-badge');
        if (badgeEstado) {
            badgeEstado.className = 'badge';
            const estados = {
                'pendiente': ['badge-pendiente', '<i class="fas fa-clock mr-1"></i> Pendiente'],
                'revision': ['badge-revision', '<i class="fas fa-spinner mr-1"></i> En Revisión'],
                'finalizada': ['badge-finalizada', '<i class="fas fa-check mr-1"></i> Finalizada']
            };
            const [clase, html] = estados[solicitud.estado] || estados.pendiente;
            badgeEstado.classList.add(clase);
            badgeEstado.innerHTML = html;
        }

        // Unidad técnica
        const selectUT = document.getElementById('modal-unidad-tecnica');
        if (selectUT) {
            selectUT.value = solicitud.unidadTecnica || '';
        }

        // Configurar visibilidad según origen
        this.configurarVisibilidad(solicitud, origenVista);
    },

    configurarVisibilidad(solicitud, origenVista) {
        const estadoUTContainer = document.getElementById('modal-estado-ut-container');
        const estadoUTSelect = document.getElementById('modal-estado-ut');
        const asignacionUTContainer = document.getElementById('modal-asignacion-ut-container');

        if (origenVista === 'unidad-tecnica' && solicitud.unidadTecnica) {
            if (estadoUTContainer) estadoUTContainer.classList.remove('hidden');
            if (estadoUTSelect) estadoUTSelect.value = solicitud.estadoUnidadTecnica || '';
            if (asignacionUTContainer) asignacionUTContainer.classList.add('hidden');
        } else {
            if (estadoUTContainer) estadoUTContainer.classList.add('hidden');
            if (asignacionUTContainer) asignacionUTContainer.classList.remove('hidden');
        }

        // Preguntas Parques y Jardines
        if (origenVista === 'funcionario') {
            const unidadTecnicaActual = solicitud.unidadTecnica || '';
            this.manejarCambioUnidadTecnica(unidadTecnicaActual);

            if (unidadTecnicaActual === 'parques-jardines' && solicitud.datosParquesJardines) {
                const campos = {
                    'modal-tipo-terreno': solicitud.datosParquesJardines.tipoTerreno,
                    'modal-tipo-vegetacion': solicitud.datosParquesJardines.tipoVegetacion,
                    'modal-requiere-camion': solicitud.datosParquesJardines.requiereCamion
                };
                Object.entries(campos).forEach(([id, valor]) => {
                    const element = document.getElementById(id);
                    if (element) element.value = valor || '';
                });
            }
        }
    },

    mostrar() {
        const modal = document.getElementById('modal-detalle');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    },

    cerrar() {
        const modal = document.getElementById('modal-detalle');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        this.solicitudActual = null;
    },

    manejarCambioUnidadTecnica(unidad) {
        const parquesJardinesContainer = document.getElementById('modal-parques-jardines-container');
        if (parquesJardinesContainer) {
            if (unidad === 'parques-jardines') {
                parquesJardinesContainer.classList.remove('hidden');
            } else {
                parquesJardinesContainer.classList.add('hidden');
            }
        }
    },

    guardarAsignacion() {
        if (!this.solicitudActual) return;

        const unidad = document.getElementById('modal-unidad-tecnica').value;

        if (unidad === 'parques-jardines') {
            const tipoTerreno = document.getElementById('modal-tipo-terreno').value;
            const tipoVegetacion = document.getElementById('modal-tipo-vegetacion').value;
            const requiereCamion = document.getElementById('modal-requiere-camion').value;

            if (!tipoTerreno || !tipoVegetacion || !requiereCamion) {
                alert('⚠️ Por favor complete todas las preguntas de Parques y Jardines antes de guardar');
                return;
            }

            APP.actualizarSolicitud(this.solicitudActual.id, {
                datosParquesJardines: { tipoTerreno, tipoVegetacion, requiereCamion }
            });
        }

        APP.asignarUnidadTecnica(this.solicitudActual.id, unidad);
        FuncionarioView.actualizar();
        this.cerrar();
    },

    guardarEstadoUnidadTecnica() {
        if (!this.solicitudActual) return;

        const estadoUT = document.getElementById('modal-estado-ut').value;

        if (!estadoUT) {
            alert('Por favor seleccione un estado');
            return;
        }

        APP.cambiarEstadoUnidadTecnica(this.solicitudActual.id, estadoUT);
        FuncionarioView.actualizar();
        UnidadTecnicaView.actualizar();
        this.cerrar();
    }
};


// ============================================
// 12. DATOS DE EJEMPLO (mantenido igual)
// ============================================

const DatosDeEjemplo = {
    cargarSolicitudesDeEjemplo() {
        const ejemplos = [
            {
                id: '241031-001',
                nombre: 'Carlos Alberto Mendoza',
                rut: '12.345.678-9',
                email: 'carlos.mendoza@email.com',
                telefono: '+56912345678',
                titulo: 'Cambio de domicilio para servicios municipales',
                descripcion: 'Solicitud de cambio de domicilio para servicios municipales y actualización de base de datos.',
                estado: 'finalizada',
                unidadTecnica: 'dat',
                fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241107-002',
                nombre: 'María Francisca Rodríguez López',
                rut: '11.234.567-8',
                email: 'mfrodriguez@email.com',
                telefono: '+56987654321',
                titulo: 'Consulta sobre pensión alimenticia',
                descripcion: 'Consulta sobre trámite de pensión alimenticia y requisitos documentales necesarios.',
                estado: 'revision',
                unidadTecnica: '',
                fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241109-003',
                nombre: 'Jorge Luis García Fernández',
                rut: '14.567.890-1',
                email: 'jgarcia.fernandez@email.com',
                telefono: '+56923456789',
                titulo: 'Reclamo por falta de recolección de basura',
                descripcion: 'Reclamo sobre falta de servicio de recolección de basura en la calle Los Andes sector sur.',
                estado: 'pendiente',
                unidadTecnica: '',
                fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241026-004',
                nombre: 'Patricia Elena Soto Morales',
                rut: '16.789.012-3',
                email: 'p.soto.morales@email.com',
                telefono: '+56934567890',
                titulo: 'Permiso para evento comunitario en parque',
                descripcion: 'Solicitud de permiso para evento comunitario en parque municipal el próximo mes.',
                estado: 'finalizada',
                unidadTecnica: 'parques-jardines',
                fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241105-005',
                nombre: 'Roberto Manuel Pérez Valenzuela',
                rut: '13.456.789-0',
                email: 'r.perez.valenzuela@email.com',
                telefono: '+56945678901',
                titulo: 'Certificado de dominio para compraventa',
                descripcion: 'Trámite de obtención de certificado de dominio para proceso de compraventa inmobiliaria.',
                estado: 'revision',
                unidadTecnica: 'patentes-comerciales',
                fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241108-006',
                nombre: 'Verónica Alejandra González Parra',
                rut: '15.678.901-2',
                email: 'v.gonzalez.parra@email.com',
                telefono: '+56956789012',
                titulo: 'Consulta sobre beneficios sociales',
                descripcion: 'Consulta sobre beneficios sociales y programas de subsidios para familias de escasos recursos.',
                estado: 'pendiente',
                unidadTecnica: '',
                fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241021-007',
                nombre: 'Andrés Felipe Contreras Díaz',
                rut: '17.890.123-4',
                email: 'a.contreras.diaz@email.com',
                telefono: '+56967890123',
                titulo: 'Reparación de infraestructura vial',
                descripcion: 'Reclamo por daños en infraestructura vial y solicitud de reparación en calle principal.',
                estado: 'finalizada',
                unidadTecnica: 'alumbrado-publico',
                fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241109-008',
                nombre: 'Claudia Marcela Flores Gutierrez',
                rut: '18.901.234-5',
                email: 'c.flores.gutierrez@email.com',
                telefono: '+56978901234',
                titulo: 'Información sobre proceso electoral',
                descripcion: 'Solicitud de información sobre proceso electoral y registro de votantes para próximas elecciones.',
                estado: 'pendiente',
                unidadTecnica: '',
                fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-009',
                nombre: 'Luis Alberto Torres Ramírez',
                rut: '19.012.345-6',
                email: 'l.torres.ramirez@email.com',
                telefono: '+56989012345',
                titulo: 'Denuncia por comercio ambulante sin permiso',
                descripcion: 'Denuncia por comercio ambulante sin permiso en Avenida Principal esquina con Calle Comercio.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-010',
                nombre: 'Ana María Vega Silva',
                rut: '20.123.456-7',
                email: 'anavega.silva@email.com',
                telefono: '+56990123456',
                titulo: 'Reclamo por local con horario excedido',
                descripcion: 'Reclamo por establecimiento comercial que opera fuera del horario permitido y genera ruidos molestos.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-011',
                nombre: 'Fernando José Muñoz Herrera',
                rut: '21.234.567-8',
                email: 'fjmunoz.h@email.com',
                telefono: '+56901234567',
                titulo: 'Fiscalización de obra sin permiso',
                descripcion: 'Solicitud de fiscalización de obra en construcción sin permiso municipal visible en el sector norte.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241016-012',
                nombre: 'Isabel Cristina Rojas Campos',
                rut: '22.345.678-9',
                email: 'icrojas.campos@email.com',
                telefono: '+56912345670',
                titulo: 'Denuncia por local sin normas sanitarias',
                descripcion: 'Denuncia por local comercial que no cumple con normas sanitarias y de higiene alimentaria.',
                estado: 'finalizada',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'finalizado',
                fechaCreacion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
                fechaFinUnidadTecnica: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241109-013',
                nombre: 'Diego Antonio Morales Pinto',
                rut: '23.456.789-0',
                email: 'dmorales.pinto@email.com',
                telefono: '+56923456701',
                titulo: 'Vehículos ocupando espacio público',
                descripcion: 'Reclamo por vehículos que ocupan espacio público como estacionamiento permanente.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-014',
                nombre: 'Carmen Gloria Espinoza Díaz',
                rut: '24.567.890-1',
                email: 'cgespinoza.d@email.com',
                telefono: '+56934567012',
                titulo: 'Inspección por cierre irregular de callejón',
                descripcion: 'Solicitud de inspección por posible cierre irregular de callejón de uso público.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241109-015',
                nombre: 'Ricardo Andrés Silva Paredes',
                rut: '17.123.456-0',
                email: 'rsilva.paredes@email.com',
                telefono: '+56945612378',
                titulo: 'Denuncia construcción ilegal',
                descripcion: 'Construcción de segundo piso sin permiso en vivienda del cerro Bellavista.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241105-016',
                nombre: 'Mónica Patricia Fuentes Ríos',
                rut: '18.234.567-1',
                email: 'm.fuentes.r@email.com',
                telefono: '+56956789234',
                titulo: 'Local sin patente comercial visible',
                descripcion: 'Restaurant en Av. Argentina operando sin patente comercial visible al público.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241101-017',
                nombre: 'Héctor Manuel Bravo Castro',
                rut: '16.345.678-2',
                email: 'hbravo.c@email.com',
                telefono: '+56967890345',
                titulo: 'Vertedero clandestino en sitio eriazo',
                descripcion: 'Acumulación de escombros y basura en sitio eriazo de calle Ecuador, posible vertedero clandestino.',
                estado: 'finalizada',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'finalizado',
                fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
                fechaFinUnidadTecnica: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241108-018',
                nombre: 'Gloria Beatriz Muñoz Herrera',
                rut: '19.456.789-3',
                email: 'gbmunoz@email.com',
                telefono: '+56978901456',
                titulo: 'Ruidos molestos bar nocturno',
                descripcion: 'Bar en calle Cumming genera ruidos molestos hasta altas horas afectando vecinos.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241020-019',
                nombre: 'Sergio Alejandro Pizarro Muñoz',
                rut: '15.567.890-4',
                email: 's.pizarro.m@email.com',
                telefono: '+56989012567',
                titulo: 'Ocupación de vereda con mesas',
                descripcion: 'Café ocupa toda la vereda con mesas impidiendo tránsito peatonal en Av. Pedro Montt.',
                estado: 'finalizada',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'finalizado',
                fechaCreacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
                fechaFinUnidadTecnica: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241107-020',
                nombre: 'Daniela Carolina Rojas Soto',
                rut: '20.678.901-5',
                email: 'dcrojas.s@email.com',
                telefono: '+56990123678',
                titulo: 'Taller mecánico sin autorización',
                descripcion: 'Taller mecánico operando en zona residencial sin permisos, genera ruidos y contaminación.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241106-021',
                nombre: 'Patricio Hernán Valdés Rojas',
                rut: '14.789.012-6',
                email: 'phvaldes.r@email.com',
                telefono: '+56901234789',
                titulo: 'Antena telecomunicaciones sin permiso',
                descripcion: 'Instalación de antena de telecomunicaciones en edificio sin permiso municipal visible.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                estadoUnidadTecnica: 'en-ejecucion',
                fechaCreacion: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
                fechaDerivacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                fechaInicioUnidadTecnica: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        const idsExistentes = APP.solicitudes.map(s => s.id);
        const ejemplosNuevos = ejemplos.filter(e => !idsExistentes.includes(e.id));

        APP.solicitudes = [...APP.solicitudes, ...ejemplosNuevos];
        APP.guardarSolicitudes();

        console.log(`📝 Se agregaron ${ejemplosNuevos.length} ejemplos nuevos`);
        return ejemplosNuevos;
    }
};


// ============================================
// 13. CONFIGURACIONES DE FORMULARIOS
// ============================================

const configuraciones = {
    ciudadano: {
        formId: 'solicitud-form',
        resumenId: 'resumen-solicitud',
        btnLimpiarId: 'btn-limpiar',
        btnNuevaId: 'btn-nueva-solicitud',
        archivoId: 'archivo',
        nombreArchivoId: 'nombre-archivo',
        campos: [
            { id: 'nombre', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'apellido', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'nombre-social', key: 'nombreSocial', opcional: true },
            { id: 'rut', validaciones: ['requerido', 'rut'] },
            { id: 'fecha-nacimiento', key: 'fechaNacimiento', validaciones: ['requerido'] },
            { id: 'genero', validaciones: ['requerido'] },
            { id: 'email', validaciones: ['requerido', 'email'] },
            { id: 'email2', opcional: true },
            { id: 'telefono', validaciones: ['requerido', 'telefono'] },
            { id: 'telefono2', opcional: true },
            { id: 'direccion', validaciones: ['requerido'] },
            { id: 'titulo', validaciones: ['requerido', Validaciones.reglas.minLength(5)] },
            { id: 'descripcion', validaciones: ['requerido', Validaciones.reglas.minLength(10)] },
            { id: 'cerro', validaciones: ['requerido'] },
            { id: 'ubicacion-especifica', key: 'ubicacionEspecifica', validaciones: ['requerido', Validaciones.reglas.minLength(5)] }
        ],
        camposResumen: [
            { elementId: 'numero-seguimiento', solicitudKey: 'id' },
            { elementId: 'resumen-nombre', solicitudKey: 'nombre' },
            { elementId: 'resumen-rut', solicitudKey: 'rut' },
            { elementId: 'resumen-email', solicitudKey: 'email' },
            { elementId: 'resumen-telefono', solicitudKey: 'telefono' },
            { elementId: 'resumen-descripcion', solicitudKey: 'descripcion' }
        ]
    },
    funcionario: {
        formId: 'solicitud-form-func',
        resumenId: 'resumen-solicitud-func',
        btnLimpiarId: 'btn-limpiar-func',
        btnNuevaId: 'btn-nueva-solicitud-func',
        archivoId: 'archivo-func',
        nombreArchivoId: 'nombre-archivo-func',
        campos: [
            { id: 'nombre-func', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'apellido-func', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'nombre-social-func', key: 'nombreSocial', opcional: true },
            { id: 'rut-func', key: 'rut', validaciones: ['requerido', 'rut'] },
            { id: 'fecha-nacimiento-func', key: 'fechaNacimiento', validaciones: ['requerido'] },
            { id: 'genero-func', key: 'genero', validaciones: ['requerido'] },
            { id: 'email-func', key: 'email', validaciones: ['requerido', 'email'] },
            { id: 'email2-func', key: 'email2', opcional: true },
            { id: 'telefono-func', key: 'telefono', validaciones: ['requerido', 'telefono'] },
            { id: 'telefono2-func', key: 'telefono2', opcional: true },
            { id: 'direccion-func', key: 'direccion', validaciones: ['requerido'] },
            { id: 'titulo-func', key: 'titulo', validaciones: ['requerido', Validaciones.reglas.minLength(5)] },
            { id: 'descripcion-func', key: 'descripcion', validaciones: ['requerido', Validaciones.reglas.minLength(10)] },
            { id: 'cerro-func', key: 'cerro', validaciones: ['requerido'] },
            { id: 'ubicacion-especifica-func', key: 'ubicacionEspecifica', validaciones: ['requerido', Validaciones.reglas.minLength(5)] }
        ],
        camposResumen: [
            { elementId: 'numero-seguimiento-func', solicitudKey: 'id' },
            { elementId: 'resumen-nombre-func', solicitudKey: 'nombre' },
            { elementId: 'resumen-rut-func', solicitudKey: 'rut' },
            { elementId: 'resumen-email-func', solicitudKey: 'email' },
            { elementId: 'resumen-telefono-func', solicitudKey: 'telefono' },
            { elementId: 'resumen-descripcion-func', solicitudKey: 'descripcion' }
        ]
    },
    funcionarioEspecifico: {
        formId: 'solicitud-form-esp',
        resumenId: 'resumen-solicitud-esp',
        btnLimpiarId: 'btn-limpiar-esp',
        btnNuevaId: 'btn-nueva-solicitud-esp',
        archivoId: 'archivo-esp',
        nombreArchivoId: 'nombre-archivo-esp',
        campos: [
            { id: 'nombre-esp', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'apellido-esp', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'nombre-social-esp', key: 'nombreSocial', opcional: true },
            { id: 'rut-esp', key: 'rut', validaciones: ['requerido', 'rut'] },
            { id: 'fecha-nacimiento-esp', key: 'fechaNacimiento', validaciones: ['requerido'] },
            { id: 'genero-esp', key: 'genero', validaciones: ['requerido'] },
            { id: 'email-esp', key: 'email', validaciones: ['requerido', 'email'] },
            { id: 'email2-esp', key: 'email2', opcional: true },
            { id: 'telefono-esp', key: 'telefono', validaciones: ['requerido', 'telefono'] },
            { id: 'telefono2-esp', key: 'telefono2', opcional: true },
            { id: 'direccion-esp', key: 'direccion', validaciones: ['requerido'] },
            { id: 'titulo-esp', key: 'titulo', validaciones: ['requerido', Validaciones.reglas.minLength(5)] },
            { id: 'descripcion-esp', key: 'descripcion', validaciones: ['requerido', Validaciones.reglas.minLength(10)] },
            { id: 'cerro-esp', key: 'cerro', validaciones: ['requerido'] },
            { id: 'ubicacion-especifica-esp', key: 'ubicacionEspecifica', validaciones: ['requerido', Validaciones.reglas.minLength(5)] },
            { id: 'tipo-terreno', key: 'tipoTerreno', validaciones: ['requerido'] },
            { id: 'informe-social', key: 'informeSocial', validaciones: ['requerido'] },
            { id: 'retiro-escombros', key: 'retiroEscombros', validaciones: ['requerido'] }
        ],
        camposResumen: [
            { elementId: 'numero-seguimiento-esp', solicitudKey: 'id' },
            { elementId: 'resumen-nombre-esp', solicitudKey: 'nombre' },
            { elementId: 'resumen-rut-esp', solicitudKey: 'rut' },
            { elementId: 'resumen-email-esp', solicitudKey: 'email' },
            { elementId: 'resumen-telefono-esp', solicitudKey: 'telefono' },
            { elementId: 'resumen-descripcion-esp', solicitudKey: 'descripcion' }
        ]
    },
    funcionarioCorrespondencia: {
        formId: 'solicitud-form-corresp',
        resumenId: 'resumen-correspondencia',
        btnLimpiarId: 'btn-limpiar-corresp',
        btnNuevaId: 'btn-nueva-correspondencia',
        archivoId: 'archivo-corresp',
        nombreArchivoId: 'nombre-archivo-corresp',
        campos: [
            { id: 'tipo-remitente', key: 'tipoRemitente', validaciones: ['requerido'] },
            { id: 'nombre-corresp', combinar: { target: 'nombre' }, validaciones: ['requerido', Validaciones.reglas.minLength(2)] },
            { id: 'apellido-corresp', combinar: { target: 'nombre' }, opcional: true },
            { id: 'telefono-corresp', key: 'telefono', validaciones: ['requerido', 'telefono'] },
            { id: 'email-corresp', key: 'email', validaciones: ['requerido', 'email'] },
            { id: 'direccion-corresp', key: 'direccion', validaciones: ['requerido'] },
            { id: 'numero-folio', key: 'numeroFolio', validaciones: ['requerido'] },
            { id: 'fecha-hora-ingreso', key: 'fechaHoraIngreso', validaciones: ['requerido'] },
            { id: 'tipo-documento', key: 'tipoDocumento', validaciones: ['requerido'] },
            { id: 'canal-recepcion', key: 'canalRecepcion', validaciones: ['requerido'] },
            { id: 'materia-documento', key: 'descripcion', validaciones: ['requerido', Validaciones.reglas.minLength(10)] }
        ],
        camposResumen: [
            { elementId: 'resumen-folio', solicitudKey: 'numeroFolio' },
            { elementId: 'resumen-nombre-corresp', solicitudKey: 'nombre' },
            { elementId: 'resumen-email-corresp', solicitudKey: 'email' },
            { elementId: 'resumen-telefono-corresp', solicitudKey: 'telefono' }
        ]
    }
};


// ============================================
// 14. INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Oficina de Partes Digital (Versión Optimizada)');

    // Cargar datos (async)
    await APP.cargarSolicitudes();

    // Cargar ejemplos si hay pocas solicitudes
    if (APP.solicitudes.length < 10) {
        console.log('⚠️ Pocas solicitudes, agregando ejemplos...');
        DatosDeEjemplo.cargarSolicitudesDeEjemplo();
    }

    // Inicializar Tab Manager
    const tabManager = new TabManager();
    tabManager.init();

    // Inicializar formularios
    new FormularioBase(configuraciones.ciudadano);
    new FormularioBase(configuraciones.funcionario);
    new FormularioBase(configuraciones.funcionarioEspecifico);
    new FormularioBase(configuraciones.funcionarioCorrespondencia);

    // Inicializar vistas
    FuncionarioView.init();
    UnidadTecnicaView.init();
    ModalDetalle.init();

    // Actualizar vista funcionario
    FuncionarioView.actualizar();

    console.log('✅ Aplicación iniciada correctamente');
    console.log(`📊 ${APP.solicitudes.length} solicitudes cargadas`);
});
