<template>
  <div class="min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta
      title="Informes - Pactum"
      description="Panel de Informes en Pactum"
      canonical="/informes"
    />
    <Navbar />

    <div class="w-[95%] mx-auto px-4 py-6 mt-20 md:mt-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <h2 class="text-2xl font-bold mb-4">Informes</h2>

        <!-- Panel superior con dos botones y botones de info -->
        <div class="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
          <!-- Botón A: wrapper relative para posicionar el info en la esquina -->
          <div class="relative">
            <button @click="selectInforme('A')" :class="['px-6 py-3 rounded-lg transition relative', selectedInforme === 'A' ? 'bg-primary text-neutral hover:bg-primary/90' : 'bg-white text-gray-700 border']">
              Resumen General de Inventario y Ventas
            </button>
            <!-- Info pequeño en esquina superior derecha -->
            <button @click="toggleInfoA" class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow" aria-label="info informe A">!</button>
            <!-- Texto explicativo visible solo al presionar -->
            <div v-if="showInfoA" class="absolute top-10 right-0 bg-white text-sm text-gray-700 p-2 rounded shadow w-56 z-20">
              Muestra gráficamente el resumen de costos de compra, valor del inventario y ventas en USD y resumiendolo todo en la ganancia hasta el momento.
            </div>
          </div>
        </div>
      </div>

      <!-- Área donde se mostrará el informe (placeholder por ahora) -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-6 h-[80vh] flex flex-col">
        <h3 class="text-xl font-semibold mb-2">Vista de Informe</h3>
        <div class="flex-1 border-2 border-dashed border-gray-200 rounded p-4 text-gray-400">
          <!-- Informe A (gráfico + leyenda) -->
          <div v-if="selectedInforme === 'A'" class="flex flex-col md:flex-row items-center justify-center">
            <div class="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
              <div v-if="isLoadingInformeA" class="text-center">Cargando informe...</div>
              <div v-else class="relative w-48 h-48 md:w-64 md:h-64 max-w-full">
                <div class="absolute inset-0 rounded-full" :style="{ background: pieStyle, borderRadius: '9999px', boxShadow: '0 6px 12px rgba(0,0,0,0.08)' }"></div>
              </div>
            </div>

            <!-- Progress modal for Informe A (error no bloquea vista) -->
            <div v-if="isMetricsLoading" class="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60">
              <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                <h3 class="text-lg font-semibold mb-2">Consultando datos del informe...</h3>
                <div class="w-full bg-gray-100 rounded h-3 overflow-hidden mb-3">
                  <div :style="{ width: metricsProgressPercent + '%' }" class="h-3 bg-primary transition-all"></div>
                </div>
                <div class="text-sm text-gray-600">Progreso: {{ metricsCompleted }} / {{ metricsTotalSteps }} — {{ metricsProgressPercent }}%</div>
              </div>
            </div>

            <div class="w-full md:w-1/2 p-4 overflow-hidden">
              <div class="flex flex-col gap-4">
                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm bg-orange-400 inline-block"></span>
                      <span class="font-medium">Costos de compra</span>
                    </div>
                    <div class="text-xs text-gray-500">Sumatoria de (<em>cantidad-de-entradas * costo-de-entrada-usd</em>) de todo el inventario.</div>
                  </div>
                  <div class="font-semibold text-right">{{ comprasTotal.toFixed(2) }} <span class="text-sm text-gray-500">({{ percentages[0].toFixed(1) }}%)</span></div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm bg-blue-500 inline-block"></span>
                      <span class="font-medium">Inventario (valor)</span>
                    </div>
                    <div class="text-xs text-gray-500">Sumatoria de (<em>costo-usd * cantidad-en-existencia</em>) de todos los productos en el sistema.</div>
                  </div>
                  <div class="font-semibold text-right">{{ inventarioTotal.toFixed(2) }} <span class="text-sm text-gray-500">({{ percentages[1].toFixed(1) }}%)</span></div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm bg-green-500 inline-block"></span>
                      <span class="font-medium">Ventas (USD)</span>
                    </div>
                    <div class="text-xs text-gray-500">Sumatoria de (<em>precio-usd-cobrado-de-venta * cantidad</em>) de todas las ventas.</div>
                  </div>
                  <div class="font-semibold text-right">{{ ventasTotal.toFixed(2) }} <span class="text-sm text-gray-500">({{ percentages[2].toFixed(1) }}%)</span></div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm bg-red-500 inline-block"></span>
                      <span class="font-medium">Salidas (Pérdidas)</span>
                    </div>
                    <div class="text-xs text-gray-500">Sumatoria de (<em>cantidad * producto.costo_usd</em>) de las salidas (pérdidas).</div>
                  </div>
                  <div class="font-semibold text-right">{{ salidasTotal.toFixed(2) }} <span class="text-sm text-gray-500">({{ percentages[3].toFixed(1) }}%)</span></div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                          <span class="w-4 h-4 rounded-sm bg-white border border-gray-300 inline-block"></span>
                          <span class="font-medium">Retiros (USD)</span>
                        </div>
                    <div class="text-xs text-gray-500">Sumatoria convertida en USD: (<em>cantidad_retirada_cup / cambio_moneda</em>) + <em>cantidad_retirada_usd</em>.</div>
                  </div>
                  <div class="font-semibold text-right">{{ retirosTotal.toFixed(2) }}</div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm border border-gray-300 inline-block"></span>
                      <span class="font-medium">Costo Ventas (USD)</span>
                    </div>
                    <div class="text-xs text-gray-500">Sumatoria de (<em>costo-venta * cantidad</em>) de todas las ventas registradas.</div>
                  </div>
                  <div class="font-semibold text-right">{{ costoVentasTotal.toFixed(2) }}</div>
                </div>

                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="w-4 h-4 rounded-sm border border-gray-300 inline-block"></span>
                      <span class="font-medium">Ganancia (Ventas - Costos - Retiros)</span>
                    </div>
                    <div class="text-xs text-gray-500">Ganancia neta: <em>Ventas - Costo de ventas - Pérdidas - Retiros</em></div>
                  </div>
                  <div class="font-semibold text-right">{{ gananciaTotal.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informe B: reemplaza todo el contenido cuando está seleccionado -->
          <div v-else class="w-full flex flex-col items-center justify-start p-4 gap-4">
            <h4 class="text-lg font-medium">Informe B — Rango de fechas</h4>
            <div class="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-stretch">
              <label class="flex-1">
                <div class="text-sm text-gray-600 mb-1">Fecha inicio</div>
                <input type="date" v-model="fechaInicio" class="w-full px-3 py-2 border rounded" />
              </label>
              <label class="flex-1">
                <div class="text-sm text-gray-600 mb-1">Fecha fin</div>
                <input type="date" v-model="fechaFin" class="w-full px-3 py-2 border rounded" />
              </label>
              <div class="flex items-end">
                <button @click="applyInformeB" class="px-4 py-2 bg-primary text-neutral rounded">Generar</button>
              </div>
            </div>
            <div class="text-xs text-gray-500">Valores iniciales: mes anterior (inicio=1, fin=último día).</div>
            <div class="w-full mt-4">
              <div v-if="isLoadingInformeB" class="text-center py-6">Generando informe...</div>
              <div v-else-if="informeBError" class="text-center text-sm text-red-600">Error: {{ informeBError }}</div>
              <div v-else-if="informeBData.length === 0" class="text-center text-sm text-gray-600">No hay ventas en el rango seleccionado.</div>
              <div v-else class="w-full overflow-auto">
                <!-- simple SVG line+points chart, viewBox 0 0 100 50 -->
                <svg viewBox="0 0 100 50" class="w-full h-40">
                  <polyline
                    :points="informeBData.map((p, i) => { const x = (i / (informeBData.length - 1 || 1)) * 100; const min = Math.min(...informeBData.map(a=>a.value)); const max = Math.max(...informeBData.map(a=>a.value)); const y = (max===min)?25: 10 + (1 - ((p.value - min) / (max - min))) * 30; return x + ',' + y; }).join(' ')"
                    fill="none" stroke="#2563eb" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" />
                  <g>
                    <template v-for="(p, i) in informeBData" :key="p.day">
                      <circle :cx="(i / (informeBData.length - 1 || 1)) * 100" :cy="(function(){ const min = Math.min(...informeBData.map(a=>a.value)); const max = Math.max(...informeBData.map(a=>a.value)); return (max===min)?25: 10 + (1 - ((p.value - min) / (max - min))) * 30; })()" r="1.2" fill="#2563eb" />
                    </template>
                  </g>
                </svg>
                <div class="mt-2 text-xs text-gray-600 flex flex-wrap gap-2">
                  <template v-for="p in informeBData" :key="p.day">
                    <div class="px-2 py-1 bg-gray-50 rounded border text-xs">{{ p.day }}: {{ p.value.toFixed(2) }}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import SeoMeta from '@/components/SeoMeta.vue';

const showInfoA = ref(false);
const showInfoB = ref(false);

// Radio selection state: 'A' or 'B'
const selectedInforme = ref('A');

function toggleInfoA(e) {
  e.stopPropagation();
  showInfoA.value = !showInfoA.value;
  if (showInfoA.value) showInfoB.value = false;
}

function toggleInfoB(e) {
  e.stopPropagation();
  showInfoB.value = !showInfoB.value;
  if (showInfoB.value) showInfoA.value = false;
}

function selectInforme(id) {
  if (id === selectedInforme.value) return;
  selectedInforme.value = id;
  if (id === 'A') generateInformeA();
  else if (id === 'B') generateInformeB();
}

function generateInformeB() {
  // Placeholder para futuro desarrollo
  console.log('Informe B seleccionado (placeholder)');
}

// Informe B state (fechas)
const fechaInicio = ref('');
const fechaFin = ref('');
const isLoadingInformeB = ref(false);
const informeBData = ref([]); // [{day, value, idx}]
const informeBError = ref(null);

function formatDateISO(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function setPrevMonthRange() {
  const now = new Date();
  // previous month
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0); // last day prev month
  fechaInicio.value = formatDateISO(start);
  fechaFin.value = formatDateISO(end);
}

function applyInformeB() {
  // Ejecutar petición POST al endpoint de ventas filtrado por fecha
  informeBError.value = null;
  informeBData.value = [];
  isLoadingInformeB.value = true;
  (async () => {
    try {
      // construir rango ISO (inicio 00:00, fin 23:59:59 local convertidos a ISO)
      const minIso = new Date(fechaInicio.value + 'T00:00:00').toISOString();
      const maxIso = new Date(fechaFin.value + 'T23:59:59').toISOString();
      const token = localStorage.getItem('token');
      const body = { fecha_hora_min: minIso, fecha_hora_max: maxIso };
      const resp = await fetch(`${config.public.backendHost}/Venta/filter/1/999999999`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(body)
      });
      if (resp.status === 401) {
        localStorage.removeItem('token');
        navigateTo('/login');
        return;
      }
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(t || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const ventas = (data && data.data) ? data.data : [];
      // Agrupar por día (YYYY-MM-DD) y sumar (precio_cobrado * cantidad) / cambioUSD_al_vender
      const grouped = {};
      for (const v of ventas) {
        const dt = v.fecha_hora ? new Date(v.fecha_hora) : (v.createdAt ? new Date(v.createdAt) : null);
        if (!dt) continue;
        const day = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
        const precio = Number(v.precio_cobrado) || 0;
        const cantidad = Number(v.cantidad) || 0;
        const cambio = Number(v.cambioUSD_al_vender) || 1;
        const value = cambio && cambio !== 0 ? (precio * cantidad) / cambio : (precio * cantidad);
        grouped[day] = (grouped[day] || 0) + value;
      }
      // generar lista de días entre fechaInicio y fechaFin inclusive
      const days = [];
      const s = new Date(fechaInicio.value + 'T00:00:00');
      const e = new Date(fechaFin.value + 'T00:00:00');
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        days.push(day);
      }
      // construir puntos ordenados
      const points = days.map((day, idx) => ({ day, value: +(grouped[day] || 0), idx }));
      informeBData.value = points;
    } catch (err) {
      console.error('Informe B error:', err);
      informeBError.value = err && err.message ? err.message : String(err);
    } finally {
      isLoadingInformeB.value = false;
    }
  })();
}

onMounted(() => {
  // seleccionar Informe A por defecto y ejecutarlo la primera vez
  selectedInforme.value = 'A';
  // Ejecutar informe A al cargar
  generateInformeA();
  // inicializar fechas de Informe B al mes anterior
  setPrevMonthRange();
});

// Informe A state
import { useRuntimeConfig } from '#imports';
import { navigateTo } from 'nuxt/app';
const config = useRuntimeConfig();
const isLoadingInformeA = ref(false);
const comprasTotal = ref(0);
const inventarioTotal = ref(0);
const ventasTotal = ref(0);
const costoVentasTotal = ref(0);
const salidasTotal = ref(0);
// retiros and progress state
const retirosTotal = ref(0);
const isMetricsLoading = ref(false);
const metricsTotalSteps = 5;
const metricsCompleted = ref(0);
const metricsError = ref(false);
const metricsErrorMessage = ref('');

const metricsProgressPercent = computed(() => {
  return Math.min(100, Math.round((metricsCompleted.value / metricsTotalSteps) * 100));
});

async function fetchJson(url, token) {
  const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json', 'Authorization': token } });
  if (resp.status === 401) {
    localStorage.removeItem('token');
    navigateTo('/login');
    throw new Error('Unauthorized');
  }
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `HTTP ${resp.status}`);
  }
  return resp.json();
}

function safeNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

async function generateInformeA() {
  isLoadingInformeA.value = true;
  isMetricsLoading.value = true;
  metricsCompleted.value = 0;
  metricsError.value = false;
  metricsErrorMessage.value = '';
  comprasTotal.value = inventarioTotal.value = ventasTotal.value = costoVentasTotal.value = salidasTotal.value = retirosTotal.value = 0;
  try {
    const token = localStorage.getItem('token');
    if (!token) { navigateTo('/login'); return; }

    // 1) /entrada
    let entradas = [];
    try {
      entradas = await fetchJson(`${config.public.backendHost}/entrada`, token);
    } catch (e) { console.error(e); metricsError.value = true; metricsErrorMessage.value = 'Error consultando entradas'; }
    metricsCompleted.value += 1;
    try {
      let compras = 0;
      for (const e of entradas || []) {
        const cantidad = safeNum(e.cantidadEntrada);
        const costo_usd = safeNum(e.costo_usd);
        compras += cantidad * costo_usd;
      }
      comprasTotal.value = compras;
    } catch (e) { console.error(e); }

    // 2) /producto
    let productos = [];
    try {
      productos = await fetchJson(`${config.public.backendHost}/producto`, token);
    } catch (e) { console.error(e); metricsError.value = true; metricsErrorMessage = 'Error consultando productos'; }
    metricsCompleted.value += 1;
    try {
      let inventario = 0;
      for (const p of productos || []) {
        const costo_usd = safeNum(p.costo_usd);
        const cantidadExist = safeNum(p.cantidadExistencia);
        inventario += costo_usd * cantidadExist;
      }
      inventarioTotal.value = inventario;
    } catch (e) { console.error(e); }

    // 3) /venta
    let ventas = [];
    try {
      ventas = await fetchJson(`${config.public.backendHost}/venta`, token);
    } catch (e) { console.error(e); metricsError.value = true; metricsErrorMessage = 'Error consultando ventas'; }
    metricsCompleted.value += 1;
    try {
      let ventasSum = 0;
      let costoVentasSum = 0;
      for (const v of ventas || []) {
        const precio_cobrado = safeNum(v.precio_cobrado);
        const costo_venta_usd = safeNum(v.costo_venta_usd);
        const cantidad = safeNum(v.cantidad);
        const cambio = safeNum(v.cambioUSD_al_vender) || 1;
        ventasSum += (precio_cobrado * cantidad) / cambio;
        costoVentasSum += (costo_venta_usd * cantidad);
      }
      ventasTotal.value = ventasSum;
      costoVentasTotal.value = costoVentasSum;
    } catch (e) { console.error(e); }

    // 4) /salida (pérdidas)
    let salidas = [];
    try {
      salidas = await fetchJson(`${config.public.backendHost}/salida`, token);
    } catch (e) { console.error(e); metricsError.value = true; metricsErrorMessage = 'Error consultando salidas'; }
    metricsCompleted.value += 1;
    try {
      let salidasSum = 0;
      for (const s of salidas || []) {
        const cantidad = safeNum(s.cantidad);
        const costo_cup = safeNum(s.costo_producto_usd);
        salidasSum += cantidad * costo_cup;
      }
      salidasTotal.value = salidasSum;
    } catch (e) { console.error(e); }

    // 5) /Retiro/filterRetiros - calcular retiros en USD: (cantidad_retirada_cup / cambio_moneda) + cantidad_retirada_usd
    let retiros = [];
    try {
      const retiroRes = await fetch(`${config.public.backendHost}/Retiro/filterRetiros/null/null`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token },
        body: JSON.stringify({})
      });
      if (retiroRes.ok) {
        const retiroData = await retiroRes.json();
        retiros = retiroData && retiroData.data ? retiroData.data : [];
      } else {
        console.error('retiros fetch status', retiroRes.status);
        metricsError.value = true;
        metricsErrorMessage = 'Error consultando retiros';
      }
    } catch (e) { console.error(e); metricsError.value = true; metricsErrorMessage = 'Error consultando retiros'; }
    metricsCompleted.value += 1;
    try {
      let retirosSum = 0;
      for (const r of retiros || []) {
        const cup = safeNum(r.cantidad_retirada_cup);
        const usd = safeNum(r.cantidad_retirada_usd);
        const cambio = safeNum(r.cambio_moneda) || 1;
        const convertedCup = cambio && cambio !== 0 ? (cup / cambio) : cup;
        retirosSum += convertedCup + usd;
      }
      retirosTotal.value = retirosSum;
    } catch (e) { console.error(e); }

  } catch (err) {
    console.error('Error generating informe A:', err);
    metricsError.value = true;
    metricsErrorMessage.value = 'Ocurrió un error generando el informe';
  } finally {
    isLoadingInformeA.value = false;
    isMetricsLoading.value = false;
    metricsCompleted.value = metricsTotalSteps;
  }
}

const pieStyle = computed(() => {
  // Mostrar en el gráfico las categorías: compras, inventario, ventas, salidas (EXCLUIMOS retiros del gráfico)
  const visibleValues = [comprasTotal.value, inventarioTotal.value, ventasTotal.value, salidasTotal.value];
  const colors = ['#F97316', '#0369A1', '#10B981', '#EF4444'];
  const visibleTotal = visibleValues.reduce((s, v) => s + Math.max(0, v), 0);
  const gap = 0.6; // gap percent between slices
  let acc = 0;
  const parts = [];

  if (!visibleTotal || visibleTotal <= 0) {
    // fallback: light gray circle when no data
    return 'conic-gradient(#eef2f7 0% 100%)';
  }

  for (let i = 0; i < visibleValues.length; i++) {
    const v = Math.max(0, visibleValues[i]);
    const pct = (v / visibleTotal) * 100;
    const colorPct = Math.max(0, pct - gap);
    if (colorPct > 0) {
      const start = acc;
      const end = acc + colorPct;
      parts.push(`${colors[i]} ${start}% ${end}%`);
      acc = end;
    }
    // add transparent gap
    acc += gap;
    parts.push(`transparent ${Math.max(0, acc - gap)}% ${acc}%`);
  }
  // ensure full coverage
  if (acc < 100) parts.push(`transparent ${acc}% 100%`);

  return `conic-gradient(${parts.join(', ')})`;
});

const percentages = computed(() => {
  const values = [comprasTotal.value, inventarioTotal.value, ventasTotal.value, salidasTotal.value, retirosTotal.value, costoVentasTotal.value];
  const total = values.reduce((s, v) => s + Math.max(0, v), 0) || 0;
  if (total === 0) return values.map(() => 0);
  return values.map(v => (Math.max(0, v) / total) * 100);
});

// Ganancia: ventas - costo de ventas (no se grafica, solo se muestra en la leyenda)
const gananciaTotal = computed(() => {
  return (ventasTotal.value || 0) - (costoVentasTotal.value || 0) - (salidasTotal.value || 0) - (retirosTotal.value || 0);
});
</script>

<style scoped>
/* Pequeños ajustes visuales si hace falta */
</style>
