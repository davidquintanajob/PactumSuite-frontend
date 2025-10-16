<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta
      title="Inicio - Pactum"
      description="La plataforma integral para la gestión eficiente de contratos, entidades y trabajadores."
      canonical="/"
    />
    <Navbar />
    
    <!-- MessageBanner para mostrar estado de verificación de contratos -->
    <div v-if="verificationBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner 
        :title="verificationBanner.title" 
        :description="verificationBanner.description" 
        :type="verificationBanner.type"
        :persistent="verificationBanner.persistent"
        @close="verificationBanner = null" 
        class="pointer-events-auto" 
      />
    </div>
    
    <div class="mt-8 md:mt-0 flex-1 flex flex-col">
      <!-- Header/logo -->
      <header class="flex flex-col items-center justify-center py-12">
        <img src="/logo.png" alt="Logo" class="h-40 w-40 shadow-md mb-4" />
        <h1 class="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2 text-center drop-shadow">Pactum Suite</h1>
        <h1 class="text-2xl md:text-3xl text-primary/80 mb-2 text-center drop-shadow">Beta Vercion (1.0)</h1>
        <p class="text-lg md:text-xl text-dark/70 text-center max-w-2xl">La plataforma integral para la gestión eficiente de contratos, entidades, facturas y productos de tu organización orientado al comercio.</p>
      </header>

      <!-- Funcionalidades principales y accesos directos -->
      <section class="flex-1 flex flex-col items-center justify-center px-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl w-full mb-12">
          <div @click="goTo('contratos')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-primary mb-4 group-hover:brightness-90 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 class="text-xl font-semibold text-primary mb-2">Contratos</h3>
            <p class="text-dark text-center">Gestiona todos los contratos de tu organización.</p>
          </div>
          <div @click="goTo('entidades')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group relative">
            <!-- Indicador numérico para contratos próximos a vencer -->
            <div v-if="contratosProximosCount > 0" class="absolute -top-2 -right-2 bg-danger text-neutral text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
              {{ contratosProximosCount }}
            </div>
            <svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-primary mb-2">Entidades</h3>
            <p class="text-dark text-center">Administra proveedores, clientes y otras entidades.</p>
          </div>
          <div @click="goTo('facturas')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-primary mb-2">Facturas</h3>
            <p class="text-dark text-center">Consulta y administra las facturas asociadas a contratos.</p>
          </div>
          <div @click="goTo('productos')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="text-xl font-semibold text-primary mb-2">Productos</h3>
            <p class="text-dark text-center">Gestiona los productos que tienes para la venta y la existencia de estos.</p>
          </div>
          <div @click="goTo('trabajadores')" class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group">
            <svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-primary mb-2">Trabajadores</h3>
            <p class="text-dark text-center">Registra y gestiona trabajadores autorizados y sus contratos.</p>
          </div>
        </div>
  <button @click="goToLogin" class="mt-4 px-8 py-3 bg-primary text-neutral text-lg font-semibold rounded-full shadow hover:bg-primary/90 transition">Iniciar sesión</button>
      </section>

      <!-- Footer -->
      <footer class="w-full py-6 text-center text-dark text-sm bg-transparent mt-auto">
        © {{ new Date().getFullYear() }} Pactum Suite. Desarrollado por David Quintana Valdés, Soporte: +53 56242671 
      </footer>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import SeoMeta from '@/components/SeoMeta.vue';
import { navigateTo } from 'nuxt/app';
import { ref, onMounted } from 'vue';

const goToLogin = () => navigateTo('/login');

const goTo = (ruta) => {
    const token = localStorage.getItem('token');
    if (token) {
        navigateTo(`/${ruta}`);
    } else {
        navigateTo('/login');
    }
};

// Variables reactivas para la verificación de contratos
const verificationBanner = ref(null);
const contratosProximosCount = ref(0);

// Función para verificar contratos próximos a vencer
const verificarContratosProximos = async () => {
  const token = localStorage.getItem('token');
  
  // Solo verificar si hay token (usuario autenticado)
  if (!token) {
    return;
  }

  try {
    // Mostrar mensaje de verificación
    verificationBanner.value = {
      title: 'Verificando Contratos',
      description: 'Comprobando si hay contratos próximos a vencer...',
      type: 'warning',
      persistent: false
    };

    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.backendHost}/contrato/proximos-a-vencer`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    // Manejo de errores: 401 = sesión expirada (redirigir), 403 = permisos denegados
    if (response.status === 401) {
      verificationBanner.value = {
        title: 'Sesión Expirada',
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning',
        persistent: false
      };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
      return;
    }
    if (response.status === 403) {
      verificationBanner.value = {
        title: 'Acceso Denegado',
        description: 'No tienes permisos para realizar esta acción o acceder a esta información.',
        type: 'error',
        persistent: false
      };
      return;
    }

    const data = await response.json();
    
    if (data.count > 0) {
      // Hay contratos próximos a vencer
      const entidades = data.data.map(contrato => contrato.entidad?.nombre).filter(nombre => nombre);
      const entidadesUnicas = [...new Set(entidades)];
      const entidadesTexto = entidadesUnicas.join(', ');
      
      contratosProximosCount.value = data.count;
      
      verificationBanner.value = {
        title: `Contratos Próximos a Vencer`,
        description: `Hay ${data.count} contrato(s) próximo(s) a vencer de las entidades: ${entidadesTexto}`,
        type: 'warning',
        persistent: true
      };
    } else {
      // No hay contratos próximos a vencer
      contratosProximosCount.value = 0;
      
      verificationBanner.value = {
        title: 'Sin Contratos Próximos a Vencer',
        description: 'No hay contratos próximos a vencer en este momento.',
        type: 'success',
        persistent: false
      };
    }
  } catch (error) {
    console.error('Error al verificar contratos próximos a vencer:', error);
    verificationBanner.value = {
      title: 'Error de Verificación',
      description: 'No se pudo verificar los contratos próximos a vencer.',
      type: 'error',
      persistent: false
    };
  }
};

// Verificar contratos cuando se monta el componente
onMounted(() => {
  verificarContratosProximos();
});
</script>
<style scoped>
/* Estilos adicionales si son necesarios */
</style>
