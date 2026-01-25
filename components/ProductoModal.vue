<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <!-- MessageBanner para mostrar estado de carga -->
    <div v-if="loadingBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner
        :title="loadingBanner.title"
        :description="loadingBanner.description"
        :type="loadingBanner.type"
        @close="loadingBanner = null"
        class="pointer-events-auto"
      />
    </div>

    <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isViewing ? 'Detalles de Producto' : (isEditing ? 'Editar Producto' : 'Nuevo Producto') }}
        </h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Código -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <input v-model="formData.codigo" type="text" required :readonly="isViewing" :disabled="isViewing || isLoading"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el código del producto" />
          </div>
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="formData.nombre" type="text" required :readonly="isViewing" :disabled="isViewing || isLoading"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el nombre del producto" />
          </div>
          <!-- Precio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input v-model="formData.precio" type="number" step="0.01" required :readonly="isViewing" :disabled="isViewing || isLoading"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el precio" />
          </div>
            <!-- Costo -->
            <div v-if="!isVendedor">
              <label class="block text-sm font-medium text-gray-700 mb-1">Costo</label>
              <input v-model="formData.costo" type="number" step="0.01" required :readonly="isViewing" :disabled="isViewing || isLoading"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el costo" />
            </div>
          <!-- Unidad de Medida -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
            <input v-model="formData.unidadMedida" type="text" required :readonly="isViewing" :disabled="isViewing || isLoading"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la unidad de medida" />
          </div>
          <!-- Tipo de Producto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Producto</label>
            <input v-model="formData.tipoProducto" type="text" required :readonly="isViewing" :disabled="isViewing || isLoading"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el tipo de producto" />
          </div>
          <!-- Cantidad en Existencia -->
          <div v-if="isEditing || isViewing">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad en Existencia</label>
            <input v-model="formData.cantidadExistencia" type="number" :required="isEditing" :readonly="true" :disabled="true"
              class="w-full px-4 py-2 rounded-lg border bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la cantidad en existencia" />
          </div>
        </div>
        <!-- Nota -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
          <textarea v-model="formData.nota" :readonly="isViewing" :disabled="isViewing || isLoading"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese una nota (opcional)" rows="3"></textarea>
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!isViewing">
          <button type="button" @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            :disabled="isLoading">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? 'Guardando...' : 'Creando...' }}
            </span>
            <span v-else>
              {{ isEditing ? 'Guardar Cambios' : 'Crear Producto' }}
            </span>
          </button>
        </div>
      </form>

      <!-- Tabla de Factura Productos -->
      <div v-if="(isViewing || isEditing) && props.producto.facturaProductos && props.producto.facturaProductos.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Historial de Facturas</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Consecu</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Proveedor</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Venta</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="fp in props.producto.facturaProductos" :key="fp.id_factura_producto">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ fp.factura.num_consecutivo }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <span v-html="renderClienteProveedor(fp.factura.contrato.ClienteOProveedor)"></span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ new Date(fp.factura.fecha).toLocaleDateString() }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <span v-html="renderEstado(fp.factura.estado)"></span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ fp.cantidad }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ fp.precioVenta }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ fp.costoVenta }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import MessageBanner from './MessageBanner.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  producto: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false },
  isViewing: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'submit']);
const formData = ref({
  codigo: '',
  nombre: '',
  precio: '',
  nota: '',
  unidadMedida: '',
  tipoProducto: '',
  cantidadExistencia: 0,
  costo: 0
});

// Computed para detectar si el usuario logueado tiene rol 'Vendedor'
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
const errorMsg = ref('');
const isLoading = ref(false);
const loadingBanner = ref(null);

watch(() => props.producto, (producto) => {
  if (producto && Object.keys(producto).length > 0) {
    formData.value = {
      codigo: producto.codigo || '',
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      nota: producto.nota || '',
      unidadMedida: producto.unidadMedida || '',
      tipoProducto: producto.tipoProducto || '',
      cantidadExistencia: producto.cantidadExistencia || 0,
      costo: producto.costo || 0
    };
  } else {
    formData.value = {
      codigo: '',
      nombre: '',
      precio: '',
      nota: '',
      unidadMedida: '',
      tipoProducto: '',
      cantidadExistencia: 0,
      costo: 0
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  errorMsg.value = '';
  const requiredFields = ['codigo', 'nombre', 'precio', 'unidadMedida', 'tipoProducto'];
  // Exigir costo solo si el usuario NO es Vendedor
  if (!isVendedor.value) {
    requiredFields.push('costo');
  }
  if (props.isEditing) {
    requiredFields.push('cantidadExistencia');
  }
  const missingFields = requiredFields.filter(field => !formData.value[field]);
  if (missingFields.length > 0) {
    errorMsg.value = 'Los campos ' + missingFields.join(', ') + ' son obligatorios.';
    return;
  }

  // Activar estado de carga
  isLoading.value = true;
  loadingBanner.value = {
    title: props.isEditing ? 'Guardando Producto' : 'Creando Producto',
    description: 'Comunicando con el servidor, espere por favor...',
    type: 'warning'
  };

  try {
    // Emitir el evento submit
    await new Promise((resolve, reject) => {
      emit('submit', {
        codigo: formData.value.codigo,
        nombre: formData.value.nombre,
        precio: Number(formData.value.precio),
        nota: formData.value.nota,
        unidadMedida: formData.value.unidadMedida,
        tipoProducto: formData.value.tipoProducto,
        cantidadExistencia: props.isEditing ? Number(formData.value.cantidadExistencia) : 0,
        costo: Number(formData.value.costo)
      });
      // Simular un pequeño delay para que el usuario vea el mensaje
      setTimeout(resolve, 100);
    });
  } catch (error) {
    console.error('Error en handleSubmit:', error);
  } finally {
    // Desactivar estado de carga después de un breve delay
    setTimeout(() => {
      isLoading.value = false;
      loadingBanner.value = null;
    }, 500);
  }
};

function renderEstado(value) {
  if (!value) return '';
  let bgColor = '';
  let textColor = '';
  if (value === 'Facturado') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (value === 'No Facturado') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (value === 'Cancelado') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}">${value}</span>`;
}

function renderClienteProveedor(value) {
  if (!value) return '';
  let bgColor = '';
  let textColor = '';
  if (value === 'Proveedor') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (value === 'Cliente') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else {
    return '';
  }
  return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}">${value}</span>`;
}
</script>
