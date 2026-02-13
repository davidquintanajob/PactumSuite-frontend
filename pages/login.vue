<template>
  <div class="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral">
    <SeoMeta title="Iniciar Sesión - Contract Manager" description="Accede a Contract Manager para gestionar contratos y entidades." canonical="/login" />
    
    <!-- Pantalla de carga -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p class="text-gray-700 font-medium">Iniciando sesión...</p>
      </div>
    </div>

    <!-- Banner de error -->
    <MessageBanner 
      v-if="showError" 
      title="Error al iniciar sesión" 
      :description="errorMsg" 
      type="error" 
      @close="showError = false"
    />

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-24 w-24 rounded-full shadow mt-8" src="/logo.png" alt="Logo" />
      <h2 class="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">Inicia sesión en tu cuenta</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-900">Nombre de usuario</label>
          <div class="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              v-model="username"
              :disabled="isLoading"
              class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Usuario"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-900">Contraseña</label>
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              :disabled="isLoading"
              class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-neutral shadow hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ingresar
          </button>
        </div>
      </form>

      <!--
      <p class="mt-10 text-center text-sm text-gray-500">
        ¿No tienes cuenta?
        <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Regístrate aquí</a>
      </p>
      -->
    </div>
  </div>
</template>

<script setup>
import SeoMeta from '@/components/SeoMeta.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import { ref } from 'vue';
import { useRuntimeConfig, navigateTo } from 'nuxt/app';

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const showError = ref(false);
const isLoading = ref(false);
const config = useRuntimeConfig();

const handleLogin = async () => {
  errorMsg.value = '';
  showError.value = false;
  
  if (!username.value || !password.value) {
    errorMsg.value = 'Por favor, completa todos los campos.';
    showError.value = true;
    return;
  }
  
  isLoading.value = true;
  
  try {
    const res = await fetch(`${config.public.backendHost}/usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nombre_usuario: username.value,
        contrasenna: password.value
      })
    });
    
    if (!res.ok) {
      const data = await res.json();
      errorMsg.value = 'Usuario o contraseña incorrectos.';
      showError.value = true;
      isLoading.value = false;
      return;
    }
    
    const data = await res.json();
    if (data.token && data.usuario) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      // After successful login, try to fetch exchange rate and store it as { cambio_moneda: rate }
      // If exchange-rate fails, fall back to fetching /config as before
      try {
        const exchRes = await fetch(`${config.public.backendHost}/exchange-rate`);
        if (exchRes.ok) {
          const exchData = await exchRes.json().catch(() => null);
          if (exchData && exchData.rate != null) {
            const cfgObj = { cambio_moneda: Number(exchData.rate) };
            localStorage.setItem('config', JSON.stringify(cfgObj));
          } else {
            // fallback to /config
            try {
              const cfgRes = await fetch(`${config.public.backendHost}/config`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': data.token || ''
                }
              });
              if (cfgRes.ok) {
                const cfgData = await cfgRes.json();
                localStorage.setItem('config', JSON.stringify(cfgData));
              } else {
                console.warn('No se pudo obtener /config:', cfgRes.status);
              }
            } catch (e) {
              console.warn('Error al obtener /config:', e);
            }
          }
        } else {
          // exch endpoint didn't return ok -> fallback
          try {
            const cfgRes = await fetch(`${config.public.backendHost}/config`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': data.token || ''
              }
            });
            if (cfgRes.ok) {
              const cfgData = await cfgRes.json();
              localStorage.setItem('config', JSON.stringify(cfgData));
            } else {
              console.warn('No se pudo obtener /config:', cfgRes.status);
            }
          } catch (e) {
            console.warn('Error al obtener /config:', e);
          }
        }
      } catch (e) {
        // network or other error -> fallback to /config
        try {
          const cfgRes = await fetch(`${config.public.backendHost}/config`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': data.token || ''
            }
          });
          if (cfgRes.ok) {
            const cfgData = await cfgRes.json();
            localStorage.setItem('config', JSON.stringify(cfgData));
          } else {
            console.warn('No se pudo obtener /config:', cfgRes.status);
          }
        } catch (err) {
          console.warn('Error al obtener /config:', err);
        }
      }
      navigateTo('/');
    } else {
      errorMsg.value = 'Respuesta inesperada del servidor.';
      showError.value = true;
      isLoading.value = false;
    }
  } catch (e) {
    errorMsg.value = 'Error de conexión con el servidor.';
    showError.value = true;
    isLoading.value = false;
  }
};
</script>
