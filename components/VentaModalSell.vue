<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ propsModeTitle }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <teleport to="body" v-if="errorBanner || loadingBanner">
        <div class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div class="w-full max-w-xl pointer-events-auto px-4">
            <MessageBanner
              v-if="errorBanner"
              :title="errorBanner.title || 'Error'"
              :description="errorBanner.description || ''"
              :type="errorBanner.type || 'error'"
              @close="clearBanners"
            />
            <MessageBanner
              v-else
              :title="loadingBanner.title || 'Cargando'"
              :description="loadingBanner.description || ''"
              :type="loadingBanner.type || 'warning'"
              :persistent="true"
              @close="clearBanners"
            />
          </div>
        </div>
      </teleport>

      <!-- Scanner overlay (teleport) -->
      <teleport to="body">
        <div v-if="scannerActive" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div class="w-full max-w-lg bg-black rounded-lg overflow-hidden relative">
            <button @click="stopScanner" class="absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9.293l4.146-4.147a.5.5 0 11.708.708L10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 01-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293z" clip-rule="evenodd" />
              </svg>
            </button>
            <video ref="videoEl" autoplay muted playsinline class="w-full h-72 object-cover bg-black"></video>
            <!-- Guide rectangle -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-3/4 h-1/3 border-2 border-white/70 rounded"></div>
            </div>
            <div class="absolute bottom-2 left-0 right-0 text-center text-white text-sm">Apunta al código QR o de barras</div>
          </div>
        </div>
      </teleport>

      <div v-if="isSubmitting" class="absolute inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
        <div class="text-center">
          <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <div class="text-sm text-gray-700">Enviando datos...</div>
        </div>
      </div>

      <div>
        <div class="mb-4">
          <div class="grid grid-cols-1 gap-4">
            <div v-for="(item, idx) in ventas" :key="item._id" class="p-3 border rounded bg-gray-50">
              <div class="flex flex-col md:flex-row md:items-end md:gap-4">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">Producto</label>
                        <SelectSearchAPI
                          v-model="item.id_producto"
                          :disabled="isViewMode"
                          endpoint="/producto/filterProductos/1/10"
                          method="POST"
                          search-key="nombre"
                          label-key="nombre"
                          value-key="id_producto"
                          :initial-label="item.initialLabel"
                          placeholder="Buscar producto..."
                          @producto-seleccionado="(p) => onProductoSeleccionado(p, idx)"
                        />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">Cantidad</label>
                    <input type="number" v-model.number="item.cantidad" :disabled="isViewMode" min="1" class="w-full px-3 py-2 rounded border" />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-700 mb-1">Precio Cobrado</label>
                    <input type="number" step="0.01" v-model.number="item.precio_cobrado" :disabled="isViewMode" class="w-full px-3 py-2 rounded border" />
                  </div>
                </div>
                <div class="flex items-start md:items-center md:ml-4">
                  <button v-if="!isViewMode" type="button" @click="removeVenta(idx)" class="ml-auto px-3 py-2 bg-red-500 text-white rounded flex items-center gap-2">
                    <!-- Trash icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <button v-if="!isViewMode" type="button" @click="addVenta" :disabled="!canAddElement" class="px-4 py-2 bg-primary text-neutral rounded disabled:opacity-50">+ Agregar elemento</button>
            </div>
            <div class="text-sm text-gray-600">Usuario: {{ currentUsuarioNombre || '-' }}</div>
          </div>

          <!-- Sumatorio de elementos seleccionados (producto seleccionado) -->
          <div class="mt-3">
            <div class="text-sm font-medium text-gray-700">Total seleccionado</div>
            <div class="text-xl font-bold">{{ totalSeleccionado.toFixed(2) }}</div>
          </div>

          <!-- Nota global y forma de pago -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota (opcional)</label>
            <textarea v-model="notaVenta" :disabled="isViewMode" class="w-full px-3 py-2 rounded border" rows="2" placeholder="Nota para estas ventas"></textarea>
          </div>
          <div class="mt-3">
            <div class="mb-1 text-sm font-medium text-gray-700">Forma de pago</div>
            <div class="relative flex w-full max-w-xs">
              <div
                class="absolute top-0 left-0 w-1/2 h-full bg-primary rounded-lg transition-transform duration-300"
                :class="formaPago === 'efectivo' ? 'transform translate-x-0' : 'transform translate-x-full'"
              ></div>
              <button
                type="button"
                @click="formaPago = 'efectivo'"
                :disabled="isViewMode"
                class="relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"
                :class="formaPago === 'efectivo' ? 'text-neutral bg-transparent' : 'text-dark bg-secondary'"
              >
                Efectivo
              </button>
              <button
                type="button"
                @click="formaPago = 'transferencia'"
                :disabled="isViewMode"
                class="relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"
                :class="formaPago === 'transferencia' ? 'text-neutral bg-transparent' : 'text-dark bg-secondary'"
              >
                Transferencia
              </button>
            </div>
          </div>
        </div>

          <div class="flex justify-end gap-3">
          <button @click="close" class="px-4 py-2 bg-gray-100 rounded">{{ isViewMode ? 'Cerrar' : 'Cancelar' }}</button>
          <button v-if="!isViewMode" @click="submit" class="px-4 py-2 bg-primary text-white rounded">{{ props.mode === 'edit' ? 'Guardar cambios' : 'Crear Ventas' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue';
import SelectSearchAPI from './SelectSearchAPI.vue';
import MessageBanner from './MessageBanner.vue';
const config = useRuntimeConfig();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, default: 'create' }, // 'create' | 'edit' | 'view'
  initialData: { type: Object, default: null }
});
const emit = defineEmits(['update:modelValue', 'submit']);

const ventas = ref([]);
const currentUsuarioNombre = ref('');
const notaVenta = ref('');
const formaPago = ref('efectivo'); // 'efectivo' | 'transferencia'
const isSubmitting = ref(false);
const loadingBanner = ref(null);
const errorBanner = ref(null);
// Scanner state
const scannerActive = ref(false);
const videoEl = ref(null);
let _stream = null;
let _detector = null;
let _scanning = false;
let _codeReader = null;

function loadZXing() {
  return new Promise((resolve, reject) => {
    if (window.ZXing) return resolve(window.ZXing);
    const src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.18.6/umd/index.min.js';
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.ZXing);
    s.onerror = (e) => reject(new Error('No se pudo cargar ZXing: ' + e));
    document.head.appendChild(s);
  });
}

async function requestCameraPermission() {
  try {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      errorBanner.value = { title: 'No soportado', description: 'La API de cámara no está disponible en este entorno.', type: 'error' };
      return { ok: false };
    }
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
    // gather deviceId if possible
    let deviceId = undefined;
    try {
      const devices = (navigator.mediaDevices && typeof navigator.mediaDevices.enumerateDevices === 'function') ? await navigator.mediaDevices.enumerateDevices() : [];
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      if (videoInputs && videoInputs.length) {
        const preferred = videoInputs.find(d => /back|rear|environment|trasera|camera 2|wide/i.test(d.label));
        deviceId = (preferred && preferred.deviceId) || videoInputs[videoInputs.length - 1].deviceId;
      }
    } catch (e) {
      console.warn('enumerateDevices failed during permission request', e);
    }
    // stop temporary stream
    try { s.getTracks().forEach(t => t.stop()); } catch (e) {}
    return { ok: true, deviceId };
  } catch (e) {
    console.error('camera permission error', e);
    if (e && (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError')) {
      errorBanner.value = { title: 'Permiso denegado', description: 'Permiso de cámara denegado. Permite el acceso en la configuración del sitio.', type: 'error' };
    } else {
      errorBanner.value = { title: 'Error cámara', description: e && e.message ? e.message : String(e), type: 'error' };
    }
    return { ok: false };
  }
}

const canAddElement = computed(() => {
  if (ventas.value.length === 0) return true; // allow adding first
  const last = ventas.value[ventas.value.length - 1];
  return !!(last && last.id_producto);
});

const isViewMode = computed(() => props.mode === 'view');

const propsModeTitle = computed(() => {
  if (props.mode === 'edit') return 'Editar Venta';
  if (props.mode === 'view') return 'Ver Venta';
  return 'Nueva Venta';
});

const totalSeleccionado = computed(() => {
  return ventas.value.reduce((acc, v) => {
    if (!v || !v.id_producto) return acc;
    const qty = Number(v.cantidad || 0);
    const price = parseFloat(v.precio_cobrado) || 0;
    return acc + qty * price;
  }, 0);
});

function newItem() {
  return {
    _id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    id_producto: '',
    cantidad: 1,
    costo_venta: 0,
    precio_original_venta: 0,
    precio_cobrado: 0,
    initialLabel: ''
  };
}

function addVenta() {
  ventas.value.push(newItem());
}

function removeVenta(i) { if (ventas.value[i]) ventas.value.splice(i,1); }

function onProductoSeleccionado(p, idx) {
  if (!p) {
    // cleared selection
    if (ventas.value[idx]) {
      ventas.value[idx].id_producto = '';
      ventas.value[idx].initialLabel = '';
      ventas.value[idx].precio_cobrado = 0;
      ventas.value[idx].productoObj = null;
    }
    return;
  }
  ventas.value[idx].id_producto = p.id_producto || p.id_producto;
  ventas.value[idx].initialLabel = p.nombre || p.label || '';
  ventas.value[idx].productoObj = p;
  const precio = p.precio ?? p.precio_cobrado ?? p.precioVenta ?? null;
  if (precio != null) ventas.value[idx].precio_cobrado = Number(precio) || 0;
  // Si se seleccionó en el último elemento, agregar automáticamente otro elemento
  if (idx === ventas.value.length - 1) {
    addVenta();
  }
}

function close() {
  emit('update:modelValue', false);
  ventas.value = [];
  notaVenta.value = '';
  formaPago.value = 'efectivo';
  clearBanners();
}

function getLocalISO() {
  const dt = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = dt.getFullYear();
  const month = pad(dt.getMonth() + 1);
  const day = pad(dt.getDate());
  const hours = pad(dt.getHours());
  const minutes = pad(dt.getMinutes());
  const seconds = pad(dt.getSeconds());
  const tzOffset = -dt.getTimezoneOffset();
  const sign = tzOffset >= 0 ? '+' : '-';
  const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMinutes = pad(Math.abs(tzOffset) % 60);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMinutes}`;
}

// Return local ISO-like string WITHOUT timezone/offset suffix (e.g. 2026-01-21T12:24:00)
function getLocalISONoTZ() {
  const dt = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = dt.getFullYear();
  const month = pad(dt.getMonth() + 1);
  const day = pad(dt.getDate());
  const hours = pad(dt.getHours());
  const minutes = pad(dt.getMinutes());
  const seconds = pad(dt.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getLocalISOFromTimestamp(ts) {
  const dt = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  const year = dt.getFullYear();
  const month = pad(dt.getMonth() + 1);
  const day = pad(dt.getDate());
  const hours = pad(dt.getHours());
  const minutes = pad(dt.getMinutes());
  const seconds = pad(dt.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

async function openScanner() {
  // Request camera permission first so browser shows prompt immediately
  const perm = await requestCameraPermission();
  if (!perm || !perm.ok) return;
  const preferredDeviceId = perm.deviceId;
  try {
    // Try native BarcodeDetector first
    if (typeof window.BarcodeDetector !== 'undefined') {
      if (!_detector) {
        _detector = new window.BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128', 'ean_8', 'upc_a', 'upc_e'] });
      }
      // Try to open the preferred deviceId if available, else request environment camera
      try {
        if (preferredDeviceId) {
          _stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: preferredDeviceId } } });
        } else {
          _stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } });
        }
      } catch (e) {
        // fallback to default camera if preferred not available
        _stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      if (videoEl.value) {
        videoEl.value.srcObject = _stream;
        await videoEl.value.play();
      }
      scannerActive.value = true;
      _scanning = true;
      scanLoop();
      return;
    }

    // Fallback: load ZXing from CDN and use its BrowserMultiFormatReader
    await loadZXing();
    if (!window.ZXing || !window.ZXing.BrowserMultiFormatReader) {
      alert('Escáner no soportado en este navegador.');
      return;
    }

    _codeReader = new window.ZXing.BrowserMultiFormatReader();
    scannerActive.value = true;
    _scanning = true;
    await nextTick();
    if (!videoEl.value) {
      alert('Elemento de video no disponible para el escáner.');
      stopScanner();
      return;
    }
    try {
      if (typeof _codeReader.decodeFromVideoDevice === 'function') {
        // First request a temporary stream to prompt camera permission so device labels become available
        let permStream = null;
        try {
          permStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
          if (videoEl.value) {
            videoEl.value.srcObject = permStream;
            // give camera a moment
            await new Promise(res => setTimeout(res, 300));
          }
        } catch (e) {
          // ignore, we'll try to enumerate anyway
        }

        // Choose the best video input (prefer environment/back camera)
        let deviceId = preferredDeviceId;
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          if (videoInputs && videoInputs.length) {
            const preferred = videoInputs.find(d => /back|rear|environment|trasera|camera 2|wide/i.test(d.label));
            deviceId = deviceId || (preferred && preferred.deviceId) || videoInputs[videoInputs.length - 1].deviceId;
          }
        } catch (e) {
          console.warn('enumerateDevices failed', e);
        }

        // Stop the temporary permission stream before starting ZXing
        try {
          if (permStream) {
            permStream.getTracks().forEach(t => t.stop());
            permStream = null;
          }
          if (videoEl.value) {
            try { videoEl.value.srcObject = null; } catch(e){}
          }
        } catch (e) { /* ignore */ }

        _codeReader.decodeFromVideoDevice(deviceId, videoEl.value, (result, err) => {
          if (result) {
            const text = result.getText ? result.getText() : (result.text || JSON.stringify(result));
            alert('Código escaneado: ' + text);
            stopScanner();
          }
        });
      } else if (typeof _codeReader.decodeFromVideoElement === 'function') {
        _codeReader.decodeFromVideoElement(videoEl.value, (result, err) => {
          if (result) {
            const text = result.getText ? result.getText() : (result.text || JSON.stringify(result));
            alert('Código escaneado: ' + text);
            stopScanner();
          }
        });
      } else {
        alert('El lector ZXing cargado no soporta métodos de decodificación por video.');
        stopScanner();
      }
    } catch (e) {
      console.error('ZXing decode error', e);
      alert('Error iniciando el escáner: ' + (e && e.message ? e.message : e));
      stopScanner();
    }

  } catch (e) {
    console.error('openScanner error', e);
    alert('No se pudo acceder a la cámara: ' + (e && e.message ? e.message : e));
  }
}

async function scanLoop() {
  if (!_scanning || !videoEl.value || !_detector) return;
  try {
    const barcodes = await _detector.detect(videoEl.value);
    if (barcodes && barcodes.length) {
      const code = barcodes[0].rawValue || barcodes[0].rawData || JSON.stringify(barcodes[0]);
      alert('Código escaneado: ' + code);
      stopScanner();
      return;
    }
  } catch (e) {
    console.error('scanLoop error', e);
  }
  requestAnimationFrame(scanLoop);
}

function stopScanner() {
  _scanning = false;
  scannerActive.value = false;
  try {
    if (_codeReader) {
      try { _codeReader.reset(); } catch (e) { console.warn('error resetting codeReader', e); }
      _codeReader = null;
    }
    if (videoEl.value) {
      try { videoEl.value.pause(); } catch(e){}
      try { videoEl.value.srcObject = null; } catch(e){}
    }
    if (_stream) {
      try { _stream.getTracks().forEach(t => t.stop()); } catch(e){}
      _stream = null;
    }
  } catch (e) { console.error('stopScanner', e); }
}

function clearBanners() {
  errorBanner.value = null;
  loadingBanner.value = null;
}

async function submit() {
  let id_usuario = null;
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('usuario');
    if (raw) {
      const u = JSON.parse(raw);
      id_usuario = u?.id_usuario || u?.id || null;
      currentUsuarioNombre.value = u?.nombre || u?.nombre_usuario || '';
    }
  } catch (e) { }

  const payload = ventas.value.map(v => ({
    id_venta: v.id_venta || undefined,
    id_producto: v.id_producto,
    id_usuario: id_usuario,
    cantidad: Number(v.cantidad) || 1,
    costo_venta: v.costo_venta || 0,
    precio_original_venta: v.precio_original_venta || 0,
    precio_cobrado: v.precio_cobrado || 0
  }));

  // If in create mode, perform POST to backend
  if (props.mode === 'create') {
    // Validations
    const itemsToSend = ventas.value.filter(v => v && v.id_producto);
    if (!itemsToSend || itemsToSend.length === 0) {
      errorBanner.value = { title: 'Error', description: 'La lista debe contener al menos 1 elemento con producto seleccionado.', type: 'error' };
      return;
    }

    for (const v of itemsToSend) {
      if (Number(v.cantidad) < 0 || Number(v.precio_cobrado) < 0) {
        errorBanner.value = { title: 'Error', description: 'Cantidad y Precio Cobrado deben ser >= 0 en cada elemento.', type: 'error' };
        return;
      }
    }

    // Build body
    const token = localStorage.getItem('token');
    const usuarioRaw = localStorage.getItem('user') || localStorage.getItem('usuario');
    let id_usuario = null;
    try { if (usuarioRaw) id_usuario = JSON.parse(usuarioRaw)?.id_usuario || JSON.parse(usuarioRaw)?.id || null; } catch(e) { }

    const nowTs = Date.now();
    const nowStr = getLocalISOFromTimestamp(nowTs);
    // debug: timestamp used for all ventas
    console.debug('VentaModalSell - fecha_hora used for submit:', nowStr);

    const body = {
      nota: notaVenta.value || '',
      ventas: itemsToSend.map(v => ({
        id_producto: Number(v.id_producto),
        id_usuario: id_usuario,
        cantidad: Number(v.cantidad) || 0,
        forma_pago: formaPago.value === 'transferencia' ? 'Transferencia' : 'Efectivo',
        costo_venta: v.productoObj ? Number(v.productoObj.costo || 0) : Number(v.costo_venta || 0),
        precio_original_venta: v.productoObj ? Number(v.productoObj.precio || 0) : Number(v.precio_original_venta || 0),
        precio_cobrado: Number(v.precio_cobrado) || 0,
        fecha_hora: nowStr
      }))
    };

    // show loading
    isSubmitting.value = true;
    loadingBanner.value = { title: 'Creando ventas', description: 'Enviando datos al servidor...', type: 'info' };
    console.log(JSON.stringify(body,null,2));
    
    try {
      const resp = await fetch(`${config.public.backendHost}/ListaVenta/createWithVentas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(body)
      });

      if (resp.status === 401) {
        isSubmitting.value = false;
        loadingBanner.value = null;
        errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigateTo('/'), 2000);
        return;
      }

      let responseData = null;
      try { responseData = await resp.json(); } catch (e) { responseData = null; }

      if (!resp.ok) {
        isSubmitting.value = false;
        loadingBanner.value = null;
        let errorMessage = 'Error desconocido';
        if (responseData && responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join('\n• ');
        } else if (responseData && typeof responseData.error === 'string') {
          errorMessage = responseData.error;
        } else if (responseData && (responseData.message || responseData.description)) {
          errorMessage = responseData.message || responseData.description;
        } else if (responseData) {
          errorMessage = JSON.stringify(responseData);
        }
        errorBanner.value = { title: `Error ${resp.status}`, description: errorMessage, type: 'error' };
        return;
      }

      // Success
      // Emit to parent so it refreshes and shows success
      emit('submit', { mode: 'create', items: body.ventas, nota: body.nota, formaPago: formaPago.value });
      errorBanner.value = { title: 'Éxito', description: 'Ventas creadas correctamente.', type: 'success' };
      // close modal
      emit('update:modelValue', false);
      ventas.value = [];
      // clear success banner after a short delay so it doesn't persist on reopen
      setTimeout(() => { errorBanner.value = null; loadingBanner.value = null; }, 2500);

    } catch (err) {
      console.error('Error creating ventas:', err);
      errorBanner.value = { title: 'Error', description: 'Ocurrió un error al crear las ventas.', type: 'error' };
    } finally {
      isSubmitting.value = false;
      loadingBanner.value = null;
    }

    return;
  }

  // Emit for edit or other modes
  if (props.mode === 'edit') {
    const listId = props.initialData ? (props.initialData.id_lista_venta || props.initialData.id || null) : null;
    emit('submit', { mode: 'edit', id_lista_venta: listId, items: payload, nota: notaVenta.value, formaPago: formaPago.value });
  } else {
    emit('submit', { mode: 'create', items: payload, nota: notaVenta.value, formaPago: formaPago.value });
  }
  emit('update:modelValue', false);
  ventas.value = [];
}

onMounted(() => {
  addVenta();
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('usuario');
    if (raw) {
      const u = JSON.parse(raw);
      currentUsuarioNombre.value = u?.nombre || u?.nombre_usuario || '';
    }
  } catch (e) {}
});

onUnmounted(() => {
  stopScanner();
});

// Reset when modal opens
// Reset or populate when modal opens
// Reset or populate when modal opens
watch(() => props.modelValue, (val) => {
  if (val) {
    // If editing or viewing and we have initialData, populate fields
    if ((props.mode === 'edit' || props.mode === 'view') && props.initialData) {
      // populate ventas from initialData.ventas
      ventas.value = (Array.isArray(props.initialData.ventas) ? props.initialData.ventas.map(v => ({
        _id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
        id_venta: v.id_venta,
        id_producto: v.id_producto || (v.producto && v.producto.id_producto) || '',
        cantidad: v.cantidad || 1,
        costo_venta: v.costo_venta || 0,
        precio_original_venta: v.precio_original_venta || 0,
        precio_cobrado: Number(v.precio_cobrado) || 0,
        forma_pago: v.forma_pago || '',
        // initialLabel is used by SelectSearchAPI to show the product name on load
            initialLabel: v.producto ? (v.producto.nombre || '') : '',
            productoObj: v.producto || null
      })) : []);
      notaVenta.value = props.initialData.nota || '';
      // derive formaPago from first venta if exists
      formaPago.value = (ventas.value[0] && ventas.value[0].forma_pago) ? String(ventas.value[0].forma_pago).toLowerCase() : 'efectivo';

    } else if (props.mode === 'create') {
      // Ensure clean state for create mode
      ventas.value = [newItem()];
      notaVenta.value = '';
      formaPago.value = 'efectivo';

    } else {
      if (!ventas.value.length) addVenta();
      formaPago.value = 'efectivo';
      notaVenta.value = '';
    }
  }
});
</script>

<style scoped>
.bg-primary { background-color: #2563eb; }
</style>
