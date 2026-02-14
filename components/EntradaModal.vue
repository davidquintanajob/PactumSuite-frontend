<template>
  <Modal :show="modelValue" @close="onRequestClose" size="2xl">
    <template #title>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ isViewing ? 'Detalles de la Entrada' : (isEditing ? 'Editar Entrada' : 'Nueva Entrada') }}
      </h3>
    </template>

    <template #content>
        <div ref="contentWrapper" :class="['transition-opacity', isLoading && 'pointer-events-none opacity-50']">
        <!-- Blocking loading overlay while submitting -->
        <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <p class="text-gray-700 font-medium">Procesando, espere...</p>
          </div>
        </div>
      <div v-if="message" class="mb-4">
        <MessageBanner :title="message.title" :description="message.description" :type="message.type" @close="message = null" />
      </div>
      <div v-if="confirmVisible" class="mb-4">
        <ConfirmBanner
          :title="`Actualizar costo del producto ${confirmInfo.id_producto}?`"
          :description="`Costo actual: CUP ${Number(confirmInfo.currentCosto).toFixed(2)} - USD ${Number(confirmInfo.currentCostoUsd).toFixed(5)}.\nCosto sugerido: CUP ${Number(confirmInfo.suggestedCosto).toFixed(2)} - USD ${Number(confirmInfo.suggestedCostoUsd).toFixed(5)}.\nExistencia actual: ${confirmInfo.existingQty}, entrada: ${confirmInfo.entryQty}.`"
          :icon="''"
          type="warning"
          @confirm="applyProductUpdate"
          @close="closeConfirmNoUpdate"
        />
      </div>
      <div v-if="isViewing" class="space-y-6">
        <!-- Vista sólo lectura (igual a anterior) -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Producto</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.producto?.nombre || 'N/A' }}</p>
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
              <label class="block text-sm font-medium text-gray-700">Costo USD</label>
              <p class="mt-1 text-sm text-gray-900">${{ Number(entrada.producto?.costo_usd || 0).toFixed(5) }}</p>
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
              <label class="block text-sm font-medium text-gray-700">Costo USD</label>
              <p class="mt-1 text-sm text-gray-900">${{ Number(entrada.costo_usd || entrada.producto?.costo_usd || 0).toFixed(5) }}</p>
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
        <div v-if="entrada.contrato" class="bg-green-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Contrato</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Consecutivo</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.num_consecutivo || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cliente o Proveedor</label>
              <p class="mt-1 text-sm text-gray-900">{{ entrada.contrato?.ClienteOProveedor || 'N/A' }}</p>
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
        <div v-if="entrada.factura" class="bg-yellow-50 rounded-lg p-4">
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

      <div v-else class="space-y-6">
        <!-- Formulario de creación/edición -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <SelectSearchAPI
              v-model="form.id_producto"
              endpoint="/Producto/filterProductos/1/10"
              method="POST"
              search-key="nombre"
              label-key="nombre"
              value-key="id_producto"
              placeholder="Buscar producto..."
              @producto-seleccionado="onProductoSeleccionado"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" v-model="form.fecha" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Costo</label>
            <input type="number" :step="'any'" :value="form.costo" @input="onCostoInput" placeholder="Costo..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Costo USD</label>
            <input type="number" :step="'any'" :value="form.costo_usd" @input="onCostoUsdInput" placeholder="Costo USD..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input type="number" v-model.number="form.cantidadEntrada" min="0" step="any" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Costos * Cantidad</label>
            <input type="text" readonly :value="`CUP: ${totalCUP} - USD: ${totalUSD}`" class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input type="text" v-model="form.nota" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nota..." />
          </div>
        </div>

        <!-- Info del producto seleccionada -->
        <div v-if="selectedProducto" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Información del Producto</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm text-gray-600">Existencia</div>
              <div class="text-sm font-semibold">{{ selectedProducto.cantidadExistencia || 0 }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Unidad</div>
              <div class="text-sm font-semibold">{{ selectedProducto.unidadMedida }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Tipo</div>
              <div class="text-sm font-semibold">{{ selectedProducto.tipoProducto }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Precio</div>
              <div class="text-sm font-semibold">{{ Number(selectedProducto.precio || 0).toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Costo</div>
              <div class="text-sm font-semibold">{{ Number(selectedProducto.costo || 0).toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Costo USD</div>
              <div class="text-sm font-semibold">{{ Number(selectedProducto.costo_usd || 0).toFixed(5) }}</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div class="text-sm text-gray-600">Precio × Cantidad</div>
              <div class="text-sm font-semibold">{{ (Number(selectedProducto.precio || 0) * Number(form.cantidadEntrada || 0)).toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Costo × Cantidad</div>
              <div class="text-sm font-semibold">{{ (Number(selectedProducto.costo || 0) * Number(form.cantidadEntrada || 0)).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <div v-if="errorList.length" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          <div v-for="(e, idx) in errorList" :key="idx">{{ e }}</div>
        </div>
      </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button v-if="!isViewing" @click="onSubmit" :disabled="isLoading" class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">{{ isLoading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar' : 'Crear') }}</button>
        <button @click="onRequestClose" :disabled="isLoading" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">Cerrar</button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue';
import Modal from '@/components/Modal.vue';
import SelectSearchAPI from '@/components/SelectSearchAPI.vue';
import ConfirmBanner from '@/components/ConfirmBanner.vue';
import MessageBanner from '@/components/MessageBanner.vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  entrada: { type: Object, default: () => ({}) },
  isViewing: { type: Boolean, default: true },
  isEditing: { type: Boolean, default: false },
  // Optional: function that will be called to create the entrada.
  // Should return the created entrada object on success.
  submitHandler: { type: Function, required: false }
});

const emit = defineEmits(['update:modelValue', 'submit', 'success']);

const form = reactive({ id_producto: null, cantidadEntrada: null, nota: '', fecha: '', costo: null, costo_usd: null });
const selectedProducto = ref(null);
const errorList = ref([]);
const isLoading = ref(false);

// confirm banner state
const confirmVisible = ref(false);
const confirmInfo = reactive({
  id_producto: null,
  currentCosto: 0,
  currentCostoUsd: 0,
  suggestedCosto: 0,
  suggestedCostoUsd: 0,
  existingQty: 0,
  entryQty: 0
});

// message banner state
const message = ref(null); // { title, description, type }
const contentWrapper = ref(null);

const cambioMoneda = ref(1);

const isAdmin = computed(() => {
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return false;
    const usuario = JSON.parse(usuarioStr);
    const rawRole = usuario && (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) ? (usuario.rol || usuario.role || (usuario.perfil && usuario.perfil.rol) || (usuario.profile && usuario.profile.role)) : null;
    if (!rawRole) return false;
    return String(rawRole).trim().toLowerCase() === 'admin';
  } catch (e) {
    return false;
  }
});

const totalCUP = computed(() => {
  const q = Number(form.cantidadEntrada) || 0;
  const c = Number(form.costo) || 0;
  return (q * c).toFixed(2);
});

const totalUSD = computed(() => {
  const q = Number(form.cantidadEntrada) || 0;
  const cu = Number(form.costo_usd) || 0;
  return (q * cu).toFixed(5);
});

watch(() => props.entrada, (val) => {
  if (val && Object.keys(val).length) {
    form.id_producto = val.id_producto || val.producto?.id_producto || null;
    form.cantidadEntrada = val.cantidadEntrada || null;
    form.nota = val.nota || '';
    form.fecha = val.fecha ? val.fecha.substring(0,10) : '';
    form.costo = val.costo != null ? val.costo : (val.producto?.costo != null ? val.producto.costo : null);
    form.costo_usd = val.costo_usd != null ? val.costo_usd : (val.producto?.costo_usd != null ? val.producto.costo_usd : null);
    selectedProducto.value = val.producto || null;
  } else {
    form.id_producto = null;
    form.cantidadEntrada = null;
    form.nota = '';
    form.fecha = '';
    form.costo = null;
    form.costo_usd = null;
    selectedProducto.value = null;
  }
}, { immediate: true });

function onProductoSeleccionado(producto) {
  selectedProducto.value = producto;
  // prefill costo/costo_usd from producto but do NOT trigger conversions
  form.costo = producto?.costo != null ? producto.costo : null;
  form.costo_usd = producto?.costo_usd != null ? producto.costo_usd : null;
}

async function onSubmit() {
  errorList.value = [];
  if (!form.id_producto) errorList.value.push('Debe seleccionar un producto');
  if (form.cantidadEntrada == null || Number(form.cantidadEntrada) <= 0) errorList.value.push('La cantidad debe ser mayor que 0');
  if (!form.fecha) errorList.value.push('Debe seleccionar una fecha');
  if (errorList.value.length) return;
  const payload = { id_producto: form.id_producto, cantidadEntrada: Number(form.cantidadEntrada), nota: form.nota, fecha: form.fecha };
  // include costo and costo_usd only when valid numbers
  if (form.costo !== null && form.costo !== '') {
    const c = Number(form.costo);
    if (!isNaN(c)) payload.costo = c;
  }
  if (form.costo_usd !== null && form.costo_usd !== '') {
    const cu = Number(form.costo_usd);
    if (!isNaN(cu)) payload.costo_usd = cu;
  }
  // If a submitHandler prop is provided, call it and wait for the created entrada
  if (props.submitHandler && typeof props.submitHandler === 'function') {
    try {
      isLoading.value = true;
      const created = await props.submitHandler(payload);
      // If creation returned an object with id_producto proceed to fetch product
      if (created && created.id_producto) {
        await handlePostCreate(created);
      } else {
        // fallback: emit success and close
        emit('success', { title: 'Entrada creada', description: 'Entrada agregada con éxito' });
        emit('update:modelValue', false);
      }
    } catch (e) {
      errorList.value.push(e.message || 'Error al crear la entrada');
    } finally {
      isLoading.value = false;
    }
    return;
  }

  // Default behavior: emit submit and let parent handle creation
  emit('submit', payload);
}

async function handlePostCreate(createdEntrada) {
  // Fetch product data to compute weighted average
  const id = createdEntrada.id_producto || form.id_producto;
  if (!id) {
    emit('success', { title: 'Entrada creada', description: 'Entrada agregada con éxito' });
    emit('update:modelValue', false);
    return;
  }

  const config = useRuntimeConfig();
  const token = localStorage.getItem('token');

  // Try common GET endpoints to retrieve product
  const tryUrls = [
    `${config.public.backendHost}/Producto/getProducto/${id}`,
    `${config.public.backendHost}/Producto/${id}`,
    `${config.public.backendHost}/Producto/Get/${id}`
  ];

  let prod = null;
  for (const u of tryUrls) {
    try {
      const res = await fetch(u, { method: 'GET', headers: { Authorization: token, Accept: 'application/json' } });
      if (res.ok) {
        prod = await res.json();
        break;
      }
    } catch (e) {
      // continue
    }
  }

  if (!prod) {
    // If product couldn't be fetched, just close with success
    emit('success', { title: 'Entrada creada', description: 'Entrada agregada con éxito' });
    emit('update:modelValue', false);
    return;
  }

  // Determine existing and entry costs/quantities
  const existingQty = Number(prod.cantidadExistencia) || 0;
  const existingCosto = Number(prod.costo) || 0;
  const existingCostoUsd = Number(prod.costo_usd) || 0;

  const entryQty = Number(createdEntrada.cantidadEntrada != null ? createdEntrada.cantidadEntrada : form.cantidadEntrada) || 0;
  const entryCosto = Number(createdEntrada.costo != null ? createdEntrada.costo : form.costo) || 0;
  const entryCostoUsd = Number(createdEntrada.costo_usd != null ? createdEntrada.costo_usd : form.costo_usd) || 0;

  const combinedQty = existingQty + entryQty;
  const suggestedCosto = combinedQty > 0 ? ((existingQty * existingCosto + entryQty * entryCosto) / combinedQty) : entryCosto;
  const suggestedCostoUsd = combinedQty > 0 ? ((existingQty * existingCostoUsd + entryQty * entryCostoUsd) / combinedQty) : entryCostoUsd;

  // populate confirm info and show banner
  confirmInfo.id_producto = id;
  confirmInfo.currentCosto = existingCosto;
  confirmInfo.currentCostoUsd = existingCostoUsd;
  confirmInfo.suggestedCosto = suggestedCosto;
  confirmInfo.suggestedCostoUsd = suggestedCostoUsd;
  confirmInfo.existingQty = existingQty;
  confirmInfo.entryQty = entryQty;

  confirmVisible.value = true;
}

// When confirm banner appears, scroll modal content to top so banner is visible
watch(confirmVisible, async (val) => {
  if (val) {
    await nextTick();
    try {
      // The wrapper is direct child of Modal's scrollable container
      const wrapper = contentWrapper.value;
      const scrollContainer = wrapper && wrapper.parentElement ? wrapper.parentElement : null;
      if (scrollContainer && typeof scrollContainer.scrollTo === 'function') {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (wrapper && typeof wrapper.scrollIntoView === 'function') {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      // ignore
    }
  }
});

function onRequestClose() {
  // prevent closing when confirm prompt is visible
  if (confirmVisible.value) return;
  emit('update:modelValue', false);
}

async function applyProductUpdate() {
  const id = confirmInfo.id_producto;
  if (!id) return;
  const config = useRuntimeConfig();
  const token = localStorage.getItem('token');
  const body = {
    costo: Number(confirmInfo.suggestedCosto).toFixed(2),
    costo_usd: Number(confirmInfo.suggestedCostoUsd).toFixed(5)
  };
  try {
    isLoading.value = true;
    const url = `${config.public.backendHost}/Producto/updateProducto/${id}`;
    const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: token, Accept: 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) {
      // ignore update failure but notify user
      message.value = { title: 'Actualización fallida', description: 'No se pudo actualizar el costo del producto.', type: 'warning' };
    } else {
      message.value = { title: 'Producto actualizado', description: 'Se actualizó el costo del producto con el nuevo costo promedio.', type: 'success' };
    }
  } catch (e) {
    message.value = { title: 'Error', description: e.message || 'Error al actualizar producto', type: 'error' };
  } finally {
    confirmVisible.value = false;
    isLoading.value = false;
    // cierre modal mostrando éxito de la entrada
    emit('success', { title: 'Entrada creada', description: 'Entrada agregada con éxito' });
    emit('update:modelValue', false);
  }
}

function closeConfirmNoUpdate() {
  confirmVisible.value = false;
  emit('success', { title: 'Entrada creada', description: 'Entrada agregada con éxito' });
  emit('update:modelValue', false);
}

// load cambio_moneda when modal opens
watch(() => props.modelValue, (open) => {
  if (open) {
    try {
      const cfg = localStorage.getItem('config');
      if (cfg) {
        const parsed = JSON.parse(cfg);
        if (parsed && parsed.cambio_moneda) cambioMoneda.value = Number(parsed.cambio_moneda) || 1;
      }
    } catch (e) {
      cambioMoneda.value = 1;
    }

    // Si el modal se abre en modo crear (no editar, no ver), limpiar todos los campos
    if (!props.isEditing && !props.isViewing) {
      form.id_producto = null;
      form.cantidadEntrada = null;
      form.nota = '';
      form.fecha = '';
      form.costo = null;
      form.costo_usd = null;
      selectedProducto.value = null;
      errorList.value = [];
    }
  } else {
    errorList.value = [];
  }
});

function onCostoInput(e) {
  const val = e.target.value;
  form.costo = val;
  if (!val) return;
  const n = Number(val);
  if (isNaN(n) || !cambioMoneda.value) return;
  form.costo_usd = (n / cambioMoneda.value).toFixed(5);
}

function onCostoUsdInput(e) {
  const val = e.target.value;
  form.costo_usd = val;
  if (!val) return;
  const n = Number(val);
  if (isNaN(n) || !cambioMoneda.value) return;
  form.costo = (n * cambioMoneda.value).toFixed(2);
}

watch(() => props.modelValue, (open) => {
  if (!open) {
    errorList.value = [];
  }
});
</script>

