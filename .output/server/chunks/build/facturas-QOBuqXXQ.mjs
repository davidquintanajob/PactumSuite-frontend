import { ref, computed, watch, mergeProps, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { _ as _sfc_main$3 } from './MessageBanner-UgGYw58j.mjs';
import { _ as _sfc_main$4 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$5 } from './SelectSearch-DgMSQ3ZM.mjs';
import { _ as _sfc_main$6 } from './SelectSearchAPI-C4OFsj20.mjs';
import { _ as _export_sfc, n as navigateTo, b as useRuntimeConfig } from './server.mjs';
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
import './v3-Dku30dXH.mjs';
import 'vue-router';

const _sfc_main$2 = {
  __name: "FacturaModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    factura: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isViewing: {
      type: Boolean,
      default: false
    },
    contratos: {
      type: Array,
      default: () => []
    },
    entidades: {
      type: Array,
      default: () => []
    },
    trabajadores: {
      type: Array,
      default: () => []
    },
    usuarios: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      id_entidad: "",
      id_contrato: "",
      id_usuario: "",
      id_trabajador_autorizado: "",
      num_consecutivo: "",
      fecha: "",
      estado: "",
      nota: "",
      cargoAdicional: ""
    });
    const selectedTipo = ref("productos");
    watch(() => props.factura, (factura) => {
      if (factura && factura.tipoFactura) {
        selectedTipo.value = factura.tipoFactura;
      } else {
        selectedTipo.value = "productos";
      }
    });
    const estadoOptions = ref([
      { label: "Facturado", value: "Facturado" },
      { label: "No Facturado", value: "No Facturado" },
      { label: "Cancelado", value: "Cancelado" }
    ]);
    const services = ref([{ descripcion: "", unidadMedida: "", cantidad: 0, importe: 0 }]);
    const productos = ref([{ id_producto: "", nombre: "", unidadMedida: "", cantidad: 0, precio: 0 }]);
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    const contratosFiltrados = ref([]);
    const entidadCompleta = ref(null);
    const usuarioData = ref(null);
    const trabajadorData = ref(null);
    const selectedContract = computed(() => {
      return contratosFiltrados.value.find((contrato) => contrato.id_contrato === formData.value.id_contrato);
    });
    const canEditConsecutivo = computed(() => {
      if (!selectedContract.value) return false;
      return selectedContract.value.ClienteOProveedor !== "Cliente";
    });
    async function fetchNextConsecutivo() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const config = useRuntimeConfig();
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const res = await fetch(`${config.public.backendHost}/Factura/nextConsecutivo/${currentYear}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
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
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.nextConsecutivo) {
            formData.value.num_consecutivo = data.data.nextConsecutivo;
            localStorage.setItem("num_consecutivo_guardado", data.data.nextConsecutivo);
          }
        } else {
          console.error("Error al obtener el siguiente consecutivo");
        }
      } catch (err) {
        console.error("Error al obtener el siguiente consecutivo:", err);
      }
    }
    watch(() => props.modelValue, async (newValue) => {
      if (newValue) {
        if (!props.isEditing && !props.isViewing) {
          await fetchNextConsecutivo();
        } else if (props.isViewing) {
          await fetchNextConsecutivo();
        }
      }
    });
    watch(() => props.factura, async (factura) => {
      var _a, _b;
      if (factura && Object.keys(factura).length > 0) {
        formData.value = {
          id_entidad: ((_a = factura.contrato) == null ? void 0 : _a.id_entidad) || "",
          id_contrato: factura.id_contrato || "",
          id_usuario: factura.id_usuario || "",
          id_trabajador_autorizado: factura.id_trabajador_autorizado || "",
          num_consecutivo: factura.num_consecutivo || "",
          fecha: factura.fecha ? factura.fecha.substring(0, 10) : "",
          estado: factura.estado || "",
          nota: factura.nota || "",
          cargoAdicional: factura.cargoAdicional || ""
        };
        if (factura.servicio && factura.servicio.length > 0) {
          selectedTipo.value = "servicios";
          services.value = [...factura.servicio];
          formData.value.services = [...factura.servicio];
          productos.value = [{ id_producto: "", nombre: "", unidadMedida: "", cantidad: 0, precio: 0 }];
          formData.value.products = [];
        } else {
          selectedTipo.value = "productos";
          if (factura.productos && factura.productos.length > 0) {
            productos.value = factura.productos.map((producto) => {
              var _a2, _b2;
              return {
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                unidadMedida: producto.unidadMedida,
                cantidad: ((_a2 = producto.factura_producto) == null ? void 0 : _a2.cantidad) || 0,
                precio: ((_b2 = producto.factura_producto) == null ? void 0 : _b2.precioVenta) || producto.precio
              };
            });
            formData.value.products = [...factura.productos];
          } else {
            productos.value = [{ id_producto: "", nombre: "", unidadMedida: "", cantidad: 0, precio: 0 }];
            formData.value.products = [];
          }
          services.value = [{ descripcion: "", unidadMedida: "", cantidad: 0, importe: 0 }];
          formData.value.services = [];
        }
        if ((_b = factura.contrato) == null ? void 0 : _b.id_entidad) {
          await cargarContratosPorEntidad(factura.contrato.id_entidad);
        }
        if (props.isViewing || props.isEditing) {
          if (factura.id_usuario) {
            await cargarUsuarioPorId(factura.id_usuario);
          }
          if (factura.id_trabajador_autorizado) {
            await cargarTrabajadorPorId(factura.id_trabajador_autorizado);
          }
        }
        if (!props.isViewing) {
          const contratoSeleccionado = contratosFiltrados.value.find((c) => c.id_contrato === formData.value.id_contrato);
          if (contratoSeleccionado && contratoSeleccionado.ClienteOProveedor === "Cliente") {
            const consecutivoGuardado = localStorage.getItem("num_consecutivo_guardado");
            if (consecutivoGuardado) {
              formData.value.num_consecutivo = consecutivoGuardado;
              console.log("Carga inicial (crear/editar): N\xFAmero consecutivo establecido a:", consecutivoGuardado);
            }
          }
        }
      } else {
        formData.value = {
          id_entidad: "",
          id_contrato: "",
          id_usuario: "",
          id_trabajador_autorizado: "",
          num_consecutivo: "",
          fecha: "",
          estado: "",
          nota: "",
          cargoAdicional: ""
        };
        contratosFiltrados.value = [];
        entidadCompleta.value = null;
        usuarioData.value = null;
        trabajadorData.value = null;
        productos.value = [{ id_producto: "", nombre: "", unidadMedida: "", cantidad: 0, precio: 0 }];
        services.value = [{ descripcion: "", unidadMedida: "", cantidad: 0, importe: 0 }];
      }
    }, { immediate: true });
    watch(() => formData.value.id_contrato, (newIdContrato) => {
      if (!props.isViewing && newIdContrato) {
        const contratoSeleccionado = contratosFiltrados.value.find((c) => c.id_contrato === newIdContrato);
        if (contratoSeleccionado && contratoSeleccionado.ClienteOProveedor === "Cliente") {
          const consecutivoGuardado = localStorage.getItem("num_consecutivo_guardado");
          if (consecutivoGuardado) {
            formData.value.num_consecutivo = consecutivoGuardado;
            console.log("Selecci\xF3n de contrato (crear/editar): N\xFAmero consecutivo establecido a:", consecutivoGuardado);
          }
        }
      }
    });
    watch(() => productos.value, (newProductos) => {
      if (newProductos.length > 0 && !props.isViewing) {
        const last = newProductos[newProductos.length - 1];
        if (last.id_producto && last.unidadMedida && last.cantidad > 0 && last.precio > 0) {
          productos.value.push({ id_producto: "", nombre: "", unidadMedida: "", cantidad: 0, precio: 0 });
        }
      }
    }, { deep: true });
    watch(() => services.value, (newServicios) => {
      if (newServicios.length > 0 && !props.isViewing) {
        const last = newServicios[newServicios.length - 1];
        if (last.descripcion && last.unidadMedida && last.cantidad > 0 && last.importe > 0) {
          services.value.push({ descripcion: "", unidadMedida: "", cantidad: 0, importe: 0 });
        }
      }
    }, { deep: true });
    const initialEntidadLabel = computed(() => {
      if (props.factura && props.factura.contrato && props.factura.contrato.entidad) {
        return props.factura.contrato.entidad.nombre || "";
      }
      return "";
    });
    const initialUsuarioLabel = computed(() => {
      if (usuarioData.value) {
        return usuarioData.value.nombre || "";
      }
      if (props.factura && props.factura.usuario) {
        return props.factura.usuario.nombre || "";
      }
      return "";
    });
    const initialTrabajadorLabel = computed(() => {
      if (trabajadorData.value) {
        return trabajadorData.value.nombre || "";
      }
      if (props.factura && props.factura.trabajador_autorizado) {
        return props.factura.trabajador_autorizado.nombre || "";
      }
      return "";
    });
    const handleEntidadSeleccionada = async (entidad) => {
      if (entidad && entidad.id_entidad) {
        formData.value.id_contrato = "";
        await cargarContratosPorEntidad(entidad.id_entidad);
      } else {
        contratosFiltrados.value = [];
        formData.value.id_contrato = "";
      }
    };
    async function cargarContratosPorEntidad(entidadId) {
      if (!entidadId) {
        contratosFiltrados.value = [];
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      loadingBanner.value = {
        title: "Cargando Datos de la Base de Datos",
        description: "Obteniendo contratos de la base de datos...",
        type: "info"
      };
      try {
        const config = useRuntimeConfig();
        const res = await fetch(`${config.public.backendHost}/entidad/${entidadId}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
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
        if (res.ok) {
          const data = await res.json();
          entidadCompleta.value = data;
          const contratos = (data == null ? void 0 : data.contratos) || [];
          contratosFiltrados.value = contratos.map((contrato) => {
            var _a;
            return {
              ...contrato,
              displayLabel: `${contrato.num_consecutivo} - ${((_a = contrato.tipoContrato) == null ? void 0 : _a.nombre) || ""} - ${contrato.ClienteOProveedor || ""}`
            };
          });
        } else {
          console.error("Error en la respuesta:", res.status);
          contratosFiltrados.value = [];
        }
      } catch (err) {
        console.error("Error al cargar contratos:", err);
        contratosFiltrados.value = [];
      } finally {
        setTimeout(() => {
          loadingBanner.value = null;
        }, 3e3);
      }
    }
    async function cargarUsuarioPorId(usuarioId) {
      if (!usuarioId) return;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const config = useRuntimeConfig();
        const res = await fetch(`${config.public.backendHost}/Usuario/${usuarioId}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
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
        if (res.ok) {
          const data = await res.json();
          usuarioData.value = { nombre: data.nombre };
        } else {
          console.error("Error al cargar usuario:", res.status);
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      }
    }
    async function cargarTrabajadorPorId(trabajadorId) {
      if (!trabajadorId) return;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const config = useRuntimeConfig();
        const res = await fetch(`${config.public.backendHost}/trabajadorAutorizado/${trabajadorId}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
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
        if (res.ok) {
          const data = await res.json();
          trabajadorData.value = { nombre: data.nombre };
        } else {
          console.error("Error al cargar trabajador:", res.status);
        }
      } catch (err) {
        console.error("Error al cargar trabajador:", err);
      }
    }
    function handleProductoSeleccionado(selected, index) {
      if (index >= 0 && index < productos.value.length) {
        if (selected) {
          let cantidad = 0;
          let precio = selected.precio || 0;
          if (props.factura && props.factura.id_factura && selected.facturaProductos) {
            const matchingFacturaProducto = selected.facturaProductos.find((fp) => fp.id_factura === props.factura.id_factura);
            if (matchingFacturaProducto) {
              cantidad = Number(matchingFacturaProducto.cantidad) || 0;
              precio = Number(matchingFacturaProducto.precioVenta) || selected.precio || 0;
            }
          }
          productos.value[index] = {
            ...productos.value[index],
            id_producto: selected.id_producto,
            nombre: selected.nombre,
            unidadMedida: selected.unidadMedida || "",
            cantidad,
            precio
          };
        } else {
          productos.value[index] = {
            ...productos.value[index],
            id_producto: "",
            nombre: "",
            unidadMedida: "",
            cantidad: 0,
            precio: 0
          };
        }
      }
    }
    function calcularTotal(item) {
      const cantidad = Number(item.cantidad) || 0;
      const precio = Number(item.precio) || 0;
      const importe = Number(item.importe) || 0;
      const multiplier = item.precio !== void 0 ? precio : importe;
      return (cantidad * multiplier).toFixed(2);
    }
    const importeTotalProductos = computed(() => {
      const productosTotal = productos.value.reduce((total, producto) => {
        return total + Number(producto.cantidad) * Number(producto.precio);
      }, 0);
      return (productosTotal + (Number(formData.value.cargoAdicional) || 0)).toFixed(2);
    });
    const importeTotalServicios = computed(() => {
      const serviciosTotal = services.value.reduce((total, servicio) => {
        return total + Number(servicio.cantidad) * Number(servicio.importe);
      }, 0);
      return (serviciosTotal + (Number(formData.value.cargoAdicional) || 0)).toFixed(2);
    });
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Factura" : __props.isEditing ? "Editar Factura" : "Nueva Factura")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          modelValue: formData.value.id_entidad,
          "onUpdate:modelValue": ($event) => formData.value.id_entidad = $event,
          endpoint: "/entidad/filter/1/10",
          method: "POST",
          "search-key": "nombre",
          "label-key": "nombre",
          "value-key": "id_entidad",
          placeholder: "Buscar entidad por nombre...",
          disabled: __props.isViewing || isLoading.value,
          "initial-label": initialEntidadLabel.value,
          onEntidadSeleccionada: handleEntidadSeleccionada
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Contrato</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: formData.value.id_contrato,
          "onUpdate:modelValue": ($event) => formData.value.id_contrato = $event,
          options: contratosFiltrados.value,
          labelKey: "displayLabel",
          valueKey: "id_contrato",
          disabled: __props.isViewing || isLoading.value || !formData.value.id_entidad,
          class: { "opacity-50": !formData.value.id_entidad },
          placeholder: "Seleccione primero una entidad..."
        }, null, _parent));
        _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">`);
        if (__props.isViewing || __props.isEditing) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>`);
          _push(ssrRenderComponent(_sfc_main$6, {
            modelValue: formData.value.id_usuario,
            "onUpdate:modelValue": ($event) => formData.value.id_usuario = $event,
            endpoint: "/Usuario/filterUsers",
            method: "POST",
            "search-key": "nombre_usuario",
            "label-key": "nombre_usuario",
            "value-key": "id_usuario",
            placeholder: "Buscar usuario por nombre...",
            disabled: true,
            "initial-label": initialUsuarioLabel.value,
            "direct-data": true,
            class: { "opacity-50": __props.isViewing || __props.isEditing }
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Trabajador Autorizado</label>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          modelValue: formData.value.id_trabajador_autorizado,
          "onUpdate:modelValue": ($event) => formData.value.id_trabajador_autorizado = $event,
          endpoint: "/trabajadorAutorizado/filter/1/10",
          method: "POST",
          "search-key": "nombre",
          "label-key": "nombre",
          "value-key": "id_trabajador",
          placeholder: "Buscar trabajador por nombre...",
          disabled: __props.isViewing || isLoading.value,
          "initial-label": initialTrabajadorLabel.value
        }, null, _parent));
        _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">N\xFAmero Consecutivo</label><input${ssrRenderAttr("value", formData.value.num_consecutivo)} type="number"${ssrIncludeBooleanAttr(__props.isViewing || !canEditConsecutivo.value) ? " readonly" : ""}${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="${ssrRenderClass([
          "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
          { "bg-gray-100 text-gray-500": __props.isViewing || !canEditConsecutivo.value }
        ])}" required></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label><input${ssrRenderAttr("value", formData.value.fecha)} type="date"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: formData.value.estado,
          "onUpdate:modelValue": ($event) => formData.value.estado = $event,
          options: estadoOptions.value,
          labelKey: "label",
          valueKey: "value",
          disabled: __props.isViewing || isLoading.value,
          placeholder: "Selecciona un estado"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cargo Adicional</label><input${ssrRenderAttr("value", formData.value.cargoAdicional)} type="number"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese cargo adicional (opcional)"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nota</label><textarea${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Ingrese una nota opcional">${ssrInterpolate(formData.value.nota)}</textarea></div><div class="mt-4"><label class="block text-sm font-medium text-gray-700 mb-2 text-center">Tipo de Factura</label><div class="relative flex w-full"><div class="${ssrRenderClass([selectedTipo.value === "productos" ? "transform translate-x-0" : "transform translate-x-full", "absolute top-0 left-0 w-1/2 h-full bg-primary rounded-lg transition-transform duration-300"])}"></div><button type="button" class="${ssrRenderClass([selectedTipo.value === "productos" ? "text-neutral bg-transparent" : "text-dark bg-secondary", "relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"])}"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}> Venta Productos </button><button type="button" class="${ssrRenderClass([selectedTipo.value === "servicios" ? "text-neutral bg-transparent" : "text-dark bg-secondary", "relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"])}"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}> Prestaci\xF3n de Servicios </button></div></div>`);
        if (selectedTipo.value === "productos") {
          _push(`<div class="mt-4"><h3 class="text-lg font-semibold mb-2">Productos</h3><div class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-2 font-semibold text-gray-700"><span class="col-span-2">Producto</span><span>Uni/Medida</span><span>Cantidad</span><span>Precio</span><span>Total</span><span>Acci\xF3n</span></div><!--[-->`);
          ssrRenderList(productos.value, (producto, index) => {
            _push(`<div class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-2">`);
            _push(ssrRenderComponent(_sfc_main$6, {
              modelValue: producto.id_producto,
              "onUpdate:modelValue": ($event) => producto.id_producto = $event,
              endpoint: "/producto/filterProductos/1/10",
              method: "POST",
              "search-key": "nombre",
              "label-key": "nombre",
              "value-key": "id_producto",
              placeholder: "Buscar producto por nombre...",
              disabled: __props.isViewing || isLoading.value,
              "initial-label": producto.nombre || "",
              onProductoSeleccionado: (selected) => handleProductoSeleccionado(selected, index),
              class: "col-span-2"
            }, null, _parent));
            _push(`<input${ssrRenderAttr("value", producto.unidadMedida)} type="text" placeholder="Uni/Medida" readonly class="px-4 py-2 border-2 border-gray-400 rounded-lg opacity-50"><input${ssrRenderAttr("value", producto.cantidad)} type="number" step="0.01" placeholder="Cantidad" class="px-4 py-2 border-2 border-gray-400 rounded-lg"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><input${ssrRenderAttr("value", producto.precio)} type="number" step="0.01" placeholder="Precio"${ssrIncludeBooleanAttr(!__props.isEditing || __props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50": !__props.isEditing || __props.isViewing }, "px-4 py-2 border-2 border-gray-400 rounded-lg"])}"><input${ssrRenderAttr("value", calcularTotal(producto))} type="text" readonly class="px-4 py-2 border-2 border-blue-400 bg-blue-50 rounded-lg font-bold text-blue-800"><button type="button" class="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Eliminar </button></div>`);
          });
          _push(`<!--]--><button type="button" class="px-4 py-2 bg-purple-500 text-white rounded-lg mt-2 flex items-center"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Producto </button><div class="mt-4 p-4 bg-gray-100 rounded-lg"><strong>Importe Total Productos: ${ssrInterpolate(importeTotalProductos.value)}</strong></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedTipo.value === "servicios") {
          _push(`<div class="mt-4"><h3 class="text-lg font-semibold mb-2">Servicios</h3><div class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-2 font-semibold text-gray-700"><span class="col-span-2">Descripci\xF3n</span><span>Uni/Medida</span><span>Cantidad</span><span>Importe</span><span>Total</span><span>Acci\xF3n</span></div><!--[-->`);
          ssrRenderList(services.value, (servicio, index) => {
            _push(`<div class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-2"><input${ssrRenderAttr("value", servicio.descripcion)} type="text" placeholder="Descripci\xF3n" class="col-span-2 px-4 py-2 border-2 border-gray-400 rounded-lg"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><input${ssrRenderAttr("value", servicio.unidadMedida)} type="text" placeholder="Uni/Medida" class="px-4 py-2 border-2 border-gray-400 rounded-lg"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><input${ssrRenderAttr("value", servicio.cantidad)} type="number" step="0.01" placeholder="Cantidad" class="px-4 py-2 border-2 border-gray-400 rounded-lg"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><input${ssrRenderAttr("value", servicio.importe)} type="number" step="0.01" placeholder="Importe" class="px-4 py-2 border-2 border-gray-400 rounded-lg"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><input${ssrRenderAttr("value", calcularTotal(servicio))} type="text" readonly class="px-4 py-2 border-2 border-blue-400 bg-blue-50 rounded-lg font-bold text-blue-800"><button type="button" class="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Eliminar </button></div>`);
          });
          _push(`<!--]--><button type="button" class="px-4 py-2 bg-purple-500 text-white rounded-lg mt-2 flex items-center"${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Servicio </button><div class="mt-4 p-4 bg-gray-100 rounded-lg"><strong>Importe Total Servicios: ${ssrInterpolate(importeTotalServicios.value)}</strong></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Factura")}</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FacturaModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const totalRows = 10;
const _sfc_main$1 = {
  __name: "FacturaPDFModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    factura: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showVendorConfig = ref(false);
    const vendorData = ref({
      nombre: "",
      carnet_identidad: "",
      identificacion_fiscal: "",
      cuenta_bancaria: "",
      agencia_bancaria: "",
      direccion_particular: "",
      telefono: ""
    });
    const validationErrors = ref({
      carnet_identidad: "",
      cuenta_bancaria: "",
      telefono: ""
    });
    const getVendorData = (field) => {
      const stored = vendorData.value[field];
      if (stored && stored.trim() !== "") {
        return stored;
      }
      return "_________________";
    };
    const isVendorDataComplete = computed(() => {
      const requiredFields = ["nombre", "carnet_identidad", "identificacion_fiscal", "cuenta_bancaria", "agencia_bancaria", "direccion_particular", "telefono"];
      return requiredFields.every((field) => {
        const value = vendorData.value[field];
        return value && value.trim() !== "";
      });
    });
    const missingVendorFields = computed(() => {
      const requiredFields = ["nombre", "carnet_identidad", "identificacion_fiscal", "cuenta_bancaria", "agencia_bancaria", "direccion_particular", "telefono"];
      return requiredFields.filter((field) => {
        const value = vendorData.value[field];
        return !value || value.trim() === "";
      });
    });
    const getFieldLabel = (field) => {
      const labels = {
        nombre: "Nombre Completo",
        carnet_identidad: "Carn\xE9 de Identidad",
        identificacion_fiscal: "Identificaci\xF3n Fiscal (RC-05)",
        cuenta_bancaria: "Cuenta Bancaria",
        agencia_bancaria: "Agencia Bancaria",
        direccion_particular: "Direcci\xF3n Particular",
        telefono: "Tel\xE9fono"
      };
      return labels[field] || field;
    };
    const isProveedorContract = computed(() => {
      var _a;
      return ((_a = props.factura.contrato) == null ? void 0 : _a.ClienteOProveedor) === "Proveedor";
    });
    computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (isProveedorContract.value) {
        return {
          title: "Comprador",
          nombre: ((_b = (_a = props.factura.contrato) == null ? void 0 : _a.entidad) == null ? void 0 : _b.nombre) || "_________________",
          codigo: ((_d = (_c = props.factura.contrato) == null ? void 0 : _c.entidad) == null ? void 0 : _d.consecutivo) || "_________________",
          direccion: ((_f = (_e = props.factura.contrato) == null ? void 0 : _e.entidad) == null ? void 0 : _f.direccion) || "_________________",
          cuenta_bancaria: ((_h = (_g = props.factura.contrato) == null ? void 0 : _g.entidad) == null ? void 0 : _h.cuenta_bancaria) || "_________________",
          showConfigButton: false
        };
      } else {
        return {
          title: "Vendedor",
          nombre: getVendorData("nombre"),
          carnet_identidad: getVendorData("carnet_identidad"),
          identificacion_fiscal: getVendorData("identificacion_fiscal"),
          cuenta_bancaria: getVendorData("cuenta_bancaria"),
          agencia_bancaria: getVendorData("agencia_bancaria"),
          direccion_particular: getVendorData("direccion_particular"),
          telefono: getVendorData("telefono"),
          showConfigButton: true
        };
      }
    });
    computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (isProveedorContract.value) {
        return {
          title: "Vendedor",
          nombre: getVendorData("nombre"),
          carnet_identidad: getVendorData("carnet_identidad"),
          identificacion_fiscal: getVendorData("identificacion_fiscal"),
          cuenta_bancaria: getVendorData("cuenta_bancaria"),
          agencia_bancaria: getVendorData("agencia_bancaria"),
          direccion_particular: getVendorData("direccion_particular"),
          telefono: getVendorData("telefono"),
          showConfigButton: true
        };
      } else {
        return {
          title: "Comprador",
          nombre: ((_b = (_a = props.factura.contrato) == null ? void 0 : _a.entidad) == null ? void 0 : _b.nombre) || "_________________",
          codigo: ((_d = (_c = props.factura.contrato) == null ? void 0 : _c.entidad) == null ? void 0 : _d.consecutivo) || "_________________",
          direccion: ((_f = (_e = props.factura.contrato) == null ? void 0 : _e.entidad) == null ? void 0 : _f.direccion) || "_________________",
          cuenta_bancaria: ((_h = (_g = props.factura.contrato) == null ? void 0 : _g.entidad) == null ? void 0 : _h.cuenta_bancaria) || "_________________",
          showConfigButton: false
        };
      }
    });
    computed(() => {
      var _a, _b, _c, _d, _e, _f;
      if (isProveedorContract.value) {
        return {
          title: "Recibido",
          nombre: ((_a = getTrabajadorAutorizado()) == null ? void 0 : _a.nombre) || "________________________",
          cargo: ((_b = getTrabajadorAutorizado()) == null ? void 0 : _b.cargo) || "________________________",
          carnet_identidad: ((_c = getTrabajadorAutorizado()) == null ? void 0 : _c.carnet_identidad) || "________________________",
          fecha: "________________________"
        };
      } else {
        return {
          title: "Emitido",
          nombre: ((_d = props.factura.usuario) == null ? void 0 : _d.nombre) || "_________________",
          cargo: ((_e = props.factura.usuario) == null ? void 0 : _e.cargo) || "_________________",
          carnet_identidad: ((_f = props.factura.usuario) == null ? void 0 : _f.carnet_identidad) || "_________________",
          fecha: "___________"
        };
      }
    });
    computed(() => {
      var _a, _b, _c, _d, _e, _f;
      if (isProveedorContract.value) {
        return {
          title: "Emitido",
          nombre: ((_a = props.factura.usuario) == null ? void 0 : _a.nombre) || "_________________",
          cargo: ((_b = props.factura.usuario) == null ? void 0 : _b.cargo) || "_________________",
          carnet_identidad: ((_c = props.factura.usuario) == null ? void 0 : _c.carnet_identidad) || "_________________",
          fecha: "___________"
        };
      } else {
        return {
          title: "Recibido",
          nombre: ((_d = getTrabajadorAutorizado()) == null ? void 0 : _d.nombre) || "________________________",
          cargo: ((_e = getTrabajadorAutorizado()) == null ? void 0 : _e.cargo) || "________________________",
          carnet_identidad: ((_f = getTrabajadorAutorizado()) == null ? void 0 : _f.carnet_identidad) || "________________________",
          fecha: "________________________"
        };
      }
    });
    const formatNumber = (number) => {
      if (!number) return "0,00";
      return parseFloat(number).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace(/\./g, " ").replace(",", ",");
    };
    const getTrabajadorAutorizado = () => {
      var _a;
      if ((_a = props.factura.contrato) == null ? void 0 : _a.trabajadorAutorizado) {
        return props.factura.contrato.trabajadorAutorizado;
      }
      if (props.factura.trabajadorAutorizado) {
        return props.factura.trabajadorAutorizado;
      }
      return null;
    };
    const emptyRows = computed(() => {
      const serviciosCount = props.factura.servicio ? props.factura.servicio.length : 0;
      const productosCount = props.factura.productos ? props.factura.productos.length : 0;
      const filledRows = serviciosCount + productosCount;
      const emptyCount = totalRows - filledRows;
      return emptyCount > 0 ? Array.from({ length: emptyCount }, (_, i) => i + 1) : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      _push(`<!--[-->`);
      if (__props.modelValue) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-v-027e2079><div class="bg-white rounded-lg p-2 w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl" data-v-027e2079><div class="flex justify-between items-center mb-6" data-v-027e2079><h2 class="text-2xl font-bold text-gray-800" data-v-027e2079>Vista PDF de Factura</h2><div class="flex space-x-2" data-v-027e2079><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"${ssrIncludeBooleanAttr(!isVendorDataComplete.value) ? " disabled" : ""} data-v-027e2079> Imprimir </button><button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"${ssrIncludeBooleanAttr(!isVendorDataComplete.value) ? " disabled" : ""} data-v-027e2079> Descargar PDF </button><button class="text-gray-500 hover:text-gray-700" data-v-027e2079><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-027e2079><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-027e2079></path></svg></button></div></div>`);
        if (!isVendorDataComplete.value) {
          _push(`<div class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" data-v-027e2079><div class="flex items-center" data-v-027e2079><svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" data-v-027e2079><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-027e2079></path></svg><strong data-v-027e2079>Error:</strong> Faltan datos del vendedor. Complete la informaci\xF3n requerida antes de imprimir o descargar el PDF. </div><ul class="mt-2 list-disc list-inside" data-v-027e2079><!--[-->`);
          ssrRenderList(missingVendorFields.value, (field) => {
            _push(`<li data-v-027e2079>${ssrInterpolate(getFieldLabel(field))}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div id="factura-content" class="bg-white p-6 max-w-full mx-auto" style="${ssrRenderStyle({ "font-family": "Arial, sans-serif", "font-size": "14px", "line-height": "1.4" })}" data-v-027e2079><div class="text-center mb-4" data-v-027e2079><h1 class="text-lx font-bold mb-2" style="${ssrRenderStyle({ "color": "#dc2626", "font-size": "40px", "letter-spacing": "1px" })}" data-v-027e2079>FACTURA</h1><div class="border-b border-blue-500 w-full mb-3" style="${ssrRenderStyle({ "border-color": "#3b82f6" })}" data-v-027e2079></div><p class="text-xl font-bold mb-3" style="${ssrRenderStyle({ "font-size": "24px" })}" data-v-027e2079>Nombre del Trabajo: ${ssrInterpolate(((_a = __props.factura.contrato) == null ? void 0 : _a.ClienteOProveedor) === "Cliente" ? "Servicio Prestado" : "Compra Realizada")}</p></div><div class="flex justify-end mb-4" data-v-027e2079><div class="text-right" data-v-027e2079><p class="mb-1 text-lg" data-v-027e2079><strong data-v-027e2079>Factura N: ${ssrInterpolate(__props.factura.num_consecutivo)}</strong></p><p class="mb-1 text-lg" data-v-027e2079><strong data-v-027e2079>Fecha: ___________</strong></p></div></div><div class="grid grid-cols-2 gap-10 mb-4" data-v-027e2079><div data-v-027e2079><div class="flex justify-between items-center mb-2" data-v-027e2079><h3 class="font-bold" style="${ssrRenderStyle({ "color": "#2563eb", "font-size": "18px" })}" data-v-027e2079>Vendedor</h3><button class="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 border border-blue-500 rounded no-print" title="Configurar datos del vendedor" data-v-027e2079><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-027e2079><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-027e2079></path></svg></button></div><div class="space-y-0.5" data-v-027e2079><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Nombre:</strong> ${ssrInterpolate(getVendorData("nombre"))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Carn\xE9 Identidad:</strong> ${ssrInterpolate(getVendorData("carnet_identidad"))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Identificaci\xF3n Fiscal (RC-05):</strong> ${ssrInterpolate(getVendorData("identificacion_fiscal"))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Cuenta Bancaria:</strong> ${ssrInterpolate(getVendorData("cuenta_bancaria").replace(/-/g, ""))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Agencia Bancaria:</strong> ${ssrInterpolate(getVendorData("agencia_bancaria"))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Direcci\xF3n Particular:</strong> ${ssrInterpolate(getVendorData("direccion_particular"))}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Tel\xE9fono:</strong> ${ssrInterpolate(getVendorData("telefono"))}</p></div></div></div><div data-v-027e2079><h3 class="font-bold mb-2" style="${ssrRenderStyle({ "color": "#2563eb", "font-size": "18px" })}" data-v-027e2079>Comprador</h3><div class="space-y-0.5" data-v-027e2079><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Nombre:</strong> ${ssrInterpolate(((_c = (_b = __props.factura.contrato) == null ? void 0 : _b.entidad) == null ? void 0 : _c.nombre) || "_________________")}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>C\xF3digo:</strong> ${ssrInterpolate(((_e = (_d = __props.factura.contrato) == null ? void 0 : _d.entidad) == null ? void 0 : _e.consecutivo) || "_________________")}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Direcci\xF3n:</strong> ${ssrInterpolate(((_g = (_f = __props.factura.contrato) == null ? void 0 : _f.entidad) == null ? void 0 : _g.direccion) || "_________________")}</p></div><div class="flex items-center justify-between" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Cuenta Bancaria:</strong> ${ssrInterpolate((((_i = (_h = __props.factura.contrato) == null ? void 0 : _h.entidad) == null ? void 0 : _i.cuenta_bancaria) || "_________________").replace(/-/g, ""))}</p></div></div></div></div><div class="border-b border-black w-full mb-3" data-v-027e2079></div><table class="w-full border-collapse border border-black mb-4" data-v-027e2079><thead data-v-027e2079><tr style="${ssrRenderStyle({ "background-color": "#f0f0f0" })}" data-v-027e2079><th class="border border-black p-2 text-center font-bold" data-v-027e2079>Descripci\xF3n</th><th class="border border-black p-2 text-center font-bold" data-v-027e2079>U/M</th><th class="border border-black p-2 text-center font-bold" data-v-027e2079>Cantidad</th><th class="border border-black p-2 text-center font-bold" data-v-027e2079>Precio en CUP</th><th class="border border-black p-2 text-center font-bold" data-v-027e2079>Precio Total</th></tr></thead><tbody data-v-027e2079><!--[-->`);
        ssrRenderList(__props.factura.servicio, (servicio) => {
          _push(`<tr data-v-027e2079><td class="border border-black p-2" data-v-027e2079>${ssrInterpolate(servicio.descripcion)}</td><td class="border border-black p-2" data-v-027e2079>${ssrInterpolate(servicio.unidadMedida)}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate(parseFloat(servicio.cantidad).toFixed(2))}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate(parseFloat(servicio.importe).toFixed(2))}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate((servicio.cantidad * parseFloat(servicio.importe)).toFixed(2))}</td></tr>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(__props.factura.productos, (producto) => {
          var _a2, _b2, _c2, _d2;
          _push(`<tr data-v-027e2079><td class="border border-black p-2" data-v-027e2079>${ssrInterpolate(producto.nombre)}</td><td class="border border-black p-2" data-v-027e2079>${ssrInterpolate(producto.unidadMedida)}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate(parseFloat(((_a2 = producto.factura_producto) == null ? void 0 : _a2.cantidad) || 0).toFixed(2))}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate(parseFloat(((_b2 = producto.factura_producto) == null ? void 0 : _b2.precioVenta) || 0).toFixed(2))}</td><td class="border border-black p-2 text-right" data-v-027e2079>${ssrInterpolate(((((_c2 = producto.factura_producto) == null ? void 0 : _c2.cantidad) || 0) * parseFloat(((_d2 = producto.factura_producto) == null ? void 0 : _d2.precioVenta) || 0)).toFixed(2))}</td></tr>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(emptyRows.value, (n) => {
          _push(`<tr data-v-027e2079><td class="border border-black p-2 h-6" data-v-027e2079></td><td class="border border-black p-2" data-v-027e2079></td><td class="border border-black p-2" data-v-027e2079></td><td class="border border-black p-2" data-v-027e2079></td><td class="border border-black p-2" data-v-027e2079></td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="text-right mb-4" data-v-027e2079><p class="text-lg font-bold" data-v-027e2079><strong data-v-027e2079>Cantidad Total a Cobrar: $ ${ssrInterpolate(formatNumber(__props.factura.suma_general))}</strong></p></div><div class="grid grid-cols-2 gap-10 mt-6" data-v-027e2079><div data-v-027e2079><div class="border-b border-black w-full mb-2" data-v-027e2079></div><p class="font-bold mb-2 text-center" data-v-027e2079>Emitido</p><div class="space-y-0.5" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Nombre:</strong> ${ssrInterpolate(((_j = __props.factura.usuario) == null ? void 0 : _j.nombre) || "_________________")}</p><p data-v-027e2079><strong data-v-027e2079>Cargo:</strong> ${ssrInterpolate(((_k = __props.factura.usuario) == null ? void 0 : _k.cargo) || "_________________")}</p><p data-v-027e2079><strong data-v-027e2079>C. Identidad:</strong> ${ssrInterpolate(((_l = __props.factura.usuario) == null ? void 0 : _l.carnet_identidad) || "_________________")}</p><p data-v-027e2079><strong data-v-027e2079>Fecha:</strong> ___________</p></div><div class="mt-3" data-v-027e2079><div class="border-b border-black w-full mb-1" data-v-027e2079></div><p class="font-bold text-center" data-v-027e2079>Cu\xF1o</p></div></div><div data-v-027e2079><div class="border-b border-black w-full mb-2" data-v-027e2079></div><p class="font-bold mb-2 text-center" data-v-027e2079>Recibido</p><div class="space-y-0.5" data-v-027e2079><p data-v-027e2079><strong data-v-027e2079>Nombre:</strong> ${ssrInterpolate(((_m = getTrabajadorAutorizado()) == null ? void 0 : _m.nombre) || "________________________")}</p><p data-v-027e2079><strong data-v-027e2079>Cargo:</strong> ${ssrInterpolate(((_n = getTrabajadorAutorizado()) == null ? void 0 : _n.cargo) || "________________________")}</p><p data-v-027e2079><strong data-v-027e2079>C. Identidad:</strong> ${ssrInterpolate(((_o = getTrabajadorAutorizado()) == null ? void 0 : _o.carnet_identidad) || "________________________")}</p><p data-v-027e2079><strong data-v-027e2079>Fecha:</strong> ________________________</p></div><div class="mt-3" data-v-027e2079><div class="border-b border-black w-full mb-1" data-v-027e2079></div><p class="font-bold text-center" data-v-027e2079>Cu\xF1o</p></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showVendorConfig.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 z-70 flex items-center justify-center p-4" data-v-027e2079><div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" data-v-027e2079><div class="flex justify-between items-center mb-6" data-v-027e2079><h2 class="text-2xl font-bold text-gray-800" data-v-027e2079>Configurar Datos del Vendedor</h2><button class="text-gray-500 hover:text-gray-700" data-v-027e2079><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-027e2079><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-027e2079></path></svg></button></div><form class="space-y-4" data-v-027e2079><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Nombre Completo</label><input${ssrRenderAttr("value", vendorData.value.nombre)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el nombre completo" data-v-027e2079></div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Carn\xE9 de Identidad</label><input${ssrRenderAttr("value", vendorData.value.carnet_identidad)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el carn\xE9 de identidad" data-v-027e2079>`);
        if (validationErrors.value.carnet_identidad) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-027e2079>${ssrInterpolate(validationErrors.value.carnet_identidad)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Identificaci\xF3n Fiscal (RC-05)</label><input${ssrRenderAttr("value", vendorData.value.identificacion_fiscal)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la identificaci\xF3n fiscal" data-v-027e2079></div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Cuenta Bancaria</label><input${ssrRenderAttr("value", vendorData.value.cuenta_bancaria)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la cuenta bancaria" data-v-027e2079>`);
        if (validationErrors.value.cuenta_bancaria) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-027e2079>${ssrInterpolate(validationErrors.value.cuenta_bancaria)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Agencia Bancaria</label><input${ssrRenderAttr("value", vendorData.value.agencia_bancaria)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la agencia bancaria" data-v-027e2079></div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Direcci\xF3n Particular</label><input${ssrRenderAttr("value", vendorData.value.direccion_particular)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la direcci\xF3n particular" data-v-027e2079></div><div data-v-027e2079><label class="block text-sm font-medium text-gray-700 mb-1" data-v-027e2079>Tel\xE9fono</label><input${ssrRenderAttr("value", vendorData.value.telefono)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el tel\xE9fono" data-v-027e2079>`);
        if (validationErrors.value.telefono) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-027e2079>${ssrInterpolate(validationErrors.value.telefono)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-end space-x-3 pt-4" data-v-027e2079><button type="button" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50" data-v-027e2079> Cancelar </button><button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" data-v-027e2079> Guardar Datos </button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FacturaPDFModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FacturaPDFModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-027e2079"]]);
const _sfc_main = {
  __name: "facturas",
  __ssrInlineRender: true,
  setup(__props) {
    const consecutivoEntidad = ref("");
    const organismoEntidad = ref("");
    const num_consecutivo = ref("");
    const fecha_desde = ref("");
    const fecha_hasta = ref("");
    const estado = ref("");
    const id_contrato = ref("");
    const id_entidad = ref("");
    const id_trabajador_autorizado = ref("");
    const id_usuario = ref("");
    const estadoOptions = ref([
      { label: "Todos", value: null },
      { label: "Facturado", value: "Facturado" },
      { label: "No Facturado", value: "No Facturado" },
      { label: "Cancelado", value: "Cancelado" }
    ]);
    const contratosFiltrados = ref([]);
    const entidadSeleccionada = ref(null);
    const entidadCompleta = ref(null);
    const showModal = ref(false);
    const showPDFModal = ref(false);
    const selectedFactura = ref({});
    const isEditing = ref(false);
    const isInvitado = computed(() => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (!usuarioStr) return false;
        const usuario = JSON.parse(usuarioStr);
        const rawRole = usuario && (usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role) ? usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role : null;
        if (!rawRole) return false;
        return String(rawRole).trim().toLowerCase() === "invitado";
      } catch (e) {
        return false;
      }
    });
    const isViewing = ref(false);
    const facturasColumns = [
      { key: "num_consecutivo", label: "Num. Consecutivo" },
      {
        key: "fecha",
        label: "Fecha",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
        }
      },
      {
        key: "estado",
        label: "Estado",
        cellRenderer: (value) => {
          if (!value) return "";
          let bgColor = "";
          if (value === "Facturado") {
            bgColor = "bg-green-100 text-green-800";
          } else if (value === "No Facturado") {
            bgColor = "bg-yellow-100 text-yellow-800";
          } else if (value === "Cancelado") {
            bgColor = "bg-red-100 text-red-800";
          }
          return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      {
        key: "contrato.ClienteOProveedor",
        label: "Cliente o Proveedor",
        cellRenderer: (value) => {
          if (!value) return "";
          const bgColor = value === "Cliente" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
          return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      { key: "contrato.num_consecutivo", label: "Contrato" },
      { key: "contrato.tipoContrato.nombre", label: "Tipo Contrato" },
      {
        key: "suma_general",
        label: "Importe",
        cellRenderer: (value) => {
          if (value == null || value === "") return "";
          const num = parseFloat(value);
          if (isNaN(num)) return value;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
        }
      },
      { key: "contrato.entidad.nombre", label: "Entidad" },
      { key: "usuario.nombre", label: "Creado por" }
    ];
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(10);
    const itemsData = ref([]);
    const paginationData = ref({});
    const errorBanner2 = ref(null);
    const showConfirmBanner = ref(false);
    const facturaAEliminar = ref(null);
    const config = useRuntimeConfig();
    const facturasActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 7.5-7.5z" })
            ]);
          }
        },
        handler: (item) => abrirModalFactura(item, "editar"),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Ver en PDF",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }),
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 9h6m-6 4h6m-6 4h6" })
            ]);
          }
        },
        handler: (item) => abrirModalPDFFactura(item),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      }
    ];
    function handlePageChange(page) {
      fetchFacturas(page);
    }
    function handleRowClick(item) {
      abrirModalFactura(item, "ver");
    }
    async function fetchFacturas(page = 1) {
      var _a, _b;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const body = {
          id_contrato: id_contrato.value || 0,
          id_entidad: id_entidad.value || 0,
          consecutivoEntidad: consecutivoEntidad.value || void 0,
          organismoEntidad: organismoEntidad.value || void 0,
          num_consecutivo: num_consecutivo.value || 0,
          fecha_desde: fecha_desde.value || void 0,
          fecha_hasta: fecha_hasta.value || void 0,
          estado: estado.value || void 0,
          id_trabajador_autorizado: id_trabajador_autorizado.value || 0,
          id_usuario: id_usuario.value || 0
        };
        const res = await fetch(`${config.public.backendHost}/Factura/filterFacturas/${page}/${itemsPorPage.value}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(body)
        });
        if (res.status === 401) {
          errorBanner2.value = {
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
        if (res.status === 403) {
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        const data = await res.json();
        itemsData.value = data.data || [];
        totalItems.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
        currentPage.value = ((_b = data.pagination) == null ? void 0 : _b.currentPage) || 1;
        paginationData.value = data.pagination;
      } catch (err) {
        errorBanner2.value = { title: "Error", description: "No se pudieron cargar las facturas", type: "error" };
      }
    }
    async function cargarContratosPorEntidad(entidadId) {
      if (!entidadId) {
        contratosFiltrados.value = [];
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const res = await fetch(`${config.public.backendHost}/entidad/${entidadId}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
          errorBanner2.value = {
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
        if (res.ok) {
          const data = await res.json();
          entidadSeleccionada.value = data;
          const contratos = (data == null ? void 0 : data.contratos) || [];
          contratosFiltrados.value = contratos.map((contrato) => {
            var _a;
            return {
              ...contrato,
              displayLabel: `${contrato.num_consecutivo} - ${((_a = contrato.tipoContrato) == null ? void 0 : _a.nombre) || ""} - ${contrato.ClienteOProveedor || ""}`
            };
          });
        } else {
          console.error("Error en la respuesta:", res.status);
          contratosFiltrados.value = [];
        }
      } catch (err) {
        console.error("Error al cargar contratos:", err);
        contratosFiltrados.value = [];
      }
    }
    function abrirModalFactura(item, modo) {
      selectedFactura.value = item ? { ...item } : {};
      isEditing.value = modo === "editar";
      isViewing.value = modo === "ver";
      showModal.value = true;
    }
    function abrirModalPDFFactura(item) {
      selectedFactura.value = { ...item };
      showPDFModal.value = true;
    }
    async function confirmDeleteFactura() {
      if (!facturaAEliminar.value) return;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const res = await fetch(`${config.public.backendHost}/Factura/deleteFactura/${facturaAEliminar.value.id_factura}`, {
          method: "DELETE",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401) {
          errorBanner2.value = {
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
        if (res.status === 403) {
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (!res.ok) {
          let errorMsg = "No se pudo eliminar la factura";
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {
          }
          throw new Error(errorMsg);
        }
        errorBanner2.value = { title: "\xC9xito", description: "Factura eliminada correctamente", type: "success" };
        fetchFacturas(currentPage.value);
      } catch (err) {
        errorBanner2.value = { title: "Error", description: err.message, type: "error" };
      } finally {
        showConfirmBanner.value = false;
        facturaAEliminar.value = null;
      }
    }
    const handleFacturaSubmit = async (formData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const url = isEditing.value ? `${config.public.backendHost}/Factura/updateFactura/${selectedFactura.value.id_factura}` : `${config.public.backendHost}/Factura/createFactura`;
        const response = await fetch(url, {
          method: isEditing.value ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(formData)
        });
        if (response.status === 401) {
          errorBanner2.value = {
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
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n.",
            type: "error"
          };
          return;
        }
        if (response.status === 400 || response.status === 500) {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorBanner2.value = {
              title: `Errores de validaci\xF3n: ${response.status}`,
              description: errorData.errors.join("\n"),
              type: "error"
            };
          } else if (errorData.error) {
            errorBanner2.value = {
              title: `Error: ${response.status}`,
              description: errorData.error,
              type: "error"
            };
          } else {
            errorBanner2.value = {
              title: `Error: ${response.status}`,
              description: JSON.stringify(errorData),
              type: "error"
            };
          }
          return;
        }
        if (!response.ok) {
          let errorMsg = "No se pudo guardar la factura";
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {
          }
          throw new Error(errorMsg);
        }
        errorBanner2.value = {
          title: "\xC9xito",
          description: isEditing.value ? "Factura actualizada correctamente" : "Factura creada correctamente",
          type: "success"
        };
        showModal.value = false;
        fetchFacturas(currentPage.value);
      } catch (error) {
        errorBanner2.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      }
    };
    function manejarEntidadSeleccionada(entidadCompleta2) {
      entidadCompleta2.value = entidadCompleta2;
      if (entidadCompleta2 && entidadCompleta2.contratos) {
        contratosFiltrados.value = entidadCompleta2.contratos.map((contrato) => {
          var _a;
          return {
            ...contrato,
            displayLabel: `${contrato.num_consecutivo} - ${((_a = contrato.tipoContrato) == null ? void 0 : _a.nombre) || ""} - ${contrato.ClienteOProveedor || ""}`
          };
        });
      } else {
        contratosFiltrados.value = [];
      }
      id_contrato.value = "";
    }
    watch(id_entidad, (newEntidadId, oldEntidadId) => {
      if (newEntidadId && !entidadCompleta.value) {
        cargarContratosPorEntidad(newEntidadId);
      } else if (!newEntidadId) {
        contratosFiltrados.value = [];
        id_contrato.value = "";
        entidadCompleta.value = null;
      }
    }, { immediate: true });
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
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Facturas - Pactum",
        description: "Lista y gesti\xF3n de facturas en Pactum. Filtra, exporta y administra facturas.",
        canonical: "/facturas"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner2.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: errorBanner2.value.title,
          description: errorBanner2.value.description,
          type: errorBanner2.value.type,
          onClose: ($event) => errorBanner2.value = null,
          class: "pointer-events-auto"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showConfirmBanner.value) {
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">`);
        _push(ssrRenderComponent(_sfc_main$4, {
          title: "\xBFEst\xE1s seguro que deseas eliminar esta factura?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteFactura,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Consecutivo Entidad</label><input type="text"${ssrRenderAttr("value", consecutivoEntidad.value)} placeholder="Ingrese consecutivo entidad..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Organismo Entidad</label><input type="text"${ssrRenderAttr("value", organismoEntidad.value)} placeholder="Ingrese organismo entidad..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Num. Consecutivo</label><input type="number"${ssrRenderAttr("value", num_consecutivo.value)} placeholder="N\xFAmero consecutivo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: estado.value,
        "onUpdate:modelValue": ($event) => estado.value = $event,
        options: estadoOptions.value,
        labelKey: "label",
        valueKey: "value",
        placeholder: "Seleccionar estado..."
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label><input type="date"${ssrRenderAttr("value", fecha_desde.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label><input type="date"${ssrRenderAttr("value", fecha_hasta.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Entidad por Nombre</label>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        modelValue: id_entidad.value,
        "onUpdate:modelValue": ($event) => id_entidad.value = $event,
        endpoint: "/entidad/filter/1/10",
        method: "POST",
        "search-key": "nombre",
        "label-key": "nombre",
        "value-key": "id_entidad",
        placeholder: "Buscar entidad por nombre...",
        onEntidadSeleccionada: manejarEntidadSeleccionada
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Contrato por n\xFAmero consecutivo</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: id_contrato.value,
        "onUpdate:modelValue": ($event) => id_contrato.value = $event,
        options: contratosFiltrados.value,
        labelKey: "displayLabel",
        valueKey: "id_contrato",
        disabled: !id_entidad.value,
        class: { "opacity-50": !id_entidad.value },
        placeholder: "Seleccione primero una entidad..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Trabajador Autorizado por Nombre</label>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        modelValue: id_trabajador_autorizado.value,
        "onUpdate:modelValue": ($event) => id_trabajador_autorizado.value = $event,
        endpoint: "/trabajadorAutorizado/filter/1/10",
        method: "POST",
        "search-key": "nombre",
        "label-key": "nombre",
        "value-key": "id_trabajador",
        placeholder: "Buscar trabajador por nombre..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Usuario por Nombre</label>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        modelValue: id_usuario.value,
        "onUpdate:modelValue": ($event) => id_usuario.value = $event,
        endpoint: "/Usuario/filterUsers",
        method: "POST",
        "search-key": "nombre_usuario",
        "label-key": "nombre_usuario",
        "value-key": "id_usuario",
        placeholder: "Buscar usuario por nombre...",
        "direct-data": true
      }, null, _parent));
      _push(`</div></div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button>`);
      if (!isInvitado.value) {
        _push(`<button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button>`);
      } else {
        _push(`<!---->`);
      }
      if (!isInvitado.value) {
        _push(`<button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> Exportar a Excel con Productos </button>`);
      } else {
        _push(`<!---->`);
      }
      if (!isInvitado.value) {
        _push(`<button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Exportar a Excel con Servicios </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Facturas</h2>`);
      if (!isInvitado.value) {
        _push(`<button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nueva Factura </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: facturasColumns,
        items: itemsData.value,
        actions: isInvitado.value ? [] : facturasActions,
        "total-items": totalItems.value,
        "items-per-page": itemsPorPage.value,
        "current-page": currentPage.value,
        "is-loading": isLoading.value,
        onPageChange: handlePageChange,
        onRowClick: handleRowClick
      }, null, _parent));
      _push(`<div class="mt-6 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto"><h3 class="text-xl font-semibold mb-4">Resumen de Informaci\xF3n Filtrada</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div class="bg-orange-100 text-orange-800 rounded p-3"><div class="text-sm font-medium">Suma: Servicios que los Proveedores han prestado</div><div class="text-lg font-bold">Facturado: ${ssrInterpolate(((_a = paginationData.value.serviciosProveedoresFacturados) != null ? _a : 0).toFixed(2))}</div><div class="text-lg font-bold">No Facturado: ${ssrInterpolate((((_b = paginationData.value.serviciosProveedores) != null ? _b : 0).toFixed(2) - ((_c = paginationData.value.serviciosProveedoresFacturados) != null ? _c : 0).toFixed(2)).toFixed(2))}</div><div class="text-lg font-bold">Total: ${ssrInterpolate(((_d = paginationData.value.serviciosProveedores) != null ? _d : 0).toFixed(2))}</div></div><div class="bg-blue-100 text-blue-800 rounded p-3"><div class="text-sm font-medium">Suma: Servicios prestados a Clientes</div><div class="text-lg font-bold">Facturado: ${ssrInterpolate(((_e = paginationData.value.serviciosClientesFacturados) != null ? _e : 0).toFixed(2))}</div><div class="text-lg font-bold">No Facturado: ${ssrInterpolate((((_f = paginationData.value.serviciosClientes) != null ? _f : 0).toFixed(2) - ((_g = paginationData.value.serviciosClientesFacturados) != null ? _g : 0).toFixed(2)).toFixed(2))}</div><div class="text-lg font-bold">Total: ${ssrInterpolate(((_h = paginationData.value.serviciosClientes) != null ? _h : 0).toFixed(2))}</div></div><div class="bg-orange-100 text-orange-800 rounded p-3"><div class="text-sm font-medium">Suma: Productos comprados a Proveedores</div><div class="text-lg font-bold">Facturado: ${ssrInterpolate(((_i = paginationData.value.productosProveedorFacturados) != null ? _i : 0).toFixed(2))}</div><div class="text-lg font-bold">No Facturado: ${ssrInterpolate((((_j = paginationData.value.productosProveedor) != null ? _j : 0).toFixed(2) - ((_k = paginationData.value.productosProveedorFacturados) != null ? _k : 0).toFixed(2)).toFixed(2))}</div><div class="text-lg font-bold">Total: ${ssrInterpolate(((_l = paginationData.value.productosProveedor) != null ? _l : 0).toFixed(2))}</div></div><div class="bg-blue-100 text-blue-800 rounded p-3"><div class="text-sm font-medium">Suma: Productos vendidos a Clientes</div><div class="text-lg font-bold">Facturado: ${ssrInterpolate(((_m = paginationData.value.productosClientesFacturados) != null ? _m : 0).toFixed(2))}</div><div class="text-lg font-bold">No Facturado: ${ssrInterpolate((((_n = paginationData.value.productosClientes) != null ? _n : 0).toFixed(2) - ((_o = paginationData.value.productosClientesFacturados) != null ? _o : 0).toFixed(2)).toFixed(2))}</div><div class="text-lg font-bold">Total: ${ssrInterpolate(((_p = paginationData.value.productosClientes) != null ? _p : 0).toFixed(2))}</div></div></div></div></div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        factura: selectedFactura.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        contratos: contratosFiltrados.value,
        entidades: [],
        trabajadores: [],
        usuarios: [],
        onSubmit: handleFacturaSubmit
      }, null, _parent));
      _push(ssrRenderComponent(FacturaPDFModal, {
        modelValue: showPDFModal.value,
        "onUpdate:modelValue": ($event) => showPDFModal.value = $event,
        factura: selectedFactura.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/facturas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=facturas-QOBuqXXQ.mjs.map
