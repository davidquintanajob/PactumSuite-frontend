<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Productos - Contract Manager" description="Registra y gestiona productos." canonical="/productos" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner"
      class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner :title="'¿Estás seguro que deseas eliminar este producto?'"
        :description="'Esta acción no se puede deshacer.'" type="warning" @confirm="confirmDeleteProducto"
        @close="showConfirmBanner = false" />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div v-if="activeTab === 'productos'" class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 md:mb-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por código</label>
            <div class="relative">
              <input type="text" v-model="searchCodigo" placeholder="Ingrese el código..."
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <input type="text" v-model="searchNombre" placeholder="Ingrese el nombre..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch" />
          </div>
          <div class="flex space-x-2">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
              <input type="number" v-model="searchPrecioMin" placeholder="Precio min..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
              <input type="number" v-model="searchPrecioMax" placeholder="Precio max..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input type="text" v-model="searchNota" placeholder="Nota..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch" />
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2 flex-wrap">
          <button @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button v-if="!isVendedor" @click="exportToExcel"
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
          <button v-if="!isVendedor" @click="exportToExcelWithVentasCompras"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Exportar Ventas y Compras
          </button>
        </div>
      </div>
      <div class="flex justify-between items-center mb-4 mt-2">
        <div class="flex items-center gap-2 flex-wrap">
          <button v-if="!isVendedor" @click="activeTab = 'productos'"
            :class="['px-4 py-2 rounded-lg border transition-colors', activeTab === 'productos' ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100']">
            Productos
          </button>
          <button v-if="!isVendedor" @click="activeTab = 'ventas'"
            :class="['px-4 py-2 rounded-lg border transition-colors', activeTab === 'ventas' ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100']">
            Ventas de facturas
          </button>
        </div>
        <button v-if="!isVendedor" @click="nuevaProducto"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>
    </div>
    <!-- Tabla de Productos -->
    <div v-if="activeTab === 'productos'" class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Productos</h2>
      </div>
      <DataTable :columns="visibleProductosColumns" :items="productosData" :actions="visibleProductosActions"
        :total-items="totalProductos" :items-per-page="itemsPorPage" :current-page="currentPage" :is-loading="isLoading"
        @page-change="handlePageChange" @row-click="handleRowClick" />
    </div>
    <!-- Sección de Ventas -->
    <div v-if="activeTab === 'ventas'" class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Ventas</h2>
      </div>

      <!-- Filtros Ventas (placeholders sin conexión) -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código de producto</label>
            <input type="text" v-model="ventasSearchCodigo" placeholder="Código..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de producto</label>
            <input type="text" v-model="ventasSearchNombre" placeholder="Nombre..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">N° consecutivo factura</label>
            <input type="number" v-model="ventasSearchConsecutivo" placeholder="Consecutivo..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado factura</label>
            <select v-model="ventasSearchEstado"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Todos</option>
              <option value="Facturado">Facturado</option>
              <option value="No Facturado">No Facturado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" v-model="ventasSearchDesde"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" v-model="ventasSearchHasta"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
            <input type="number" v-model="ventasPrecioMin" placeholder="Mínimo..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
            <input type="number" v-model="ventasPrecioMax" placeholder="Máximo..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="flex justify-end gap-2 flex-wrap">
          <button @click="exportVentasToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel
          </button>
          <button @click="handleVentasSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Buscar</button>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button @click="activeTab = 'productos'"
          :class="['px-4 py-2 rounded-lg border transition-colors', activeTab === 'productos' ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100']">
          Productos
        </button>
        <button @click="activeTab = 'ventas'"
          :class="['px-4 py-2 rounded-lg border transition-colors', activeTab === 'ventas' ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100']">
          Ventas de facturas
        </button>
      </div>
      <!-- Tabla Ventas -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Ventas</h2>
      </div>
      <DataTable :columns="ventasColumns" :items="ventasData" :actions="ventasActions" :total-items="totalVentas"
        :items-per-page="itemsPorPage" :current-page="ventasCurrentPage" :is-loading="ventasLoading"
        @page-change="handleVentasPageChange" />
    </div>
    <!-- Modal de Producto -->
    <ProductoModal v-model="showModal" :producto="selectedProducto" :is-editing="isEditing" :is-viewing="isViewing"
      @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, onMounted, h, watch, computed } from 'vue';
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from '@/components/Navbar.vue';
import DataTable from '@/components/DataTable.vue';
import ProductoModal from '@/components/ProductoModal.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import { useRouter } from 'nuxt/app';
import * as XLSX from 'xlsx';

const { navigateTo } = useRouter();

const searchCodigo = ref('');
const searchNombre = ref('');
const searchPrecioMin = ref('');
const searchPrecioMax = ref('');
const searchNota = ref('');
const productosData = ref([]);
const totalProductos = ref(0);
const itemsPorPage = ref(10);
const currentPage = ref(1);
const isLoading = ref(false);
const showModal = ref(false);
const selectedProducto = ref(null);
const isEditing = ref(false);
const isViewing = ref(false);
const errorBanner = ref(null);
const showConfirmBanner = ref(false);
const productoAEliminar = ref(null);
const activeTab = ref('productos');

// Estado para Ventas
const ventasData = ref([]);
const totalVentas = ref(0);
const ventasCurrentPage = ref(1);
const ventasLoading = ref(false);

// Filtros (placeholders, sin conexión por ahora)
const ventasSearchCodigo = ref('');
const ventasSearchNombre = ref('');
const ventasSearchConsecutivo = ref('');
const ventasSearchEstado = ref('');
const ventasSearchDesde = ref('');
const ventasSearchHasta = ref('');
const ventasPrecioMin = ref('');
const ventasPrecioMax = ref('');

const ventasColumns = [
  { key: 'productoCodigo', label: 'Código' },
  { key: 'productoNombre', label: 'Nombre' },
  { key: 'productoUnidad', label: 'Unidad de Medida' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'precioVenta', label: 'Precio Venta' },
  { key: 'total', label: 'Total (Cant x Precio)' },
  { key: 'numConsecutivo', label: 'N° Consecutivo factura' },
  { key: 'fechaFactura', label: 'Fecha' }
];

const ventasActions = [];

let lastVentasBody = {};

const buildVentasBody = () => {
  const body = {
    nombre_producto: ventasSearchNombre.value || undefined,
    codigo_producto: ventasSearchCodigo.value || undefined,
    num_consecutivo: ventasSearchConsecutivo.value ? Number(ventasSearchConsecutivo.value) : undefined,
    estado: ventasSearchEstado.value || undefined,
    fecha_desde: ventasSearchDesde.value ? new Date(ventasSearchDesde.value).toISOString() : undefined,
    fecha_hasta: ventasSearchHasta.value ? new Date(ventasSearchHasta.value).toISOString() : undefined,
    precio_min: ventasPrecioMin.value !== '' ? Number(ventasPrecioMin.value) : undefined,
    precio_max: ventasPrecioMax.value !== '' ? Number(ventasPrecioMax.value) : undefined
  };
  // eliminar undefined
  Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
  return body;
};

const fetchVentas = async (page = ventasCurrentPage.value, limit = itemsPorPage.value) => {
  ventasLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const res = await fetch(`${config.public.backendHost}/FacturaProducto/filterFacturaProductos/${page}/${limit}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lastVentasBody)
    });

    const data = await res.json();
    const items = Array.isArray(data.data) ? data.data : [];
    ventasData.value = items.map(fp => ({
      id: fp.id_factura_producto,
      productoCodigo: fp.producto?.codigo ?? '',
      productoNombre: fp.producto?.nombre ?? '',
      productoUnidad: fp.producto?.unidadMedida ?? '',
      cantidad: Number(fp.cantidad ?? 0).toFixed(2),
      precioVenta: Number(fp.precioVenta ?? 0).toFixed(2),
      total: (Number(fp.cantidad ?? 0) * Number(fp.precioVenta ?? 0)).toFixed(2),
      numConsecutivo: fp.factura?.num_consecutivo ?? '',
      fechaFactura: fp.factura?.fecha ? new Date(fp.factura.fecha).toLocaleDateString('es-ES') : ''
    }));
    totalVentas.value = data.pagination?.total || 0;
  } catch (error) {
    ventasData.value = [];
    totalVentas.value = 0;
  } finally {
    ventasLoading.value = false;
  }
};

const handleVentasPageChange = (page) => {
  ventasCurrentPage.value = page;
  fetchVentas(page);
};

const handleVentasSearch = async () => {
  // Construir body según filtros, omitiendo campos vacíos
  lastVentasBody = buildVentasBody();
  ventasCurrentPage.value = 1;
  await fetchVentas(1, itemsPorPage.value);
};

watch(activeTab, async (val) => {
  if (val === 'ventas' && ventasData.value.length === 0) {
    await fetchVentas(ventasCurrentPage.value, itemsPorPage.value);
  }
});

async function exportVentasToExcel() {
  // Mensaje de consulta de datos
  errorBanner.value = {
    title: 'Consultando datos',
    description: 'Se están consultando los datos de ventas, la descarga comenzará en breve.',
    type: 'info'
  };

  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();

    // Asegurar que el body refleje los filtros actuales
    const bodyData = buildVentasBody();

    // Obtener todos los registros segun filtros actuales
    const response = await fetch(`${config.public.backendHost}/FacturaProducto/filterFacturaProductos/1/${totalVentas.value || 100000}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      errorBanner.value = {
        title: 'Error al consultar datos',
        description: errorData.error || 'Ocurrió un error al consultar los datos de ventas.',
        type: 'error'
      };
      return;
    }

    const data = await response.json();
    const rows = (Array.isArray(data.data) ? data.data : []).map(fp => ({
      'Código Producto': fp.producto?.codigo ?? '',
      'Nombre Producto': fp.producto?.nombre ?? '',
      'Unidad de Medida': fp.producto?.unidadMedida ?? '',
      'Cantidad': Number(fp.cantidad ?? 0).toFixed(2),
      'Precio Venta': Number(fp.precioVenta ?? 0).toFixed(2),
      'Total (Cant x Precio)': (Number(fp.cantidad ?? 0) * Number(fp.precioVenta ?? 0)).toFixed(2),
      'N° Consecutivo factura': fp.factura?.num_consecutivo ?? '',
      'Fecha Factura': fp.factura?.fecha ? new Date(fp.factura.fecha).toLocaleDateString('es-ES') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `ventas_${date}.xlsx`);

    errorBanner.value = null;
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: 'Ocurrió un error al exportar los datos de ventas.',
      type: 'error'
    };
  }
}

const productosColumns = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'unidadMedida', label: 'Unidad de Medida' },
  { key: 'precio', label: 'Precio' },
  { key: 'costo', label: 'Costo' },
  { key: 'tipoProducto', label: 'Tipo de Producto' },
  { key: 'cantidadExistencia', label: 'Existencia' }
];
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
const productosActions = [
  {
    name: 'Editar',
    icon: {
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
        ]);
      }
    },
    handler: (producto) => {
      selectedProducto.value = producto;
      isEditing.value = true;
      isViewing.value = false;
      showModal.value = true;
    },
    buttonClass: 'px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90'
  },
  {
    name: 'Eliminar',
    icon: deleteIcon,
    handler: (producto) => {
      productoAEliminar.value = producto;
      showConfirmBanner.value = true;
    },
    buttonClass: 'px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90'
  }
];

// Computed: detecta si el usuario logueado es 'Vendedor'
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

// Columnas y acciones visibles según rol
const visibleProductosColumns = computed(() => {
  return productosColumns.filter(col => !(isVendedor.value && col.key === 'costo'));
});

const visibleProductosActions = computed(() => {
  return isVendedor.value ? [] : productosActions;
});

const fetchProductos = async (page = currentPage.value, limit = itemsPorPage.value) => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const body = {
      codigo: searchCodigo.value,
      nombre: searchNombre.value,
      precio: {
        min: searchPrecioMin.value ? Number(searchPrecioMin.value) : undefined,
        max: searchPrecioMax.value ? Number(searchPrecioMax.value) : undefined
      },
      nota: searchNota.value
    };
    // Remove undefined values
    if (!body.precio.min && !body.precio.max) delete body.precio;
    else {
      if (!body.precio.min) delete body.precio.min;
      if (!body.precio.max) delete body.precio.max;
    }
    const res = await fetch(`${config.public.backendHost}/Producto/filterProductos/${page}/${limit}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    productosData.value = Array.isArray(data.data) ? data.data.map(p => ({ ...p, precio: Number(p.precio).toFixed(2) })) : [];
    totalProductos.value = data.pagination?.total || 0;
  } catch (error) {
    productosData.value = [];
    totalProductos.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchProductos(page);
};

// Abrir modal al hacer click en la fila
const handleRowClick = (item) => {
  selectedProducto.value = item;
  isEditing.value = false;
  isViewing.value = true;
  showModal.value = true;
};

onMounted(() => {
  fetchProductos();
});

const handleSubmit = async (producto) => {
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();

    const url = isEditing.value
      ? `${config.public.backendHost}/Producto/updateProducto/${selectedProducto.value.id_producto}`
      : `${config.public.backendHost}/Producto/createProducto`;

    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    // Manejo de errores: 401 = sesión expirada (redirigir), 403 = permisos denegados
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

    // Si la respuesta es 400 o 500, mostrar los errores de validación
    if (response.status === 400 || response.status === 500) {
      const errorData = await response.json();
      if (errorData.error) {
        errorBanner.value = {
          title: `Errores de validación: ${response.status}`,
          description: errorData.message,
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
          title: `Producto Actualizado: ${response.status}`,
          description: `El producto ${producto.nombre} se actualizó con éxito`,
          type: 'success'
        };
      } else {
        errorBanner.value = {
          title: `Producto Creado: ${response.status}`,
          description: `El producto ${producto.nombre} se creó con éxito`,
          type: 'success'
        };
      }
      // Recargar los datos después de crear/editar
      await fetchProductos(currentPage.value, itemsPorPage.value);
      // Cerrar modal y resetear estados
      showModal.value = false;
      selectedProducto.value = null;
      isEditing.value = false;
      isViewing.value = false;
    } else {
      console.error('Error al guardar el producto');
    }
  } catch (error) {
    console.error('Error:', error);
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  }
};

const nuevaProducto = () => {
  // Asegurar que el modal abra siempre en blanco creando un objeto vacío
  selectedProducto.value = {};
  isEditing.value = false;
  isViewing.value = false;
  showModal.value = true;
};

async function confirmDeleteProducto() {
  showConfirmBanner.value = false;
  if (!productoAEliminar.value) return;
  try {
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.backendHost}/Producto/DeleteProducto/${productoAEliminar.value.id_producto}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
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
    if (!response.ok) {
      const errorData = await response.json();
      errorBanner.value = {
        title: `Error al eliminar: ${response.status}`,
        description: errorData.message || JSON.stringify(errorData),
        type: 'error'
      };
      return;
    }
    errorBanner.value = {
      title: 'Producto eliminado',
      description: `El producto fue eliminado correctamente`,
      type: 'success'
    };
    await fetchProductos(currentPage.value, itemsPorPage.value);
  } catch (error) {
    errorBanner.value = {
      title: 'Error',
      description: error.message,
      type: 'error'
    };
  } finally {
    productoAEliminar.value = null;
  }
}

const handleSearch = async () => {
  try {
    isLoading.value = true;
    await fetchProductos(1, itemsPorPage.value);
  } catch (error) {
    console.error('Error al buscar productos:', error);
  } finally {
    isLoading.value = false;
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
      codigo: searchCodigo.value,
      nombre: searchNombre.value,
      precio: {
        min: searchPrecioMin.value ? Number(searchPrecioMin.value) : undefined,
        max: searchPrecioMax.value ? Number(searchPrecioMax.value) : undefined
      },
      nota: searchNota.value
    };
    // Remove undefined values
    if (!bodyData.precio.min && !bodyData.precio.max) delete bodyData.precio;
    else {
      if (!bodyData.precio.min) delete bodyData.precio.min;
      if (!bodyData.precio.max) delete bodyData.precio.max;
    }

    const response = await fetch(`${config.public.backendHost}/Producto/filterProductos/1/${totalProductos.value}`, {
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
      'Código': item.codigo,
      'Nombre': item.nombre,
      'Unidad de Medida': item.unidadMedida,
      'Precio': Number(item.precio).toFixed(2),
      'Nota': item.nota
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `productos_${date}.xlsx`);

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

async function exportToExcelWithVentasCompras() {
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
      codigo: searchCodigo.value,
      nombre: searchNombre.value,
      precio: {
        min: searchPrecioMin.value ? Number(searchPrecioMin.value) : undefined,
        max: searchPrecioMax.value ? Number(searchPrecioMax.value) : undefined
      },
      nota: searchNota.value
    };
    // Remove undefined values
    if (!bodyData.precio.min && !bodyData.precio.max) delete bodyData.precio;
    else {
      if (!bodyData.precio.min) delete bodyData.precio.min;
      if (!bodyData.precio.max) delete bodyData.precio.max;
    }

    const response = await fetch(`${config.public.backendHost}/Producto/filterProductos/1/${totalProductos.value}`, {
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

    // Crear filas para cada producto y sus facturas
    const exportData = [];
    data.data.forEach(producto => {
      if (Array.isArray(producto.facturaProductos)) {
        producto.facturaProductos.forEach(facturaProducto => {
          exportData.push({
            'Código Producto': producto.codigo,
            'Nombre Producto': producto.nombre,
            'Unidad Medida Producto': producto.unidadMedida,
            'Precio Producto': Number(producto.precio).toFixed(2),
            'Costo Producto': Number(producto.costo).toFixed(2),
            'Tipo Producto': producto.tipoProducto,
            'Existencia Producto': producto.cantidadExistencia,
            'Nota Producto': producto.nota,
            'Número Consecutivo Factura': facturaProducto.factura.num_consecutivo,
            'Fecha Factura': facturaProducto.factura.fecha ? new Date(facturaProducto.factura.fecha).toLocaleDateString('es-ES') : '',
            'Estado Factura': facturaProducto.factura.estado,
            'Nota Factura': facturaProducto.factura.nota,
            'Cantidad': Number(facturaProducto.cantidad).toFixed(2),
            'Precio Venta': Number(facturaProducto.precioVenta).toFixed(2),
            'Número Consecutivo Contrato': facturaProducto.factura.contrato.num_consecutivo,
            'Fecha Inicio Contrato': facturaProducto.factura.contrato.fecha_inicio ? new Date(facturaProducto.factura.contrato.fecha_inicio).toLocaleDateString('es-ES') : '',
            'Fecha Fin Contrato': facturaProducto.factura.contrato.fecha_fin ? new Date(facturaProducto.factura.contrato.fecha_fin).toLocaleDateString('es-ES') : '',
            'Nota Contrato': facturaProducto.factura.contrato.nota,
            'Cliente/Proveedor': facturaProducto.factura.contrato.ClienteOProveedor,
            'Vigencia Facturas (Días)': facturaProducto.factura.contrato.vigenciaFacturasDias
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos con Ventas y Compras');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `productos_ventas_compras_${date}.xlsx`);

    // Limpiar el banner después de la exportación
    errorBanner.value = null;
  } catch (error) {
    console.error('Error al exportar a Excel con ventas y compras:', error);
    errorBanner.value = {
      title: 'Error',
      description: 'Ocurrió un error al exportar los datos.',
      type: 'error'
    };
  }
}
</script>
