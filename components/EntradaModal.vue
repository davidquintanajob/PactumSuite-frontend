<template>
  <Modal :show="modelValue" @close="$emit('update:modelValue', false)" size="2xl">
    <template #title>
      <h3 class="text-lg font-semibold text-gray-900">
        Detalles de la Entrada
      </h3>
    </template>

    <template #content>
      <div class="space-y-6">
        <!-- Información del Producto -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Producto</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.nombre || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Código</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.codigo || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Unidad de Medida</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.unidadMedida || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Producto</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.tipoProducto || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Precio Unitario</label>
              <p class="mt-1 text-sm text-gray-900">${{ Number(entrada.producto?.precio || 0).toFixed(2) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Existencia Actual</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.cantidadExistencia || 0 }}</p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Nota del Producto</label>
            <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.nota || 'Sin nota' }}</p>
          </div>
        </div>

        <!-- Información de la Entrada -->
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información de la Entrada</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cantidad Entrada</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.cantidadEntrada }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Costo</label>
              <p class="mt-1 text-sm text-gray-900">${{ Number(entrada.costo || 0).toFixed(2) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Total</label>
              <p class="mt-1 text-sm font-semibold text-gray-900">${{ (Number(entrada.cantidadEntrada) * Number(entrada.producto?.precio || 0)).toFixed(2) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.fecha ? new Date(entrada.fecha).toLocaleDateString('es-ES') : 'N/A' }}</p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Nota de la Entrada</label>
            <p class="mt-1 text-sm text-gray-900">{{ entrada.nota || 'Sin nota' }}</p>
          </div>
        </div>

        <!-- Información del Contrato -->
        <div class="bg-green-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Contrato</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Consecutivo</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.num_consecutivo || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Contrato</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.tipoContrato?.nombre || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cliente o Proveedor</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.ClienteOProveedor || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Entidad</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.entidad?.nombre || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Inicio</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.fecha_inicio ? new Date(entrada.contrato.fecha_inicio).toLocaleDateString('es-ES') : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Fin</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.fecha_fin ? new Date(entrada.contrato.fecha_fin).toLocaleDateString('es-ES') : 'N/A' }}</p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Nota del Contrato</label>
            <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.nota || 'Sin nota' }}</p>
          </div>
        </div>

        <!-- Información de Factura (si existe) -->
        <div v-if="entrada.id_factura" class="bg-yellow-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información de Factura</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Consecutivo</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.factura?.num_consecutivo || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.factura?.estado || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.factura?.fecha ? new Date(entrada.factura.fecha).toLocaleDateString('es-ES') : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Importe Total</label>
              <p class="mt-1 text-sm text-gray-900">${{ Number(entrada.factura?.suma_general || 0).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Información de Timestamps -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Sistema</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Creado</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.createdAt ? new Date(entrada.createdAt).toLocaleString('es-ES') : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Última Actualización</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.updatedAt ? new Date(entrada.updatedAt).toLocaleString('es-ES') : 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  entrada: {
    type: Object,
    default: () => ({})
  },
  isViewing: {
    type: Boolean,
    default: true
  }
});

defineEmits(['update:modelValue']);
</script>
