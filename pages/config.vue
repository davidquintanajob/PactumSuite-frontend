<template>
  <div class="p-4 max-w-md mx-auto">
    <Navbar />
    <h1 class="text-xl font-semibold mb-4">Configuración</h1>

    <!-- Sección de información de tasa actual -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h2 class="font-medium mb-3 text-gray-700">Tasa actual del mercado</h2>

      <!-- EUR -->
      <div class="flex items-center mb-2">
        <div class="w-8 h-6 bg-gray-200 rounded flex items-center justify-center mr-3">
          <span class="text-sm">EU</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">1 Euro (EUR)</span>
            <span class="font-semibold">
              <span v-if="currentEurRate">{{ currentEurRate.toFixed(2) }}</span>
              <span v-else class="text-gray-400">--.--</span>
              <span class="text-gray-500 text-sm ml-1">CUP</span>
            </span>
          </div>
        </div>
      </div>

      <!-- USD -->
      <div class="flex items-center mt-3 pt-3 border-t">
        <div class="w-8 h-6 bg-gray-200 rounded flex items-center justify-center mr-3">
          <span class="text-sm">US</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">1 Dólar estadounidense (USD)</span>
            <span class="font-semibold">
              <span v-if="currentUsdRate">{{ currentUsdRate.toFixed(2) }}</span>
              <span v-else class="text-gray-400">--.--</span>
              <span class="text-gray-500 text-sm ml-1">CUP</span>
            </span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            <span v-if="loadingRate" class="text-blue-500">Actualizando...</span>
            <span v-else-if="currentUsdRate">Valor obtenido del mercado informal</span>
            <span v-else class="text-amber-600">No disponible</span>
          </div>
        </div>
      </div>

      <button
        @click="fetchExchangeRate"
        :disabled="loadingRate"
        class="mt-4 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
      >
        {{ loadingRate ? 'Actualizando...' : 'Actualizar tasa' }}
      </button>
    </div>

    <!-- Campo de moneda del softwarel -->
    <label class="block mb-2 font-medium">Cambio Moneda del Software (USD ↔ CUP)</label>
    <p class="text-sm text-gray-500 mb-3">
      Este valor se usará en la aplicación para calcular automaticamente precios y costos por todos los usuarios del sistema.
    </p>
    <input
      type="number"
      v-model="cambio"
      placeholder="Ej: 485.00"
      step="0.01"
      min="0"
      class="border border-gray-300 p-3 w-full mb-4 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-500">
        <span v-if="currentUsdRate && cambio">
          Diferencia:
          <span :class="Math.abs(Number(cambio) - currentUsdRate) > 5 ? 'text-amber-600' : 'text-green-600'">
            {{ (Number(cambio) - currentUsdRate).toFixed(2) }} CUP
          </span>
        </span>
      </div>
      <button
        @click="save"
        :disabled="saving || !cambio"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ saving ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const config = useRuntimeConfig()
import Navbar from '@/components/Navbar.vue'

const cambio = ref('')
const saving = ref(false)
const currentUsdRate = ref(null)
const currentEurRate = ref(null)
const loadingRate = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem('config')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.cambio_moneda != null) {
        cambio.value = String(parsed.cambio_moneda)
      }
    }
  } catch (e) {
    console.warn('No se pudo leer .config desde localStorage', e)
  }

  fetchExchangeRate()
})

const fetchExchangeRate = async () => {
  loadingRate.value = true
  try {
    const response = await fetch(`${config.public.backendHost}/exchange-rate`)
    if (!response.ok) {
      console.warn('No se pudo obtener la tasa desde ' + `${config.public.backendHost}/exchange-rate`)
      return
    }
    const data = await response.json()
    if (data.rate != null) currentUsdRate.value = Number(data.rate)
    if (data.eur != null) currentEurRate.value = Number(data.eur)
  } catch (error) {
    console.error('Error al obtener tasa:', error)
  } finally {
    loadingRate.value = false
  }
}

const inverseRate = computed(() => {
  if (currentUsdRate.value) return (1 / currentUsdRate.value).toFixed(6)
  return null
})

const save = async () => {
  saving.value = true
  try {
    const payload = { cambio_moneda: Number(cambio.value) }
    await fetch(`${config.public.backendHost}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    try {
      const raw = localStorage.getItem('.config')
      const parsed = raw ? JSON.parse(raw) : {}
      parsed.cambio_moneda = payload.cambio_moneda
      localStorage.setItem('.config', JSON.stringify(parsed))
    } catch (e) {
      console.warn('No se pudo actualizar localStorage', e)
    }
    alert('Cambios guardados')
  } catch (e) {
    console.error(e)
    alert('Error al guardar cambios')
  } finally {
    saving.value = false
  }
}
</script>
