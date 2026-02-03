<template>
  <div v-if="modelValue" class="fixed inset-0 z-[12000] flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
      <button @click="close" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">Comprobante de Venta</h3>
        <div class="flex items-center gap-2">
          <select v-model="selectedSize" class="px-2 py-1 border rounded">
            <option v-for="s in sizes" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <button @click="printPreview" class="px-3 py-1 bg-primary text-white rounded flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9V2h12v7M6 18h12v-5H6v5z"/></svg>
            Imprimir
          </button>
          <button @click="downloadPDF" class="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v12m0 0l-4-4m4 4l4-4M6 21h12"/></svg>
            Descargar
          </button>
          <button @click="sharePDF" class="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8a3 3 0 10-2.83-4H9m6 8v6m0 0l3-3m-3 3l-3-3"/></svg>
            Compartir
          </button>
        </div>
      </div>

      <div ref="printSection" :style="pageStyle" class="p-4 border rounded bg-white">
        <div :style="innerStyle">
          <div class="text-center mb-4">
            <div class="text-lg font-bold">Comprobante de pago</div>
          </div>

          <div class="mb-4">
            <div><strong>Fecha creación:</strong> {{ formatDate(data?.createdAt) }}</div>
          </div>

          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2">Producto</th>
                <th class="text-right py-2">Cantidad</th>
                <th class="text-right py-2">Precio</th>
                <th class="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in flatVentas" :key="venta.id_venta" class="border-b">
                <td class="py-2">{{ venta.producto?.nombre || venta.servicio?.nombre || '---' }}</td>
                <td class="py-2 text-right">{{ venta.cantidad }}</td>
                <td class="py-2 text-right">{{ formatMoney(venta.precio_cobrado) }}</td>
                <td class="py-2 text-right">{{ formatMoney((Number(venta.precio_cobrado)||0) * (Number(venta.cantidad)||0)) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 text-right">
            <div><strong>Total:</strong> {{ formatMoney(totalCalculated) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({ modelValue: { type: Boolean, required: true }, data: { type: Object, default: null } });
const emit = defineEmits(['update:modelValue']);

const sizes = [
  { label: 'Térmica 80mm (80×200 mm)', value: 'Thermal80' },
  { label: 'A4 (8.27×11.69 in)', value: 'A4' },
  { label: 'A5 (5.83×8.27 in)', value: 'A5' },
  { label: 'Letter (8.5×11 in)', value: 'Letter' },
  { label: '4×6 (4×6 in)', value: '4x6' },
  { label: '5×7 (5×7 in)', value: '5x7' },
  { label: '8×10 (8×10 in)', value: '8x10' }
];
// Por defecto usamos el tamaño térmico 80mm para impresoras de tickets
const selectedSize = ref('Thermal80');
const printSection = ref(null);

// Physical sizes in mm (width, height)
const SIZE_MAP = {
  A4: [210, 297],
  A5: [148, 210],
  Letter: [216, 279],
  '4x6': [101.6, 152.4],
  '5x7': [127, 177.8],
  '8x10': [203.2, 254]
};
// Añadimos mapa para la opción térmica 80mm (ancho x alto en mm)
// reducir altura por defecto para impresoras térmicas (menos espacio en blanco)
SIZE_MAP.Thermal80 = [80, 120];
const SHRINK_MM = 6; // global shrink for margin buffer

const scaleFactor = computed(() => {
  const base = SIZE_MAP[selectedSize.value] || SIZE_MAP.A4;
  const w = base[0];
  const baseScale = Math.max(0.5, (w - SHRINK_MM) / w);
  const finalScale = baseScale * 0.9; // make content 20% smaller than base scale
  return Number(Math.max(0.3, finalScale).toFixed(3));
});

const innerStyle = computed(() => ({
  transform: `scale(${scaleFactor.value})`,
  transformOrigin: 'top left',
  width: '100%'
}));

const flatVentas = computed(() => {
  if (!props.data) return [];
  if (Array.isArray(props.data.ventas)) return props.data.ventas;
  if (Array.isArray(props.data.data) && props.data.data.length && Array.isArray(props.data.data[0].ventas)) return props.data.data[0].ventas;
  return [];
});

const totalCalculated = computed(() => {
  return flatVentas.value.reduce((acc, v) => acc + (Number(v.precio_cobrado)||0) * (Number(v.cantidad)||0), 0);
});

function formatMoney(v) { return Number(v||0).toFixed(2); }
function formatDate(s) { if (!s) return '-'; try { return new Date(s).toLocaleString(); } catch(e) { return s; } }

const pageStyle = computed(() => {
  // return exact CSS dimensions for the printable area (width x height in mm)
  switch (selectedSize.value) {
    case 'Thermal80': return { width: '80mm', height: '200mm' };
    case 'A5': return { width: '148mm', height: '210mm' };
    case 'Letter': return { width: '216mm', height: '279mm' };
    case '4x6': return { width: '101.6mm', height: '152.4mm' }; // 4in x 6in
    case '5x7': return { width: '127mm', height: '177.8mm' };
    case '8x10': return { width: '203.2mm', height: '254mm' };
    default: return { width: '210mm', height: '297mm' }; // A4
  }
});

function close() { emit('update:modelValue', false); }

function createPrintWindow() {
  // open a new window and write a full HTML document including basic styles
  const w = window.open('', '_blank');
  if (!w) return null;
  const content = printSection.value ? printSection.value.innerHTML : '';
  // compute selected physical dimensions (mm)
  const base = SIZE_MAP[selectedSize.value] || SIZE_MAP.A4;
  const pageW = base[0];
  const pageH = base[1];
  // CSS: set @page size and remove default margins so small thermal sizes are respected
  const css = `
    @page { size: ${pageW}mm ${pageH}mm; margin: 0; }
    html, body { width: ${pageW}mm; height: ${pageH}mm; margin: 0; padding: 0; }
    /* reducir padding para que no quede tanto espacio en blanco arriba/abajo */
    body{font-family: Helvetica,Arial,sans-serif;padding:3mm;color:#111;box-sizing:border-box}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{padding:4px;border-bottom:1px solid #eee}
    .text-right{text-align:right}
    /* ensure printed elements don't overflow */
    * { box-sizing: border-box; }
  `;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Comprobante</title><style>${css}</style></head><body>${content}</body></html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
  // ensure print is called once content has rendered
  const tryPrint = () => { try { w.focus(); w.print(); } catch (e) { console.warn('Print failed', e); } };
  // attempt on load and as fallback after short timeout
  w.onload = () => setTimeout(tryPrint, 300);
  setTimeout(tryPrint, 800);
  return w;
}

function printPreview() {
  // open printable window and trigger print there
  const w = createPrintWindow();
  if (!w) {
    alert('No se pudo abrir la ventana de impresión. Revisa bloqueadores de ventanas emergentes.');
  }
}

function downloadPDF() {
  console.log('downloadPDF: start');
  // Prefer a local install via dynamic `import('html2pdf.js')` to avoid CDN/script-blocking.
  const loadHtml2pdf = () => new Promise(async (resolve, reject) => {
    if (window.html2pdf) return resolve(window.html2pdf);
    // Try dynamic import (works when the package is installed locally and bundled by the dev server)
    try {
      const mod = await import(/* webpackIgnore: true */ 'html2pdf.js');
      // html2pdf exposes a factory function; assign to window for compatibility
      window.html2pdf = (mod && mod.default) ? mod.default : window.html2pdf;
      if (window.html2pdf) return resolve(window.html2pdf);
    } catch (e) {
      // dynamic import failed (likely not installed). We'll attempt CDN as a fallback below.
      console.warn('dynamic import html2pdf failed:', e && e.message ? e.message : e);
    }

    // Fallback: try loading the bundled script (may be blocked by Tracking Prevention).
    const existing = document.querySelector('script[data-html2pdf]');
    if (existing) {
      const onLoad = () => { existing.removeEventListener('load', onLoad); existing.removeEventListener('error', onError); resolve(window.html2pdf); };
      const onError = () => { existing.removeEventListener('load', onLoad); existing.removeEventListener('error', onError); reject(new Error('Failed to load html2pdf from CDN')); };
      const onErrorRef = onError;
      existing.addEventListener('load', onLoad);
      existing.addEventListener('error', onErrorRef);
      return;
    }

    const s = document.createElement('script');
    // using unpkg CDN as last resort — may be blocked by browser Tracking Prevention
    s.src = 'https://unpkg.com/html2pdf.js@0.9.2/dist/html2pdf.bundle.min.js';
    s.setAttribute('data-html2pdf', '1');
    s.onload = () => resolve(window.html2pdf);
    s.onerror = () => reject(new Error('Failed to load html2pdf from CDN'));
    document.head.appendChild(s);
    // safety timeout
    setTimeout(() => reject(new Error('html2pdf load timeout')), 10000);
  });

  (async () => {
    try {
      console.log('downloadPDF: loading html2pdf');
      const html2pdf = await loadHtml2pdf();
      console.log('downloadPDF: html2pdf loaded', !!html2pdf);
      if (!printSection.value) throw new Error('Sección a imprimir no encontrada');

      // Define physical sizes (width, height) in mm for each choice
      const sizeMap = {
        A4: [210, 297],
        A5: [148, 210],
        Letter: [216, 279],
        '4x6': [101.6, 152.4],
        '5x7': [127, 177.8],
        '8x10': [203.2, 254]
      };

      const shrinkMm = 6; // reduce final PDF dims by this amount to leave margin of error
      const base = sizeMap[selectedSize.value] || sizeMap.A4;
      // ensure we use width x height (portrait by default)
      const targetWidth = Math.max(10, base[0] - shrinkMm);
      const targetHeight = Math.max(10, base[1] - shrinkMm);

      const opt = {
        margin: 3, // small margin
        filename: 'comprobante.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: [targetWidth, targetHeight] }
      };

      await html2pdf().set(opt).from(printSection.value).save();
      console.log('downloadPDF: saved');
    } catch (err) {
      console.error('downloadPDF error:', err);
      alert('No se pudo generar el PDF automáticamente: ' + (err && err.message ? err.message : String(err)));
      // fallback to opening print window
      const w = createPrintWindow();
      if (!w) {
        // fallback: download HTML
        const content = printSection.value ? printSection.value.innerHTML : '';
        const blob = new Blob([`<!doctype html><html><body>${content}</body></html>`], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comprobante.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    }
  })();
}

async function sharePDF() {
  try {
    const html = `<html><body>${printSection.value ? printSection.value.innerHTML : ''}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const file = new File([blob], 'comprobante.html', { type: 'text/html' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Comprobante' });
      return;
    }
    await navigator.clipboard.writeText(html);
    alert('Contenido copiado al portapapeles para compartir.');
  } catch (e) {
    console.error('Share failed', e);
    alert('Compartir no disponible en este navegador.');
  }
}
</script>

<style scoped>
.bg-primary { background-color: #2563eb; }
</style>
