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
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `OP-${timestamp}-${random}`;
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
// 2. GESTIÓN DE TEMAS
// ============================================

const ThemeManager = {
    init() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const html = document.documentElement;

        if (!themeToggle || !themeIcon) return;

        // Cargar tema guardado
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            html.classList.add('theme-light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        // Toggle de tema
        themeToggle.addEventListener('click', () => {
            const isLight = html.classList.toggle('theme-light');

            if (isLight) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
};


// ============================================
// 2B. RELOJ DEL HEADER
// ============================================

const HeaderClock = {
    init() {
        this.actualizarFechaHora();
        // Actualizar cada segundo
        setInterval(() => this.actualizarFechaHora(), 1000);
    },

    actualizarFechaHora() {
        const ahora = new Date();
        
        // Fecha
        const fecha = ahora.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        
        // Hora
        const hora = ahora.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const elementoFecha = document.getElementById('header-fecha');
        const elementoHora = document.getElementById('header-hora');

        if (elementoFecha) elementoFecha.textContent = fecha;
        if (elementoHora) elementoHora.textContent = hora;
    }
};


// ============================================
// 3. GESTIÓN DE TABS
// ============================================

const TabManager = {
    init() {
        const tabCiudadano = document.getElementById('tab-ciudadano');
        const tabFuncionario = document.getElementById('tab-funcionario');
        const tabUnidadTecnica = document.getElementById('tab-unidad-tecnica');
        const vistaCiudadano = document.getElementById('vista-ciudadano');
        const vistaFuncionario = document.getElementById('vista-funcionario');
        const vistaUnidadTecnica = document.getElementById('vista-unidad-tecnica');

        tabCiudadano.addEventListener('click', () => {
            this.activarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
        });

        tabFuncionario.addEventListener('click', () => {
            this.activarTab(tabFuncionario, vistaFuncionario);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
            this.desactivarTab(tabUnidadTecnica, vistaUnidadTecnica);
            FuncionarioView.actualizar();
        });

        tabUnidadTecnica.addEventListener('click', () => {
            this.activarTab(tabUnidadTecnica, vistaUnidadTecnica);
            this.desactivarTab(tabCiudadano, vistaCiudadano);
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
// 4. VALIDACIONES
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
        const campos = ['nombre', 'rut', 'nombre-social', 'fecha-nacimiento', 'genero', 'email', 'email2', 'telefono', 'telefono2', 'direccion', 'descripcion'];

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
                mensaje = 'El nombre es obligatorio';
            } else if (valor.trim().length < 3) {
                esValido = false;
                mensaje = 'El nombre debe tener al menos 3 caracteres';
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
        } else if (campo.id === 'descripcion') {
            if (!Validaciones.validarRequerido(valor)) {
                esValido = false;
                mensaje = 'La descripción es obligatoria';
            } else if (valor.trim().length < 10) {
                esValido = false;
                mensaje = 'La descripción debe tener al menos 10 caracteres';
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
        const campos = ['nombre', 'rut', 'fecha-nacimiento', 'genero', 'email', 'telefono', 'direccion', 'descripcion'];
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
            nombre: document.getElementById('nombre').value.trim(),
            nombreSocial: document.getElementById('nombre-social').value.trim() || null,
            rut: document.getElementById('rut').value.trim(),
            fechaNacimiento: document.getElementById('fecha-nacimiento').value,
            genero: document.getElementById('genero').value,
            email: document.getElementById('email').value.trim(),
            email2: document.getElementById('email2').value.trim() || null,
            telefono: document.getElementById('telefono').value.trim(),
            telefono2: document.getElementById('telefono2').value.trim() || null,
            direccion: document.getElementById('direccion').value.trim(),
            descripcion: document.getElementById('descripcion').value.trim(),
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
    const nombreArchivo = document.getElementById('nombre-archivo');
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
// 6. VISTA FUNCIONARIO
// ============================================

const FuncionarioView = {
    actualizar() {
        console.log('📋 FuncionarioView.actualizar() - Solicitudes:', APP.solicitudes.length);
        this.renderizarTabla();
    },

    renderizarTabla() {
        const tbody = document.getElementById('tabla-solicitudes-body');
        const container = document.getElementById('tabla-solicitudes-container');
        const estadoVacio = document.getElementById('estado-vacio');
        const countSpan = document.getElementById('count-solicitudes');

        console.log('🔍 Renderizando tabla con', APP.solicitudes.length, 'solicitudes');

        // Actualizar contador
        countSpan.textContent = APP.solicitudes.length;

        // Si no hay solicitudes, mostrar estado vacío
        if (APP.solicitudes.length === 0) {
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
        const solicitudesOrdenadas = [...APP.solicitudes].reverse();

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
                ModalDetalle.abrir(solicitud.id);
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

        // Columna Acciones
        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'px-6 py-4 text-center';
        tdAcciones.innerHTML = this.crearBotonesAccion(solicitud);

        // Agregar columnas a la fila
        tr.appendChild(tdId);
        tr.appendChild(tdSolicitante);
        tr.appendChild(tdContacto);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdEstado);
        tr.appendChild(tdAcciones);

        // Event listeners para los botones
        this.agregarEventListenersAcciones(tr, solicitud);

        return tr;
    },

    crearBadgeEstado(solicitud) {
        const estado = solicitud.estado;
        const unidadTecnica = solicitud.unidadTecnica;
        
        // Mapeo de valores a nombres legibles
        const unidadesNombres = {
            'desarrollo-economico': 'Desarrollo Económico',
            'dat': 'DAT',
            'parques-jardines': 'Parques y Jardines',
            'alumbrado-publico': 'Alumbrado Público',
            'fiscalizacion': 'Fiscalización',
            'transito': 'Tránsito',
            'patentes-comerciales': 'Patentes Comerciales'
        };
        
        // Si tiene unidad técnica asignada, mostrar derivación
        if (unidadTecnica && unidadTecnica !== '') {
            const nombreUnidad = unidadesNombres[unidadTecnica] || unidadTecnica;
            return `<span class="badge badge-revision"><i class="fas fa-share mr-1"></i>Derivado a: ${nombreUnidad}</span>`;
        }
        
        // Si no tiene unidad técnica, mostrar estado normal
        const badges = {
            'pendiente': '<span class="badge badge-pendiente"><i class="fas fa-clock mr-1"></i>Derivación pendiente</span>',
            'revision': '<span class="badge badge-revision"><i class="fas fa-spinner mr-1"></i>En Revisión</span>',
            'finalizada': '<span class="badge badge-finalizada"><i class="fas fa-check mr-1"></i>Finalizada</span>'
        };
        return badges[estado] || badges.pendiente;
    },

    crearBotonesAccion(solicitud) {
        if (solicitud.estado === 'pendiente') {
            return `
                <button class="action-button action-button-revision" data-action="revision" data-id="${solicitud.id}">
                    <i class="fas fa-eye"></i>
                    <span>Revisar</span>
                </button>
            `;
        } else if (solicitud.estado === 'revision') {
            return `
                <button class="action-button action-button-finalizar" data-action="finalizar" data-id="${solicitud.id}">
                    <i class="fas fa-check"></i>
                    <span>Finalizar</span>
                </button>
            `;
        } else {
            return `
                <span class="text-sm" style="color: var(--text-muted);">
                    <i class="fas fa-check-circle"></i> Completada
                </span>
            `;
        }
    },

    agregarEventListenersAcciones(fila, solicitud) {
        const botones = fila.querySelectorAll('.action-button');

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const accion = boton.getAttribute('data-action');
                const id = boton.getAttribute('data-id');

                if (accion === 'revision') {
                    APP.cambiarEstado(id, 'revision');
                    this.actualizar();
                } else if (accion === 'finalizar') {
                    APP.cambiarEstado(id, 'finalizada');
                    this.actualizar();
                }
            });
        });
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
            // No abrir modal si se hace clic en un botón
            if (!e.target.closest('.action-button')) {
                ModalDetalle.abrir(solicitud.id);
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
        tdEstado.innerHTML = this.crearBadgeEstado(solicitud.estado);

        // Columna Acciones
        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'px-6 py-4 text-center';
        tdAcciones.innerHTML = this.crearBotonesAccion(solicitud);

        // Agregar columnas a la fila
        tr.appendChild(tdId);
        tr.appendChild(tdSolicitante);
        tr.appendChild(tdContacto);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdEstado);
        tr.appendChild(tdAcciones);

        // Event listeners para los botones
        this.agregarEventListenersAcciones(tr, solicitud);

        return tr;
    },

    crearBadgeEstado(estado) {
        const badges = {
            'pendiente': '<span class="badge badge-pendiente"><i class="fas fa-clock mr-1"></i>Pendiente</span>',
            'revision': '<span class="badge badge-revision"><i class="fas fa-spinner mr-1"></i>En Revisión</span>',
            'finalizada': '<span class="badge badge-finalizada"><i class="fas fa-check mr-1"></i>Finalizada</span>'
        };
        return badges[estado] || badges.pendiente;
    },

    crearBotonesAccion(solicitud) {
        if (solicitud.estado === 'pendiente') {
            return `
                <button class="action-button action-button-revision" data-action="revision" data-id="${solicitud.id}">
                    <i class="fas fa-eye"></i>
                    <span>Revisar</span>
                </button>
            `;
        } else if (solicitud.estado === 'revision') {
            return `
                <button class="action-button action-button-finalizar" data-action="finalizar" data-id="${solicitud.id}">
                    <i class="fas fa-check"></i>
                    <span>Finalizar</span>
                </button>
            `;
        } else {
            return `
                <span class="text-sm" style="color: var(--text-muted);">
                    <i class="fas fa-check-circle"></i> Completada
                </span>
            `;
        }
    },

    agregarEventListenersAcciones(fila, solicitud) {
        const botones = fila.querySelectorAll('.action-button');

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const accion = boton.getAttribute('data-action');
                const id = boton.getAttribute('data-id');

                if (accion === 'revision') {
                    APP.cambiarEstado(id, 'revision');
                    this.actualizar();
                } else if (accion === 'finalizar') {
                    APP.cambiarEstado(id, 'finalizada');
                    this.actualizar();
                }
            });
        });
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

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.cerrar();
            }
        });
    },

    abrir(solicitudId) {
        const solicitud = APP.solicitudes.find(s => s.id === solicitudId);
        if (!solicitud) return;

        this.solicitudActual = solicitud;

        // Llenar datos
        document.getElementById('modal-id-solicitud').textContent = solicitud.id;
        document.getElementById('modal-nombre').textContent = solicitud.nombre;
        document.getElementById('modal-rut').textContent = solicitud.rut;
        document.getElementById('modal-email').textContent = solicitud.email;
        document.getElementById('modal-telefono').textContent = solicitud.telefono;
        document.getElementById('modal-descripcion').textContent = solicitud.descripcion;
        document.getElementById('modal-fecha').textContent = FuncionarioView.formatearFecha(solicitud.fechaCreacion);
        
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
        document.getElementById('modal-unidad-tecnica').value = solicitud.unidadTecnica || '';

        // Mostrar modal
        document.getElementById('modal-detalle').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    cerrar() {
        document.getElementById('modal-detalle').classList.add('hidden');
        document.body.style.overflow = '';
        this.solicitudActual = null;
    },

    guardarAsignacion() {
        if (!this.solicitudActual) return;

        const unidad = document.getElementById('modal-unidad-tecnica').value;
        APP.asignarUnidadTecnica(this.solicitudActual.id, unidad);
        
        console.log('✅ Unidad técnica asignada:', unidad);
        
        // Actualizar vista y cerrar
        FuncionarioView.actualizar();
        this.cerrar();
    }
};


// ============================================
// 9. DATOS DE PRUEBA
// ============================================

const DatosDeEjemplo = {
    cargarSolicitudesDeEjemplo() {
        const ejemplos = [
            {
                id: 'OP-1699000001-001',
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
                id: 'OP-1699100002-002',
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
                id: 'OP-1699200003-003',
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
                id: 'OP-1699300004-004',
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
                id: 'OP-1699400005-005',
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
                id: 'OP-1699500006-006',
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
                id: 'OP-1699600007-007',
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
                id: 'OP-1699700008-008',
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
                id: 'OP-1699800009-009',
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
                id: 'OP-1699900010-010',
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
                id: 'OP-1700000011-011',
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
                id: 'OP-1700100012-012',
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
                id: 'OP-1700200013-013',
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
                id: 'OP-1700300014-014',
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
    ThemeManager.init();
    HeaderClock.init();
    TabManager.init();
    FormularioCiudadano.init();
    ModalDetalle.init();

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
