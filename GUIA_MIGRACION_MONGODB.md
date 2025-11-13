# Guía de Migración a MongoDB

Esta guía te ayudará a migrar tu aplicación de localStorage a MongoDB con un backend completo.

---

## 📋 Tabla de Contenidos

1. [Arquitectura Propuesta](#arquitectura-propuesta)
2. [Requisitos Previos](#requisitos-previos)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Implementación Backend](#implementación-backend)
6. [Modificaciones Frontend](#modificaciones-frontend)
7. [Despliegue](#despliegue)

---

## 🏗️ Arquitectura Propuesta

### Estado Actual
```
[Navegador] → localStorage (solo local)
```

### Nueva Arquitectura
```
[Navegador] → [API REST - Express] → [MongoDB]
     ↓              ↓                      ↓
  Frontend      Backend                Database
  (HTML/JS)   (Node.js)            (Cloud/Local)
```

---

## ✅ Requisitos Previos

### Software Necesario
- **Node.js** v18+ y npm ([Descargar](https://nodejs.org/))
- **MongoDB** (opciones):
  - **MongoDB Atlas** (Cloud - Gratis) - **RECOMENDADO**
  - MongoDB Community (Local)

### Conocimientos Básicos
- JavaScript básico
- Uso de terminal/línea de comandos
- Conceptos básicos de APIs REST

---

## 📁 Estructura del Proyecto (Nueva)

```
op_virtual/
├── frontend/                  # Archivos existentes
│   ├── index.html
│   ├── js/
│   │   └── app-optimized.js  # Se modificará
│   ├── css/
│   │   └── styles.css
│   └── assets/
│
├── backend/                   # NUEVO
│   ├── server.js             # Servidor Express
│   ├── config/
│   │   └── database.js       # Configuración MongoDB
│   ├── models/
│   │   ├── Solicitud.js      # Modelo Mongoose
│   │   └── Usuario.js        # (Futuro)
│   ├── routes/
│   │   └── solicitudes.js    # Rutas API
│   ├── controllers/
│   │   └── solicitudController.js
│   ├── middleware/
│   │   ├── auth.js           # (Futuro)
│   │   └── errorHandler.js
│   ├── .env                  # Variables de entorno
│   └── package.json
│
└── docs/                      # Documentación
    └── API.md
```

---

## 🚀 Instalación y Configuración

### Paso 1: Crear Cuenta en MongoDB Atlas (GRATIS)

1. Ve a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (Shared - Gratis)
4. Espera 3-5 minutos a que se cree
5. Configura acceso:
   - **Database Access**: Crea un usuario (guarda usuario/contraseña)
   - **Network Access**: Agrega `0.0.0.0/0` (permitir desde cualquier IP)
6. Haz click en **Connect** → **Connect your application**
7. Copia la **Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 2: Inicializar Backend

```bash
# Desde la raíz del proyecto
mkdir backend
cd backend

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias
npm install express mongoose dotenv cors helmet express-rate-limit
npm install --save-dev nodemon
```

### Paso 3: Crear archivo .env

Crear `backend/.env`:
```env
# MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/oficina_partes?retryWrites=true&w=majority
DB_NAME=oficina_partes

# Server
PORT=3000
NODE_ENV=development

# CORS (Frontend URL)
FRONTEND_URL=http://127.0.0.1:5500

# Seguridad (Futuro)
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiarla_en_produccion
```

**IMPORTANTE**: Reemplaza `<usuario>` y `<password>` con tus credenciales de MongoDB Atlas.

### Paso 4: Configurar package.json

Editar `backend/package.json`:
```json
{
  "name": "oficina-partes-backend",
  "version": "1.0.0",
  "description": "Backend API para Oficina de Partes Digital",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["express", "mongodb", "oficina-partes"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 💻 Implementación Backend

### 1. Configuración Base de Datos (`backend/config/database.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME
        });

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        console.log(`📊 Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

### 2. Modelo Solicitud (`backend/models/Solicitud.js`)

```javascript
const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    // ID personalizado (ej: 25-0001)
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // Datos del ciudadano
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    rut: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },

    // Datos de la solicitud
    titulo: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },

    // Estados
    estado: {
        type: String,
        enum: ['pendiente', 'revision', 'finalizada'],
        default: 'pendiente',
        index: true
    },
    unidadTecnica: {
        type: String,
        enum: ['', 'desarrollo-economico', 'dat', 'parques-jardines',
               'alumbrado-publico', 'fiscalizacion', 'transito',
               'patentes-comerciales'],
        default: '',
        index: true
    },
    estadoUnidadTecnica: {
        type: String,
        enum: ['', 'en-ejecucion', 'finalizado', 'rechazado'],
        default: ''
    },

    // Datos específicos de Parques y Jardines
    datosParquesJardines: {
        tipoTerreno: String,
        tipoVegetacion: String,
        requiereCamion: String
    },

    // Datos de correspondencia
    tipoRemitente: String,
    numeroFolio: String,
    fechaHoraIngreso: Date,
    tipoDocumento: String,
    canalRecepcion: String,

    // Archivo adjunto
    archivoNombre: {
        type: String
    },

    // Ubicación
    cerro: String,
    ubicacionEspecifica: String,

    // Metadatos
    fechaCreacion: {
        type: Date,
        default: Date.now,
        index: true
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacionUT: {
        type: Date
    }
}, {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    collection: 'solicitudes'
});

// Índices compuestos para búsquedas optimizadas
solicitudSchema.index({ estado: 1, fechaCreacion: -1 });
solicitudSchema.index({ unidadTecnica: 1, estado: 1 });

// Middleware para actualizar fechaActualizacion
solicitudSchema.pre('save', function(next) {
    this.fechaActualizacion = new Date();
    next();
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
```

### 3. Controlador (`backend/controllers/solicitudController.js`)

```javascript
const Solicitud = require('../models/Solicitud');

// @desc    Obtener todas las solicitudes
// @route   GET /api/solicitudes
// @access  Public (cambiar a Private con autenticación)
exports.getSolicitudes = async (req, res) => {
    try {
        const { estado, unidadTecnica, limit = 100 } = req.query;

        const filtro = {};
        if (estado) filtro.estado = estado;
        if (unidadTecnica) filtro.unidadTecnica = unidadTecnica;

        const solicitudes = await Solicitud
            .find(filtro)
            .sort({ fechaCreacion: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: solicitudes.length,
            data: solicitudes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Obtener solicitud por ID
// @route   GET /api/solicitudes/:id
// @access  Public
exports.getSolicitud = async (req, res) => {
    try {
        const solicitud = await Solicitud.findOne({ id: req.params.id });

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                error: 'Solicitud no encontrada'
            });
        }

        res.json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Crear nueva solicitud
// @route   POST /api/solicitudes
// @access  Public
exports.createSolicitud = async (req, res) => {
    try {
        // Generar ID único
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 9999) + 1;
        const id = `${year}-${random.toString().padStart(4, '0')}`;

        const solicitudData = {
            id,
            ...req.body,
            estado: 'pendiente',
            unidadTecnica: ''
        };

        const solicitud = await Solicitud.create(solicitudData);

        res.status(201).json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        // Error de duplicado (ID ya existe)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'ID duplicado, intenta nuevamente'
            });
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Actualizar solicitud
// @route   PUT /api/solicitudes/:id
// @access  Public
exports.updateSolicitud = async (req, res) => {
    try {
        const solicitud = await Solicitud.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            {
                new: true, // Retornar documento actualizado
                runValidators: true
            }
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                error: 'Solicitud no encontrada'
            });
        }

        res.json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Eliminar solicitud
// @route   DELETE /api/solicitudes/:id
// @access  Public
exports.deleteSolicitud = async (req, res) => {
    try {
        const solicitud = await Solicitud.findOneAndDelete({ id: req.params.id });

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                error: 'Solicitud no encontrada'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Asignar unidad técnica
// @route   PATCH /api/solicitudes/:id/unidad-tecnica
// @access  Public
exports.asignarUnidadTecnica = async (req, res) => {
    try {
        const { unidadTecnica, datosParquesJardines } = req.body;

        const updateData = { unidadTecnica };
        if (datosParquesJardines) {
            updateData.datosParquesJardines = datosParquesJardines;
        }

        const solicitud = await Solicitud.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                error: 'Solicitud no encontrada'
            });
        }

        res.json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Cambiar estado de unidad técnica
// @route   PATCH /api/solicitudes/:id/estado-ut
// @access  Public
exports.cambiarEstadoUT = async (req, res) => {
    try {
        const { estadoUnidadTecnica } = req.body;

        const solicitud = await Solicitud.findOneAndUpdate(
            { id: req.params.id },
            {
                estadoUnidadTecnica,
                fechaActualizacionUT: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                error: 'Solicitud no encontrada'
            });
        }

        res.json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Obtener estadísticas
// @route   GET /api/solicitudes/stats
// @access  Public
exports.getStats = async (req, res) => {
    try {
        const stats = await Solicitud.aggregate([
            {
                $group: {
                    _id: '$estado',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Solicitud.countDocuments();

        res.json({
            success: true,
            data: {
                total,
                porEstado: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
```

### 4. Rutas (`backend/routes/solicitudes.js`)

```javascript
const express = require('express');
const router = express.Router();
const {
    getSolicitudes,
    getSolicitud,
    createSolicitud,
    updateSolicitud,
    deleteSolicitud,
    asignarUnidadTecnica,
    cambiarEstadoUT,
    getStats
} = require('../controllers/solicitudController');

// Rutas principales
router.get('/', getSolicitudes);
router.get('/stats', getStats);
router.get('/:id', getSolicitud);
router.post('/', createSolicitud);
router.put('/:id', updateSolicitud);
router.delete('/:id', deleteSolicitud);

// Rutas específicas
router.patch('/:id/unidad-tecnica', asignarUnidadTecnica);
router.patch('/:id/estado-ut', cambiarEstadoUT);

module.exports = router;
```

### 5. Servidor Principal (`backend/server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Conectar a MongoDB
connectDB();

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (máximo 100 requests por 15 minutos por IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde'
});
app.use('/api/', limiter);

// Rutas
app.use('/api/solicitudes', require('./routes/solicitudes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: '✅ API de Oficina de Partes Digital',
        version: '1.0.0',
        endpoints: {
            solicitudes: '/api/solicitudes',
            stats: '/api/solicitudes/stats'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Error del servidor'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Modo: ${process.env.NODE_ENV}`);
});
```

---

## 🔄 Modificaciones Frontend

### Nuevo archivo: `frontend/js/api-service.js`

```javascript
// Servicio para comunicación con el backend
class APIService {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la solicitud');
            }

            return data;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    }

    // Solicitudes
    async getSolicitudes(filtros = {}) {
        const params = new URLSearchParams(filtros);
        return this.request(`/solicitudes?${params}`);
    }

    async getSolicitud(id) {
        return this.request(`/solicitudes/${id}`);
    }

    async createSolicitud(datos) {
        return this.request('/solicitudes', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async updateSolicitud(id, cambios) {
        return this.request(`/solicitudes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cambios)
        });
    }

    async deleteSolicitud(id) {
        return this.request(`/solicitudes/${id}`, {
            method: 'DELETE'
        });
    }

    async asignarUnidadTecnica(id, unidad, datosExtra = null) {
        const body = { unidadTecnica: unidad };
        if (datosExtra) body.datosParquesJardines = datosExtra;

        return this.request(`/solicitudes/${id}/unidad-tecnica`, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    async cambiarEstadoUT(id, estadoUT) {
        return this.request(`/solicitudes/${id}/estado-ut`, {
            method: 'PATCH',
            body: JSON.stringify({ estadoUnidadTecnica: estadoUT })
        });
    }

    async getStats() {
        return this.request('/solicitudes/stats');
    }
}

// Instancia global
const api = new APIService();
```

---

## 🚢 Despliegue

### Opción 1: Local (Desarrollo)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (Live Server en VSCode o similar)
# O simplemente abrir index.html
```

### Opción 2: Producción

**Backend:**
- **Render** (gratis): https://render.com
- **Railway** (gratis con límites): https://railway.app
- **Heroku**: https://heroku.com

**Frontend:**
- **GitHub Pages** (gratis)
- **Vercel** (gratis)
- **Netlify** (gratis)

**MongoDB:**
- **MongoDB Atlas** (ya configurado, gratis hasta 512MB)

---

## 📝 Próximos Pasos

1. **Autenticación**: Agregar JWT para usuarios
2. **Upload de archivos**: Implementar subida de PDFs a S3/Cloudinary
3. **Websockets**: Notificaciones en tiempo real
4. **Testing**: Implementar tests unitarios y de integración
5. **Docker**: Containerizar la aplicación

---

## 🆘 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica tu connection string en `.env`
- Revisa que tu IP esté permitida en MongoDB Atlas
- Verifica usuario/contraseña

### Error: "CORS"
- Verifica `FRONTEND_URL` en `.env`
- Asegúrate de que el frontend y backend estén en las URLs correctas

### Error: "Port already in use"
- Cambia el `PORT` en `.env`
- O mata el proceso: `lsof -ti:3000 | xargs kill`

---

## 📚 Recursos

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Docs](https://mongoosejs.com/docs/)

---

**Última actualización:** 12 de Noviembre, 2025
