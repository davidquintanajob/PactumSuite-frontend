<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral flex flex-col items-center py-12">
    <Navbar />
    <div v-if="errorBanner"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner :title="errorBanner.title" :description="errorBanner.description" :type="errorBanner.type"
        @close="errorBanner = null" class="pointer-events-auto" />
    </div>
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-blue-700">Mi Perfil</h2>
        <button @click="handleLogoutProfile"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
          Cerrar sesión
        </button>
      </div>
      <div v-if="user" class="space-y-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Nombre:</span>
            <span class="text-gray-900">{{ user.nombre }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Usuario:</span>
            <span class="text-gray-900">{{ user.nombre_usuario }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Carnet de Identidad:</span>
            <span class="text-gray-900">{{ user.carnet_identidad }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Cargo:</span>
            <span class="text-gray-900">{{ user.cargo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Rol:</span>
            <span class="text-gray-900">{{ user.rol }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Estado:</span>
            <span :class="user.activo ? 'bg-success' : 'bg-danger'" class="px-3 py-1 rounded-full text-neutral text-xs font-semibold">
              {{ user.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
        <!-- Cambiar contraseña -->
        <div class="mt-6 border-t pt-6">
          <h3 class="text-lg font-semibold text-blue-700 mb-4">Cambiar contraseña</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input type="password" v-model="oldPassword" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ingresa tu contraseña actual" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input type="password" v-model="newPassword" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ingresa la nueva contraseña" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input type="password" v-model="confirmPassword" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Confirma la nueva contraseña" />
            </div>
            <div class="flex justify-end">
              <button @click="handleChangePassword" :disabled="isChangingPassword || !canSubmitPassword"
                :class="['px-6 py-2 rounded-lg transition-colors', (!canSubmitPassword || isChangingPassword) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-primary text-neutral hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2']">
                {{ isChangingPassword ? 'Cambiando...' : 'Cambiar contraseña' }}
              </button>
            </div>
            <p v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="text-sm text-red-600">Las nuevas contraseñas no coinciden.</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">Cargando datos...</div>
    </div>
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mt-8">
      <h3 class="text-xl font-semibold text-blue-700 mb-4">Facturas del usuario</h3>
      <DataTable
        :columns="facturasColumns"
        :items="facturasData"
        :total-items="facturasData.length"
        :items-per-page="10"
        :current-page="facturasPage"
        :is-loading="isLoading"
        :show-actions="false"
        @page-change="handleFacturasPageChange"
      />
    </div>
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mt-8">
      <h3 class="text-xl font-semibold text-blue-700 mb-4">Ofertas del usuario</h3>
      <DataTable
        :columns="ofertasColumns"
        :items="ofertasData"
        :total-items="ofertasData.length"
        :items-per-page="5"
        :current-page="ofertasPage"
        :is-loading="isLoading"
        :show-actions="false"
        @page-change="handleOfertasPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from '@/components/DataTable.vue';
import { useRuntimeConfig, navigateTo } from 'nuxt/app';
import Navbar from '@/components/Navbar.vue';
import MessageBanner from '@/components/MessageBanner.vue';

const config = useRuntimeConfig();
const user = ref(null);
const facturasData = ref([]);
const facturasPage = ref(1);
const ofertasData = ref([]);
const ofertasPage = ref(1);
const isLoading = ref(false);
const isChangingPassword = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorBanner = ref(null);

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
      if (value === 'Facturado') bgColor = 'bg-green-100 text-green-800';
      else if (value === 'No Facturado') bgColor = 'bg-yellow-100 text-yellow-800';
      else if (value === 'Cancelado') bgColor = 'bg-red-100 text-red-800';
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
    key: 'importe',
    label: 'Importe',
    cellRenderer: (value) => {
      if (value == null || value === '') return '';
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return `<span class=\"px-2 py-1 rounded text-sm\">${num.toFixed(2)}</span>`;
    }
  }
];

const ofertasColumns = [
  { key: 'id_oferta', label: 'ID Oferta' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha_inicio', label: 'Fecha Inicio', format: (val) => val?.substring(0, 10) },
  { key: 'fecha_fin', label: 'Fecha Fin', format: (val) => val?.substring(0, 10) },
  { key: 'id_contrato', label: 'ID Contrato' }
];

function handleFacturasPageChange(page) {
  facturasPage.value = page;
}

function handleOfertasPageChange(page) {
  ofertasPage.value = page;
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const usuarioLS = localStorage.getItem('usuario');
    if (!usuarioLS) {
      navigateTo('/login');
      return;
    }
    let usuario;
    try {
      usuario = JSON.parse(usuarioLS);
    } catch (e) {
      navigateTo('/login');
      return;
    }
    if (!usuario || !usuario.id_usuario) {
      navigateTo('/login');
      return;
    }
    const res = await fetch(`${config.public.backendHost}/usuario/${usuario.id_usuario}`);
    const data = await res.json();
    user.value = data;
    // Mapear facturas del usuario a un formato similar a la vista de facturas
    const facturas = Array.isArray(data.facturas) ? data.facturas : [];
    facturasData.value = facturas.map(f => {
      // calcular importe si no viene totalFactura
      let importe = f.totalFactura;
      if (importe == null) {
        const sumaServicios = Array.isArray(f.servicio)
          ? f.servicio.reduce((acc, s) => acc + (Number(s.importe) * Number(s.cantidad || 1)), 0)
          : 0;
        const sumaProductos = Array.isArray(f.productos)
          ? f.productos.reduce((acc, p) => acc + (Number(p.factura_producto?.precioVenta || 0) * Number(p.factura_producto?.cantidad || 0)), 0)
          : 0;
        importe = sumaServicios + sumaProductos;
      }
      return {
        ...f,
        importe
      };
    });
    ofertasData.value = Array.isArray(data.oferta) ? data.oferta.map(o => ({
      ...o,
      fecha_inicio: o.fecha_inicio ? o.fecha_inicio.substring(0, 10) : '',
      fecha_fin: o.fecha_fin ? o.fecha_fin.substring(0, 10) : ''
    })) : [];
  } catch (e) {
    user.value = null;
    ofertasData.value = [];
  } finally {
    isLoading.value = false;
  }
});

const canSubmitPassword = computed(() => {
  return newPassword.value.length > 0 && confirmPassword.value.length > 0 && newPassword.value === confirmPassword.value;
});

async function handleChangePassword() {
  try {
    isChangingPassword.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      navigateTo('/login');
      return;
    }
    const response = await fetch(`${config.public.backendHost}/Usuario/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        viejaContrasenna: oldPassword.value,
        nuevaContrasenna: newPassword.value
      })
    });

    if ([400,401,403,404,500].includes(response.status)) {
      let errorMsg = 'Error al cambiar la contraseña';
      try {
        const errorData = await response.json();
        if (errorData && Array.isArray(errorData.errors)) {
          errorMsg = errorData.errors.join('\n');
        } else if (errorData && errorData.error) {
          errorMsg = errorData.error;
        }
      } catch (e) {}
      errorBanner.value = { title: 'Error', description: errorMsg, type: 'error' };
      return;
    }

    if (!response.ok) {
      errorBanner.value = { title: 'Error', description: 'No se pudo cambiar la contraseña', type: 'error' };
      return;
    }

    errorBanner.value = { title: 'Éxito', description: 'Contraseña cambiada correctamente', type: 'success' };
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (e) {
    errorBanner.value = { title: 'Error', description: 'Ocurrió un error al cambiar la contraseña', type: 'error' };
  } finally {
    isChangingPassword.value = false;
  }
}

function handleLogoutProfile() {
  try {
    localStorage.clear();
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigateTo('/');
    }
  } catch (e) {
    // fallback
    navigateTo('/');
  }
}
</script> 