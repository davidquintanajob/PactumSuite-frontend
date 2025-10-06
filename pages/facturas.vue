<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta
      title="Facturas - Contract Manager"
      description="Lista y gestión de facturas en Contract Manager. Filtra, exporta y administra facturas." 
      canonical="/facturas"
    />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar esta factura?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteFactura"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Consecutivo Entidad</label>
            <input type="text" v-model="consecutivoEntidad" placeholder="Ingrese consecutivo entidad..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Organismo Entidad</label>
            <input type="text" v-model="organismoEntidad" placeholder="Ingrese organismo entidad..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Num. Consecutivo</label>
            <input type="number" v-model.number="num_consecutivo" placeholder="Número consecutivo"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <SelectSearch
              v-model="estado"
              :options="estadoOptions"
              labelKey="label"
              valueKey="value"
              placeholder="Seleccionar estado..."
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input type="date" v-model="fecha_desde" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input type="date" v-model="fecha_hasta" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" @keyup.enter="handleSearch">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Entidad por Nombre</label>
            <SelectSearchAPI
              v-model="id_entidad"
              endpoint="/entidad/filter/1/10"
              method="POST"
              search-key="nombre"
              label-key="nombre"
              value-key="id_entidad"
              placeholder="Buscar entidad por nombre..."
              @entidad-seleccionada="manejarEntidadSeleccionada"
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contrato por número consecutivo</label>
            <SelectSearch
              v-model="id_contrato"
              :options="contratosFiltrados"
              labelKey="displayLabel"
              valueKey="id_contrato"
              :disabled="!id_entidad"
              :class="{ 'opacity-50': !id_entidad }"
              placeholder="Seleccione primero una entidad..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Trabajador Autorizado por Nombre</label>
            <SelectSearchAPI
              v-model="id_trabajador_autorizado"
              endpoint="/trabajadorAutorizado/filter/1/10"
              method="POST"
              search-key="nombre"
              label-key="nombre"
              value-key="id_trabajador"
              placeholder="Buscar trabajador por nombre..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario por Nombre</label>
            <SelectSearchAPI
              v-model="id_usuario"
              endpoint="/Usuario/filterUsers"
              method="POST"
              search-key="nombre_usuario"
              label-key="nombre_usuario"
              value-key="id_usuario"
              placeholder="Buscar usuario por nombre..."
              :direct-data="true"
            />
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <button @click="handleSearch"
            class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button @click="exportToExcel"
            class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors">
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de facturas -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Facturas</h2>
        <button @click="nuevaFactura"
          class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Factura
        </button>
      </div>
      <DataTable :columns="facturasColumns" :items="itemsData" :actions="facturasActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
      <!-- Información resumen debajo de la tabla -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto">
        <h3 class="text-xl font-semibold mb-4">Resumen de Información Filtrada</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="bg-orange-100 text-orange-800 rounded p-3">
            <div class="text-sm font-medium">Suma: Servicios que los Proveedores han prestado</div>
            <div class="text-lg font-bold">Facturado: {{ (paginationData.serviciosProveedoresFacturados ?? 0).toFixed(2) }}</div>
            <div class="text-lg font-bold">No Facturado: {{ ((paginationData.serviciosProveedores ?? 0).toFixed(2) - (paginationData.serviciosProveedoresFacturados ?? 0).toFixed(2)).toFixed(2) }}</div>
            <div class="text-lg font-bold">Total: {{ (paginationData.serviciosProveedores ?? 0).toFixed(2) }}</div>
          </div>
          <div class="bg-blue-100 text-blue-800 rounded p-3">
            <div class="text-sm font-medium">Suma: Servicios prestados a Clientes</div>
            <div class="text-lg font-bold">Facturado: {{ (paginationData.serviciosClientesFacturados ?? 0).toFixed(2) }}</div>
            <div class="text-lg font-bold">No Facturado: {{ ((paginationData.serviciosClientes ?? 0).toFixed(2) - (paginationData.serviciosClientesFacturados ?? 0).toFixed(2)).toFixed(2) }}</div>
            <div class="text-lg font-bold">Total: {{ (paginationData.serviciosClientes ?? 0).toFixed(2) }}</div>
          </div>
          <div class="bg-orange-100 text-orange-800 rounded p-3">
            <div class="text-sm font-medium">Suma: Productos comprados a Proveedores</div>
            <div class="text-lg font-bold">Facturado: {{ (paginationData.productosProveedorFacturados ?? 0).toFixed(2) }}</div>
            <div class="text-lg font-bold">No Facturado: {{ ((paginationData.productosProveedor ?? 0).toFixed(2) - (paginationData.productosProveedorFacturados ?? 0).toFixed(2)).toFixed(2) }}</div>
            <div class="text-lg font-bold">Total: {{ (paginationData.productosProveedor ?? 0).toFixed(2) }}</div>
          </div>
          <div class="bg-blue-100 text-blue-800 rounded p-3">
            <div class="text-sm font-medium">Suma: Productos vendidos a Clientes</div>
            <div class="text-lg font-bold">Facturado: {{ (paginationData.productosClientesFacturados ?? 0).toFixed(2) }}</div>
            <div class="text-lg font-bold">No Facturado: {{ ((paginationData.productosClientes ?? 0).toFixed(2) - (paginationData.productosClientesFacturados ?? 0).toFixed(2)).toFixed(2) }}</div>
            <div class="text-lg font-bold">Total: {{ (paginationData.productosClientes ?? 0).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de Factura -->
    <FacturaModal
      v-model="showModal"
      :factura="selectedFactura"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      :contratos="contratosFiltrados"
      :entidades="[]"
      :trabajadores="[]"
      :usuarios="[]"
      @submit="handleFacturaSubmit"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted, watch } from 'vue';
import Navbar from "@/components/Navbar.vue";
import SeoMeta from '@/components/SeoMeta.vue';
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import SelectSearchAPI from '@/components/SelectSearchAPI.vue';
import FacturaModal from '../components/FacturaModal.vue';
import * as XLSX from 'xlsx';

// Variables de filtros
const consecutivoEntidad = ref('');
const organismoEntidad = ref('');
const num_consecutivo = ref('');
const fecha_desde = ref('');
const fecha_hasta = ref('');
const estado = ref('');
const id_contrato = ref('');
const id_entidad = ref('');
const id_trabajador_autorizado = ref('');
const id_usuario = ref('');

// Opciones para el select de estado
const estadoOptions = ref([
  { label: 'Todos', value: null },
  { label: 'Facturado', value: 'Facturado' },
  { label: 'No Facturado', value: 'No Facturado' },
  { label: 'Cancelado', value: 'Cancelado' }
]);

// Los datos ahora se cargan dinámicamente a través de SelectSearchAPI
const contratosFiltrados = ref([]);
const entidadSeleccionada = ref(null);
const entidadCompleta = ref(null);

// Modal y estado
const showModal = ref(false);
const selectedFactura = ref({});
const isEditing = ref(false);
const isViewing = ref(false);

// Columnas de la tabla
const facturasColumns = [
  { key: 'num_consecutivo', label: 'Num. Consecutivo' },
  { 
    key: 'fecha', 
    label: 'Fecha', 
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
    }
  },
  { 
    key: 'estado', 
    label: 'Estado',
    cellRenderer: (value) => {
      if (!value) return '';
      let bgColor = '';
      if (value === 'Facturado') {
        bgColor = 'bg-green-100 text-green-800';
      } else if (value === 'No Facturado') {
        bgColor = 'bg-yellow-100 text-yellow-800';
      } else if (value === 'Cancelado') {
        bgColor = 'bg-red-100 text-red-800';
      }
      return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
    }
  },
  {
    key: 'contrato.ClienteOProveedor',
    label: 'Cliente o Proveedor',
    cellRenderer: (value) => {
      if (!value) return '';
      const bgColor = value === 'Cliente' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
      return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
    }
  },
  { key: 'contrato.num_consecutivo', label: 'Contrato' },
  { key: 'contrato.tipoContrato.nombre', label: 'Tipo Contrato' },
  { 
    key: 'suma_general', 
    label: 'Importe',
    cellRenderer: (value) => {
      if (value == null || value === '') return '';
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
    }
  },
  { key: 'contrato.entidad.nombre', label: 'Entidad' },
  { key: 'usuario.nombre', label: 'Creado por' }
];

// Paginación y datos
const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(10);
const itemsData = ref([]);
const paginationData = ref({});

// Banners de error y confirmación
const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const facturaAEliminar = ref(null);

const config = useRuntimeConfig();

// Acciones de la tabla
const facturasActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 7.5-7.5z' })
        ]);
      }
    },
    handler: (item) => abrirModalFactura(item, 'editar'),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90'
  },
  {
    name: 'Eliminar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5 text-red-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2' })
        ]);
      }
    },
    handler: (item) => eliminarFactura(item),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90'
  }
];

// Funciones de búsqueda y filtrado
const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchFacturas(1);
  } catch (error) {
    console.error('Error al buscar facturas:', error);
  } finally {
    isLoading.value = false;
  }
};

function handlePageChange(page) {
  fetchFacturas(page);
}

// Abrir modal al hacer click en la fila
function handleRowClick(item) {
  abrirModalFactura(item, 'ver');
}

// Función principal para obtener facturas
async function fetchFacturas(page = 1) {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const body = {
      id_contrato: id_contrato.value || 0,
      id_entidad: id_entidad.value || 0,
      consecutivoEntidad: consecutivoEntidad.value || undefined,
      organismoEntidad: organismoEntidad.value || undefined,
      num_consecutivo: num_consecutivo.value || 0,
      fecha_desde: fecha_desde.value || undefined,
      fecha_hasta: fecha_hasta.value || undefined,
      estado: estado.value || undefined,
      id_trabajador_autorizado: id_trabajador_autorizado.value || 0,
      id_usuario: id_usuario.value || 0
    };
    
    const res = await fetch(`${config.public.backendHost}/Factura/filterFacturas/${page}/${itemsPorPage.value}`, {
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
    paginationData.value = data.pagination;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar las facturas', type: 'error' };
  }
}

// Función para cargar contratos cuando se selecciona una entidad
async function cargarContratosPorEntidad(entidadId) {
  
  if (!entidadId) {
    contratosFiltrados.value = [];
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }

  try {
    const res = await fetch(`${config.public.backendHost}/entidad/${entidadId}`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    if (res.status === 401 || res.status === 403) {
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

    if (res.ok) {
      const data = await res.json();
      entidadSeleccionada.value = data;
      
      // Procesar los contratos para el formato de display
      const contratos = data?.contratos || [];
      
      contratosFiltrados.value = contratos.map(contrato => ({
        ...contrato,
        displayLabel: `${contrato.num_consecutivo} - ${contrato.tipoContrato?.nombre || ''} - ${contrato.ClienteOProveedor || ''}`
      }));
      
    } else {
      console.error('Error en la respuesta:', res.status);
      contratosFiltrados.value = [];
    }
  } catch (err) {
    console.error('Error al cargar contratos:', err);
    contratosFiltrados.value = [];
  }
}

// Funciones del modal
function abrirModalFactura(item, modo) {
  selectedFactura.value = item ? { ...item } : {};
  isEditing.value = modo === 'editar';
  isViewing.value = modo === 'ver';
  showModal.value = true;
}

function nuevaFactura() {
  abrirModalFactura({}, 'crear');
}

function eliminarFactura(item) {
  facturaAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteFactura() {
  if (!facturaAEliminar.value) return;
  const token = localStorage.getItem('token');
  
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/Factura/deleteFactura/${facturaAEliminar.value.id_factura}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
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
      let errorMsg = 'No se pudo eliminar la factura';
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    errorBanner.value = { title: 'Éxito', description: 'Factura eliminada correctamente', type: 'success' };
    fetchFacturas(currentPage.value);
  } catch (err) {
    errorBanner.value = { title: 'Error', description: err.message, type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    facturaAEliminar.value = null;
  }
}

const handleFacturaSubmit = async (formData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    navigateTo('/');
    return;
  }

  try {
    const url = isEditing.value
      ? `${config.public.backendHost}/Factura/updateFactura/${selectedFactura.value.id_factura}`
      : `${config.public.backendHost}/Factura/createFactura`;
    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

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
        description: 'No tienes permisos para realizar esta acción.',
        type: 'error'
      };
      return;
    }

    if (response.status === 400 || response.status === 500) {
      const errorData = await response.json();
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorBanner.value = {
          title: `Errores de validación: ${response.status}`,
          description: errorData.errors.join('\n'),
          type: 'error'
        };
      } else if (errorData.error) {
        errorBanner.value = {
          title: `Error: ${response.status}`,
          description: errorData.error,
          type: 'error'
        };
      } else {
        errorBanner.value = {
          title: `Error: ${response.status}`,
          description: JSON.stringify(errorData),
          type: 'error'
        };
      }
      return;
    }

    if (!response.ok) {
      let errorMsg = 'No se pudo guardar la factura';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }

    // Éxito
    errorBanner.value = {
      title: 'Éxito',
      description: isEditing.value ? 'Factura actualizada correctamente' : 'Factura creada correctamente',
      type: 'success'
    };

    // Cerrar modal y refrescar lista
    showModal.value = false;
    fetchFacturas(currentPage.value);

  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  }
};

// Función de exportación
function exportToExcel() {
  const exportData = itemsData.value.map(item => ({
    'Num. Consecutivo': item.num_consecutivo,
    'Fecha': item.fecha ? item.fecha.substring(0, 10) : '',
    'Estado': item.estado,
    'Creado por': item.usuario?.nombre || '',
    'Cliente o Proveedor': item.contrato?.ClienteOProveedor || '',
    'Contrato': item.contrato?.num_consecutivo || '',
    'Tipo Contrato': item.contrato?.tipoContrato?.nombre || '',
    'Importe': item.suma_general ? parseFloat(item.suma_general).toFixed(2) : '',
    'Entidad': item.contrato?.entidad?.nombre || ''
  }));
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');
  XLSX.writeFile(workbook, 'facturas.xlsx');
}

// Función para manejar cuando se selecciona una entidad
function manejarEntidadSeleccionada(entidadCompleta) {
  entidadCompleta.value = entidadCompleta;
  
  if (entidadCompleta && entidadCompleta.contratos) {
    // Procesar los contratos para el formato de display
    contratosFiltrados.value = entidadCompleta.contratos.map(contrato => ({
      ...contrato,
      displayLabel: `${contrato.num_consecutivo} - ${contrato.tipoContrato?.nombre || ''} - ${contrato.ClienteOProveedor || ''}`
    }));
    
  } else {
    contratosFiltrados.value = [];
  }
  
  // Limpiar selección de contrato
  id_contrato.value = '';
}

// Watcher para detectar cambios en la entidad seleccionada (mantener como respaldo)
watch(id_entidad, (newEntidadId, oldEntidadId) => {
  if (newEntidadId && !entidadCompleta.value) {
    cargarContratosPorEntidad(newEntidadId);
  } else if (!newEntidadId) {
    contratosFiltrados.value = [];
    id_contrato.value = '';
    entidadCompleta.value = null;
  }
}, { immediate: true });

// Cargar datos al montar el componente
onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }
  
  fetchFacturas();
});

// Icono para el banner de confirmación
const deleteIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-6 w-6 text-neutral',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      })
    ])
  }
};
</script>
