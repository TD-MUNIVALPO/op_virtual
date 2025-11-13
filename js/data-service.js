// ============================================
// SERVICIO DE DATOS - Soporta JSON y localStorage
// ============================================

class DataService {
    constructor() {
        this.mode = 'auto'; // 'auto', 'json', 'localStorage'
        this.jsonUrl = './data/solicitudes.json';
        this.localStorageKey = 'solicitudes_op';
        this.cache = null;
    }

    /**
     * Determina el modo de operación automáticamente
     */
    async detectMode() {
        // Si estamos en modo desarrollo local (file://) usa localStorage
        if (window.location.protocol === 'file:') {
            console.log('📍 Modo: localStorage (desarrollo local)');
            return 'localStorage';
        }

        // Si estamos en un servidor, intenta cargar JSON
        try {
            const response = await fetch(this.jsonUrl, { method: 'HEAD' });
            if (response.ok) {
                console.log('📍 Modo: JSON (servidor)');
                return 'json';
            }
        } catch (error) {
            console.log('📍 Modo: localStorage (JSON no disponible)');
        }

        return 'localStorage';
    }

    /**
     * Carga datos desde JSON
     */
    async loadFromJSON() {
        try {
            const response = await fetch(this.jsonUrl);
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            const data = await response.json();
            console.log(`✅ ${data.length} solicitudes cargadas desde JSON`);
            return data;
        } catch (error) {
            console.error('❌ Error cargando JSON:', error);
            return [];
        }
    }

    /**
     * Carga datos desde localStorage
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.localStorageKey);
            if (stored) {
                const data = JSON.parse(stored);
                console.log(`✅ ${data.length} solicitudes cargadas desde localStorage`);
                return data;
            }
            console.log('⚠️ No hay datos en localStorage');
            return [];
        } catch (error) {
            console.error('❌ Error cargando localStorage:', error);
            return [];
        }
    }

    /**
     * Guarda datos en localStorage
     */
    saveToLocalStorage(data) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            console.log('✅ Datos guardados en localStorage');
            return true;
        } catch (error) {
            console.error('❌ Error guardando en localStorage:', error);
            return false;
        }
    }

    /**
     * Carga datos (automático según el modo)
     */
    async load() {
        if (this.cache) {
            console.log('📦 Usando datos en cache');
            return this.cache;
        }

        if (this.mode === 'auto') {
            this.mode = await this.detectMode();
        }

        let data = [];

        if (this.mode === 'json') {
            data = await this.loadFromJSON();
            // En modo JSON, también guardamos en localStorage como backup
            if (data.length > 0) {
                this.saveToLocalStorage(data);
            }
        } else {
            data = this.loadFromLocalStorage();
        }

        this.cache = data;
        return data;
    }

    /**
     * Guarda datos (solo funciona en modo localStorage)
     */
    async save(data) {
        this.cache = data;

        if (this.mode === 'json') {
            console.warn('⚠️ Modo JSON: Los datos se guardan en localStorage, no en el archivo JSON');
            console.warn('💡 Para persistir cambios en JSON, exporta los datos manualmente');
            return this.saveToLocalStorage(data);
        }

        return this.saveToLocalStorage(data);
    }

    /**
     * Fuerza el modo de operación
     */
    setMode(mode) {
        if (['json', 'localStorage'].includes(mode)) {
            this.mode = mode;
            this.cache = null; // Invalida cache
            console.log(`📍 Modo cambiado a: ${mode}`);
        } else {
            console.error('❌ Modo inválido. Usa: "json" o "localStorage"');
        }
    }

    /**
     * Exporta datos para guardar en JSON
     */
    exportToJSON(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'solicitudes.json';
        a.click();

        URL.revokeObjectURL(url);
        console.log('✅ Datos exportados a solicitudes.json');
    }

    /**
     * Invalida cache
     */
    invalidateCache() {
        this.cache = null;
        console.log('🔄 Cache invalidado');
    }

    /**
     * Obtiene información del modo actual
     */
    getInfo() {
        return {
            mode: this.mode,
            hasCache: this.cache !== null,
            cacheSize: this.cache ? this.cache.length : 0,
            jsonUrl: this.jsonUrl,
            localStorageKey: this.localStorageKey
        };
    }
}

// Instancia global (reemplaza StorageManager)
const dataService = new DataService();
