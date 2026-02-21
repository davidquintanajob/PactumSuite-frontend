<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Ventas - Contract Manager" description="Lista de ventas agrupadas." canonical="/ventas" />
    <Navbar />

    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>

    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner :title="'¿Estás seguro que deseas eliminar esta venta?'" :description="'Esta acción no se puede deshacer.'" type="warning" @confirm="confirmDeleteVenta" @close="showConfirmBanner = false" />
    </div>

    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <!-- Campo principal de búsqueda (Nombre Producto) siempre visible -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre de producto</label>
          <div class="relative">
            <input type="text" v-model="filters.nombre_producto" placeholder="Nombre producto..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
            <div class="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        

        <!-- Modo de visualización: Normal / Detallado (estilo toggle como FacturaModal) -->
        <div class="mb-4">
          <div class="relative flex w-full max-w-xs">
            <div
              class="absolute top-0 left-0 w-1/2 h-full bg-primary rounded-lg transition-transform duration-300"
              :class="viewMode === 'normal' ? 'transform translate-x-0' : 'transform translate-x-full'"
            ></div>
            <button
              type="button"
              @click="selectViewMode('normal')"
              class="relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"
              :class="viewMode === 'normal' ? 'text-neutral bg-transparent' : 'text-dark bg-secondary'"
              :disabled="isLoading"
            >
              Normal
            </button>
            <button
              type="button"
              @click="selectViewMode('detallado')"
              class="relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"
              :class="viewMode === 'detallado' ? 'text-neutral bg-transparent' : 'text-dark bg-secondary'"
              :disabled="isLoading"
            >
              Detallado
            </button>
          </div>
        </div>

        <!-- Botón para mostrar/ocultar filtros en móvil -->
        <div class="md:hidden flex justify-between items-center mb-4">
          <button @click="showFilters = !showFilters" class="flex items-center text-primary hover:brightness-90">
            <span class="mr-2">Filtros adicionales</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform"
              :class="{ 'rotate-180': showFilters }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Campos adicionales (colapsables en móvil) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4" :class="{ 'hidden md:grid': !showFilters }">
          <div v-if="viewMode === 'normal'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input v-model="filters.nota" type="text" placeholder="Nota"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código Producto</label>
            <input v-model="filters.codigo_producto" type="text" placeholder="Código producto"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio cobrado min</label>
              <input v-model.number="filters.precio_cobrado_min" type="number" min="0" step="0.01"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                @keyup.enter="handleSearch" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio cobrado max</label>
              <input v-model.number="filters.precio_cobrado_max" type="number" min="0" step="0.01"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                @keyup.enter="handleSearch" />
            </div>
          </div>
        </div>

        <!-- Fechas (separadas para que ocupen toda la fila en móvil dentro del bloque colapsable) -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4" :class="{ 'hidden md:grid': !showFilters }">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha mínima</label>
            <input v-model="filters.fecha_hora_min" type="date"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha máxima</label>
            <input v-model="filters.fecha_hora_max" type="date"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div class="flex items-end justify-end">
            <button @click="handleSearch"
              class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Ventas</h2>
        <div>
          <button v-if="!isInvitado" @click="openCreateModal" class="px-3 py-1 bg-green-600 text-white rounded-md">+ Agregar Venta</button>
        </div>
      </div>

      <DataTable :columns="ventasColumns" :items="itemsData" :actions="isInvitado ? [] : ventasActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
      
      <!-- Selector de límite de elementos por página -->
      <div class="mt-4 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Elementos por página:</label>
          <div class="relative w-32">
            <input 
              v-model.number="itemsPorPage"
              type="number"
              min="1"
              max="1000"
              list="itemsPerPageOptions"
              @change="handleItemsPerPageChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              :disabled="isLoading"
            />
            <datalist id="itemsPerPageOptions">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </datalist>
          </div>
        </div>
        <div class="text-sm text-gray-600">
          Total: <span class="font-semibold">{{ totalItems }}</span> elementos
        </div>
      </div>

      <!-- Resumen con sumatorios devueltos por la API -->
      <div v-if="viewMode === 'normal'" class="mt-6 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto">
        <h3 class="text-xl font-semibold mb-4">Resumen de Totales - Reporte de las {{ itemsPorPage }} elementos</h3>
        <!-- Resumen en CUP -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-gray-100 text-gray-800 rounded p-3">
            <div class="text-sm font-medium">Suma Cantidad de productos vendidos</div>
            <div class="text-lg font-bold">{{ formatNumber(paginationData.sumCantidad ?? 0, 0) }}</div>
          </div>
          <div class="bg-green-100 text-green-800 rounded p-3">
            <div class="text-sm font-medium">Suma Total CUP vendido (Efectivo y Transferencia)</div>
            <div class="text-lg font-bold">{{ formatNumber(paginationData.sumTotalVentas ?? 0, 2) }}</div>
          </div>
          <div v-if="!isVendedor" class="bg-blue-100 text-blue-800 rounded p-3">
            <div class="text-sm font-medium">Suma Total Costos CUP de las ventas</div>
            <div class="text-lg font-bold">{{ formatNumber(paginationData.sumCostoVenta ?? 0, 2) }}</div>
          </div>
          <div v-if="!isVendedor" class="bg-yellow-100 text-yellow-800 rounded p-3">
            <div class="text-sm font-medium">Ganancia Total en CUP</div>
            <div class="text-lg font-bold">{{ formatNumber(((paginationData.sumTotalVentas ?? 0) - (paginationData.sumCostoVenta ?? 0)) || 0, 2) }}</div>
          </div>
        </div>

        <!-- Nuevo reporte: Suma de Efectivo y Transferencia -->
        <div class="mt-6 pt-6 border-t border-gray-300">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Suma de Efectivo -->
            <div>
              <h4 class="text-lg font-semibold mb-3">Suma de Efectivo</h4>
              <div class="grid grid-cols-1 gap-4 text-center">
                <div class="bg-purple-50 text-purple-800 rounded p-3">
                  <div class="text-sm font-medium">Total Efectivo CUP</div>
                  <div class="text-lg font-bold">{{ formatNumber(paginationData.sumEfectivoCUP ?? 0, 2) }}</div>
                </div>
                <div class="bg-purple-100 text-purple-800 rounded p-3">
                  <div class="text-sm font-medium">Total Efectivo USD</div>
                  <div class="text-lg font-bold">{{ formatNumber(paginationData.sumEfectivoUSD ?? 0, 2) }}</div>
                </div>
              </div>
            </div>
            <!-- Suma de Transferencia -->
            <div>
              <h4 class="text-lg font-semibold mb-3">Suma de Transferencia</h4>
              <div class="grid grid-cols-1 gap-4 text-center">
                <div class="bg-indigo-50 text-indigo-800 rounded p-3">
                  <div class="text-sm font-medium">Total Transferencia CUP</div>
                  <div class="text-lg font-bold">{{ formatNumber(paginationData.sumTransferenciaCUP ?? 0, 2) }}</div>
                </div>
                <div class="bg-indigo-100 text-indigo-800 rounded p-3">
                  <div class="text-sm font-medium">Total Transferencia USD</div>
                  <div class="text-lg font-bold">{{ formatNumber(paginationData.sumTransferenciaUSD ?? 0, 2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <VentaModal v-model="showModal" :listaVenta="selectedLista" />
    <div v-if="modalLoading" class="fixed inset-0 z-[11000] bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded p-6 flex flex-col items-center gap-4">
        <div class="loader-border w-12 h-12 border-4 border-primary rounded-full animate-spin"></div>
        <div>Cargando lista de venta...</div>
      </div>
    </div>
    <VentaModalSell v-model="showSellModal" :mode="modalMode" :initialData="modalInitialData" @submit="handleNewVentas" @open-comprobante="openComprobanteFromModal" />
    <VentaComprobante v-model="showComprobante" :data="comprobanteData" />
  </div>
</template>

<script setup>
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from '@/components/Navbar.vue';
import DataTable from '@/components/DataTable.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import VentaModal from '@/components/VentaModal.vue';
import VentaModalSell from '@/components/VentaModalSell.vue';
import VentaComprobante from '@/components/VentaComprobante.vue';
import { ref, onMounted, h, computed } from 'vue';

const config = useRuntimeConfig();

const filters = ref({
  nota: '',
  nombre_producto: '',
  codigo_producto: '',
  fecha_hora_min: '',
  fecha_hora_max: '',
  precio_cobrado_min: null,
  precio_cobrado_max: null
});

// Modo de visualización: 'normal' (por defecto) o 'detallado'
const viewMode = ref('normal');

const showFilters = ref(false);

function formatTime12(timeStr) {
  if (!timeStr) return '';
  // Accept formats like HH:MM:SS or HH:MM:SS.sssZ
  const t = String(timeStr).substring(0,8);
  const parts = t.split(':');
  if (parts.length < 2) return timeStr;
  let hh = parseInt(parts[0], 10);
  const mm = parts[1];
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${mm} ${ampm}`;
}

// Formatea números con separador de miles ' ' y decimales configurables
function formatNumber(value, decimals = 2) {
  const n = Number(value);
  if (!isFinite(n)) return (0).toFixed(decimals);
  if (decimals === 0) {
    return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  const fixed = n.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(50);
const itemsData = ref([]);
const paginationData = ref({});

const showModal = ref(false);
const selectedLista = ref(null);
const showSellModal = ref(false);
const modalMode = ref('create');
const modalInitialData = ref(null);
const modalLoading = ref(false);
const showComprobante = ref(false);
const comprobanteData = ref(null);

const errorBanner = ref(null);
// Confirmación de eliminación
const showConfirmBanner = ref(false);
const ventaAEliminar = ref(null);

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
// ----------------------------------

const ventasColumns = computed(() => {
  if (viewMode.value === 'normal') {
    return [
      { key: 'fecha', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'totalCobrado', label: 'Total Cobrado' },
      // Mostrar TOTAL COBRADO USD solo si NO es Vendedor
      ...(isVendedor.value ? [] : [{ key: 'totalCobradoUSD', label: 'TOTAL COBRADO USD' }]),
      {
        key: 'formaPago',
        label: 'Forma de Pago',
        cellRenderer: (value) => {
          if (!value) return '';
          const v = String(value).toLowerCase();
          // composite: both efectivo and transferencia
          const hasEfectivo = v.includes('efectivo');
          const hasTransfer = v.includes('transferencia');
          if (hasEfectivo && hasTransfer) {
            return `<span class="px-2 py-1 rounded-full text-sm font-medium"><span class=\"inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-l\">Efectivo</span><span class=\"inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-r\">Transferencia</span></span>`;
          }
          let bg = 'bg-gray-100 text-gray-800';
          if (hasTransfer) bg = 'bg-blue-100 text-blue-800';
          else if (hasEfectivo) bg = 'bg-green-100 text-green-800';
          return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bg}">${value}</span>`;
        }
      },
      { key: 'usuario', label: 'Usuario' }
    ];
  }

  // Modo detallado: columnas basadas en los campos individuales de venta
  return [
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'productoNombre', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'precio_cobrado', label: 'Precio Cobrado' },
    // Mostrar columna USD en detallado solo si NO es Vendedor
    ...(isVendedor.value ? [] : [{ key: 'totalUSD', label: 'TOTAL COBRADO USD' }]),
    { key: 'total', label: 'Total' },
    {
      key: 'forma_pago',
      label: 'Forma de Pago',
      cellRenderer: (value) => {
        if (!value) return '';
        const v = String(value).toLowerCase();
        const hasEfectivo = v.includes('efectivo');
        const hasTransfer = v.includes('transferencia');
        if (hasEfectivo && hasTransfer) {
          return `<span class="px-2 py-1 rounded-full text-sm font-medium"><span class=\"inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-l\">Efectivo</span><span class=\"inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-r\">Transferencia</span></span>`;
        }
        let bg = 'bg-gray-100 text-gray-800';
        if (hasTransfer) bg = 'bg-blue-100 text-blue-800';
        else if (hasEfectivo) bg = 'bg-green-100 text-green-800';
        return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bg}">${value}</span>`;
      }
    },
    { key: 'usuario', label: 'Usuario' }
  ];
});

const ventasActions = [
  // Imprimir (placeholder)
  {
    name: 'Imprimir',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 9V2h12v7' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18h12v-5H6v5z' })
        ])
      }
    },
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90',
    handler: async (item) => {
      // Abrir modal del comprobante. Si estamos en modo detallado, obtener lista primero
      if (viewMode.value === 'normal') {
        comprobanteData.value = item.rawItem || item;
        showComprobante.value = true;
        return;
      }

      // detallado: obtener ListaVenta/{id_lista_venta}
      const raw = item.rawItem || item;
      const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
      if (!idLista) {
        errorBanner.value = { title: 'Error', description: 'ID de lista no encontrado.', type: 'error' };
        return;
      }
      try {
        modalLoading.value = true;
        const token = localStorage.getItem('token');
        const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'Authorization': token }
        });
        if (resp.status === 401) {
          errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
        comprobanteData.value = data;
        showComprobante.value = true;
      } catch (err) {
        console.error('Error fetching lista venta for comprobante:', err);
        errorBanner.value = { title: 'Error', description: 'No se pudo cargar la lista de venta.', type: 'error' };
      } finally {
        modalLoading.value = false;
      }
    }
  },

  // Editar (placeholder)
  /*/
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5h6M4 21v-7a4 4 0 014-4h2l8 8v4H4z' })
        ])
      }
    },
    buttonClass: 'px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700',
      handler: async (item) => {
        // Abrir VentaModalSell en modo editar.
        if (viewMode.value === 'normal') {
          // item.rawItem es la lista completa
          modalMode.value = 'edit';
          modalInitialData.value = item.rawItem || item;
          showSellModal.value = true;
          return;
        }

        // modo detallado: obtener la lista mediante GET /ListaVenta/{id_lista_venta}
        const raw = item.rawItem || item;
        const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
        if (!idLista) {
          errorBanner.value = { title: 'Error', description: 'ID de lista no encontrado.', type: 'error' };
          return;
        }
        try {
          modalLoading.value = true;
          const token = localStorage.getItem('token');
          const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': token }
          });
          if (resp.status === 401) {
            errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
          modalMode.value = 'edit';
          modalInitialData.value = data;
          showSellModal.value = true;
        } catch (err) {
          console.error('Error fetching lista venta:', err);
          errorBanner.value = { title: 'Error', description: 'No se pudo cargar la lista de venta.', type: 'error' };
        } finally {
          modalLoading.value = false;
        }
      }
  },
  */
 
  // Eliminar (ejecuta DELETE al endpoint según viewMode)
  {
    name: 'Eliminar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3' })
        ])
      }
    },
    buttonClass: 'px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700',
    handler: (item) => {
      // Mostrar confirmación antes de eliminar
      ventaAEliminar.value = { raw: item.rawItem || item, mode: viewMode.value };
      showConfirmBanner.value = true;
    }
  }
];

// Computed: determinar si el usuario actual es Invitado
const isInvitado = computed(() => {
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return false;
    const usuario = JSON.parse(usuarioStr);
    const rawRole = usuario && (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) ? (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) : null;
    if (!rawRole) return false;
    return String(rawRole).trim().toLowerCase() === 'invitado';
  } catch (e) {
    return false;
  }
});

// Computed: determinar si el usuario actual es Vendedor
const isVendedor = computed(() => {
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return false;
    const usuario = JSON.parse(usuarioStr);
    const rawRole = usuario && (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) ? (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) : null;
    if (!rawRole) return false;
    return String(rawRole).trim().toLowerCase() === 'vendedor';
  } catch (e) {
    return false;
  }
});

function selectViewMode(mode) {
  if (viewMode.value === mode) return;
  viewMode.value = mode;
  handleModeChange();
}

function buildBodyFromFilters(obj, mode = 'normal') {
  const body = {};
  for (const key in obj) {
    // En modo detallado no enviamos 'nota'
    if (mode === 'detallado' && key === 'nota') continue;
    const val = obj[key];
    if (val === null || val === undefined) continue;
    if (typeof val === 'string' && val.trim() === '') continue;
    body[key] = val;
  }
  return body;
}

async function fetchItems(page = 1, limit = 20) {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const bodyData = buildBodyFromFilters(filters.value, viewMode.value);

    const endpoint = viewMode.value === 'normal' ? 'ListaVenta' : 'Venta';
    const response = await fetch(`${config.public.backendHost}/${endpoint}/filter/${page}/${limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (response.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 2000);
      return;
    }
    if (response.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos.', type: 'error' };
      return;
    }

    const data = await response.json();
    // Guardamos los elementos originales en rawItem para acciones/modal
    // Mapear según modo
    if (viewMode.value === 'normal') {
      const mapped = (data.data || []).map(item => {
        // Calcular fecha/hora más común entre ventas
        const ventas = Array.isArray(item.ventas) ? item.ventas : [];
        const dateCount = {};
        const timeCount = {};
        let total = 0;
        const formas = new Set();
        let usuarioNombre = '';
        let usdTotal = 0;

        ventas.forEach(v => {
          if (v.fecha_hora) {
            const d = v.fecha_hora.substring(0, 10);
            const t = v.fecha_hora.substring(11, 19);
            dateCount[d] = (dateCount[d] || 0) + 1;
            timeCount[t] = (timeCount[t] || 0) + 1;
          }
          const precio = parseFloat(v.precio_cobrado) || 0;
          const cantidad = Number(v.cantidad) || 0;
          total += precio * cantidad;
          const cambio = parseFloat(v.cambioUSD_al_vender);
          const usd = (cambio && cambio !== 0) ? (precio / cambio) : 0;
          usdTotal += usd;
          if (v.forma_pago) formas.add(String(v.forma_pago).toLowerCase());
          if (v.usuario && v.usuario.nombre_usuario) usuarioNombre = v.usuario.nombre_usuario;
        });

        function mostCommon(obj) {
          let max = 0; let val = '';
          for (const k in obj) {
            if (obj[k] > max) { max = obj[k]; val = k; }
          }
          return val;
        }

        let formaPago = '';
        const formasArr = Array.from(formas);
        if (formasArr.length === 0) {
          formaPago = '';
        } else if (formasArr.length === 1) {
          // Capitalize each word of the single forma
          formaPago = formasArr[0].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else {
          const hasEfectivo = formasArr.some(s => s.includes('efectivo'));
          const hasTransfer = formasArr.some(s => s.includes('transferencia'));
          if (hasEfectivo && hasTransfer) formaPago = 'Efectivo y Transferencia';
          else {
            formaPago = formasArr.map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' y ');
          }
        }

        const rawHora = mostCommon(timeCount) || (item.createdAt ? item.createdAt.substring(11,19) : '');
        const hora12 = formatTime12(rawHora);

        return {
          fecha: mostCommon(dateCount) || (item.createdAt ? item.createdAt.substring(0,10) : ''),
          hora: hora12,
          nota: item.nota || '',
          totalCobrado: total.toFixed(2),
          totalCobradoUSD: usdTotal.toFixed(2),
          formaPago: formaPago,
          usuario: usuarioNombre || (item.usuario ? item.usuario.nombre_usuario : ''),
          rawItem: item
        };
      });

      itemsData.value = mapped;
      totalItems.value = data.pagination ? data.pagination.total : (mapped.length);
      
      // Calcular totales en USD dividendo por el cambioUSD_al_vender de cada venta
      try {
        let sumPrecioCobradoUSD = 0;
        let sumCostoVentaUSD = 0;
        let sumGananciaTotalUSD = 0;
        let sumEfectivoCUP = 0;
        let sumEfectivoUSD = 0;
        let sumTransferenciaCUP = 0;
        let sumTransferenciaUSD = 0;
        let sumCantidad = 0;
        let sumCostoVenta = 0;
        let sumPrecioCobrado = 0;
        
        (data.data || []).forEach(listItem => {
          const ventasArr = Array.isArray(listItem.ventas) ? listItem.ventas : [];
          ventasArr.forEach(v => {
            const precio = parseFloat(v.precio_cobrado) || 0;
            const cantidad = Number(v.cantidad) || 0;
            const cambio = parseFloat(v.cambioUSD_al_vender) || 0;
            const costo = (parseFloat(v.costo_venta) || parseFloat(v.costoVenta) || 0);
            const formaPago = String(v.forma_pago || '').toLowerCase();
            const cantidadPagadaTransferencia = parseFloat(v.cantidad_pagada_transferencia_cup) || 0;
            
            // Sumar totales generales
            sumCantidad += cantidad;
            sumCostoVenta += costo * cantidad;
            sumPrecioCobrado += precio * cantidad;
            
            if (cambio && cambio !== 0) {
              sumPrecioCobradoUSD += (precio * cantidad) / cambio;
              sumCostoVentaUSD += (costo * cantidad) / cambio;
              sumGananciaTotalUSD += ((precio - costo) * cantidad) / cambio;
            }
            
            // Calcular Suma de Efectivo CUP
            if (formaPago.includes('efectivo')) {
              if (formaPago === 'efectivo cup') {
                // Solo Efectivo CUP: sumar precio * cantidad
                const montoCUP = precio * cantidad;
                sumEfectivoCUP += montoCUP;
              } else if (formaPago.includes('efectivo') && formaPago.includes('transferencia')) {
                // Efectivo y Transferencia: sumar (precio * cantidad - cantidad_pagada_transferencia)
                const montoCUP = (precio * cantidad) - cantidadPagadaTransferencia;
                sumEfectivoCUP += montoCUP;
              }
            }
            
            // Calcular Suma de Transferencia CUP
            if (formaPago.includes('transferencia')) {
              if (formaPago === 'transferencia cup') {
                // Solo Transferencia CUP: sumar precio * cantidad
                const montoCUP = precio * cantidad;
                sumTransferenciaCUP += montoCUP;
              } else if (formaPago.includes('efectivo') && formaPago.includes('transferencia')) {
                // Efectivo y Transferencia: sumar cantidad_pagada_transferencia
                const montoCUP = cantidadPagadaTransferencia;
                sumTransferenciaCUP += montoCUP;
              }
            }
            
            // Calcular Suma de Efectivo USD
            if (formaPago === 'efectivo usd') {
              const montoUSD = (precio * cantidad) / (cambio && cambio !== 0 ? cambio : 1);
              sumEfectivoUSD += montoUSD;
            }
            
            // Calcular Suma de Transferencia USD
            if (formaPago === 'transferencia usd') {
              const montoUSD = (precio * cantidad) / (cambio && cambio !== 0 ? cambio : 1);
              sumTransferenciaUSD += montoUSD;
            }
          });
        });
        
        // Asignar todos los valores calculados a paginationData, sobrescribiendo los del backend
        paginationData.value = data.pagination || {};
        paginationData.value.sumCantidad = sumCantidad;
        paginationData.value.sumCostoVenta = sumCostoVenta;
        paginationData.value.sumPrecioCobrado = sumPrecioCobrado;
        // Nuevo: suma total de todas las ventas (precio_cobrado * cantidad)
        paginationData.value.sumTotalVentas = sumPrecioCobrado;
        paginationData.value.sumPrecioCobradoUSD = sumPrecioCobradoUSD;
        paginationData.value.sumCostoVentaUSD = sumCostoVentaUSD;
        paginationData.value.sumGananciaTotalUSD = sumGananciaTotalUSD;
        paginationData.value.sumEfectivoCUP = sumEfectivoCUP;
        paginationData.value.sumEfectivoUSD = sumEfectivoUSD;
        paginationData.value.sumTransferenciaCUP = sumTransferenciaCUP;
        paginationData.value.sumTransferenciaUSD = sumTransferenciaUSD;
      } catch (e) {
        // Si algo falla, asignar valores del backend
        paginationData.value = data.pagination || {};
        console.error('Error calculando totales:', e);
      }
    } else {
      // modo detallado: cada elemento es una venta individual
        const mapped = (data.data || []).map(item => {
          const rawFecha = item.fecha_hora ? item.fecha_hora.substring(0,10) : (item.createdAt ? item.createdAt.substring(0,10) : '');
          const rawHoraStr = item.fecha_hora ? item.fecha_hora.substring(11,19) : (item.createdAt ? item.createdAt.substring(11,19) : '');
          const hora12 = formatTime12(rawHoraStr);
          const cambio = parseFloat(item.cambioUSD_al_vender);
          const totalUSD = (cambio && cambio !== 0) ? ((parseFloat(item.precio_cobrado) || 0) / cambio) : 0;
          return {
            fecha: rawFecha,
            hora: hora12,
            productoNombre: item.producto ? item.producto.nombre : (item.servicio ? item.servicio.nombre : ''),
            cantidad: item.cantidad,
            precio_cobrado: (parseFloat(item.precio_cobrado) || 0).toFixed(2),
            totalUSD: totalUSD.toFixed(2),
            total: (Number(item.cantidad || 0) * (parseFloat(item.precio_cobrado) || 0)).toFixed(2),
            forma_pago: item.forma_pago || '',
            usuario: item.usuario ? item.usuario.nombre_usuario : '',
            rawItem: item
          };
        });

      itemsData.value = mapped;
      totalItems.value = data.pagination ? data.pagination.total : (mapped.length);
      paginationData.value = data.pagination || {};
    }
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al cargar ventas.', type: 'error' };
  } finally {
    isLoading.value = false;
  }
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems(newPage, itemsPorPage.value);
};

const handleSearch = async () => {
  currentPage.value = 1;
  await fetchItems(1, itemsPorPage.value);
};

const handleModeChange = async () => {
  currentPage.value = 1;
  await fetchItems(1, itemsPorPage.value);
};

const handleItemsPerPageChange = async () => {
  currentPage.value = 1;
  await fetchItems(1, itemsPorPage.value);
};

function openCreateModal() {
  modalMode.value = 'create';
  modalInitialData.value = null;
  showSellModal.value = true;
}

const handleRowClick = (item) => {
  // Open VentaModalSell in view mode instead of VentaModal
  if (viewMode.value === 'normal') {
    modalMode.value = 'view';
    modalInitialData.value = item.rawItem || item;
    showSellModal.value = true;
    return;
  }

  // Detallado: fetch ListaVenta/{id_lista_venta} then open modal in view mode
  (async () => {
    const raw = item.rawItem || item;
    const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
    if (!idLista) {
      errorBanner.value = { title: 'Error', description: 'ID de lista no encontrado.', type: 'error' };
      return;
    }
    try {
      modalLoading.value = true;
      const token = localStorage.getItem('token');
      const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Authorization': token }
      });
      if (resp.status === 401) {
        errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
      modalMode.value = 'view';
      modalInitialData.value = data;
      showSellModal.value = true;
    } catch (err) {
      console.error('Error fetching lista venta:', err);
      errorBanner.value = { title: 'Error', description: 'No se pudo cargar la lista de venta.', type: 'error' };
    } finally {
      modalLoading.value = false;
    }
  })();
};

const handleNewVentas = async (ventasPayload) => {
  // ventasPayload puede ser un array o un objeto { items, nota, formaPago }
  let items = [];
  let nota = '';
  let forma = '';
  if (Array.isArray(ventasPayload)) {
    items = ventasPayload;
  } else if (ventasPayload && ventasPayload.items) {
    items = ventasPayload.items;
    nota = ventasPayload.nota || '';
    forma = ventasPayload.formaPago || '';
  }
  const count = items.length;
  if (ventasPayload && ventasPayload.mode === 'edit') {
    errorBanner.value = { title: 'Ventas actualizadas', description: `${count} venta(s) actualizada(s). ${nota ? 'Nota: ' + nota : ''} ${forma ? 'Forma: ' + forma : ''}`, type: 'success' };
  } else {
    errorBanner.value = { title: 'Ventas creadas', description: `${count} venta(s) listas. ${nota ? 'Nota: ' + nota : ''} ${forma ? 'Forma: ' + forma : ''}`, type: 'success' };
  }
  // refrescar la vista
  await fetchItems(1, itemsPorPage.value);
  // reset modal state
  modalMode.value = 'create';
  modalInitialData.value = null;
  showSellModal.value = false;
};

function openComprobanteFromModal(data) {
  comprobanteData.value = data || null;
  showComprobante.value = true;
}

// printing is handled directly by VentaModalSell now

async function confirmDeleteVenta() {
  showConfirmBanner.value = false;
  if (!ventaAEliminar.value) return;
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const raw = ventaAEliminar.value.raw || {};
    const mode = ventaAEliminar.value.mode || 'normal';
    const endpoint = mode === 'normal' ? 'ListaVenta' : 'Venta';
    let idToDelete = null;
    if (mode === 'normal') idToDelete = raw.id_lista_venta || raw.id_lista_venta;
    else idToDelete = raw.id_venta || raw.id_venta;

    if (!idToDelete) {
      errorBanner.value = { title: 'Error', description: 'ID no encontrado para eliminar.', type: 'error' };
      return;
    }

    const response = await fetch(`${config.public.backendHost}/${endpoint}/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    });

    if (response.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => navigateTo('/'), 2000);
      return;
    }
    if (response.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos.', type: 'error' };
      return;
    }

    let responseData = null;
    try { responseData = await response.json(); } catch (e) { responseData = null; }

    if (!response.ok) {
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
      errorBanner.value = { title: `Error ${response.status}`, description: errorMessage, type: 'error' };
      return;
    }

    errorBanner.value = { title: 'Eliminado', description: 'Elemento eliminado correctamente.', type: 'success' };
    await fetchItems(currentPage.value, itemsPorPage.value);
  } catch (err) {
    console.error('Error al eliminar:', err);
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al eliminar.', type: 'error' };
  } finally {
    isLoading.value = false;
    ventaAEliminar.value = null;
  }
}

onMounted(() => {
  // 🔁 Cargar el cambio de moneda al montar el componente
  loadCambioMoneda();

  // Inicializar filtros de fecha con la fecha actual del dispositivo si están vacíos
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  if (!filters.value.fecha_hora_min) filters.value.fecha_hora_min = dateStr;
  if (!filters.value.fecha_hora_max) filters.value.fecha_hora_max = dateStr;

  fetchItems(1, itemsPorPage.value);
});
</script>

<style scoped>
/* estilos si son necesarios */
</style>
