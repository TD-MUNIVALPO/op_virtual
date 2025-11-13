// ============================================
// OFICINA DE PARTES DIGITAL - APLICACIÓN PRINCIPAL
// ============================================

// ============================================
// 1. ESTADO DE LA APLICACIÓN
// ============================================

const APP = {
    solicitudes: [],

    // Cargar solicitudes desde localStorage
    cargarSolicitudes() {
        const stored = localStorage.getItem('solicitudes_op');
        if (stored) {
            try {
                this.solicitudes = JSON.parse(stored);
            } catch (e) {
                console.error('Error al cargar solicitudes:', e);
                this.solicitudes = [];
            }
        }
    },

    // Guardar solicitudes en localStorage
    guardarSolicitudes() {
        localStorage.setItem('solicitudes_op', JSON.stringify(this.solicitudes));
    },

    // Generar ID único
    generarId() {
        const year = new Date().getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const day = new Date().getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 999) + 1; // 1-999
        return `${year}${month}${day}-${random.toString().padStart(3, '0')}`;
    },

    // Agregar nueva solicitud
    agregarSolicitud(datos) {
        const nuevaSolicitud = {
            id: this.generarId(),
            ...datos,
            estado: 'pendiente', // pendiente, revision, finalizada
            unidadTecnica: '',
            fechaCreacion: new Date().toISOString()
        };

        this.solicitudes.push(nuevaSolicitud);
        this.guardarSolicitudes();
        return nuevaSolicitud;
    },

    // Asignar unidad técnica
    asignarUnidadTecnica(id, unidad) {
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (solicitud) {
            solicitud.unidadTecnica = unidad;
            this.guardarSolicitudes();
            return true;
        }
        return false;
    },

    // Cambiar estado de solicitud
    cambiarEstado(id, nuevoEstado) {
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (solicitud) {
            solicitud.estado = nuevoEstado;
            this.guardarSolicitudes();
            return true;
        }
        return false;
    },

    // Cambiar estado de unidad técnica (en-ejecucion, finalizado, rechazado)
    cambiarEstadoUnidadTecnica(id, estadoUT) {
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (solicitud) {
            solicitud.estadoUnidadTecnica = estadoUT;
            solicitud.fechaActualizacionUT = new Date().toISOString();
            this.guardarSolicitudes();
            console.log(`✅ Estado UT actualizado: ${id} -> ${estadoUT}`);
            return true;
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
// 2B. RELOJ DEL HEADER
// ============================================




// ============================================
// 3. GESTIÓN DE TABS
// ============================================

const TabManager = {
    init() {
        const tabCiudadano = document.getElementById('tab-ciudadano');
        const tabFuncionarioForm = document.getElementById('tab-funcionario-form');
        const tabFuncionarioEspecifico = document.getElementById('tab-funcionario-especifico');
        const tabFuncionario = document.getElementById('tab-funcionario');
        const tabUnidadTecnica = document.getElementById('tab-unidad-tecnica');
        const vistaCiudadano = document.getElementById('vista-ciudadano');
        const vistaFuncionarioForm = document.getElementById('vista-funcionario-form');
        const vistaFuncionarioEspecifico = document.getElementById('vista-funcionario-especifico');
        const vistaFuncionario = document.getElementById('vista-funcionario');
        const vistaUnidadTecnica = document.getElementById('vista-unidad-tecnica');

        tabCiudadano.addEventListener('click', () => {
            this.activarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionarioForm, vistaFuncionarioForm);
            this.desactivarTab(tabFuncionarioEspecifico, vistaFuncionarioEspecifico);
            this.desactivarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
        });

        tabFuncionarioForm.addEventListener('click', () => {
            this.activarTab(tabFuncionarioForm, vistaFuncionarioForm);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionarioEspecifico, vistaFuncionarioEspecifico);
            this.desactivarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
        });

        tabFuncionarioEspecifico.addEventListener('click', () => {
            this.activarTab(tabFuncionarioEspecifico, vistaFuncionarioEspecifico);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionarioForm, vistaFuncionarioForm);
            this.desactivarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
        });

        tabFuncionario.addEventListener('click', () => {
            this.activarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionarioForm, vistaFuncionarioForm);
            this.desactivarTab(tabFuncionarioEspecifico, vistaFuncionarioEspecifico);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
            FuncionarioView.actualizar();
        });

        tabUnidadTecnica.addEventListener('click', () => {
            this.activarTab(tabUnidadTecnica, vistaUnidadTecnica);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionarioForm, vistaFuncionarioForm);
            this.desactivarTab(tabFuncionarioEspecifico, vistaFuncionarioEspecifico);
            this.desactivarTab(tabFuncionario, vistaFuncionario);
            UnidadTecnicaView.actualizar();
        });
    },

    activarTab(tab, vista) {
        tab.classList.add('active');
        vista.classList.remove('hidden');
    },

    desactivarTab(tab, vista) {
        tab.classList.remove('active');
        vista.classList.add('hidden');
    }
};


// ============================================
// 4. UTILIDADES GLOBALES - ESTADOS
// ============================================

const EstadosUtil = {
    // Mapeo de unidades técnicas a nombres legibles
    unidadesNombres: {
        'desarrollo-economico': 'Desarrollo Económico',
        'dat': 'DAT',
        'parques-jardines': 'Parques y Jardines',
        'alumbrado-publico': 'Alumbrado Público',
        'fiscalizacion': 'Fiscalización',
        'transito': 'Tránsito',
        'patentes-comerciales': 'Patentes Comerciales'
    },

    // Función unificada para crear badges de estado
    crearBadgeEstado(solicitud) {
        const estado = solicitud.estado;
        const unidadTecnica = solicitud.unidadTecnica;
        const estadoUT = solicitud.estadoUnidadTecnica;
        
        // Si tiene estado de unidad técnica, mostrarlo prioritariamente
        if (estadoUT) {
            const nombreUnidad = this.unidadesNombres[unidadTecnica] || unidadTecnica;
            const estadosUT = {
                'en-ejecucion': `<span class="badge badge-ut-en-ejecucion"><i class="fas fa-cog mr-1"></i>En ejecución - ${nombreUnidad}</span>`,
                'finalizado': `<span class="badge badge-ut-finalizado"><i class="fas fa-check-circle mr-1"></i>Finalizado - ${nombreUnidad}</span>`,
                'rechazado': `<span class="badge badge-ut-rechazado"><i class="fas fa-times-circle mr-1"></i>Rechazado - ${nombreUnidad}</span>`
            };
            return estadosUT[estadoUT] || estadosUT['en-ejecucion'];
        }
        
        // Si tiene unidad técnica asignada pero no tiene estado UT, mostrar derivación
        if (unidadTecnica && unidadTecnica !== '') {
            const nombreUnidad = this.unidadesNombres[unidadTecnica] || unidadTecnica;
            return `<span class="badge badge-derivado"><i class="fas fa-share mr-1"></i>Derivado a: ${nombreUnidad}</span>`;
        }
        
        // Si no tiene unidad técnica, mostrar estado normal
        const badges = {
            'pendiente': '<span class="badge badge-derivacion-pendiente"><i class="fas fa-clock mr-1"></i>Derivación pendiente según</span>',
            'revision': '<span class="badge badge-revision"><i class="fas fa-spinner mr-1"></i>En Revisión</span>',
            'finalizada': '<span class="badge badge-finalizada"><i class="fas fa-check mr-1"></i>Finalizada</span>'
        };
        return badges[estado] || badges.pendiente;
    },

    // Función para calcular días que lleva abierto un requerimiento
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
    }
};

// ============================================
// 5. VALIDACIONES
// ============================================

const Validaciones = {
    // Validar RUT chileno
    validarRUT(rut) {
        // Formato básico: permite con o sin puntos y guión
        const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

        if (rutLimpio.length < 8 || rutLimpio.length > 9) {
            return false;
        }

        const rutPattern = /^[0-9]+-[0-9kK]{1}$/;
        return rutPattern.test(rut) || /^[0-9]{7,8}[0-9kK]{1}$/.test(rutLimpio);
    },

    // Validar email
    validarEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    },

    // Validar teléfono (acepta varios formatos)
    validarTelefono(telefono) {
        const telefonoLimpio = telefono.replace(/\s/g, '').replace(/\+/g, '').replace(/-/g, '');
        return /^[0-9]{8,12}$/.test(telefonoLimpio);
    },

    // Validar campo vacío
    validarRequerido(valor) {
        return valor.trim().length > 0;
    },

    // Mostrar error en campo
    mostrarError(campo, mensaje) {
        const errorSpan = campo.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = mensaje;
            errorSpan.classList.remove('hidden');
        }
        campo.classList.add('border-red-500');
    },

    // Limpiar error en campo
    limpiarError(campo) {
        const errorSpan = campo.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
        }
        campo.classList.remove('border-red-500');
    },

    // Limpiar todos los errores
    limpiarTodosErrores() {
        document.querySelectorAll('.error-message').forEach(span => {
            span.textContent = '';
            span.classList.add('hidden');
        });
        document.querySelectorAll('input, textarea').forEach(campo => {
            campo.classList.remove('border-red-500');
        });
    }
};


// ============================================
// 5. FORMULARIO DE SOLICITUD (CIUDADANO)
// ============================================

const FormularioCiudadano = {
    init() {
        const form = document.getElementById('solicitud-form');
        const btnLimpiar = document.getElementById('btn-limpiar');
        const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud');

        // Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarSolicitud();
        });

        // Botón limpiar
        btnLimpiar.addEventListener('click', () => {
            this.limpiarFormulario();
        });

        // Botón nueva solicitud
        btnNuevaSolicitud.addEventListener('click', () => {
            this.ocultarResumen();
            this.limpiarFormulario();
        });

        // Validación en tiempo real
        this.agregarValidacionTiempoReal();
    },

    agregarValidacionTiempoReal() {
        const campos = ['nombre', 'apellido', 'rut', 'nombre-social', 'fecha-nacimiento', 'genero', 'email', 'email2', 'telefono', 'telefono2', 'direccion', 'titulo', 'descripcion', 'cerro', 'ubicacion-especifica'];

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('blur', () => {
                    this.validarCampo(campo);
                });

                campo.addEventListener('input', () => {
                    if (campo.classList.contains('border-red-500')) {
                        Validaciones.limpiarError(campo);
                    }
                });
            }
        });
    },

    validarCampo(campo) {
        const valor = campo.value;
        let esValido = true;
        let mensaje = '';

        // Validar según el tipo de campo
        if (campo.id === 'nombre') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los nombres son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los nombres deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'apellido') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los apellidos son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los apellidos deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'rut') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El RUT es obligatorio';
            } else if (!Validaciones.validarRUT(valor)) {
                esValido = false;
                mensaje = 'RUT inválido (formato: 12.345.678-9)';
            }
        } else if (campo.id === 'email') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El correo es obligatorio';
            } else if (!Validaciones.validarEmail(valor)) {
                esValido = false;
                mensaje = 'Correo electrónico inválido';
            }
        } else if (campo.id === 'telefono') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El teléfono es obligatorio';
            } else if (!Validaciones.validarTelefono(valor)) {
                esValido = false;
                mensaje = 'Teléfono inválido (mínimo 8 dígitos)';
            }
        } else if (campo.id === 'titulo') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El título es obligatorio';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'El título debe tener al menos 5 caracteres';
            }
        } else if (campo.id === 'descripcion') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La descripción es obligatoria';
            } else if (valor.trim().length < 10) {
                esValido = false;
                mensaje = 'La descripción debe tener al menos 10 caracteres';
            }
        } else if (campo.id === 'cerro') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El sector/cerro es obligatorio';
            }
        } else if (campo.id === 'ubicacion-especifica') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La ubicación específica es obligatoria';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'La ubicación debe tener al menos 5 caracteres';
            }
        }

        if (!esValido) {
            Validaciones.mostrarError(campo, mensaje);
        } else {
            Validaciones.limpiarError(campo);
        }

        return esValido;
    },

    validarFormulario() {
        const campos = ['nombre', 'apellido', 'rut', 'fecha-nacimiento', 'genero', 'email', 'telefono', 'direccion', 'titulo', 'descripcion', 'cerro', 'ubicacion-especifica'];
        let formularioValido = true;

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo && !this.validarCampo(campo)) {
                formularioValido = false;
            }
        });

        return formularioValido;
    },

    enviarSolicitud() {
        // Limpiar errores previos
        Validaciones.limpiarTodosErrores();

        // Validar formulario
        if (!this.validarFormulario()) {
            return;
        }

        // Validar archivo si existe
        const inputArchivo = document.getElementById('archivo');
        if (inputArchivo.files.length > 0) {
            const archivo = inputArchivo.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (archivo.size > maxSize) {
                Validaciones.mostrarError(inputArchivo, 'El archivo no debe superar los 5MB');
                return;
            }
        }

        // Recoger datos
        const datos = {
            nombre: document.getElementById('nombre').value.trim() + ' ' + document.getElementById('apellido').value.trim(),
            nombreSocial: document.getElementById('nombre-social').value.trim() || null,
            rut: document.getElementById('rut').value.trim(),
            fechaNacimiento: document.getElementById('fecha-nacimiento').value,
            genero: document.getElementById('genero').value,
            email: document.getElementById('email').value.trim(),
            email2: document.getElementById('email2').value.trim() || null,
            telefono: document.getElementById('telefono').value.trim(),
            telefono2: document.getElementById('telefono2').value.trim() || null,
            direccion: document.getElementById('direccion').value.trim(),
            titulo: document.getElementById('titulo').value.trim(),
            descripcion: document.getElementById('descripcion').value.trim(),
            cerro: document.getElementById('cerro').value,
            ubicacionEspecifica: document.getElementById('ubicacion-especifica').value.trim(),
            archivoNombre: inputArchivo.files.length > 0 ? inputArchivo.files[0].name : null
        };

        // Agregar solicitud
        const solicitud = APP.agregarSolicitud(datos);

        // Mostrar resumen
        this.mostrarResumen(solicitud);

        // Scroll al resumen
        document.getElementById('resumen-solicitud').scrollIntoView({ behavior: 'smooth' });
    },

    mostrarResumen(solicitud) {
        // Ocultar formulario
        document.getElementById('solicitud-form').parentElement.parentElement.style.display = 'none';

        // Mostrar resumen
        const resumen = document.getElementById('resumen-solicitud');
        resumen.classList.remove('hidden');

        // Llenar datos
        document.getElementById('numero-seguimiento').textContent = solicitud.id;
        document.getElementById('resumen-nombre').textContent = solicitud.nombre;
        document.getElementById('resumen-rut').textContent = solicitud.rut;
        document.getElementById('resumen-email').textContent = solicitud.email;
        document.getElementById('resumen-telefono').textContent = solicitud.telefono;
        document.getElementById('resumen-descripcion').textContent = solicitud.descripcion;
    },

    ocultarResumen() {
        // Mostrar formulario
        document.getElementById('solicitud-form').parentElement.parentElement.style.display = 'block';

        // Ocultar resumen
        document.getElementById('resumen-solicitud').classList.add('hidden');
    },

    limpiarFormulario() {
        document.getElementById('solicitud-form').reset();
        
        // Limpiar nombre del archivo
        const nombreArchivo = document.getElementById('nombre-archivo');
        if (nombreArchivo) {
            nombreArchivo.textContent = 'Seleccionar archivo...';
        }
        
        Validaciones.limpiarTodosErrores();
    }
};


// ============================================
// 5B. FUNCIÓN GLOBAL PARA ARCHIVO
// ============================================

// Función global para actualizar el nombre del archivo
function actualizarNombreArchivo(input) {
    let targetId = 'nombre-archivo';
    if (input.id === 'archivo-func') {
        targetId = 'nombre-archivo-func';
    } else if (input.id === 'archivo-esp') {
        targetId = 'nombre-archivo-esp';
    }
    
    const nombreArchivo = document.getElementById(targetId);
    if (input.files.length > 0) {
        const archivo = input.files[0];
        nombreArchivo.textContent = archivo.name;
        
        // Validar tamaño
        const maxSize = 5 * 1024 * 1024; // 5MB
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
// 5C. FORMULARIO DE SOLICITUD (FUNCIONARIO)
// ============================================

const FormularioFuncionario = {
    init() {
        const form = document.getElementById('solicitud-form-func');
        const btnLimpiar = document.getElementById('btn-limpiar-func');
        const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud-func');

        // Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarSolicitud();
        });

        // Botón limpiar
        btnLimpiar.addEventListener('click', () => {
            this.limpiarFormulario();
        });

        // Botón nueva solicitud
        btnNuevaSolicitud.addEventListener('click', () => {
            this.ocultarResumen();
            this.limpiarFormulario();
        });

        // Validación en tiempo real
        this.agregarValidacionTiempoReal();
    },

    agregarValidacionTiempoReal() {
        const campos = ['nombre-func', 'apellido-func', 'rut-func', 'nombre-social-func', 'fecha-nacimiento-func', 'genero-func', 'email-func', 'email2-func', 'telefono-func', 'telefono2-func', 'direccion-func', 'titulo-func', 'descripcion-func', 'cerro-func', 'ubicacion-especifica-func'];

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('blur', () => {
                    this.validarCampo(campo);
                });

                campo.addEventListener('input', () => {
                    if (campo.classList.contains('border-red-500')) {
                        Validaciones.limpiarError(campo);
                    }
                });
            }
        });
    },

    validarCampo(campo) {
        const valor = campo.value;
        let esValido = true;
        let mensaje = '';

        // Validar según el tipo de campo
        if (campo.id === 'nombre-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los nombres son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los nombres deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'apellido-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los apellidos son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los apellidos deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'rut-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El RUT es obligatorio';
            } else if (!Validaciones.validarRUT(valor)) {
                esValido = false;
                mensaje = 'RUT inválido (formato: 12.345.678-9)';
            }
        } else if (campo.id === 'email-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El correo es obligatorio';
            } else if (!Validaciones.validarEmail(valor)) {
                esValido = false;
                mensaje = 'Correo electrónico inválido';
            }
        } else if (campo.id === 'telefono-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El teléfono es obligatorio';
            } else if (!Validaciones.validarTelefono(valor)) {
                esValido = false;
                mensaje = 'Teléfono inválido (mínimo 8 dígitos)';
            }
        } else if (campo.id === 'titulo-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El título es obligatorio';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'El título debe tener al menos 5 caracteres';
            }
        } else if (campo.id === 'descripcion-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La descripción es obligatoria';
            } else if (valor.trim().length < 10) {
                esValido = false;
                mensaje = 'La descripción debe tener al menos 10 caracteres';
            }
        } else if (campo.id === 'cerro-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El sector/cerro es obligatorio';
            }
        } else if (campo.id === 'ubicacion-especifica-func') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La ubicación específica es obligatoria';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'La ubicación debe tener al menos 5 caracteres';
            }
        }

        if (!esValido) {
            Validaciones.mostrarError(campo, mensaje);
        } else {
            Validaciones.limpiarError(campo);
        }

        return esValido;
    },

    validarFormulario() {
        const campos = ['nombre-func', 'apellido-func', 'rut-func', 'fecha-nacimiento-func', 'genero-func', 'email-func', 'telefono-func', 'direccion-func', 'titulo-func', 'descripcion-func', 'cerro-func', 'ubicacion-especifica-func'];
        let formularioValido = true;

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo && !this.validarCampo(campo)) {
                formularioValido = false;
            }
        });

        return formularioValido;
    },

    enviarSolicitud() {
        // Limpiar errores previos
        Validaciones.limpiarTodosErrores();

        // Validar formulario
        if (!this.validarFormulario()) {
            return;
        }

        // Validar archivo si existe
        const inputArchivo = document.getElementById('archivo-func');
        if (inputArchivo.files.length > 0) {
            const archivo = inputArchivo.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (archivo.size > maxSize) {
                Validaciones.mostrarError(inputArchivo, 'El archivo no debe superar los 5MB');
                return;
            }
        }

        // Recoger datos
        const datos = {
            nombre: document.getElementById('nombre-func').value.trim() + ' ' + document.getElementById('apellido-func').value.trim(),
            nombreSocial: document.getElementById('nombre-social-func').value.trim() || null,
            rut: document.getElementById('rut-func').value.trim(),
            fechaNacimiento: document.getElementById('fecha-nacimiento-func').value,
            genero: document.getElementById('genero-func').value,
            email: document.getElementById('email-func').value.trim(),
            email2: document.getElementById('email2-func').value.trim() || null,
            telefono: document.getElementById('telefono-func').value.trim(),
            telefono2: document.getElementById('telefono2-func').value.trim() || null,
            direccion: document.getElementById('direccion-func').value.trim(),
            titulo: document.getElementById('titulo-func').value.trim(),
            descripcion: document.getElementById('descripcion-func').value.trim(),
            cerro: document.getElementById('cerro-func').value,
            ubicacionEspecifica: document.getElementById('ubicacion-especifica-func').value.trim(),
            archivoNombre: inputArchivo.files.length > 0 ? inputArchivo.files[0].name : null
        };

        // Agregar solicitud
        const solicitud = APP.agregarSolicitud(datos);

        // Mostrar resumen
        this.mostrarResumen(solicitud);

        // Scroll al resumen
        document.getElementById('resumen-solicitud-func').scrollIntoView({ behavior: 'smooth' });
    },

    mostrarResumen(solicitud) {
        // Ocultar formulario
        document.getElementById('solicitud-form-func').parentElement.parentElement.style.display = 'none';

        // Mostrar resumen
        const resumen = document.getElementById('resumen-solicitud-func');
        resumen.classList.remove('hidden');

        // Llenar datos
        document.getElementById('numero-seguimiento-func').textContent = solicitud.id;
        document.getElementById('resumen-nombre-func').textContent = solicitud.nombre;
        document.getElementById('resumen-rut-func').textContent = solicitud.rut;
        document.getElementById('resumen-email-func').textContent = solicitud.email;
        document.getElementById('resumen-telefono-func').textContent = solicitud.telefono;
        document.getElementById('resumen-descripcion-func').textContent = solicitud.descripcion;
    },

    ocultarResumen() {
        // Mostrar formulario
        document.getElementById('solicitud-form-func').parentElement.parentElement.style.display = 'block';

        // Ocultar resumen
        document.getElementById('resumen-solicitud-func').classList.add('hidden');
    },

    limpiarFormulario() {
        document.getElementById('solicitud-form-func').reset();
        
        // Limpiar nombre del archivo
        const nombreArchivo = document.getElementById('nombre-archivo-func');
        if (nombreArchivo) {
            nombreArchivo.textContent = 'Seleccionar archivo...';
        }
        
        Validaciones.limpiarTodosErrores();
    }
};


// ============================================
// 5D. FORMULARIO DE SOLICITUD ESPECÍFICO (FUNCIONARIO)
// ============================================

const FormularioFuncionarioEspecifico = {
    init() {
        const form = document.getElementById('solicitud-form-esp');
        const btnLimpiar = document.getElementById('btn-limpiar-esp');
        const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud-esp');

        // Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarSolicitud();
        });

        // Botón limpiar
        btnLimpiar.addEventListener('click', () => {
            this.limpiarFormulario();
        });

        // Botón nueva solicitud
        btnNuevaSolicitud.addEventListener('click', () => {
            this.ocultarResumen();
            this.limpiarFormulario();
        });

        // Validación en tiempo real
        this.agregarValidacionTiempoReal();
    },

    agregarValidacionTiempoReal() {
        const campos = ['nombre-esp', 'apellido-esp', 'rut-esp', 'nombre-social-esp', 'fecha-nacimiento-esp', 'genero-esp', 'email-esp', 'email2-esp', 'telefono-esp', 'telefono2-esp', 'direccion-esp', 'titulo-esp', 'descripcion-esp', 'cerro-esp', 'ubicacion-especifica-esp', 'tipo-terreno', 'informe-social', 'retiro-escombros'];

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('blur', () => {
                    this.validarCampo(campo);
                });

                campo.addEventListener('input', () => {
                    if (campo.classList.contains('border-red-500')) {
                        Validaciones.limpiarError(campo);
                    }
                });
            }
        });
    },

    validarCampo(campo) {
        const valor = campo.value;
        let esValido = true;
        let mensaje = '';

        // Validar según el tipo de campo
        if (campo.id === 'nombre-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los nombres son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los nombres deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'apellido-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Los apellidos son obligatorios';
            } else if (valor.trim().length < 2) {
                esValido = false;
                mensaje = 'Los apellidos deben tener al menos 2 caracteres';
            }
        } else if (campo.id === 'rut-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El RUT es obligatorio';
            } else if (!Validaciones.validarRUT(valor)) {
                esValido = false;
                mensaje = 'RUT inválido (formato: 12.345.678-9)';
            }
        } else if (campo.id === 'email-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El correo es obligatorio';
            } else if (!Validaciones.validarEmail(valor)) {
                esValido = false;
                mensaje = 'Correo electrónico inválido';
            }
        } else if (campo.id === 'telefono-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El teléfono es obligatorio';
            } else if (!Validaciones.validarTelefono(valor)) {
                esValido = false;
                mensaje = 'Teléfono inválido (mínimo 8 dígitos)';
            }
        } else if (campo.id === 'titulo-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El título es obligatorio';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'El título debe tener al menos 5 caracteres';
            }
        } else if (campo.id === 'descripcion-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La descripción es obligatoria';
            } else if (valor.trim().length < 10) {
                esValido = false;
                mensaje = 'La descripción debe tener al menos 10 caracteres';
            }
        } else if (campo.id === 'cerro-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'El sector/cerro es obligatorio';
            }
        } else if (campo.id === 'ubicacion-especifica-esp') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La ubicación específica es obligatoria';
            } else if (valor.trim().length < 5) {
                esValido = false;
                mensaje = 'La ubicación debe tener al menos 5 caracteres';
            }
        } else if (campo.id === 'tipo-terreno' || campo.id === 'informe-social' || campo.id === 'retiro-escombros') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'Este campo es obligatorio';
            }
        }

        if (!esValido) {
            Validaciones.mostrarError(campo, mensaje);
        } else {
            Validaciones.limpiarError(campo);
        }

        return esValido;
    },

    validarFormulario() {
        const campos = ['nombre-esp', 'apellido-esp', 'rut-esp', 'fecha-nacimiento-esp', 'genero-esp', 'email-esp', 'telefono-esp', 'direccion-esp', 'titulo-esp', 'descripcion-esp', 'cerro-esp', 'ubicacion-especifica-esp', 'tipo-terreno', 'informe-social', 'retiro-escombros'];
        let formularioValido = true;

        campos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo && !this.validarCampo(campo)) {
                formularioValido = false;
            }
        });

        return formularioValido;
    },

    enviarSolicitud() {
        // Limpiar errores previos
        Validaciones.limpiarTodosErrores();

        // Validar formulario
        if (!this.validarFormulario()) {
            return;
        }

        // Validar archivo si existe
        const inputArchivo = document.getElementById('archivo-esp');
        if (inputArchivo.files.length > 0) {
            const archivo = inputArchivo.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (archivo.size > maxSize) {
                Validaciones.mostrarError(inputArchivo, 'El archivo no debe superar los 5MB');
                return;
            }
        }

        // Recoger datos
        const datos = {
            nombre: document.getElementById('nombre-esp').value.trim() + ' ' + document.getElementById('apellido-esp').value.trim(),
            nombreSocial: document.getElementById('nombre-social-esp').value.trim() || null,
            rut: document.getElementById('rut-esp').value.trim(),
            fechaNacimiento: document.getElementById('fecha-nacimiento-esp').value,
            genero: document.getElementById('genero-esp').value,
            email: document.getElementById('email-esp').value.trim(),
            email2: document.getElementById('email2-esp').value.trim() || null,
            telefono: document.getElementById('telefono-esp').value.trim(),
            telefono2: document.getElementById('telefono2-esp').value.trim() || null,
            direccion: document.getElementById('direccion-esp').value.trim(),
            titulo: document.getElementById('titulo-esp').value.trim(),
            descripcion: document.getElementById('descripcion-esp').value.trim(),
            archivoNombre: inputArchivo.files.length > 0 ? inputArchivo.files[0].name : null,
            // Campos específicos
            tipoTerreno: document.getElementById('tipo-terreno').value,
            informeSocial: document.getElementById('informe-social').value,
            retiroEscombros: document.getElementById('retiro-escombros').value
        };

        // Agregar solicitud
        const solicitud = APP.agregarSolicitud(datos);

        // Mostrar resumen
        this.mostrarResumen(solicitud);

        // Scroll al resumen
        document.getElementById('resumen-solicitud-esp').scrollIntoView({ behavior: 'smooth' });
    },

    mostrarResumen(solicitud) {
        // Ocultar formulario
        document.getElementById('solicitud-form-esp').parentElement.parentElement.style.display = 'none';

        // Mostrar resumen
        const resumen = document.getElementById('resumen-solicitud-esp');
        resumen.classList.remove('hidden');

        // Llenar datos
        document.getElementById('numero-seguimiento-esp').textContent = solicitud.id;
        document.getElementById('resumen-nombre-esp').textContent = solicitud.nombre;
        document.getElementById('resumen-rut-esp').textContent = solicitud.rut;
        document.getElementById('resumen-email-esp').textContent = solicitud.email;
        document.getElementById('resumen-telefono-esp').textContent = solicitud.telefono;
        document.getElementById('resumen-descripcion-esp').textContent = solicitud.descripcion;
        
        // Campos específicos
        document.getElementById('resumen-tipo-terreno').textContent = solicitud.tipoTerreno === 'privado' ? 'Terreno Privado' : 'Terreno Público';
        document.getElementById('resumen-informe-social').textContent = solicitud.informeSocial === 'si' ? 'Sí' : 'No';
        document.getElementById('resumen-retiro-escombros').textContent = solicitud.retiroEscombros === 'si' ? 'Sí' : 'No';
    },

    ocultarResumen() {
        // Mostrar formulario
        document.getElementById('solicitud-form-esp').parentElement.parentElement.style.display = 'block';

        // Ocultar resumen
        document.getElementById('resumen-solicitud-esp').classList.add('hidden');
    },

    limpiarFormulario() {
        document.getElementById('solicitud-form-esp').reset();
        
        // Limpiar nombre del archivo
        const nombreArchivo = document.getElementById('nombre-archivo-esp');
        if (nombreArchivo) {
            nombreArchivo.textContent = 'Seleccionar archivo...';
        }
        
        Validaciones.limpiarTodosErrores();
    }
};


// ============================================
// 6. VISTA FUNCIONARIO
// ============================================

const FuncionarioView = {
    filtroActual: 'todas', // Filtro actual

    actualizar() {
        console.log('📋 FuncionarioView.actualizar() - Solicitudes:', APP.solicitudes.length);
        this.renderizarTabla();
    },

    // Inicializar filtros
    initFiltros() {
        const btnTodas = document.getElementById('filtro-todas');
        const btnPendienteDerivacion = document.getElementById('filtro-pendiente-derivar');
        const btnDerivadas = document.getElementById('filtro-derivadas');

        if (btnTodas) btnTodas.addEventListener('click', () => this.aplicarFiltro('todas', btnTodas));
        if (btnPendienteDerivacion) btnPendienteDerivacion.addEventListener('click', () => this.aplicarFiltro('pendiente-derivar', btnPendienteDerivacion));
        if (btnDerivadas) btnDerivadas.addEventListener('click', () => this.aplicarFiltro('derivadas', btnDerivadas));
    },

    // Aplicar filtro
    aplicarFiltro(filtro, boton) {
        // Remover clase activa de todos los botones
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('filtro-activo'));

        // Agregar clase activa al botón clickeado
        boton.classList.add('filtro-activo');

        // Guardar filtro actual
        this.filtroActual = filtro;

        // Renderizar tabla con el filtro
        this.renderizarTabla();
    },

    // Obtener solicitudes filtradas
    obtenerSolicitudesFiltradas() {
        let solicitudes = APP.solicitudes;

        if (this.filtroActual === 'pendiente-derivar') {
            // Solicitudes sin unidad técnica asignada
            solicitudes = solicitudes.filter(s => !s.unidadTecnica || s.unidadTecnica === '');
        } else if (this.filtroActual === 'derivadas') {
            // Solicitudes con unidad técnica asignada
            solicitudes = solicitudes.filter(s => s.unidadTecnica && s.unidadTecnica !== '');
        }
        // Si es 'todas', devuelve todas las solicitudes

        return solicitudes;
    },

    renderizarTabla() {
        const tbody = document.getElementById('tabla-solicitudes-body');
        const container = document.getElementById('tabla-solicitudes-container');
        const estadoVacio = document.getElementById('estado-vacio');
        const countSpan = document.getElementById('count-solicitudes');

        // Obtener solicitudes filtradas
        const solicitudes = this.obtenerSolicitudesFiltradas();

        console.log('🔍 Renderizando tabla con', solicitudes.length, 'solicitudes (filtro:', this.filtroActual, ')');

        // Actualizar contador
        countSpan.textContent = solicitudes.length;

        // Si no hay solicitudes, mostrar estado vacío
        if (solicitudes.length === 0) {
            console.log('⚠️ No hay solicitudes, mostrando estado vacío');
            container.style.display = 'none';
            estadoVacio.style.display = 'block';
            return;
        }

        // Mostrar tabla
        container.style.display = 'block';
        estadoVacio.style.display = 'none';

        // Limpiar tabla
        tbody.innerHTML = '';

        // Renderizar filas (más recientes primero)
        const solicitudesOrdenadas = [...solicitudes].reverse();

        solicitudesOrdenadas.forEach(solicitud => {
            const fila = this.crearFilaSolicitud(solicitud);
            tbody.appendChild(fila);
        });
    },

    crearFilaSolicitud(solicitud) {
        const tr = document.createElement('tr');
        tr.style.background = 'var(--card-bg)';
        tr.style.cursor = 'pointer';
        
        // Hacer toda la fila clickeable (excepto botones)
        tr.addEventListener('click', (e) => {
            // No abrir modal si se hace clic en un botón
            if (!e.target.closest('.action-button')) {
                ModalDetalle.abrir(solicitud.id, 'funcionario');
            }
        });

        // Columna ID
        const tdId = document.createElement('td');
        tdId.className = 'px-6 py-4';
        tdId.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 bg-muni-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-file-alt text-white"></i>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.id}</div>
                    <div class="text-sm" style="color: var(--text-secondary);">${this.formatearFecha(solicitud.fechaCreacion)}</div>
                </div>
            </div>
        `;

        // Columna Solicitante
        const tdSolicitante = document.createElement('td');
        tdSolicitante.className = 'px-6 py-4';
        tdSolicitante.innerHTML = `
            <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.nombre}</div>
            <div class="text-sm" style="color: var(--text-secondary);">RUT: ${solicitud.rut}</div>
        `;

        // Columna Contacto
        const tdContacto = document.createElement('td');
        tdContacto.className = 'px-6 py-4';
        tdContacto.innerHTML = `
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
        `;

        // Columna Descripción
        const tdDescripcion = document.createElement('td');
        tdDescripcion.className = 'px-6 py-4';
        const descripcionCorta = solicitud.descripcion.length > 80
            ? solicitud.descripcion.substring(0, 80) + '...'
            : solicitud.descripcion;
        tdDescripcion.innerHTML = `
            <div class="text-sm" style="color: var(--text-secondary);">${descripcionCorta}</div>
        `;

        // Columna Estado
        const tdEstado = document.createElement('td');
        tdEstado.className = 'px-6 py-4';
        tdEstado.innerHTML = this.crearBadgeEstado(solicitud);

        // Columna Días Abierto
        const tdDiasAbierto = document.createElement('td');
        tdDiasAbierto.className = 'px-6 py-4';
        
        // Crear contenedor flex para días + botón
        const diasContainer = document.createElement('div');
        diasContainer.className = 'flex items-center justify-center gap-2';
        
        // Badge de días
        const diasBadge = document.createElement('span');
        diasBadge.innerHTML = EstadosUtil.calcularDiasAbierto(solicitud.fechaCreacion);
        
        // Botón de notificación
        const btnNotificar = document.createElement('button');
        btnNotificar.className = 'p-1.5 rounded-lg transition-colors hover:bg-blue-100';
        btnNotificar.innerHTML = '<i class="fas fa-envelope text-blue-600 text-sm"></i>';
        btnNotificar.title = 'Enviar recordatorio';
        btnNotificar.onclick = (e) => {
            e.stopPropagation();
            this.confirmarEnvioRecordatorio(solicitud);
        };
        
        diasContainer.appendChild(diasBadge);
        diasContainer.appendChild(btnNotificar);
        tdDiasAbierto.appendChild(diasContainer);

        // Agregar columnas a la fila
        tr.appendChild(tdId);
        tr.appendChild(tdSolicitante);
        tr.appendChild(tdContacto);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdEstado);
        tr.appendChild(tdDiasAbierto);

        return tr;
    },

    crearBadgeEstado(solicitud) {
        return EstadosUtil.crearBadgeEstado(solicitud);
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

    confirmarEnvioRecordatorio(solicitud) {
        // Calcular días abiertos
        const diasAbiertos = Math.floor((Date.now() - new Date(solicitud.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24));
        
        // Crear modal de confirmación personalizado
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
        // Simular envío de recordatorio
        console.log('📧 Enviando recordatorio para solicitud:', solicitud.id);
        
        // Mostrar mensaje de éxito
        alert(
            `✅ Recordatorio enviado exitosamente\n\n` +
            `Solicitud: ${solicitud.id}\n` +
            `Se ha notificado sobre el retraso de esta solicitud.`
        );
        
        // Aquí se podría agregar la lógica real de envío de email
        // Por ejemplo, llamar a una API del backend
    }
};


// ============================================
// 7. VISTA UNIDAD TÉCNICA
// ============================================

const UnidadTecnicaView = {
    unidadCodigo: 'fiscalizacion', // Código de la unidad técnica

    actualizar() {
        console.log('🏢 UnidadTecnicaView.actualizar() - Unidad: Fiscalización');
        this.renderizarTabla();
    },

    obtenerSolicitudesUnidad() {
        // Filtrar solo las solicitudes asignadas a esta unidad técnica
        return APP.solicitudes.filter(sol => sol.unidadTecnica === this.unidadCodigo);
    },

    renderizarTabla() {
        const tbody = document.getElementById('tabla-solicitudes-ut-body');
        const container = document.getElementById('tabla-solicitudes-ut-container');
        const estadoVacio = document.getElementById('estado-vacio-ut');
        const countSpan = document.getElementById('count-solicitudes-ut');

        const solicitudes = this.obtenerSolicitudesUnidad();

        console.log('🔍 Renderizando tabla Unidad Técnica con', solicitudes.length, 'solicitudes');

        // Actualizar contador
        countSpan.textContent = solicitudes.length;

        // Si no hay solicitudes, mostrar estado vacío
        if (solicitudes.length === 0) {
            console.log('⚠️ No hay solicitudes asignadas a Fiscalización');
            container.style.display = 'none';
            estadoVacio.style.display = 'block';
            return;
        }

        // Mostrar tabla
        container.style.display = 'block';
        estadoVacio.style.display = 'none';

        // Limpiar tabla
        tbody.innerHTML = '';

        // Renderizar filas (más recientes primero)
        const solicitudesOrdenadas = [...solicitudes].reverse();

        solicitudesOrdenadas.forEach(solicitud => {
            const fila = this.crearFilaSolicitud(solicitud);
            tbody.appendChild(fila);
        });
    },

    crearFilaSolicitud(solicitud) {
        const tr = document.createElement('tr');
        tr.style.background = 'var(--card-bg)';
        tr.style.cursor = 'pointer';
        
        // Hacer toda la fila clickeable (excepto botones)
        tr.addEventListener('click', (e) => {
            console.log('🖱️ Click en fila de Unidad Técnica, ID:', solicitud.id);
            // No abrir modal si se hace clic en un botón
            if (!e.target.closest('.action-button')) {
                console.log('📋 Abriendo modal desde UnidadTecnicaView');
                ModalDetalle.abrir(solicitud.id, 'unidad-tecnica');
            } else {
                console.log('🚫 Click en botón, no abrir modal');
            }
        });

        // Columna ID
        const tdId = document.createElement('td');
        tdId.className = 'px-6 py-4';
        tdId.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background: #9333ea;">
                    <i class="fas fa-file-alt text-white"></i>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.id}</div>
                    <div class="text-sm" style="color: var(--text-secondary);">${this.formatearFecha(solicitud.fechaCreacion)}</div>
                </div>
            </div>
        `;

        // Columna Solicitante
        const tdSolicitante = document.createElement('td');
        tdSolicitante.className = 'px-6 py-4';
        tdSolicitante.innerHTML = `
            <div class="text-sm font-medium" style="color: var(--text-primary);">${solicitud.nombre}</div>
            <div class="text-sm" style="color: var(--text-secondary);">RUT: ${solicitud.rut}</div>
        `;

        // Columna Contacto
        const tdContacto = document.createElement('td');
        tdContacto.className = 'px-6 py-4';
        tdContacto.innerHTML = `
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
        `;

        // Columna Descripción
        const tdDescripcion = document.createElement('td');
        tdDescripcion.className = 'px-6 py-4';
        const descripcionCorta = solicitud.descripcion.length > 80
            ? solicitud.descripcion.substring(0, 80) + '...'
            : solicitud.descripcion;
        tdDescripcion.innerHTML = `
            <div class="text-sm" style="color: var(--text-secondary);">${descripcionCorta}</div>
        `;

        // Columna Estado
        const tdEstado = document.createElement('td');
        tdEstado.className = 'px-6 py-4';
        tdEstado.innerHTML = EstadosUtil.crearBadgeEstado(solicitud);

        // Columna Días Abierto
        const tdDiasAbierto = document.createElement('td');
        tdDiasAbierto.className = 'px-6 py-4 text-center';
        tdDiasAbierto.innerHTML = EstadosUtil.calcularDiasAbierto(solicitud.fechaCreacion);

        // Agregar columnas a la fila
        tr.appendChild(tdId);
        tr.appendChild(tdSolicitante);
        tr.appendChild(tdContacto);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdEstado);
        tr.appendChild(tdDiasAbierto);

        return tr;
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
    }
};


// ============================================
// 8. MODAL DE DETALLE
// ============================================

const ModalDetalle = {
    solicitudActual: null,

    init() {
        const modal = document.getElementById('modal-detalle');
        const btnCerrar = document.getElementById('btn-cerrar-modal');
        const btnCancelar = document.getElementById('btn-cancelar-modal');
        const btnGuardar = document.getElementById('btn-guardar-asignacion');
        const btnGuardarEstadoUT = document.getElementById('btn-guardar-estado-ut');

        // Cerrar modal
        btnCerrar.addEventListener('click', () => this.cerrar());
        btnCancelar.addEventListener('click', () => this.cerrar());

        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.cerrar();
            }
        });

        // Guardar asignación
        btnGuardar.addEventListener('click', () => this.guardarAsignacion());

        // Guardar estado de unidad técnica
        if (btnGuardarEstadoUT) {
            btnGuardarEstadoUT.addEventListener('click', () => this.guardarEstadoUnidadTecnica());
        }

        // Detectar cambio en selector de unidad técnica para mostrar/ocultar preguntas de Parques y Jardines
        const selectUnidadTecnica = document.getElementById('modal-unidad-tecnica');
        if (selectUnidadTecnica) {
            selectUnidadTecnica.addEventListener('change', (e) => this.manejarCambioUnidadTecnica(e.target.value));
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.cerrar();
            }
        });
    },

    abrir(solicitudId, origenVista = 'funcionario') {
        console.log('🔍 ModalDetalle.abrir() - ID:', solicitudId, '| Origen:', origenVista);
        const solicitud = APP.solicitudes.find(s => s.id === solicitudId);
        if (!solicitud) {
            console.error('❌ No se encontró solicitud con ID:', solicitudId);
            return;
        }

        console.log('✅ Solicitud encontrada:', solicitud);
        this.solicitudActual = solicitud;

        // Llenar datos
        document.getElementById('modal-id-solicitud').textContent = solicitud.id;
        document.getElementById('modal-nombre').textContent = solicitud.nombre;
        document.getElementById('modal-rut').textContent = solicitud.rut;
        document.getElementById('modal-email').textContent = solicitud.email;
        document.getElementById('modal-telefono').textContent = solicitud.telefono;
        document.getElementById('modal-titulo').textContent = solicitud.titulo || 'Sin título';
        document.getElementById('modal-descripcion').textContent = solicitud.descripcion;
        document.getElementById('modal-fecha').textContent = this.formatearFecha(solicitud.fechaCreacion);
        
        // Archivo adjunto
        const archivoContainer = document.getElementById('modal-archivo-container');
        const archivoNombre = document.getElementById('modal-archivo-nombre');
        if (solicitud.archivoNombre) {
            archivoContainer.classList.remove('hidden');
            archivoNombre.textContent = solicitud.archivoNombre;
        } else {
            archivoContainer.classList.add('hidden');
        }
        
        // Estado
        const badgeEstado = document.getElementById('modal-estado-badge');
        badgeEstado.className = 'badge';
        if (solicitud.estado === 'pendiente') {
            badgeEstado.classList.add('badge-pendiente');
            badgeEstado.innerHTML = '<i class="fas fa-clock mr-1"></i> Pendiente';
        } else if (solicitud.estado === 'revision') {
            badgeEstado.classList.add('badge-revision');
            badgeEstado.innerHTML = '<i class="fas fa-spinner mr-1"></i> En Revisión';
        } else {
            badgeEstado.classList.add('badge-finalizada');
            badgeEstado.innerHTML = '<i class="fas fa-check mr-1"></i> Finalizada';
        }

        // Unidad técnica
        const unidadTecnicaActual = solicitud.unidadTecnica || '';
        document.getElementById('modal-unidad-tecnica').value = unidadTecnicaActual;

        // Mostrar preguntas de Parques y Jardines si corresponde y cargar valores guardados
        if (origenVista === 'funcionario') {
            this.manejarCambioUnidadTecnica(unidadTecnicaActual);
            
            // Cargar valores guardados de Parques y Jardines si existen
            if (unidadTecnicaActual === 'parques-jardines' && solicitud.datosParquesJardines) {
                document.getElementById('modal-tipo-terreno').value = solicitud.datosParquesJardines.tipoTerreno || '';
                document.getElementById('modal-tipo-vegetacion').value = solicitud.datosParquesJardines.tipoVegetacion || '';
                document.getElementById('modal-requiere-camion').value = solicitud.datosParquesJardines.requiereCamion || '';
            }
        }

        // Mostrar u ocultar selector de estado de unidad técnica
        const estadoUTContainer = document.getElementById('modal-estado-ut-container');
        const estadoUTSelect = document.getElementById('modal-estado-ut');
        
        // Mostrar u ocultar selector de asignación de unidad técnica
        const asignacionUTContainer = document.getElementById('modal-asignacion-ut-container');
        
        // SOLO mostrar selector de estado si se abre desde Unidad Técnica
        if (origenVista === 'unidad-tecnica' && solicitud.unidadTecnica && solicitud.unidadTecnica !== '') {
            estadoUTContainer.classList.remove('hidden');
            estadoUTSelect.value = solicitud.estadoUnidadTecnica || '';
            // Ocultar selector de asignación porque ya está asignada
            asignacionUTContainer.classList.add('hidden');
            console.log('🏢 Mostrando selector de estado UT (desde Unidad Técnica), estado actual:', solicitud.estadoUnidadTecnica);
        } else {
            estadoUTContainer.classList.add('hidden');
            // Mostrar selector de asignación solo si es funcionario
            asignacionUTContainer.classList.remove('hidden');
            console.log('👤 Ocultando selector de estado UT (origen:', origenVista, ')');
        }

        // Mostrar modal
        const modal = document.getElementById('modal-detalle');
        console.log('📋 Mostrando modal de detalle');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    cerrar() {
        document.getElementById('modal-detalle').classList.add('hidden');
        document.body.style.overflow = '';
        this.solicitudActual = null;
    },

    manejarCambioUnidadTecnica(unidad) {
        const parquesJardinesContainer = document.getElementById('modal-parques-jardines-container');
        
        if (unidad === 'parques-jardines') {
            parquesJardinesContainer.classList.remove('hidden');
            console.log('🌳 Mostrando preguntas de Parques y Jardines');
        } else {
            parquesJardinesContainer.classList.add('hidden');
            console.log('👤 Ocultando preguntas de Parques y Jardines');
        }
    },

    guardarAsignacion() {
        if (!this.solicitudActual) return;

        const unidad = document.getElementById('modal-unidad-tecnica').value;
        
        // Si es Parques y Jardines, validar y guardar las respuestas adicionales
        if (unidad === 'parques-jardines') {
            const tipoTerreno = document.getElementById('modal-tipo-terreno').value;
            const tipoVegetacion = document.getElementById('modal-tipo-vegetacion').value;
            const requiereCamion = document.getElementById('modal-requiere-camion').value;
            
            // Validar que se hayan respondido todas las preguntas
            if (!tipoTerreno || !tipoVegetacion || !requiereCamion) {
                alert('⚠️ Por favor complete todas las preguntas de Parques y Jardines antes de guardar');
                return;
            }
            
            // Guardar datos adicionales de Parques y Jardines
            const solicitud = APP.solicitudes.find(s => s.id === this.solicitudActual.id);
            if (solicitud) {
                solicitud.datosParquesJardines = {
                    tipoTerreno,
                    tipoVegetacion,
                    requiereCamion
                };
                APP.guardarSolicitudes();
                console.log('🌳 Datos de Parques y Jardines guardados:', solicitud.datosParquesJardines);
            }
        }
        
        APP.asignarUnidadTecnica(this.solicitudActual.id, unidad);
        
        console.log('✅ Unidad técnica asignada:', unidad);
        
        // Actualizar vista y cerrar
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
        
        console.log('✅ Estado de unidad técnica actualizado:', estadoUT);
        
        // Actualizar vistas
        FuncionarioView.actualizar();
        UnidadTecnicaView.actualizar();
        
        // Cerrar modal
        this.cerrar();
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
    }
};


// ============================================
// 9. DATOS DE PRUEBA
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
                descripcion: 'Denuncia por comercio ambulante sin permiso en Avenida Principal esquina con Calle Comercio.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-010',
                nombre: 'Ana María Vega Silva',
                rut: '20.123.456-7',
                email: 'anavega.silva@email.com',
                telefono: '+56990123456',
                descripcion: 'Reclamo por establecimiento comercial que opera fuera del horario permitido y genera ruidos molestos.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-011',
                nombre: 'Fernando José Muñoz Herrera',
                rut: '21.234.567-8',
                email: 'fjmunoz.h@email.com',
                telefono: '+56901234567',
                descripcion: 'Solicitud de fiscalización de obra en construcción sin permiso municipal visible en el sector norte.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241016-012',
                nombre: 'Isabel Cristina Rojas Campos',
                rut: '22.345.678-9',
                email: 'icrojas.campos@email.com',
                telefono: '+56912345670',
                descripcion: 'Denuncia por local comercial que no cumple con normas sanitarias y de higiene alimentaria.',
                estado: 'finalizada',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241109-013',
                nombre: 'Diego Antonio Morales Pinto',
                rut: '23.456.789-0',
                email: 'dmorales.pinto@email.com',
                telefono: '+56923456701',
                descripcion: 'Reclamo por vehículos que ocupan espacio público como estacionamiento permanente.',
                estado: 'revision',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '241110-014',
                nombre: 'Carmen Gloria Espinoza Díaz',
                rut: '24.567.890-1',
                email: 'cgespinoza.d@email.com',
                telefono: '+56934567012',
                descripcion: 'Solicitud de inspección por posible cierre irregular de callejón de uso público.',
                estado: 'pendiente',
                unidadTecnica: 'fiscalizacion',
                fechaCreacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
        ];

        // Verificar qué ejemplos no existen ya (por ID)
        const idsExistentes = APP.solicitudes.map(s => s.id);
        const ejemplosNuevos = ejemplos.filter(e => !idsExistentes.includes(e.id));
        
        // Agregar solo los nuevos ejemplos
        APP.solicitudes = [...APP.solicitudes, ...ejemplosNuevos];
        APP.guardarSolicitudes();
        
        console.log(`📝 Se agregaron ${ejemplosNuevos.length} ejemplos nuevos`);
        return ejemplosNuevos;
    }
};


// ============================================
// 10. INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Iniciando carga de solicitudes...');
    console.log('localStorage disponible:', typeof(Storage) !== 'undefined');
    
    // Cargar datos
    APP.cargarSolicitudes();
    console.log(`📊 Solicitudes en localStorage: ${APP.solicitudes.length}`);
    console.log('📦 Contenido de APP.solicitudes:', APP.solicitudes);

    // Cargar datos de ejemplo si hay pocas solicitudes (menos de 10)
    if (APP.solicitudes.length < 10) {
        console.log('⚠️ Pocas solicitudes, agregando ejemplos...');
        const ejemplos = DatosDeEjemplo.cargarSolicitudesDeEjemplo();
        console.log(`✅ ${ejemplos.length} ejemplos agregados`);
        console.log('📦 Total de solicitudes:', APP.solicitudes.length);
    } else {
        console.log('✅ Datos suficientes encontrados');
    }

    // Inicializar componentes
    TabManager.init();
    FormularioCiudadano.init();
    FormularioFuncionario.init();
    FormularioFuncionarioEspecifico.init();
    ModalDetalle.init();
    FuncionarioView.initFiltros();

    // Evento para botón de cargar ejemplos (para debugging)
    const btnCargarEjemplos = document.getElementById('btn-cargar-ejemplos');
    if (btnCargarEjemplos) {
        btnCargarEjemplos.addEventListener('click', () => {
            localStorage.removeItem('solicitudes_op');
            APP.solicitudes = [];
            DatosDeEjemplo.cargarSolicitudesDeEjemplo();
            APP.cargarSolicitudes();
            FuncionarioView.actualizar();
            location.reload();
        });
    }

    // Actualizar vista funcionario SIEMPRE (incluso si está oculta)
    console.log(`🎯 Preparando vista funcionario con ${APP.solicitudes.length} solicitudes`);
    FuncionarioView.actualizar();

    console.log('✅ Oficina de Partes Digital iniciada correctamente');
    console.log(`📊 ${APP.solicitudes.length} solicitudes cargadas en total`);
    console.log('💡 Cambia a la pestaña "Vista Funcionario" para ver los casos de ejemplo');
});
