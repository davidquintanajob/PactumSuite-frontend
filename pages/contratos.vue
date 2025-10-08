<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta
      title="Contratos - Contract Manager"
      description="Lista y gestión de contratos en Contract Manager. Filtra, exporta y administra contratos." 
      canonical="/contratos"
    />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar este contrato?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteContrato"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por entidad</label>
          <div class="relative">
            <input type="text" v-model="nombre_entidad" placeholder="Ingrese el nombre de la entidad..."
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
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de contrato</label>
            <SelectSearch
              v-model="id_tipo_contrato"
              :options="tipoContratos"
              labelKey="nombre"
              valueKey="id_tipo_contrato"
              placeholder="Buscar tipo de contrato..."
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input type="date" v-model="fecha_inicio" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input type="date" v-model="fecha_fin" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Num. consecutivo</label>
            <input type="number" v-model.number="num_consecutivo" placeholder="Número consecutivo"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente o Proveedor</label>
            <SelectSearch
              v-model="clienteOProveedor"
              :options="clienteOProveedorOptions"
              labelKey="label"
              valueKey="value"
              placeholder="Seleccionar..."
            />
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2 flex-wrap">
          <button @click="handleSearch"
            class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button @click="exportToExcel"
            class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel
          </button>
          <button @click="exportToExcelWithFacturas"
            class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel con Facturas
          </button>
          <button @click="exportToExcelWithFichaCliente"
            class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel con Ficha de Cliente
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de contratos -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Contratos</h2>
        <button @click="nuevoContrato"
          class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Contrato
        </button>
      </div>
      <DataTable :columns="contratosColumns" :items="itemsData" :actions="contratosActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
    </div>
    <!-- Modal de Contrato (estructura base, puedes personalizarla luego) -->
    <ContratoModal
      v-model="showModal"
      :contrato="selectedContrato"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      :entidades="entidades"
      :tipos-contrato="tipoContratos"
      @submit="handleContratoSubmit"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import Navbar from "@/components/Navbar.vue";
import SeoMeta from '@/components/SeoMeta.vue';
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import SelectSearch from '@/components/SelectSearch.vue';
import ContratoModal from '@/components/ContratoModal.vue';
import * as XLSX from 'xlsx';

const nombre_entidad = ref('');
const id_tipo_contrato = ref('');
const fecha_inicio = ref('');
const fecha_fin = ref('');
const num_consecutivo = ref('');
const clienteOProveedor = ref('');
const showFilters = ref(false);

const clienteOProveedorOptions = ref([
  { label: 'Todos', value: '' },
  { label: 'Cliente', value: 'Cliente' },
  { label: 'Proveedor', value: 'Proveedor' }
]);

const tipoContratos = ref([]);
const entidades = ref([]);

const showModal = ref(false);
const selectedContrato = ref({});
const isEditing = ref(false);
const isViewing = ref(false);

const contratosColumns = [
  { key: 'num_consecutivo', label: 'Num. Consecutivo' },
  { 
    key: 'fecha_inicio', 
    label: 'Fecha Inicio', 
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
    }
  },
  { 
    key: 'fecha_fin', 
    label: 'Fecha Fin', 
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      const fechaActual = new Date();
      const fechaFin = new Date(value);
      
      // Si la fecha actual es mayor que la fecha fin, fondo rojo (vencido)
      // Si no, fondo verde (vigente)
      const bgColor = fechaActual > fechaFin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
      
      return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${fechaFormateada}</span>`;
    }
  },
  { key: 'clasificacion', label: 'Clasificación', class: 'w-1/2 whitespace-normal break-words' },
  {
    key: 'ClienteOProveedor',
    label: 'Cliente o Proveedor',
    cellRenderer: (value) => {
      if (!value) return '';
      const bgColor = value === 'Cliente' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
      return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${value}</span>`;
    }
  },
  { key: 'entidad.nombre', label: 'Entidad' },
  { key: 'tipoContrato.nombre', label: 'Tipo de Contrato' }
];

const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const itemsPorPage = ref(10);
const itemsData = ref([]);

const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const contratoAEliminar = ref(null);

const config = useRuntimeConfig();

const contratosActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 7.5-7.5z' })
        ]);
      }
    },
    handler: (item) => abrirModalContrato(item, 'editar'),
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
    handler: (item) => eliminarContrato(item),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90'
  }
];

const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchContratos(1);
  } catch (error) {
    console.error('Error al buscar contratos:', error);
  } finally {
    isLoading.value = false;
  }
};

function handlePageChange(page) {
  fetchContratos(page);
}

// Abrir modal al hacer click en la fila
function handleRowClick(item) {
  abrirModalContrato(item, 'ver');
}

async function fetchContratos(page = 1) {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const body = {
      nombre_entidad: nombre_entidad.value || undefined,
      id_tipo_contrato: id_tipo_contrato.value || undefined,
      fecha_inicio: fecha_inicio.value || undefined,
      fecha_fin: fecha_fin.value || undefined,
      num_consecutivo: num_consecutivo.value || undefined,
      ClienteOProveedor: clienteOProveedor.value || undefined
    };
    const res = await fetch(`${config.public.backendHost}/contrato/filter/${page}/${itemsPorPage.value}`, {
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
    // Formatear fechas para mostrar solo YYYY-MM-DD
    itemsData.value = (data.data || []).map(c => ({
      ...c,
      fecha_inicio: c.fecha_inicio ? c.fecha_inicio.substring(0, 10) : '',
      fecha_fin: c.fecha_fin ? c.fecha_fin.substring(0, 10) : ''
    }));
    totalItems.value = data.pagination?.total || 0;
    currentPage.value = data.pagination?.currentPage || 1;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar los contratos', type: 'error' };
  }
}

async function fetchTipoContratos() {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/tipoContrato`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
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
    tipoContratos.value = data.data || [];
  } catch (err) {
    tipoContratos.value = [];
  }
}

async function fetchEntidades() {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/entidad`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
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
    entidades.value = data.data || [];
  } catch (err) {
    entidades.value = [];
  }
}

function abrirModalContrato(item, modo) {
  selectedContrato.value = item ? { ...item } : {};
  isEditing.value = modo === 'editar';
  isViewing.value = modo === 'ver';
  showModal.value = true;
}

async function nuevoContrato() {
  if (!entidades.value.length) await fetchEntidades();
  if (!tipoContratos.value.length) await fetchTipoContratos();
  abrirModalContrato({}, 'crear');
}

function eliminarContrato(item) {
  contratoAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteContrato() {
  if (!contratoAEliminar.value) return;
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const res = await fetch(`${config.public.backendHost}/contrato/deleteContrato/${contratoAEliminar.value.id_contrato}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });
    
    // Verificar si hay error de autenticación
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
      let errorMsg = 'No se pudo eliminar el contrato';
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    errorBanner.value = { title: 'Éxito', description: 'Contrato eliminado correctamente', type: 'success' };
    fetchContratos(currentPage.value);
  } catch (err) {
    errorBanner.value = { title: 'Error', description: err.message, type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    contratoAEliminar.value = null;
  }
}

const handleContratoSubmit = async (formData) => {
  const token = localStorage.getItem('token');
  
  // Verificar si hay token
  if (!token) {
    navigateTo('/');
    return;
  }
  
  try {
    const url = isEditing.value
      ? `${config.public.backendHost}/contrato/UpdateContrato/${selectedContrato.value.id_contrato}`
      : `${config.public.backendHost}/contrato/createContrato`;
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
        description: 'No tienes permisos para realizar esta acción o acceder a esta información.',
        type: 'error'
      };
      return;
    }
    if (response.status === 400 || response.status === 500) {
      const errorData = await response.json();
      if (errorData.error) {
        errorBanner.value = {
          title: `Errores de validación: ${response.status}`,
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
    if (response.ok) {
      if (isEditing.value) {
        errorBanner.value = {
          title: `Contrato Actualizado: ${response.status}`,
          description: `El contrato se actualizó con éxito`,
          type: 'success'
        };
      } else {
        errorBanner.value = {
          title: `Contrato Creado: ${response.status}`,
          description: `El contrato se creó con éxito`,
          type: 'success'
        };
      }
      showModal.value = false;
      await fetchContratos(currentPage.value);
    } else {
      console.error('Error al guardar el contrato');
    }
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  }
};

async function exportToExcel() {
  // Mostrar mensaje de consulta de datos
  errorBanner.value = {
    title: 'Consultando datos',
    description: 'Se están consultando los datos, la descarga comenzará en breve.',
    type: 'info'
  };

  try {
    const token = localStorage.getItem('token');

    // Datos para el body
    const bodyData = {
      nombre_entidad: nombre_entidad.value || undefined,
      id_tipo_contrato: id_tipo_contrato.value || undefined,
      fecha_inicio: fecha_inicio.value || undefined,
      fecha_fin: fecha_fin.value || undefined,
      num_consecutivo: num_consecutivo.value || undefined,
      ClienteOProveedor: clienteOProveedor.value || undefined
    };

    const response = await fetch(`${config.public.backendHost}/contrato/filter/1/${totalItems.value}`, {
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

    // Mapear los datos a las columnas requeridas en el orden especificado
    const exportData = data.data.map(item => ({
      'Num. Consecutivo': item.num_consecutivo,
      'Fecha Inicio': item.fecha_inicio ? item.fecha_inicio.substring(0, 10) : '',
      'Fecha Fin': item.fecha_fin ? item.fecha_fin.substring(0, 10) : '',
      'Clasificación': item.clasificacion,
      'Cliente o Proveedor': item.ClienteOProveedor,
      'Entidad': item.entidad?.nombre,
      'Tipo de Contrato': item.tipoContrato?.nombre,
      'Vigencia de pago/cobro facturas (días)': item.vigenciaFacturasDias,
      'Nota': item.nota
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `contratos_${date}.xlsx`);

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

// Función para exportar a Excel con facturas
async function exportToExcelWithFacturas() {
  // Mostrar mensaje de consulta de datos
  errorBanner.value = {
    title: 'Consultando datos',
    description: 'Se están consultando los datos, la descarga comenzará en breve.',
    type: 'info'
  };

  try {
    const token = localStorage.getItem('token');

    // Datos para el body
    const bodyData = {
      nombre_entidad: nombre_entidad.value || undefined,
      id_tipo_contrato: id_tipo_contrato.value || undefined,
      fecha_inicio: fecha_inicio.value || undefined,
      fecha_fin: fecha_fin.value || undefined,
      num_consecutivo: num_consecutivo.value || undefined,
      ClienteOProveedor: clienteOProveedor.value || undefined
    };

    const response = await fetch(`${config.public.backendHost}/contrato/filter/1/${totalItems.value}`, {
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

    // Mapear los datos a las columnas requeridas, incluyendo facturas
    const exportData = [];
    data.data.forEach(contrato => {
      if (contrato.facturas && contrato.facturas.length > 0) {
        contrato.facturas.forEach(factura => {
          exportData.push({
            // Campos de contrato
            'Num. Consecutivo Contrato': contrato.num_consecutivo,
            'Fecha Inicio Contrato': contrato.fecha_inicio ? contrato.fecha_inicio.substring(0, 10) : '',
            'Fecha Fin Contrato': contrato.fecha_fin ? contrato.fecha_fin.substring(0, 10) : '',
            'Clasificación Contrato': contrato.clasificacion,
            'Cliente o Proveedor': contrato.ClienteOProveedor,
            'Entidad': contrato.entidad?.nombre,
            'Tipo de Contrato': contrato.tipoContrato?.nombre,
            'Vigencia Facturas (días)': contrato.vigenciaFacturasDias,
            'Nota Contrato': contrato.nota,
            // Campos de factura
            'Num. Consecutivo Factura': factura.num_consecutivo,
            'Fecha Factura': factura.fecha ? factura.fecha.substring(0, 10) : '',
            'Estado Factura': factura.estado,
            'Nota Factura': factura.nota,
            'Suma Servicios': Number(factura.suma_servicios).toFixed(2),
            'Suma Productos': Number(factura.suma_productos).toFixed(2),
            'Suma General': Number(factura.suma_general).toFixed(2)
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos con Facturas');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `contratos_facturas_${date}.xlsx`);

    // Limpiar el banner después de la exportación
    errorBanner.value = null;
  } catch (error) {
    console.error('Error al exportar a Excel con facturas:', error);
    errorBanner.value = {
      title: 'Error',
      description: 'Ocurrió un error al exportar los datos.',
      type: 'error'
    };
  }
}

// Función para exportar a Excel con ficha de cliente
async function exportToExcelWithFichaCliente() {
  // Mostrar mensaje de consulta de datos
  errorBanner.value = {
    title: 'Consultando datos',
    description: 'Se están consultando los datos, la descarga comenzará en breve.',
    type: 'info'
  };

  try {
    const token = localStorage.getItem('token');

    // Datos para el body
    const bodyData = {
      nombre_entidad: nombre_entidad.value || undefined,
      id_tipo_contrato: id_tipo_contrato.value || undefined,
      fecha_inicio: fecha_inicio.value || undefined,
      fecha_fin: fecha_fin.value || undefined,
      num_consecutivo: num_consecutivo.value || undefined,
      ClienteOProveedor: clienteOProveedor.value || undefined
    };

    const response = await fetch(`${config.public.backendHost}/contrato/filter/1/${totalItems.value}`, {
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

    // Crear filas para cada trabajador autorizado
    const exportData = [];
    data.data.forEach(contrato => {
      if (contrato.trabajadoresAutorizados && contrato.trabajadoresAutorizados.length > 0) {
        contrato.trabajadoresAutorizados.forEach(trabajador => {
          exportData.push({
            // Información del contrato
            'Num. Consecutivo Contrato': contrato.num_consecutivo,
            'Fecha Inicio Contrato': contrato.fecha_inicio ? contrato.fecha_inicio.substring(0, 10) : '',
            'Fecha Fin Contrato': contrato.fecha_fin ? contrato.fecha_fin.substring(0, 10) : '',
            'Clasificación Contrato': contrato.clasificacion,
            'Cliente o Proveedor': contrato.ClienteOProveedor,
            'Tipo de Contrato': contrato.tipoContrato?.nombre,
            'Vigencia Facturas (días)': contrato.vigenciaFacturasDias,
            'Nota Contrato': contrato.nota,
            // Información de la entidad
            'Nombre Entidad': contrato.entidad?.nombre,
            'Dirección Entidad': contrato.entidad?.direccion,
            'Teléfono Entidad': contrato.entidad?.telefono,
            'Email Entidad': contrato.entidad?.email,
            'Tipo de Entidad': contrato.entidad?.tipo_entidad,
            // Información del trabajador autorizado
            'Nombre Trabajador': trabajador.nombre,
            'Cargo Trabajador': trabajador.cargo,
            'Función Trabajador': trabajador.funcion,
            'Carnet Identidad': trabajador.carnet_identidad,
            'Teléfono Trabajador': trabajador.num_telefono
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ficha de Clientes');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `ficha_clientes_${date}.xlsx`);

    // Limpiar el banner después de la exportación
    errorBanner.value = null;
  } catch (error) {
    console.error('Error al exportar ficha de cliente:', error);
    errorBanner.value = {
      title: 'Error',
      description: 'Ocurrió un error al exportar los datos.',
      type: 'error'
    };
  }
}

onMounted(() => {
  // Verificar si hay token antes de hacer las peticiones
  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }
  
  fetchEntidades();
  fetchTipoContratos();
  fetchContratos();
});

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