<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Entradas - Pactum" description="Lista y gestión de entradas de productos." canonical="/entradas" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar esta entrada?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteEntrada"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Producto por código</label>
            <SelectSearchAPI
              v-model="id_producto"
              endpoint="/Producto/filterProductos/1/10"
              method="POST"
              search-key="codigo"
              label-key="codigo"
              value-key="id_producto"
              placeholder="Buscar producto por código..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contrato por número consecutivo</label>
            <SelectSearch
              v-model="id_contrato"
              :options="contratos"
              labelKey="displayLabel"
              valueKey="id_contrato"
              placeholder="Buscar contrato..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad mínima</label>
            <input type="number" v-model.number="cantidad_min" placeholder="Cantidad min..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad máxima</label>
            <input type="number" v-model.number="cantidad_max" placeholder="Cantidad max..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Costo mínimo</label>
            <input type="number" v-model.number="costo_min" step="any" placeholder="Costo min..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Costo máximo</label>
            <input type="number" v-model.number="costo_max" step="any" placeholder="Costo max..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input type="text" v-model="nota" placeholder="Nota..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" v-model="fecha_desde"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" v-model="fecha_hasta"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2 flex-wrap">
          <button @click="handleSearch"
            class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button v-if="!isInvitado" @click="exportToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de entradas -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Entradas</h2>
        <button v-if="!isInvitado" @click="nuevaEntrada"
          class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Entrada
        </button>
      </div>
      <DataTable :columns="visibleEntradasColumns" :items="itemsData" :actions="isInvitado ? [] : entradasActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
    </div>
    <!-- Modal de Entrada -->
    <EntradaModal
      v-model="showModal"
      :entrada="selectedEntrada"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      :submitHandler="createEntrada"
      @success="onEntradaSuccess"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";
import SeoMeta from '@/components/SeoMeta.vue';
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import SelectSearchAPI from '@/components/SelectSearchAPI.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import EntradaModal from '../components/EntradaModal.vue';
import * as XLSX from 'xlsx';

// Variables de filtros
const id_producto = ref('');
const id_contrato = ref('');
const cantidad_min = ref('');
const cantidad_max = ref('');
const costo_min = ref('');
const costo_max = ref('');
const nota = ref('');
const fecha_desde = ref('');
const fecha_hasta = ref('');

// Variables para contratos
const contratos = ref([]);

// Modal y estado
const showModal = ref(false);
const selectedEntrada = ref({});
const isViewing = ref(false);
const isEditing = ref(false);

// Variables para confirmación de eliminación
const showConfirmBanner = ref(false);
const entradaAEliminar = ref(null);

// Columnas de la tabla
const entradasColumns = [
  { key: 'producto.nombre', label: 'Producto' },
  { key: 'producto.codigo', label: 'Código' },
  { key: 'producto.unidadMedida', label: 'Unidad' },
  { key: 'cantidadEntrada', label: 'Cantidad' },
  {
    key: 'costo',
    label: 'Costo Unitario',
    cellRenderer: (value, item) => {
      const val = (item.costo != null) ? item.costo : (item.producto?.costo != null ? item.producto.costo : null);
      if (val == null || val === '') return '';
      const num = parseFloat(val);
      if (isNaN(num)) return val;
      return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
    }
  },
  {
    key: 'costo_usd',
    label: 'Costo USD',
    cellRenderer: (value, item) => {
      const val = (item.costo_usd != null) ? item.costo_usd : (item.producto?.costo_usd != null ? item.producto.costo_usd : null);
      if (val == null || val === '') return '';
      const num = parseFloat(val);
      if (isNaN(num)) return val;
      return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(5)}</span>`;
    }
  },
  {
    key: 'total',
    label: 'Total',
    cellRenderer: (value, item) => {
      const cantidad = parseFloat(item.cantidadEntrada || 0);
      const costo = parseFloat(item.costo != null ? item.costo : (item.producto?.costo || 0));
      const total = cantidad * costo;
      return `<span class="px-2 py-1 rounded text-sm font-semibold">${total.toFixed(2)}</span>`;
    }
  },
  {
    key: 'total_usd',
    label: 'Total USD',
    cellRenderer: (value, item) => {
      const cantidad = parseFloat(item.cantidadEntrada || 0);
      const cu = parseFloat(item.costo_usd != null ? item.costo_usd : (item.producto?.costo_usd || 0));
      const total = cantidad * cu;
      if (isNaN(total)) return '';
      return `<span class="px-2 py-1 rounded text-sm font-semibold">${total.toFixed(5)}</span>`;
    }
  },
  {
    key: 'fecha',
    label: 'Fecha',
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
    }
  }
];

// Computed columnas visibles (mostrar todas, incluidas columnas USD)
const visibleEntradasColumns = computed(() => {
  return entradasColumns;
});

// Paginación y datos
const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(20);
const itemsData = ref([]);

// Banners de error
const errorBanner = ref(null);

const config = useRuntimeConfig();

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

// Acciones de la tabla (solo ver)
const deleteIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
    ]);
  }
};

const entradasActions = [
  
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
        ]);
      }
    },
    handler: (item) => abrirModalEntrada(item, 'editar'),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90',
    visible: (item) => (!item.id_contrato && !item.id_factura) || (item.id_contrato === '' && item.id_factura === '')
  },
  {
    name: 'Eliminar',
    icon: deleteIcon,
    handler: (item) => eliminarEntrada(item),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90',
    visible: (item) => (!item.id_contrato && !item.id_factura) || (item.id_contrato === '' && item.id_factura === '')
  }
];

// Función para cargar contratos
async function fetchContratos() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${config.public.backendHost}/contrato`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    contratos.value = Array.isArray(data.data) ? data.data.map(contrato => ({
      ...contrato,
      displayLabel: `${contrato.num_consecutivo} - ${contrato.entidad?.nombre || ''} - ${contrato.tipoContrato?.nombre || ''}`
    })) : [];
  } catch (error) {
    console.error('Error al cargar contratos:', error);
  }
}

// Función principal para obtener entradas
async function fetchEntradas(page = 1) {
  const token = localStorage.getItem('token');

  if (!token) {
    navigateTo('/');
    return;
  }

  try {
    isLoading.value = true;
    const body = {
      nota: nota.value || '',
      fecha_desde: fecha_desde.value || '',
      fecha_hasta: fecha_hasta.value || ''
    };

    // Solo incluir id_producto si el usuario ha seleccionado un valor
    if (id_producto.value !== '') {
      body.id_producto = id_producto.value;
    }

    // Solo incluir id_contrato si el usuario ha seleccionado un valor
    if (id_contrato.value !== '') {
      body.id_contrato = id_contrato.value;
    }

    // Solo incluir cantidadEntrada si el usuario ha digitado algún valor
    if (cantidad_min.value !== '' || cantidad_max.value !== '') {
      body.cantidadEntrada = {
        min: cantidad_min.value || 0,
        max: cantidad_max.value || 0
      };
    }

    // Solo incluir costo si el usuario ha digitado algún valor
    if (costo_min.value !== '' || costo_max.value !== '') {
      body.costo = {
        min: costo_min.value || 0,
        max: costo_max.value || 0
      };
    }
    console.log(body);
    
    const res = await fetch(`${config.public.backendHost}/entrada/filterEntradas/${page}/${itemsPorPage.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
    });

    // Manejo de errores: 401 = sesión expirada (redirigir), 403 = permisos denegados
    if (res.status === 401) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }
    if (res.status === 403) {
      errorBanner.value = {
        title: 'Acceso Denegado',
        description: 'No tienes permisos para realizar esta acción o acceder a esta información.',
        type: 'error'
      };
      return;
    }

    const data = await res.json();
    itemsData.value = data.data || [];
    totalItems.value = data.pagination?.total || 0;
    currentPage.value = data.pagination?.currentPage || 1;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar las entradas', type: 'error' };
  } finally {
    isLoading.value = false;
  }
}

// Funciones del modal
function abrirModalEntrada(item, modo) {
  // Verificar si la entrada fue creada por una factura o contrato y se intenta editar
  if ((item.id_factura || item.id_contrato) && modo !== 'ver') {
    errorBanner.value = {
      title: 'Entrada no editable',
      description: 'Esta entrada fue creada por una factura de un proveedor, solo es editable desde la factura misma',
      type: 'warning'
    };
    return;
  }
  
  selectedEntrada.value = { ...item };
  isViewing.value = modo === 'ver';
  isEditing.value = modo === 'editar';
  showModal.value = true;
}

// Abrir modal al hacer click en la fila
function handleRowClick(item) {
  abrirModalEntrada(item, 'ver');
}

function nuevaEntrada() {
  selectedEntrada.value = null;
  isViewing.value = false;
  isEditing.value = false;
  showModal.value = true;
}

function eliminarEntrada(item) {
  // Verificar si la entrada fue creada por una factura o contrato
  if (item.id_factura || item.id_contrato) {
    errorBanner.value = {
      title: 'Entrada no eliminable',
      description: 'Esta entrada fue creada por una factura de un proveedor, solo es eliminable desde la factura misma',
      type: 'warning'
    };
    return;
  }

  // Mostrar banner de confirmación
  entradaAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteEntrada() {
  if (!entradaAEliminar.value) return;
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${config.public.backendHost}/Entrada/deleteEntrada/${entradaAEliminar.value.id_entrada}`, {
      method: 'DELETE',
      headers: { 'Authorization': token, 'Accept': 'application/json' }
    });
    
    if (res.status === 401) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }
    if (res.status === 403) {
      errorBanner.value = {
        title: 'Acceso Denegado',
        description: 'No tienes permisos para realizar esta acción o acceder a esta información.',
        type: 'error'
      };
      return;
    }
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = Array.isArray(err.errors) ? err.errors.join('\n') : (err.error || 'No se pudo eliminar la entrada');
      errorBanner.value = { title: 'Error', description: msg, type: 'error' };
      return;
    }
    
    errorBanner.value = { title: 'Entrada eliminada', description: 'Se eliminó correctamente', type: 'success' };
    await fetchEntradas(currentPage.value);
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al eliminar', type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    entradaAEliminar.value = null;
  }
}

async function handleEntradaSubmit(payload) {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value && selectedEntrada.value?.id_entrada
      ? `${config.public.backendHost}/Entrada/updateEntrada/${selectedEntrada.value.id_entrada}`
      : `${config.public.backendHost}/Entrada/createEntrada`;
    const method = isEditing.value ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Intentar parsear cuerpo de respuesta (si existe) para mostrar errores detallados
    let responseData = null;
    try { responseData = await res.json(); } catch (e) { responseData = null; }

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
    errorBanner.value = { title: isEditing.value ? 'Entrada actualizada' : 'Entrada creada', description: 'Operación exitosa', type: 'success' };
    showModal.value = false;
    selectedEntrada.value = {};
    isEditing.value = false;
    isViewing.value = false;
    await fetchEntradas(currentPage.value);
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al guardar', type: 'error' };
  }
}

// Nueva implementación para que el modal pueda crear/actualizar la entrada
async function createEntrada(payload) {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value && selectedEntrada.value?.id_entrada
      ? `${config.public.backendHost}/Entrada/updateEntrada/${selectedEntrada.value.id_entrada}`
      : `${config.public.backendHost}/Entrada/createEntrada`;
    const method = isEditing.value ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', type: 'warning' };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => { navigateTo('/'); }, 3000);
      throw new Error('Sesión Expirada');
    }
    if (res.status === 403) {
      errorBanner.value = { title: 'Acceso Denegado', description: 'No tienes permisos para realizar esta acción o acceder a esta información.', type: 'error' };
      throw new Error('Acceso Denegado');
    }

    // Intentar parsear cuerpo de respuesta (si existe) para mostrar errores detallados
    let responseData = null;
    try { responseData = await res.json(); } catch (e) { responseData = null; }

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

    const data = await res.json().catch(() => null);
    const created = data && (data.data || data) ? (data.data || data) : null;
    return created;
  } catch (e) {
    throw e;
  }
}

// Maneja el evento `success` emitido por el modal: mostrar banner y recargar lista
async function onEntradaSuccess(payload) {
  try {
    errorBanner.value = { title: payload?.title || 'Entrada creada', description: payload?.description || '', type: 'success' };
    // reset modal state
    showModal.value = false;
    selectedEntrada.value = {};
    isEditing.value = false;
    isViewing.value = false;
    await fetchEntradas(currentPage.value);
  } catch (e) {
    console.error(e);
  }
}

// Funciones de búsqueda y paginación
const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchEntradas(1);
  } catch (error) {
    console.error('Error al buscar entradas:', error);
  } finally {
    isLoading.value = false;
  }
};

function handlePageChange(page) {
  fetchEntradas(page);
}

// Función de exportación
async function exportToExcel() {
  // Mostrar mensaje de consulta de datos
  errorBanner.value = {
    title: 'Consultando datos',
    description: 'Se están consultando los datos, la descarga comenzará en breve.',
    type: 'info'
  };

  try {
    const token = localStorage.getItem('token');

    const bodyData = {
      nota: nota.value || '',
      fecha_desde: fecha_desde.value || '',
      fecha_hasta: fecha_hasta.value || ''
    };

    // Solo incluir id_producto si el usuario ha seleccionado un valor
    if (id_producto.value !== '') {
      bodyData.id_producto = id_producto.value;
    }

    // Solo incluir id_contrato si el usuario ha seleccionado un valor
    if (id_contrato.value !== '') {
      bodyData.id_contrato = id_contrato.value;
    }

    // Solo incluir cantidadEntrada si el usuario ha digitado algún valor
    if (cantidad_min.value !== '' || cantidad_max.value !== '') {
      bodyData.cantidadEntrada = {
        min: cantidad_min.value || 0,
        max: cantidad_max.value || 0
      };
    }

    // Solo incluir costo si el usuario ha digitado algún valor
    if (costo_min.value !== '' || costo_max.value !== '') {
      bodyData.costo = {
        min: costo_min.value || 0,
        max: costo_max.value || 0
      };
    }

    const response = await fetch(`${config.public.backendHost}/entrada/filterEntradas/1/${totalItems.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    // Manejo de errores
    if (response.status === 401) {
      errorBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning'
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }
    if (response.status === 403) {
      errorBanner.value = {
        title: 'Acceso Denegado',
        description: 'No tienes permisos para realizar esta acción o acceder a esta información.',
        type: 'error'
      };
      return;
    }
    if (!response.ok) {
      const errorData = await response.json();
      errorBanner.value = {
        title: 'Error al consultar datos',
        description: errorData.error || 'Ocurrió un error al consultar los datos.',
        type: 'error'
      };
      return;
    }

    const data = await response.json();

    // Mapear los datos a las columnas requeridas en el orden especificado (usar costo y costo_usd)
    const exportData = data.data.map(item => {
      const costoUnit = Number(item.costo != null ? item.costo : (item.producto?.costo || 0));
      const costoUsdUnit = Number(item.costo_usd != null ? item.costo_usd : (item.producto?.costo_usd || 0));
      const cantidadNum = Number(item.cantidadEntrada || 0);
      return {
        'Producto': item.producto?.nombre || '',
        'Código': item.producto?.codigo || '',
        'Unidad': item.producto?.unidadMedida || '',
        'Cantidad': item.cantidadEntrada,
        'Costo Unitario': costoUnit.toFixed(2),
        'Costo USD': costoUsdUnit.toFixed(5),
        'Total': (cantidadNum * costoUnit).toFixed(2),
        'Total USD': (cantidadNum * costoUsdUnit).toFixed(5),
        'Fecha': item.fecha ? item.fecha.substring(0, 10) : '',
        'Nota': item.nota || '',
        'Contrato': item.contrato?.num_consecutivo || '',
        'Entidad': item.contrato?.entidad?.nombre || ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entradas');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `entradas_${date}.xlsx`);

    // Limpiar el banner después de la exportación
    errorBanner.value = null;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    errorBanner.value = {
      title: 'Error',
      description: 'Ocurrió un error al exportar los datos.',
      type: 'error'
    };
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }

  await fetchContratos();
  await fetchEntradas();
});
</script>
