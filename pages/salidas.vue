<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Salidas - Pactum" description="Lista y gestión de salidas de productos." canonical="/salidas" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar esta salida?'"
        :description="'Esta acción no se puede deshacer.'"
        :icon="deleteIcon"
        type="warning"
        @confirm="confirmDeleteSalida"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input type="text" v-model="descripcion" placeholder="Descripción..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
            <input type="text" v-model="producto_nombre" placeholder="Nombre del producto..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <input type="text" v-model="usuario_nombre" placeholder="Nombre de usuario..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <div class="flex justify-end mt-4">
          <button @click="handleSearch"
            class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
            Buscar
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de salidas -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Salidas</h2>
        <button v-if="!isInvitado" @click="nuevaSalida"
          class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Salida
        </button>
      </div>
      <DataTable :columns="salidasColumns" :items="itemsData" :actions="isInvitado ? [] : salidasActions" :total-items="totalItems"
        :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
    </div>
    <!-- Modal de Salida -->
    <SalidaModal
      v-model="showModal"
      :salida="selectedSalida"
      :is-editing="isEditing"
      :is-viewing="isViewing"
      @submit="handleSalidaSubmit"
    />
  </div>
</template>

<script setup>
import { ref, h, onMounted, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";
import SeoMeta from '@/components/SeoMeta.vue';
import DataTable from "@/components/DataTable.vue";
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import SalidaModal from '../components/SalidaModal.vue';

// Variables de filtros
const descripcion = ref('');
const fecha_desde = ref('');
const fecha_hasta = ref('');
const producto_nombre = ref('');
const usuario_nombre = ref('');
const cantidad_min = ref('');
const cantidad_max = ref('');

// Modal y estado
const showModal = ref(false);
const selectedSalida = ref({});
const isViewing = ref(false);
const isEditing = ref(false);

// Variables para confirmación de eliminación
const showConfirmBanner = ref(false);
const salidaAEliminar = ref(null);

// Columnas de la tabla
const salidasColumns = [
  {
    key: 'fecha',
    label: 'Fecha',
    cellRenderer: (value) => {
      if (!value) return '';
      const fechaFormateada = value.substring(0, 10);
      return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
    }
  },
  { key: 'producto.nombre', label: 'Producto' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'usuario.nombre', label: 'Usuario' },
];

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

// Acciones de la tabla
const deleteIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
    ]);
  }
};

const salidasActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
        ]);
      }
    },
    handler: (item) => abrirModalSalida(item, 'editar'),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90',
  },
  {
    name: 'Eliminar',
    icon: deleteIcon,
    handler: (item) => eliminarSalida(item),
    iconOnly: false,
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90',
  }
];

// Función principal para obtener salidas
async function fetchSalidas(page = 1) {
  const token = localStorage.getItem('token');

  if (!token) {
    navigateTo('/');
    return;
  }

  try {
    isLoading.value = true;
    const body = {
      descripcion: descripcion.value || undefined,
      fecha_desde: fecha_desde.value || undefined,
      fecha_hasta: fecha_hasta.value || undefined,
      producto_nombre: producto_nombre.value || undefined,
      usuario_nombre: usuario_nombre.value || undefined,
    };

    if (cantidad_min.value !== '' || cantidad_max.value !== '') {
      body.cantidad = {};
      if (cantidad_min.value !== '') {
        body.cantidad.min = cantidad_min.value;
      }
      if (cantidad_max.value !== '') {
        body.cantidad.max = cantidad_max.value;
      }
    }

    const res = await fetch(`${config.public.backendHost}/salida/filterSalidas/${page}/${itemsPorPage.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
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

    const data = await res.json();
    itemsData.value = data.data || [];
    totalItems.value = data.pagination?.total || 0;
    currentPage.value = data.pagination?.currentPage || 1;
  } catch (err) {
    errorBanner.value = { title: 'Error', description: 'No se pudieron cargar las salidas', type: 'error' };
  } finally {
    isLoading.value = false;
  }
}

// Funciones del modal
function abrirModalSalida(item, modo) {
  selectedSalida.value = { ...item };
  isViewing.value = modo === 'ver';
  isEditing.value = modo === 'editar';
  showModal.value = true;
}

function handleRowClick(item) {
  abrirModalSalida(item, 'ver');
}

function nuevaSalida() {
  selectedSalida.value = null;
  isViewing.value = false;
  isEditing.value = false;
  showModal.value = true;
}

function eliminarSalida(item) {
  salidaAEliminar.value = item;
  showConfirmBanner.value = true;
}

async function confirmDeleteSalida() {
  if (!salidaAEliminar.value) return;
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${config.public.backendHost}/salida/deleteSalida/${salidaAEliminar.value.id_salida}`, {
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
      const msg = Array.isArray(err.errors) ? err.errors.join('\n') : (err.error || 'No se pudo eliminar la salida');
      errorBanner.value = { title: 'Error', description: msg, type: 'error' };
      return;
    }
    
    errorBanner.value = { title: 'Salida eliminada', description: 'Se eliminó correctamente', type: 'success' };
    await fetchSalidas(currentPage.value);
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al eliminar', type: 'error' };
  } finally {
    showConfirmBanner.value = false;
    salidaAEliminar.value = null;
  }
}

async function handleSalidaSubmit(payload) {
  try {
    const token = localStorage.getItem('token');
    const url = isEditing.value && selectedSalida.value?.id_salida
      ? `${config.public.backendHost}/salida/updateSalida/${selectedSalida.value.id_salida}`
      : `${config.public.backendHost}/salida/createSalida`;
    const method = isEditing.value ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = Array.isArray(err.errors) ? err.errors.join('\n') : (err.error || 'Error en la operación');
      errorBanner.value = { title: 'Error', description: msg, type: 'error' };
      return;
    }
    errorBanner.value = { title: isEditing.value ? 'Salida actualizada' : 'Salida creada', description: 'Operación exitosa', type: 'success' };
    showModal.value = false;
    selectedSalida.value = {};
    isEditing.value = false;
    isViewing.value = false;
    await fetchSalidas(currentPage.value);
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al guardar', type: 'error' };
  }
}

// Funciones de búsqueda y paginación
const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchSalidas(1);
  } catch (error) {
    console.error('Error al buscar salidas:', error);
  } finally {
    isLoading.value = false;
  }
};

function handlePageChange(page) {
  fetchSalidas(page);
}

// Cargar datos al montar el componente
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigateTo('/');
    return;
  }
  await fetchSalidas();
});
</script>
