<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Retiros - Pactum" description="Lista y gestión de retiros de efectivo." canonical="/retiros" />
    <Navbar />

    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner"
      class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner :title="'¿Estás seguro que deseas eliminar este retiro?'
        " :description="'Esta acción no se puede deshacer.'" :icon="deleteIcon" type="warning"
        @confirm="confirmDeleteRetiro" @close="showConfirmBanner = false" />
    </div>

    <!-- Filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input type="text" v-model="motivo" placeholder="Motivo..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" v-model="fecha_desde"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" v-model="fecha_hasta"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
        </div>

        <!-- Informe resumen (Ventas, Salidas, Costo Ventas, Ganancia) -->
        <div class="w-[95%] mx-auto px-4 py-4">
          <div class="bg-white rounded-lg shadow-md p-4">
            <h2 class="text-xl font-bold mb-4">Resumen rápido</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Ventas (USD)</div>
                <div class="text-lg font-semibold">{{ ventasTotal.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">Sumatoria de (precio cobrado × cantidad) convertidos a USD por
                  la tasa usada en la venta.</div>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Salidas (Pérdidas)</div>
                <div class="text-lg font-semibold">{{ salidasTotal.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">Sumatoria de (cantidad × costo del producto en USD) por
                  salidas/pérdidas.</div>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Costo Ventas (USD)</div>
                <div class="text-lg font-semibold">{{ costoVentasTotal.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">Sumatoria de (costo de venta en USD × cantidad) de todas las
                  ventas.</div>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Ganancia (Ventas - Costos)</div>
                <div class="text-lg font-semibold">{{ gananciaResumen.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">Ventas − Costo de ventas − Salidas (pérdidas).</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Ganancia en CUP de Ventas Restante</div>
                <div class="text-lg font-semibold">{{ gananciaCUPVentas.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">
                  <span class="font-bold italic">
                    ∑ (precio-cobrado-cup − costo-venta-cup) − ∑ (retiros-cup)
                  </span>
                </div>
              </div>

              <div class="p-4 bg-gray-50 rounded">
                <div class="text-sm text-gray-600">Ganancia en USD de Ventas Restante</div>
                <div class="text-lg font-semibold">{{ gananciaUSDVentas.toFixed(2) }}</div>
                <div class="text-xs text-gray-500 mt-2">
                  <span class="font-bold italic">
                    ∑ (precio-cobrado-usd − costo-venta-usd) − ∑ (retiros-usd)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal bloqueante para carga de métricas -->
          <div v-if="isMetricsLoading || metricsError"
            class="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60">
            <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <div v-if="isMetricsLoading">
                <h3 class="text-lg font-semibold mb-2">Consultando datos...</h3>
                <div class="w-full bg-gray-100 rounded h-3 overflow-hidden mb-3">
                  <div :style="{ width: metricsProgressPercent + '%' }" class="h-3 bg-primary transition-all"></div>
                </div>
                <div class="text-sm text-gray-600">Progreso: {{ metricsCompleted }} / {{ metricsTotalSteps }} — {{
                  metricsProgressPercent }}%</div>
              </div>
              <div v-else-if="metricsError">
                <h3 class="text-lg font-semibold mb-2 text-red-600">Ocurrió un error</h3>
                <p class="text-sm text-gray-700 mb-4">{{ metricsErrorMessage || 'ocurrió un error al consultar o calcular datos' }}</p>
                <div class="flex gap-2 justify-end">
                  <button @click="() => window.location.reload()"
                    class="px-4 py-2 bg-primary text-white rounded">Refrescar página</button>
                  <button @click="() => navigateTo('/')" class="px-4 py-2 bg-gray-200 rounded">Volver al inicio</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2 flex-wrap">
          <button @click="handleSearch"
            class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button v-if="!isInvitado" @click="exportToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de retiros -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Retiros</h2>
        <button v-if="!isInvitado" @click="nuevoRetiro"
          class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Retiro
        </button>
      </div>
      <DataTable :columns="visibleRetirosColumns" :items="itemsData" :actions="isInvitado ? [] : retirosActions"
        :total-items="totalItems" :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
    </div>

    <!-- Modal de Retiro -->
    <RetiroModal v-model="showModal" :retiro="selectedRetiro" :is-editing="isEditing" :is-viewing="isViewing"
      :submitHandler="createOrUpdateRetiro" @success="onRetiroSuccess" />
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";
import SeoMeta from '@/components/SeoMeta.vue';
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import RetiroModal from '@/components/RetiroModal.vue';
import * as XLSX from 'xlsx';

// filtros
const motivo = ref('');
const fecha_desde = ref('');
const fecha_hasta = ref('');

// modal & estado
const showModal = ref(false);
const selectedRetiro = ref({});
const isViewing = ref(false);
const isEditing = ref(false);

// confirm delete
const showConfirmBanner = ref(false);
const retiroAEliminar = ref(null);

// columnas
const RetirosColumns = [
  { key: 'usuario.nombre', label: 'Usuario' },
  {
    key: 'cantidad_retirada_cup',
    label: 'CUP',
    cellRenderer: value => {
      if (value == null || value === '') return '';
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
    }
  },
  {
    key: 'cantidad_retirada_usd',
    label: 'USD',
    cellRenderer: value => {
      if (value == null || value === '') return '';
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
    }
  },
  { key: 'motivo', label: 'Motivo' },
  {
    key: 'fecha',
    label: 'Fecha',
    cellRenderer: value => {
      if (!value) return '';
      return `<span class="px-2 py-1 rounded text-sm">${value.substring(0, 10)}</span>`;
    }
  }
];

const visibleRetirosColumns = computed(() => RetirosColumns);

// paginación y datos
const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(20);
const itemsData = ref([]);

// banner de error
const errorBanner = ref(null);

const config = useRuntimeConfig();

const isInvitado = computed(() => {
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return false;
    const usuario = JSON.parse(usuarioStr);
    const rawRole = usuario && (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role))
      ? (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) : null;
    if (!rawRole) return false;
    return String(rawRole).trim().toLowerCase() === 'invitado';
  } catch (e) {
    return false;
  }
});

// Resumen rápido state
const ventasTotal = ref(0);
const salidasTotal = ref(0);
const costoVentasTotal = ref(0);
const gananciaCUPVentasBase = ref(0);
const gananciaUSDVentasBase = ref(0);
const retirosCUPTotal = ref(0);
const retirosUSDTotal = ref(0);
const isMetricsLoading = ref(false);
const metricsTotalSteps = 5;
const metricsCompleted = ref(0);
const metricsError = ref(false);
const metricsErrorMessage = ref('');

const gananciaResumen = computed(() => {
  return (ventasTotal.value || 0) - (costoVentasTotal.value || 0) - (salidasTotal.value || 0);
});

const gananciaCUPVentas = computed(() => {
  return (gananciaCUPVentasBase.value || 0) - retirosCUPFilteredTotal.value;
});

const gananciaUSDVentas = computed(() => {
  return (gananciaUSDVentasBase.value || 0) - retirosUSDFilteredTotal.value;
});

const retirosCUPFilteredTotal = computed(() => {
  return (itemsData.value || []).reduce((sum, item) => sum + safeNumLocal(item.cantidad_retirada_cup), 0);
});

const retirosUSDFilteredTotal = computed(() => {
  return (itemsData.value || []).reduce((sum, item) => sum + safeNumLocal(item.cantidad_retirada_usd), 0);
});

const metricsProgressPercent = computed(() => {
  return Math.min(100, Math.round((metricsCompleted.value / metricsTotalSteps) * 100));
});

function safeNumLocal(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}
async function fetchJson(url, token) {
  const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json', 'Authorization': token } });
  if (resp.status === 401) {
    localStorage.removeItem('token');
    navigateTo('/');
    throw new Error('Unauthorized');
  }
  if (!resp.ok) {
    const txt = await resp.text().catch(() => null);
    throw new Error(txt || `HTTP ${resp.status}`);
  }
  return resp.json();
}

async function fetchResumenMetrics() {
  isMetricsLoading.value = true;
  metricsCompleted.value = 0;
  metricsError.value = false;
  metricsErrorMessage.value = '';

  const token = localStorage.getItem('token');
  if (!token) { navigateTo('/'); return; }

  try {
    // fetch sequentially to update progress after each
    // 1) entradas (compras) — keep for parity with informes
    let entradas = [];
    try {
      entradas = await fetchJson(`${config.public.backendHost}/entrada`, token);
    } catch (e) {
      metricsError.value = true;
      metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }
    metricsCompleted.value += 1;

    // 2) productos
    let productos = [];
    try {
      productos = await fetchJson(`${config.public.backendHost}/producto`, token);
    } catch (e) {
      metricsError.value = true;
      metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }
    metricsCompleted.value += 1;

    // 3) ventas
    let ventas = [];
    try {
      ventas = await fetchJson(`${config.public.backendHost}/venta`, token);
    } catch (e) {
      metricsError.value = true;
      metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }
    metricsCompleted.value += 1;

    // 4) salidas
    let salidas = [];
    try {
      salidas = await fetchJson(`${config.public.backendHost}/salida`, token);
    } catch (e) {
      metricsError.value = true;
      metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }
    metricsCompleted.value += 1;

    // 5) retiros
    let retiros = [];
    try {
      const retiroRes = await fetch(`${config.public.backendHost}/Retiro/filterRetiros/1/99999`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token },
        body: JSON.stringify({})
      });
      if (retiroRes.ok) {
        const retiroData = await retiroRes.json();
        retiros = retiroData && retiroData.data ? retiroData.data : [];
      }
    } catch (e) {
      // ignore retiros fetch error but count step
    }
    metricsCompleted.value += 1;

    // calculate retiros totals FIRST before subtracting from ganancias
    let retirosCUP = 0;
    let retirosUSD = 0;
    try {
      for (const r of retiros || []) {
        retirosCUP += safeNumLocal(r.cantidad_retirada_cup);
        retirosUSD += safeNumLocal(r.cantidad_retirada_usd);
      }
      retirosCUPTotal.value = retirosCUP;
      retirosUSDTotal.value = retirosUSD;
    } catch (e) {
      retirosCUP = 0;
      retirosUSD = 0;
    }

    // process ventas
    try {
      let ventasSum = 0;
      let costoVentasSum = 0;
      let gananciaCUP = 0;
      let gananciaUSD = 0;
      for (const v of ventas || []) {
        const precio_cobrado = safeNumLocal(v.precio_cobrado);
        const costo_venta_usd = safeNumLocal(v.costo_venta_usd);
        const cantidad = safeNumLocal(v.cantidad);
        const cambio = safeNumLocal(v.cambioUSD_al_vender) || 1;
        ventasSum += (precio_cobrado * cantidad) / cambio;
        costoVentasSum += (costo_venta_usd * cantidad);
        // ganancias: CUP
        const forma = (v.forma_pago || '').trim();
        const costo_venta_cup = safeNumLocal(v.costo_venta);
        if (['Efectivo CUP', 'Transferencia CUP', 'Efectivo y Transferencia'].includes(forma)) {
          gananciaCUP += (precio_cobrado - costo_venta_cup) * cantidad;
        }
        // ganancias: USD
        if (['Efectivo USD', 'Transferencia USD'].includes(forma)) {
          const precioUsd = cambio && cambio !== 0 ? (precio_cobrado / cambio) : precio_cobrado;
          gananciaUSD += (precioUsd - costo_venta_usd) * cantidad;
        }
      }
      ventasTotal.value = ventasSum;
      costoVentasTotal.value = costoVentasSum;
      // store base ganancias (without filtered retiros subtraction)
      gananciaCUPVentasBase.value = gananciaCUP;
      gananciaUSDVentasBase.value = gananciaUSD;
    } catch (e) {
      metricsError.value = true; metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }

    // process salidas
    try {
      let salidasSum = 0;
      for (const s of salidas || []) {
        const cantidad = safeNumLocal(s.cantidad);
        const costo_cup = safeNumLocal(s.costo_producto_usd);
        salidasSum += cantidad * costo_cup;
      }
      salidasTotal.value = salidasSum;
    } catch (e) {
      metricsError.value = true; metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
    }

  } catch (e) {
    metricsError.value = true;
    metricsErrorMessage.value = 'ocurrió un error al consultar o calcular datos';
  } finally {
    // ensure progress is complete
    metricsCompleted.value = metricsTotalSteps;
    isMetricsLoading.value = false;
  }
}

// acciones tabla
const deleteIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
    ]);
  }
};

const retirosActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
        ]);
      }
    },
    handler: (item) => abrirModalRetiro(item, 'editar'),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90'
  },
  {
    name: 'Eliminar',
    icon: deleteIcon,
    handler: (item) => eliminarRetiro(item),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90'
  }
];

// fetching
async function fetchRetiros(page = 1) {
  const token = localStorage.getItem('token');
  if (!token) { navigateTo('/'); return; }

  try {
    isLoading.value = true;
    const body = {};
    if (motivo.value) body.motivo = motivo.value;
    if (fecha_desde.value || fecha_hasta.value) {
      body.fecha = {};
      if (fecha_desde.value) body.fecha.inicio = fecha_desde.value;
      if (fecha_hasta.value) body.fecha.fin = fecha_hasta.value;
    }

    const res = await fetch(`${config.public.backendHost}/Retiro/filterRetiros/null/null`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 3000);
      return;
    }
    if (res.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos.', type: 'error' };
      return;
    }

    const data = await res.json();
    itemsData.value = data.data || [];
    totalItems.value = data.pagination?.total || 0;
    currentPage.value = data.pagination?.currentPage || 1;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar los retiros', type: 'error' };
  } finally {
    isLoading.value = false;
  }
}

// modal helpers
function abrirModalRetiro(item, modo) {
  selectedRetiro.value = { ...item };
  isViewing.value = modo === 'ver';
  isEditing.value = modo === 'editar';
  showModal.value = true;
}

function handleRowClick(item) {
  abrirModalRetiro(item, 'ver');
}

function nuevoRetiro() {
  selectedRetiro.value = null;
  isViewing.value = false;
  isEditing.value = false;
  showModal.value = true;
}

function eliminarRetiro(item) {
  retiroAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteRetiro() {
  if (!retiroAEliminar.value) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${config.public.backendHost}/Retiro/deleteRetiro/${retiroAEliminar.value.id_retiro}`, {
      method: 'DELETE', headers: { Authorization: token, Accept: 'application/json' }
    });
    if (res.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 3000);
      return;
    }
    let responseData = null;
    try { responseData = await res.json(); } catch { }
    if (!res.ok) {
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
      errorBanner.value = { title: `Error ${res.status}`, description: errorMessage, type: 'error' };
      return;
    }
    errorBanner.value = { title: 'Retiro eliminado', description: 'Se eliminó correctamente', type: 'success' };
    await fetchRetiros(currentPage.value);
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al eliminar', type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    retiroAEliminar.value = null;
  }
}

// handle submit from modal
async function createOrUpdateRetiro(payload) {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value && selectedRetiro.value?.id_retiro
      ? `${config.public.backendHost}/Retiro/updateRetiro/${selectedRetiro.value.id_retiro}`
      : `${config.public.backendHost}/Retiro/createRetiro`;
    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 3000);
      throw new Error('Sesión expirada');
    }
    if (res.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos.', type: 'error' };
      throw new Error('Acceso denegado');
    }

    let responseData = null;
    try { responseData = await res.json(); } catch { }
    if (!res.ok) {
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
      errorBanner.value = { title: `Error ${res.status}`, description: errorMessage, type: 'error' };
      throw new Error(errorMessage);
    }

    return responseData && responseData.data ? responseData.data : responseData;
  } catch (e) {
    console.error('Error en createOrUpdateRetiro:', e);
    throw e;
  }
}

async function onRetiroSuccess(payload) {
  errorBanner.value = { title: payload?.title || 'Retiro guardado', description: payload?.description || '', type: 'success' };
  showModal.value = false;
  selectedRetiro.value = {};
  isEditing.value = false;
  isViewing.value = false;
  await fetchRetiros(currentPage.value);
}

// búsqueda y paginación
const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchRetiros(1);
  } finally {
    isLoading.value = false;
  }
};
function handlePageChange(page) { fetchRetiros(page); }

// export excel (opcional)
async function exportToExcel() {
  errorBanner.value = { title: 'Consultando datos', description: 'Se están consultando los datos, la descarga comenzará en breve.', type: 'info' };
  try {
    const token = localStorage.getItem('token');
    const body = {};
    if (motivo.value) body.motivo = motivo.value;
    if (fecha_desde.value || fecha_hasta.value) {
      body.fecha = {};
      if (fecha_desde.value) body.fecha.inicio = fecha_desde.value;
      if (fecha_hasta.value) body.fecha.fin = fecha_hasta.value;
    }

    const response = await fetch(`${config.public.backendHost}/Retiro/filterRetiros/null/null`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 3000);
      return;
    }
    if (response.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos.', type: 'error' };
      return;
    }
    if (!response.ok) {
      const errorData = await response.json();
      errorBanner.value = { title: 'Error al consultar datos', description: errorData.error || 'Ocurrió un error al consultar los datos.', type: 'error' };
      return;
    }
    const data = await response.json();
    const exportData = data.data.map(item => ({
      Usuario: item.usuario?.nombre || '',
      'CUP': Number(item.cantidad_retirada_cup || 0).toFixed(2),
      'USD': Number(item.cantidad_retirada_usd || 0).toFixed(2),
      Motivo: item.motivo || '',
      Fecha: item.fecha ? item.fecha.substring(0, 10) : ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retiros');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `retiros_${date}.xlsx`);
    errorBanner.value = null;
  } catch (error) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al exportar los datos.', type: 'error' };
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) { navigateTo('/'); return; }
  // fetch resumen metrics first (blocks UI with modal)
  await fetchResumenMetrics();
  await fetchRetiros();
});
</script>
