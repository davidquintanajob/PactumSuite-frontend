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

      <!-- Confirm print after creation -->
      <teleport to="body" v-if="showPrintConfirm">
        <div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
          <ConfirmBanner :title="'¿Deseas imprimir la venta creada?'" :description="'¿Deseas imprimir la lista de venta que acabas de crear?'" :icon="PrintIcon" type="warning" @confirm="printCreatedVenta" @close="handlePrintCancel" />
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
                <div class="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <div class="flex flex-col items-center md:col-span-3">
                    <label class="block text-sm text-gray-700 mb-1 text-center">Producto</label>
                    <div class="flex items-center gap-3 w-full">
                      <img :src="getItemImageSrc(item)" @error="onImgError($event)"
                        class="w-14 h-14 rounded-full object-cover bg-white border" alt="foto-producto" />
                      <div class="flex-1 w-full">
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
                    </div>
                  </div>
                  <div class="flex flex-col items-center md:col-span-1">
                    <label class="block text-sm text-gray-700 mb-1 text-center">Cantidad</label>
                    <input type="number" v-model.number="item.cantidad" :disabled="isViewMode" min="1" class="w-full px-3 py-2 rounded border text-center" />
                  </div>
                  <div class="flex flex-col items-center md:col-span-1">
                    <label class="block text-sm text-gray-700 mb-1 text-center">Precio Cobrado</label>
                    <input type="number" step="0.01" v-model.number="item.precio_cobrado" :disabled="isViewMode" class="w-full px-3 py-2 rounded border text-center" />
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
            <div class="text-sm font-medium text-gray-700">Total a cobrar</div>
            <div class="text-xl font-bold">CUP {{ formatMoney(totalSeleccionado) }} - USD: {{ formatMoney(totalSeleccionado / cambioMoneda) }}</div>
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
                class="absolute top-0 left-0 h-full bg-primary rounded-lg transition-all duration-300"
                :style="{ width: '33.3333%', left: (formaPagoOptions.indexOf(formaPago) * 33.3333) + '%' }"
              ></div>
              <button
                v-for="opt in formaPagoOptions"
                :key="opt"
                type="button"
                @click="formaPago = opt"
                :disabled="isViewMode"
                class="relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"
                :class="(formaPago === opt) ? 'text-neutral bg-transparent' : 'text-dark bg-secondary'"
              >
                {{ opt }}
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
import { ref, onMounted, computed, watch, onUnmounted, nextTick, h } from 'vue';
import SelectSearchAPI from './SelectSearchAPI.vue';
import MessageBanner from './MessageBanner.vue';
import ConfirmBanner from './ConfirmBanner.vue';
const config = useRuntimeConfig();

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, default: 'create' }, // 'create' | 'edit' | 'view'
  initialData: { type: Object, default: null }
});
const emit = defineEmits(['update:modelValue', 'submit', 'open-comprobante']);

const ventas = ref([]);
const currentUsuarioNombre = ref('');
const notaVenta = ref('');
const formaPagoOptions = ['Efectivo CUP', 'Efectivo USD', 'Transferencia'];
const formaPago = ref(formaPagoOptions[0]);
const isSubmitting = ref(false);
const loadingBanner = ref(null);
const errorBanner = ref(null);
const showPrintConfirm = ref(false);
const createdListaId = ref(null);
const createdListaRaw = ref(null);
const PrintIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 9V2h12v7' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18h12v-5H6v5z' })
    ]);
  }
};
// Scanner state
const scannerActive = ref(false);
const videoEl = ref(null);
let _stream = null;
let _detector = null;
let _scanning = false;
let _codeReader = null;

// ---------- CAMBIO DE MONEDA ----------
const cambioMoneda = ref(1);

function loadCambioMoneda() {
  try {
    const cfg = localStorage.getItem('config');
    if (cfg) {
      const parsed = JSON.parse(cfg);
      const cm = Number(parsed?.cambio_moneda);
      cambioMoneda.value = (cm && cm > 0) ? cm : 1;
    } else {
      cambioMoneda.value = 1;
    }
  } catch (e) {
    cambioMoneda.value = 1;
  }
}
// --------------------------------------

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

function getItemImageSrc(item) {
  try {
    if (item && item.productoObj && item.productoObj.foto) {
      const f = item.productoObj.foto;
      if (typeof f === 'string' && (f.startsWith('http') || f.startsWith('data:'))) return f;
      return `${config.public.backendHost}${f}`;
    }
  } catch (e) {
    // ignore and fallback
  }
  return '/image.png';
}

function onImgError(e) {
  try {
    e.target.src = '/image.png';
    e.target.style.background = 'white';
  } catch (err) {}
}

function close() {
  emit('update:modelValue', false);
  ventas.value = [];
  notaVenta.value = '';
  formaPago.value = formaPagoOptions[0];
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

function formatMoney(v) { return Number(v||0).toFixed(2); }
function formatDate(s) { if (!s) return '-'; try { return new Date(s).toLocaleString(); } catch(e) { return s; } }

function buildFlatVentas(data) {
  if (!data) return [];
  if (Array.isArray(data.ventas)) return data.ventas;
  if (Array.isArray(data.data) && data.data.length && Array.isArray(data.data[0].ventas)) return data.data[0].ventas;
  return [];
}

function createPrintWindowFromData(data) {
  const flatVentas = buildFlatVentas(data);
  const total = flatVentas.reduce((acc, v) => acc + (Number(v.precio_cobrado)||0) * (Number(v.cantidad)||0), 0);
  const contentRows = flatVentas.map(v => {
    const nombre = (v.producto && (v.producto.nombre)) || (v.servicio && v.servicio.nombre) || v.nombre || '---';
    const cantidad = v.cantidad || 0;
    const precio = formatMoney(v.precio_cobrado);
    const totalRow = formatMoney((Number(v.precio_cobrado)||0) * (Number(v.cantidad)||0));
    return `<tr class="border-b"><td class="py-2">${nombre}</td><td class="py-2 text-right">${cantidad}</td><td class="py-2 text-right">${precio}</td><td class="py-2 text-right">${totalRow}</td></tr>`;
  }).join('\n');

  const fecha = formatDate(data?.createdAt || data?.created_at || data?.fecha || '');
  const css = `body{font-family: Helvetica,Arial,sans-serif;padding:20px;color:#111;} table{width:100%;border-collapse:collapse;} th,td{padding:8px;border-bottom:1px solid #eee;} .text-right{text-align:right;} .title{font-weight:700;margin-bottom:8px}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Comprobante</title><style>${css}</style></head><body><div class="text-center"><div class="title">Comprobante de pago</div></div><div class="mb-4"><div><strong>Fecha creación:</strong> ${fecha}</div></div><table class="w-full text-sm border-collapse"><thead><tr class="border-b"><th class="text-left py-2">Producto</th><th class="text-right py-2">Cantidad</th><th class="text-right py-2">Precio</th><th class="text-right py-2">Total</th></tr></thead><tbody>${contentRows}</tbody></table><div class="mt-4 text-right"><div><strong>Total:</strong> ${formatMoney(total)}</div></div></body></html>`;

  const w = window.open('', '_blank');
  if (!w) { alert('No se pudo abrir la ventana de impresión. Revisa bloqueadores de ventanas emergentes.'); return null; }
  w.document.open(); w.document.write(html); w.document.close();
  const tryPrint = () => { try { w.focus(); w.print(); } catch (e) { console.warn('Print failed', e); } };
  w.onload = () => setTimeout(tryPrint, 300);
  setTimeout(tryPrint, 800);
  return w;
}

async function printCreatedVenta() {
  showPrintConfirm.value = false;
  const idLista = createdListaId.value;
  // if we don't have an id, emit raw data if available
  if (!idLista) {
    // print directly from raw response if available
    createPrintWindowFromData(createdListaRaw.value || null);
    // close modal after printing
    emit('update:modelValue', false);
    ventas.value = [];
    createdListaId.value = null;
    createdListaRaw.value = null;
    return;
  }
  try {
    isSubmitting.value = true;
    loadingBanner.value = { title: 'Cargando comprobante', description: 'Obteniendo lista de venta...', type: 'info' };
    const token = localStorage.getItem('token');
    const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Authorization': token }
    });
    if (resp.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 2000);
      return;
    }
    if (!resp.ok) {
      let txt = await resp.text();
      try { txt = JSON.parse(txt); } catch (e) {}
      errorBanner.value = { title: `Error ${resp.status}`, description: JSON.stringify(txt), type: 'error' };
      return;
    }
    const data = await resp.json();
    // print directly using fetched data and do not open VentaComprobante
    createPrintWindowFromData(data);
    // Close modal after printing
    emit('update:modelValue', false);
    ventas.value = [];
    createdListaId.value = null;
    createdListaRaw.value = null;
  } catch (err) {
    console.error('Error fetching lista venta for print:', err);
    errorBanner.value = { title: 'Error', description: 'No se pudo obtener la lista para imprimir.', type: 'error' };
  } finally {
    isSubmitting.value = false;
    loadingBanner.value = null;
  }
}

function handlePrintCancel() {
  showPrintConfirm.value = false;
  // Close modal when user declines printing
  emit('update:modelValue', false);
  ventas.value = [];
  createdListaId.value = null;
  createdListaRaw.value = null;
  clearBanners();
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

    // 🔁 Cargar el cambio de moneda desde localStorage
    loadCambioMoneda();

    const body = {
      nota: notaVenta.value || '',
        ventas: itemsToSend.map(v => ({
        id_producto: Number(v.id_producto),
        id_usuario: id_usuario,
        cambioUSD_al_vender: cambioMoneda.value,
        cantidad: Number(v.cantidad) || 0,
          forma_pago: formaPago.value,
        costo_venta: v.productoObj ? Number(v.productoObj.costo || 0) : Number(v.costo_venta || 0),
        precio_original_venta: v.productoObj ? Number(v.productoObj.precio || 0) : Number(v.precio_original_venta || 0),
        precio_cobrado: Number(v.precio_cobrado) || 0,
        fecha_hora: nowStr
      }))
    };
    console.log(JSON.stringify(body,null,2));
    
    // show loading
    isSubmitting.value = true;
    loadingBanner.value = { title: 'Creando ventas', description: 'Enviando datos al servidor...', type: 'info' };
    
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
      // prepare preview data for comprobante
      let previewData = null;
      try {
        createdListaRaw.value = responseData || null;
        createdListaId.value = (responseData && (responseData.id_lista_venta || responseData.id || (responseData.data && (responseData.data.id_lista_venta || responseData.data.id)))) || null;
      } catch (e) { createdListaId.value = null; createdListaRaw.value = null; }

      // Build a preview object that VentaComprobante can consume.
      // Prefer server response if it contains ventas/lista, else fall back to the request body + local selection metadata.
      const serverHasVentas = (responseData && (Array.isArray(responseData.ventas) || Array.isArray(responseData.data) || Array.isArray(responseData.lista) || Array.isArray(responseData.items)));
      if (serverHasVentas) {
        // Try to normalize server response shape
        previewData = responseData;
      } else {
        // Use the body we just sent and try to augment with product names from the local `itemsToSend`.
        const localVentas = (itemsToSend || []).map((v, idx) => {
          const prodObj = v.productoObj || v.producto || null;
          const producto = prodObj ? { nombre: prodObj.nombre || prodObj.name || '', codigo: prodObj.codigo || '' , precio: prodObj.precio ?? prodObj.price } : { nombre: v.initialLabel || '' };
          return Object.assign({}, v, { producto });
        });
        previewData = {
          id_lista_venta: createdListaId.value || null,
          nota: body.nota || '',
          fecha: new Date().toISOString(),
          ventas: localVentas
        };
      }

      // Clear UI state and close modal
      ventas.value = [];

      // Emit preview to parent to open VentaComprobante and close this modal
      try {
        emit('open-comprobante', previewData);
      } catch (e) { console.warn('open-comprobante emit failed', e); }
      emit('update:modelValue', false);

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
  // 🔁 Cargar el cambio de moneda al montar el componente
  loadCambioMoneda();
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
watch(() => props.modelValue, (val) => {
  if (val) {
    // 🔁 Cargar el cambio de moneda cada vez que se abre el modal
    loadCambioMoneda();

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
      // derive formaPago from first venta if exists (normalize various shapes)
      try {
        let fpRaw = '';
        if (ventas.value[0] && ventas.value[0].forma_pago) fpRaw = ventas.value[0].forma_pago;
        else if (props.initialData && (props.initialData.forma_pago || props.initialData.formaPago)) fpRaw = props.initialData.forma_pago || props.initialData.formaPago;
        let fp = '';
        if (fpRaw && typeof fpRaw === 'object') fp = fpRaw.nombre || fpRaw.name || '';
        else fp = String(fpRaw || '');
        fp = fp.trim();
        if (!fp) {
          formaPago.value = formaPagoOptions[0];
        } else {
          // try exact match first
          const found = formaPagoOptions.find(o => o.toLowerCase() === fp.toLowerCase());
          if (found) formaPago.value = found;
          else if (fp.toLowerCase().includes('transfer')) formaPago.value = 'Transferencia';
          else if (fp.toLowerCase().includes('efectivo') && fp.toLowerCase().includes('usd')) formaPago.value = 'Efectivo USD';
          else if (fp.toLowerCase().includes('efectivo') && fp.toLowerCase().includes('cup')) formaPago.value = 'Efectivo CUP';
          else if (fp.toLowerCase().includes('efectivo')) formaPago.value = 'Efectivo CUP';
          else formaPago.value = formaPagoOptions[0];
        }
      } catch (e) {
        formaPago.value = formaPagoOptions[0];
      }

    } else if (props.mode === 'create') {
      // Ensure clean state for create mode
      ventas.value = [newItem()];
      notaVenta.value = '';
      formaPago.value = formaPagoOptions[0];

    } else {
      if (!ventas.value.length) addVenta();
      formaPago.value = formaPagoOptions[0];
      notaVenta.value = '';
    }
  }
});
</script>

<style scoped>
.bg-primary { background-color: #2563eb; }
</style>