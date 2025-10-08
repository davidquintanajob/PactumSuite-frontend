<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Servicios - Contract Manager" description="Lista de servicios." canonical="/servicios" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 md:mb-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por descripción</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchDescripcion"
                placeholder="Ingrese la descripción..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                @keyup.enter="handleSearch"
              >
              <div class="absolute left-3 top-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <button @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button @click="exportToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de Servicios -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Servicios</h2>
      </div>
      <DataTable
        :columns="serviciosColumns"
        :items="serviciosData"
        :total-items="serviciosData.length"
        :items-per-page="1000"
        :current-page="1"
        :is-loading="isLoading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from '@/components/Navbar.vue';
import DataTable from '@/components/DataTable.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import { useRouter } from 'nuxt/app';
import * as XLSX from 'xlsx';

const { navigateTo } = useRouter();

const searchDescripcion = ref('');
const serviciosData = ref([]);
const isLoading = ref(false);
const errorBanner = ref(null);

const serviciosColumns = [
  { key: 'descripcion', label: 'Descripción' },
  { key: 'importe', label: 'Importe' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'importe_total', label: 'Importe Total' },
  { key: 'unidadMedida', label: 'Unidad de Medida' },
  { key: 'factura.num_consecutivo', label: 'Número Consecutivo Factura' }
];

const fetchServicios = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const body = {
      descripcion: searchDescripcion.value
    };
    const res = await fetch(`${config.public.backendHost}/Servicio/filter`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    serviciosData.value = Array.isArray(data) ? data : [];
  } catch (error) {
    serviciosData.value = [];
    errorBanner.value = {
      title: 'Error',
      description: 'Error al cargar los servicios.',
      type: 'error'
    };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchServicios();
});

const handleSearch = async () => {
  try {
    await fetchServicios();
  } catch (error) {
    console.error('Error al buscar servicios:', error);
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
    const config = useRuntimeConfig();

    // Datos para el body
    const bodyData = {
      descripcion: searchDescripcion.value
    };

    const response = await fetch(`${config.public.backendHost}/Servicio/filter`, {
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
    const exportData = data.map(item => ({
      'Descripción': item.descripcion,
      'Importe': Number(item.importe).toFixed(2),
      'Cantidad': item.cantidad,
      'Importe Total': Number(item.importe_total).toFixed(2),
      'Unidad de Medida': item.unidadMedida,
      'Número Consecutivo Factura': item.factura?.num_consecutivo || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `servicios_${date}.xlsx`);

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
</script>
