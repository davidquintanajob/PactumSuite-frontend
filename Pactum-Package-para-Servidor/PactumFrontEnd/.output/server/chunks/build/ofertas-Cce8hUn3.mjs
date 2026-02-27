import { ref, mergeProps, h, watch, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { _ as _sfc_main$3 } from './MessageBanner-BfG2bL-b.mjs';
import { _ as _sfc_main$4 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$5 } from './SelectSearch-DDW7FYzz.mjs';
import { _ as _export_sfc, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import './v3-CVirIiRo.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$2 = {
  __name: "OfertaModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    oferta: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    isViewing: { type: Boolean, default: false },
    usuarios: { type: Array, default: () => [] },
    contratos: { type: Array, default: () => [] },
    id_usuario: { type: [Number, null], default: null },
    id_contrato: { type: [Number, null], default: null }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      fecha_inicio: "",
      fecha_fin: "",
      id_contrato: "",
      id_usuario: "",
      estado: "no_facturada"
    });
    const descripciones = ref([""]);
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => [props.oferta, props.id_usuario, props.id_contrato], ([oferta, id_usuario, id_contrato]) => {
      var _a2, _b2;
      var _a, _b, _c, _d;
      if (oferta && Object.keys(oferta).length > 0) {
        formData.value = {
          fecha_inicio: oferta.fecha_inicio ? oferta.fecha_inicio.split("T")[0] : "",
          fecha_fin: oferta.fecha_fin ? oferta.fecha_fin.split("T")[0] : "",
          id_contrato: id_contrato !== null && id_contrato !== void 0 ? (_a2 = (_a = props.contratos.find((c) => c.id_contrato === id_contrato)) == null ? void 0 : _a.id_contrato) != null ? _a2 : null : Number(oferta.id_contrato || ((_b = oferta.contrato) == null ? void 0 : _b.id_contrato) || 0) || null,
          id_usuario: id_usuario !== null && id_usuario !== void 0 ? (_b2 = (_c = props.usuarios.find((u) => u.id_usuario === id_usuario)) == null ? void 0 : _c.id_usuario) != null ? _b2 : null : Number(oferta.id_usuario || ((_d = oferta.usuario) == null ? void 0 : _d.id_usuario) || 0) || null,
          estado: oferta.estado === "facturada" ? "facturada" : "no_facturada"
        };
        if (oferta.descripciones && Array.isArray(oferta.descripciones)) {
          descripciones.value = oferta.descripciones.map((d) => d.descripcion || "");
          if (descripciones.value.length > 0) {
            descripciones.value.push("");
          }
        } else {
          descripciones.value = [""];
        }
      } else {
        formData.value = {
          fecha_inicio: "",
          fecha_fin: "",
          id_contrato: null,
          id_usuario: null,
          estado: "no_facturada"
        };
        descripciones.value = [""];
      }
    }, { immediate: true });
    watch(
      [() => props.usuarios, () => props.contratos, () => props.id_usuario, () => props.id_contrato],
      ([newUsuarios, newContratos, id_usuario, id_contrato]) => {
        var _a2, _b2;
        var _a, _b, _c, _d;
        if (props.oferta && Object.keys(props.oferta).length > 0) {
          if (id_contrato !== null && id_contrato !== void 0) {
            formData.value.id_contrato = (_a2 = (_a = props.contratos.find((c) => c.id_contrato === id_contrato)) == null ? void 0 : _a.id_contrato) != null ? _a2 : null;
          } else {
            formData.value.id_contrato = Number(props.oferta.id_contrato || ((_b = props.oferta.contrato) == null ? void 0 : _b.id_contrato) || 0) || null;
          }
          if (id_usuario !== null && id_usuario !== void 0) {
            formData.value.id_usuario = (_b2 = (_c = props.usuarios.find((u) => u.id_usuario === id_usuario)) == null ? void 0 : _c.id_usuario) != null ? _b2 : null;
          } else {
            formData.value.id_usuario = Number(props.oferta.id_usuario || ((_d = props.oferta.usuario) == null ? void 0 : _d.id_usuario) || 0) || null;
          }
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" }, _attrs))}>`);
        if (loadingBanner.value) {
          _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
          _push(ssrRenderComponent(_sfc_main$3, {
            title: loadingBanner.value.title,
            description: loadingBanner.value.description,
            type: loadingBanner.value.type,
            onClose: ($event) => loadingBanner.value = null,
            class: "pointer-events-auto"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Oferta" : __props.isEditing ? "Editar Oferta" : "Nueva Oferta")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Descripciones</label><div class="space-y-2"><!--[-->`);
        ssrRenderList(descripciones.value, (descripcion, index) => {
          _push(`<div class="flex items-start space-x-2"><textarea${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}${ssrIncludeBooleanAttr(index === 0) ? " required" : ""} rows="2" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrRenderAttr("placeholder", `Descripci\xF3n ${index + 1}${index === 0 ? " (requerida)" : ""}`)}>${ssrInterpolate(descripciones.value[index])}</textarea>`);
          if (!__props.isViewing && descripciones.value.length > 1) {
            _push(`<button type="button" class="mt-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (!__props.isViewing && descripciones.value.length < 15) {
          _push(`<button type="button" class="w-full px-4 py-2 text-primary border-2 border-dashed border-accent/60 rounded-lg hover:border-accent/80 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Agregar descripci\xF3n </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label><input${ssrRenderAttr("value", formData.value.fecha_inicio)} type="date"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} required class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label><input${ssrRenderAttr("value", formData.value.fecha_fin)} type="date"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} required class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Contrato</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: formData.value.id_contrato,
          "onUpdate:modelValue": ($event) => formData.value.id_contrato = $event,
          options: __props.contratos,
          labelKey: (c) => {
            var _a, _b, _c;
            return `${(_a = c.entidad) == null ? void 0 : _a.nombre}: ${c == null ? void 0 : c.num_consecutivo} - ${(_b = c.tipoContrato) == null ? void 0 : _b.nombre} - (${(_c = c.fecha_inicio) == null ? void 0 : _c.substring(0, 4)})`;
          },
          valueKey: "id_contrato",
          placeholder: "Buscar contrato...",
          disabled: __props.isViewing || isLoading.value,
          required: ""
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: formData.value.id_usuario,
          "onUpdate:modelValue": ($event) => formData.value.id_usuario = $event,
          options: __props.usuarios,
          labelKey: "nombre",
          valueKey: "id_usuario",
          placeholder: "Buscar usuario...",
          disabled: __props.isViewing || isLoading.value,
          required: ""
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Estado</label><div class="space-y-2"><label class="${ssrRenderClass([{ "opacity-50": __props.isViewing || isLoading.value }, "flex items-center cursor-pointer"])}"><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(formData.value.estado, "facturada")) ? " checked" : ""} value="facturada"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="sr-only"><div class="${ssrRenderClass([formData.value.estado === "facturada" ? "bg-primary border-primary text-neutral shadow-md" : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200", "px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center"])}"><div class="w-4 h-4 border-2 border-current rounded-full mr-3 flex items-center justify-center">`);
        if (formData.value.estado === "facturada") {
          _push(`<div class="w-2 h-2 bg-white rounded-full"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><span class="font-medium">Facturada</span></div></label><label class="${ssrRenderClass([{ "opacity-50": __props.isViewing || isLoading.value }, "flex items-center cursor-pointer"])}"><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(formData.value.estado, "no_facturada")) ? " checked" : ""} value="no_facturada"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="sr-only"><div class="${ssrRenderClass([formData.value.estado === "no_facturada" ? "bg-gray-500 border-gray-600 text-white shadow-md" : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200", "px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center"])}"><div class="w-4 h-4 border-2 border-current rounded-full mr-3 flex items-center justify-center">`);
        if (formData.value.estado === "no_facturada") {
          _push(`<div class="w-2 h-2 bg-white rounded-full"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><span class="font-medium">No Facturada</span></div></label></div></div></div>`);
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Oferta")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
        if (errorMsg.value) {
          _push(`<div class="text-red-600 text-sm mt-2">${ssrInterpolate(errorMsg.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OfertaModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "ModalPDF",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    ofertaData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const modoLectura = ref(false);
    const form = reactive({
      empresa: "SOLUTEL S.R.L",
      titulo: "OFERTA COMERCIAL",
      numero: "/25",
      proveedor: "SOLUTEL S.R.L",
      domicilioProveedor: "Calle Ernesto Valdez Mu\xF1oz No. 10 entre Independencia y C\xE9spedes,",
      cupProveedor: "1252354000140315",
      usdProveedor: "1299750000010836",
      nitProveedor: "50004182197",
      domicilioCliente: "",
      cupCliente: "",
      sucursalCliente: "",
      reeupCliente: "",
      nitCliente: "",
      tabla: Array.from({ length: 9 }, (_, i) => ({
        no: i === 0 ? "No.1" : "",
        descripcion: "",
        um: "",
        cantidad: "",
        precio: "",
        importe: ""
      })),
      totalPrecio: "0.00",
      totalImporte: "0.00",
      nombreProveedor: "Belkis Mart\xEDnez Arevalo",
      ciProveedor: "70081403279",
      cargoProveedor: "Especialista",
      fechaEntregaProveedor: "",
      firmaProveedor: "",
      cunoProveedor: "",
      nombreCliente: "",
      ciCliente: "",
      cargoCliente: "",
      fechaEntregaCliente: "",
      firmaCliente: "",
      observaciones: "",
      pagoA: "SOLUTEL S.R.L Cuenta Bancaria: CUP:1252354000140315",
      validez: ""
    });
    const valoresBase = {
      empresa: "SOLUTEL S.R.L",
      titulo: "OFERTA COMERCIAL",
      numero: "/25",
      proveedor: "SOLUTEL S.R.L",
      domicilioProveedor: "Calle Ernesto Valdez Mu\xF1oz No. 10 entre Independencia y C\xE9spedes,",
      cupProveedor: "1252354000140315",
      usdProveedor: "1299750000010836",
      nitProveedor: "50004182197",
      domicilioCliente: "",
      cupCliente: "",
      sucursalCliente: "",
      reeupCliente: "",
      nitCliente: "",
      tabla: Array.from({ length: 9 }, (_, i) => ({
        no: i === 0 ? "No.1" : "",
        descripcion: "",
        um: "",
        cantidad: "",
        precio: "",
        importe: ""
      })),
      totalPrecio: "0.00",
      totalImporte: "0.00",
      nombreProveedor: "Belkis Mart\xEDnez Arevalo",
      ciProveedor: "70081403279",
      cargoProveedor: "Especialista",
      fechaEntregaProveedor: "",
      firmaProveedor: "",
      cunoProveedor: "",
      nombreCliente: "",
      ciCliente: "",
      cargoCliente: "",
      fechaEntregaCliente: "",
      firmaCliente: "",
      observaciones: "",
      pagoA: "SOLUTEL S.R.L Cuenta Bancaria: CUP:1252354000140315",
      validez: "La Oferta v\xE1lida por 7 d\xEDas"
    };
    function resetForm() {
      Object.assign(form, JSON.parse(JSON.stringify(valoresBase)));
    }
    function calcularTotales() {
      let totalPrecio = 0;
      let totalImporte = 0;
      form.tabla.forEach((row) => {
        const precio = parseFloat(row.precio) || 0;
        const importe = parseFloat(row.importe) || 0;
        if (props.ofertaData.fecha_inicio && props.ofertaData.fecha_fin) {
          const inicio = new Date(props.ofertaData.fecha_inicio);
          const fin = new Date(props.ofertaData.fecha_fin);
          const diffMs = fin - inicio;
          const diffDays = Math.ceil(diffMs / (1e3 * 60 * 60 * 24));
          form.validez = `La Oferta v\xE1lida por ${diffDays} d\xEDas`;
        } else {
          form.validez = "La Oferta v\xE1lida por 7 d\xEDas";
        }
        totalPrecio += precio;
        totalImporte += importe;
      });
      form.totalPrecio = totalPrecio.toFixed(2);
      form.totalImporte = totalImporte.toFixed(2);
    }
    watch(
      () => props.show,
      (nuevo) => {
        if (nuevo) {
          resetForm();
        }
        if (nuevo && props.ofertaData) {
          if (props.ofertaData.contrato && props.ofertaData.contrato.entidad) {
            const entidad = props.ofertaData.contrato.entidad;
            form.domicilioCliente = entidad.direccion || "";
            form.cupCliente = entidad.cuenta_bancaria || "";
            form.sucursalCliente = "";
            form.reeupCliente = entidad.codigo_reo || "";
            form.nitCliente = entidad.codigo_nit || "";
          }
          if (props.ofertaData.descripciones && Array.isArray(props.ofertaData.descripciones)) {
            form.tabla.forEach((row) => {
              row.descripcion = "";
            });
            props.ofertaData.descripciones.forEach((descripcionObj, index) => {
              if (index < form.tabla.length) {
                form.tabla[index].descripcion = descripcionObj.descripcion || "";
                form.tabla[index].no = `No.${index + 1}`;
              }
            });
            calcularTotales();
          } else if (props.ofertaData.descripcion) {
            form.tabla[0].descripcion = props.ofertaData.descripcion;
            calcularTotales();
          }
        }
        if (!nuevo) {
          resetForm();
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" }, _attrs))} data-v-ba4eb84b><div class="bg-neutral rounded-lg shadow-lg w-full max-w-3xl p-6 relative" style="${ssrRenderStyle({ "max-height": "95vh", "overflow-y": "auto" })}" data-v-ba4eb84b><button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" data-v-ba4eb84b>\xD7</button><div class="overflow-y-auto" style="${ssrRenderStyle({ "max-height": "80vh" })}" data-v-ba4eb84b><div class="bg-neutral border-2 border-primary p-0 text-xs font-sans" style="${ssrRenderStyle({ "min-width": "700px" })}" data-v-ba4eb84b><div class="flex items-center border-b-2 border-primary" data-v-ba4eb84b><div class="flex-1 text-center text-2xl font-bold text-primary py-2" data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.empresa)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.empresa)} class="w-full text-center font-bold text-primary bg-transparent outline-none" data-v-ba4eb84b>`);
        }
        _push(`</div><div class="flex-1 text-center text-2xl font-bold text-primary py-2 border-l-2 border-primary" data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.titulo)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.titulo)} class="w-full text-center font-bold text-primary bg-transparent outline-none" data-v-ba4eb84b>`);
        }
        _push(`</div><div class="w-20 text-right text-2xl font-bold text-primary py-2 border-l-2 border-primary pr-2" data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.numero)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.numero)} class="w-full text-right font-bold text-primary bg-transparent outline-none" data-v-ba4eb84b>`);
        }
        _push(`</div></div><div class="p-2 border-b border-primary" data-v-ba4eb84b><span class="font-bold text-primary" data-v-ba4eb84b>Datos del Proveedor:</span>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.proveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.proveedor)} class="font-bold bg-transparent outline-none" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Domicilio Legal: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.domicilioProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.domicilioProveedor)} class="bg-transparent outline-none w-2/3" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Cuentas Bancarias en <span class="font-bold" data-v-ba4eb84b>CUP:`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.cupProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.cupProveedor)} class="bg-transparent outline-none w-32 font-bold" data-v-ba4eb84b>`);
        }
        _push(`</span> en <span class="font-bold" data-v-ba4eb84b>USD: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.usdProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.usdProveedor)} class="bg-transparent outline-none w-40 font-bold" data-v-ba4eb84b>`);
        }
        _push(`</span><br data-v-ba4eb84b> NIT: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.nitProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.nitProveedor)} class="bg-transparent outline-none w-40" data-v-ba4eb84b>`);
        }
        _push(`</div><div class="p-2 border-b border-primary" data-v-ba4eb84b><span class="font-bold text-primary" data-v-ba4eb84b>Datos del Cliente:</span>`);
        if (props.ofertaData && props.ofertaData.contrato && props.ofertaData.contrato.entidad && props.ofertaData.contrato.entidad.nombre) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(props.ofertaData.contrato.entidad.nombre)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<br data-v-ba4eb84b> Domicilio Legal: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.domicilioCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.domicilioCliente)} class="bg-transparent outline-none w-2/3" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Cuentas Bancarias en CUP: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.cupCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.cupCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(` Sucursal: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.sucursalCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.sucursalCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> C\xF3digo REEUP: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.reeupCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.reeupCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(` NIT: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.nitCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.nitCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`</div><table class="w-full border-collapse border-primary" style="${ssrRenderStyle({ "font-size": "12px", "table-layout": "fixed" })}" data-v-ba4eb84b><thead data-v-ba4eb84b><tr class="bg-accent/40 text-primary" style="${ssrRenderStyle({ "height": "40px" })}" data-v-ba4eb84b><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "8%" })}" data-v-ba4eb84b>No</th><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "35%" })}" data-v-ba4eb84b>Descripci\xF3n</th><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "12%" })}" data-v-ba4eb84b>U/M</th><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "15%" })}" data-v-ba4eb84b>Cantidad</th><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "15%" })}" data-v-ba4eb84b>Precio</th><th class="border border-primary px-1" style="${ssrRenderStyle({ "width": "15%" })}" data-v-ba4eb84b>Importe</th></tr></thead><tbody data-v-ba4eb84b><!--[-->`);
        ssrRenderList(form.tabla, (row, i) => {
          _push(`<tr style="${ssrRenderStyle({ "height": "40px" })}" data-v-ba4eb84b><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.no)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.no)} class="w-full bg-transparent outline-none text-center" data-v-ba4eb84b>`);
          }
          _push(`</td><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.descripcion)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.descripcion)} class="w-full bg-transparent outline-none" data-v-ba4eb84b>`);
          }
          _push(`</td><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.um)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.um)} class="w-full bg-transparent outline-none text-center" data-v-ba4eb84b>`);
          }
          _push(`</td><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.cantidad)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.cantidad)} class="w-full bg-transparent outline-none text-center" data-v-ba4eb84b>`);
          }
          _push(`</td><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.precio)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.precio)} class="w-full bg-transparent outline-none text-center" data-v-ba4eb84b>`);
          }
          _push(`</td><td class="border border-primary px-1" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
          if (modoLectura.value) {
            _push(`<span data-v-ba4eb84b>${ssrInterpolate(row.importe)}</span>`);
          } else {
            _push(`<input${ssrRenderAttr("value", row.importe)} class="w-full bg-transparent outline-none text-center" readonly data-v-ba4eb84b>`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--><tr style="${ssrRenderStyle({ "height": "40px" })}" data-v-ba4eb84b><td class="border border-primary px-1 text-right font-bold" colspan="4" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>Totales</td><td class="border border-primary px-1 text-right font-bold" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.totalPrecio)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.totalPrecio)} class="w-full bg-transparent outline-none text-right font-bold" data-v-ba4eb84b>`);
        }
        _push(`</td><td class="border border-primary px-1 text-right font-bold" style="${ssrRenderStyle({ "vertical-align": "middle" })}" data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.totalImporte)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.totalImporte)} class="w-full bg-transparent outline-none text-right font-bold" data-v-ba4eb84b>`);
        }
        _push(`</td></tr></tbody></table><div class="flex border-t border-primary mt-0" data-v-ba4eb84b><div class="w-1/2 p-2 border-r border-primary" data-v-ba4eb84b><div class="font-bold text-primary" data-v-ba4eb84b>REPRESENTANTE DEL PROVEEDOR</div> Nombre: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.nombreProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.nombreProveedor)} class="bg-transparent outline-none w-40" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> CI: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.ciProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.ciProveedor)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Cargo: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.cargoProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.cargoProveedor)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Fecha de Entrega: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.fechaEntregaProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.fechaEntregaProveedor)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Firma: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.firmaProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.firmaProveedor)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Cu\xF1o: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.cunoProveedor)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.cunoProveedor)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`</div><div class="w-1/2 p-2" data-v-ba4eb84b><div class="font-bold text-primary" data-v-ba4eb84b>REPRESENTANTE DEL CLIENTE</div> Nombre: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.nombreCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.nombreCliente)} class="bg-transparent outline-none w-40" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> CI: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.ciCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.ciCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Cargo: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.cargoCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.cargoCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Fecha de Entrega: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.fechaEntregaCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.fechaEntregaCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`<br data-v-ba4eb84b> Firma: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.firmaCliente)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.firmaCliente)} class="bg-transparent outline-none w-32" data-v-ba4eb84b>`);
        }
        _push(`</div></div><div class="p-2 border-t border-primary" data-v-ba4eb84b><span class="font-bold text-primary" data-v-ba4eb84b>Observaciones:</span><br data-v-ba4eb84b>`);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.observaciones)}</span>`);
        } else {
          _push(`<textarea class="w-full bg-transparent outline-none resize-none" rows="2" data-v-ba4eb84b>${ssrInterpolate(form.observaciones)}</textarea>`);
        }
        _push(`<br data-v-ba4eb84b><span class="font-bold" data-v-ba4eb84b>Paguese a: `);
        if (modoLectura.value) {
          _push(`<span data-v-ba4eb84b>${ssrInterpolate(form.pagoA)}</span>`);
        } else {
          _push(`<input${ssrRenderAttr("value", form.pagoA)} class="bg-transparent outline-none w-96 font-bold" data-v-ba4eb84b>`);
        }
        _push(`</span><br data-v-ba4eb84b><span class="text-red-600 font-bold" data-v-ba4eb84b>${ssrInterpolate(form.validez)}</span></div></div></div><div class="flex justify-end mt-4" data-v-ba4eb84b><button class="px-6 py-2 bg-primary text-neutral rounded hover:bg-primary/90 flex items-center" data-v-ba4eb84b><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-ba4eb84b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-ba4eb84b></path></svg> Exportar a PDF </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModalPDF.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ModalPDF = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ba4eb84b"]]);
const _sfc_main = {
  __name: "ofertas",
  __ssrInlineRender: true,
  setup(__props) {
    const fecha_inicio = ref("");
    const fecha_fin = ref("");
    const id_usuario = ref("");
    const id_contrato = ref("");
    const showFilters = ref(false);
    const usuarios = ref([]);
    const contratos = ref([]);
    const showModal = ref(false);
    const selectedOferta = ref({});
    const isEditing = ref(false);
    const isViewing = ref(false);
    const showModalPDF = ref(false);
    const ofertaParaPDF = ref({});
    const ofertasColumns = [
      { key: "fecha_inicio", label: "Fecha Inicio" },
      { key: "fecha_fin", label: "Fecha Fin" },
      { key: "contrato.entidad.nombre", label: "Entidad" },
      { key: "contrato.num_consecutivo", label: "Num Contrato" },
      { key: "usuario.nombre", label: "Usuario" },
      {
        key: "estado",
        label: "Estado",
        cellRenderer: (value) => {
          if (!value) return "";
          const estado = value.toLowerCase();
          switch (estado) {
            case "facturada":
              return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/30 text-primary">Facturada</span>';
            case "vigente":
              return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Vigente</span>';
            case "vencida":
              return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Vencida</span>';
            default:
              return value;
          }
        }
      }
    ];
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(20);
    const itemsData = ref([]);
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const ofertaAEliminar = ref(null);
    const config = useRuntimeConfig();
    const fetchUsuariosYContratos = async () => {
      try {
        const token = localStorage.getItem("token");
        const resUsuarios = await fetch(`${config.public.backendHost}/usuario`, {
          method: "GET",
          headers: {
            "Authorization": token,
            "Accept": "application/json"
          }
        });
        const dataUsuarios = await resUsuarios.json();
        usuarios.value = Array.isArray(dataUsuarios.data) ? dataUsuarios.data : dataUsuarios;
        const resContratos = await fetch(`${config.public.backendHost}/contrato`, {
          method: "GET",
          headers: {
            "Authorization": token,
            "Accept": "application/json"
          }
        });
        const dataContratos = await resContratos.json();
        contratos.value = Array.isArray(dataContratos.data) ? dataContratos.data : dataContratos;
      } catch (error) {
        console.error("Error al cargar usuarios o contratos:", error);
      }
    };
    const fetchItems = async (page = 1, limit = 20, fecha_inicio2 = "", fecha_fin2 = "", id_contrato_ = "", id_usuario_ = "", descripcion_ = "") => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const body = {
          descripcion: descripcion_,
          fecha_inicio: fecha_inicio2,
          fecha_fin: fecha_fin2,
          id_contrato: id_contrato_,
          id_usuario: id_usuario_,
          page,
          limit
        };
        const response = await fetch(`${config.public.backendHost}/oferta/filterOfertas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(body)
        });
        if (response.status === 401) {
          errorBanner.value = {
            title: "Sesi\xF3n Expirada",
            description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.",
            type: "warning"
          };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            navigateTo("/");
          }, 3e3);
          return;
        }
        if (response.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        const data = await response.json();
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return dateStr.split("T")[0];
        };
        const ofertasFormateadas = (data || []).map((oferta) => ({
          ...oferta,
          fecha_inicio: formatDate(oferta.fecha_inicio),
          fecha_fin: formatDate(oferta.fecha_fin),
          contrato: oferta.contrato ? {
            ...oferta.contrato,
            fecha_inicio: formatDate(oferta.contrato.fecha_inicio),
            fecha_fin: formatDate(oferta.contrato.fecha_fin)
          } : oferta.contrato
        }));
        itemsData.value = ofertasFormateadas;
        totalItems.value = itemsData.value.length;
      } catch (error) {
        console.error("Error al cargar las ofertas:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchItems(newPage, itemsPorPage.value, fecha_inicio.value, fecha_fin.value, id_contrato.value, id_usuario.value, "");
    };
    const handleRowClick = (item) => {
      abrirModalOferta(item, "ver");
    };
    const deleteIcon = {
      render() {
        return h("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          class: "h-6 w-6 text-neutral",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor"
        }, [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          })
        ]);
      }
    };
    async function abrirModalOferta(item, modo) {
      if (!usuarios.value.length || !contratos.value.length) {
        await fetchUsuariosYContratos();
      }
      selectedOferta.value = { ...item };
      isEditing.value = modo === "editar";
      isViewing.value = modo === "ver";
      showModal.value = true;
    }
    const ofertasActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "h-5 w-5",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor"
            }, [
              h("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              })
            ]);
          }
        },
        handler: (item) => {
          abrirModalOferta(item, "editar");
        },
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Ver PDF",
        icon: {
          render() {
            return h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "h-5 w-5",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor"
            }, [
              h("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              })
            ]);
          }
        },
        handler: (item) => {
          ofertaParaPDF.value = { ...item };
          showModalPDF.value = true;
        },
        buttonClass: "px-3 py-1 bg-primary text-neutral rounded-md hover:bg-primary/90"
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => {
          ofertaAEliminar.value = item;
          showConfirmBanner.value = true;
        },
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    function confirmDeleteOferta() {
      showConfirmBanner.value = false;
      if (!ofertaAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        fetch(`${config.public.backendHost}/oferta/DeleteOferta/${ofertaAEliminar.value.id_oferta}`, {
          method: "DELETE",
          headers: {
            "Authorization": token,
            "Accept": "application/json"
          }
        }).then(async (response) => {
          if (response.status === 401) {
            errorBanner.value = {
              title: "Sesi\xF3n Expirada",
              description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.",
              type: "warning"
            };
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(() => {
              navigateTo("/");
            }, 3e3);
            return;
          }
          if (response.status === 403) {
            errorBanner.value = {
              title: "Acceso Denegado",
              description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
              type: "error"
            };
            return;
          }
          if (!response.ok) {
            const errorData = await response.json();
            errorBanner.value = {
              title: `Error al eliminar: ${response.status}`,
              description: errorData.message || JSON.stringify(errorData),
              type: "error"
            };
            return;
          }
          errorBanner.value = {
            title: "Oferta eliminada",
            description: "La oferta fue eliminada correctamente",
            type: "success"
          };
          await fetchItems(currentPage.value, itemsPorPage.value, fecha_inicio.value, fecha_fin.value, id_contrato.value, id_usuario.value, "");
        }).catch((error) => {
          errorBanner.value = {
            title: "Error",
            description: error.message,
            type: "error"
          };
        }).finally(() => {
          ofertaAEliminar.value = null;
        });
      } catch (error) {
        errorBanner.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
        ofertaAEliminar.value = null;
      }
    }
    const handleOfertaSubmit = async (formData) => {
      try {
        let estadoFinal;
        if (formData.estado === "facturada") {
          estadoFinal = "facturada";
        } else {
          const fechaActual = /* @__PURE__ */ new Date();
          const fechaFin = new Date(formData.fecha_fin);
          if (fechaActual > fechaFin) {
            estadoFinal = "vencida";
          } else {
            estadoFinal = "vigente";
          }
        }
        const datosParaEnviar = {
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin,
          id_contrato: formData.id_contrato,
          id_usuario: formData.id_usuario,
          estado: estadoFinal,
          descripciones: formData.descripciones.map((d) => d.descripcion)
        };
        const token = localStorage.getItem("token");
        const url = isEditing.value ? `${config.public.backendHost}/oferta/UpdateOferta/${selectedOferta.value.id_oferta}` : `${config.public.backendHost}/oferta/CreateOferta`;
        const response = await fetch(url, {
          method: isEditing.value ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(datosParaEnviar)
        });
        if (response.status === 401) {
          errorBanner.value = {
            title: "Sesi\xF3n Expirada",
            description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.",
            type: "warning"
          };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            navigateTo("/");
          }, 3e3);
          return;
        }
        if (response.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (response.status === 400 || response.status === 500) {
          const errorData = await response.json();
          errorBanner.value = {
            title: `Error: ${response.status}`,
            description: errorData.message || JSON.stringify(errorData),
            type: "error"
          };
          return;
        }
        if (response.ok) {
          errorBanner.value = {
            title: isEditing.value ? "Oferta actualizada" : "Oferta creada",
            description: `La oferta se ${isEditing.value ? "actualiz\xF3" : "cre\xF3"} correctamente`,
            type: "success"
          };
          await fetchItems(currentPage.value, itemsPorPage.value, fecha_inicio.value, fecha_fin.value, id_contrato.value, id_usuario.value, "");
          showModal.value = false;
        } else {
          console.error("Error al guardar la oferta");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d;
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Ofertas - Contract Manager",
        description: "Consulta y administra ofertas asociadas a contratos.",
        canonical: "/ofertas"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: errorBanner.value.title,
          description: errorBanner.value.description,
          type: errorBanner.value.type,
          onClose: ($event) => errorBanner.value = null,
          class: "pointer-events-auto"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showConfirmBanner.value) {
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">`);
        _push(ssrRenderComponent(_sfc_main$4, {
          title: "\xBFEst\xE1s seguro que deseas eliminar esta oferta?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteOferta,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="md:hidden flex justify-between items-center mb-4"><button class="flex items-center text-primary hover:brightness-90"><span class="mr-2">Filtros adicionales</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": showFilters.value }, "h-5 w-5 transform transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button></div><div class="${ssrRenderClass([{ "hidden md:grid": !showFilters.value }, "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"])}"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label><input type="date"${ssrRenderAttr("value", fecha_inicio.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label><input type="date"${ssrRenderAttr("value", fecha_fin.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: id_usuario.value,
        "onUpdate:modelValue": ($event) => id_usuario.value = $event,
        options: usuarios.value,
        labelKey: "nombre",
        valueKey: "id_usuario",
        placeholder: "Buscar usuario..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Contrato</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: id_contrato.value,
        "onUpdate:modelValue": ($event) => id_contrato.value = $event,
        options: contratos.value,
        labelKey: (c) => {
          var _a22, _b22, _c2;
          return `${(_a22 = c.entidad) == null ? void 0 : _a22.nombre}: ${c == null ? void 0 : c.num_consecutivo} - ${(_b22 = c.tipoContrato) == null ? void 0 : _b22.nombre} - (${(_c2 = c.fecha_inicio) == null ? void 0 : _c2.substring(0, 4)})`;
        },
        valueKey: "id_contrato",
        placeholder: "Buscar contrato..."
      }, null, _parent));
      _push(`</div></div><div class="flex justify-end mt-4 gap-2"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button><button class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors"> Exportar a Excel </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Ofertas</h2><button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nueva Oferta </button></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: ofertasColumns,
        items: itemsData.value,
        actions: ofertasActions,
        "total-items": totalItems.value,
        "items-per-page": itemsPorPage.value,
        "current-page": currentPage.value,
        "is-loading": isLoading.value,
        onPageChange: handlePageChange,
        onRowClick: handleRowClick
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        oferta: selectedOferta.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        usuarios: usuarios.value,
        contratos: contratos.value,
        id_usuario: (_b2 = (_a2 = selectedOferta.value.id_usuario) != null ? _a2 : (_a = selectedOferta.value.usuario) == null ? void 0 : _a.id_usuario) != null ? _b2 : null,
        id_contrato: (_d = (_c = selectedOferta.value.id_contrato) != null ? _c : (_b = selectedOferta.value.contrato) == null ? void 0 : _b.id_contrato) != null ? _d : null,
        onSubmit: handleOfertaSubmit
      }, null, _parent));
      _push(ssrRenderComponent(ModalPDF, {
        show: showModalPDF.value,
        "onUpdate:show": ($event) => showModalPDF.value = $event,
        "oferta-data": ofertaParaPDF.value,
        onClose: ($event) => showModalPDF.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ofertas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ofertas-Cce8hUn3.mjs.map
