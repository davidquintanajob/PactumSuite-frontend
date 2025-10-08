<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Productos - Contract Manager" description="Registra y gestiona productos." canonical="/productos" />
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div v-if="showConfirmBanner" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">
      <ConfirmBanner
        :title="'¿Estás seguro que deseas eliminar este producto?'"
        :description="'Esta acción no se puede deshacer.'"
        type="warning"
        @confirm="confirmDeleteProducto"
        @close="showConfirmBanner = false"
      />
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 md:mb-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por código</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchCodigo"
                placeholder="Ingrese el código..."
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <input
              type="text"
              v-model="searchNombre"
              placeholder="Ingrese el nombre..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="flex space-x-2">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
              <input
                type="number"
                v-model="searchPrecioMin"
                placeholder="Precio min..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
              <input
                type="number"
                v-model="searchPrecioMax"
                placeholder="Precio max..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input
              type="text"
              v-model="searchNota"
              placeholder="Nota..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
        <div class="flex justify-end mt-4 gap-2 flex-wrap">
          <button @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Buscar
          </button>
          <button @click="exportToExcel"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z" />
            </svg>
            Exportar a Excel
          </button>
          <button @click="exportToExcelWithVentasCompras"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Exportar Ventas y Compras
          </button>
        </div>
      </div>
    </div>
    <!-- Tabla de Productos -->
    <div class="w-[95%] mx-auto px-4 py-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Productos</h2>
        <button @click="nuevaProducto"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>
      <DataTable
        :columns="productosColumns"
        :items="productosData"
        :actions="productosActions"
        :total-items="totalProductos"
        :items-per-page="itemsPorPage"
        :current-page="currentPage"
        :is-loading="isLoading"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      />
    </div>
    <!-- Modal de Producto -->
    <ProductoModal v-model="showModal" :producto="selectedProducto" :is-editing="isEditing" :is-viewing="isViewing" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
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
  selectedProducto.value = null;
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
