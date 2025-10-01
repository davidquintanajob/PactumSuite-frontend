<template>
    <!-- Contenedor principal -->
    <div class="relative" ref="navRoot">
        <!-- Botón de toggle (SOLO DESKTOP) - Fijo en la pantalla -->
                <button @click="toggleNav"
            class="hidden md:flex items-center fixed z-50 bg-accent text-white rounded-r-full h-16 pr-4 shadow-lg hover:bg-accent-dark transition-all duration-300 ease-in-out"
            :style="{ left: isNavCollapsed ? '0px' : '255px', right: 'auto', width: isNavCollapsed ? 'auto' : 'auto', top: '200px' }">
            <!-- Icono -->
            <div class="flex items-center justify-center w-8 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 w-5', isChevronAnimating ? 'chevron-wobble' : '']" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        :d="isNavCollapsed ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'" />
                </svg>
            </div>
        </button>

        <!-- Barra de navegación -->
        <nav class="fixed top-0 left-0 w-full bg-gradient-to-r from-primary to-secondary shadow-lg z-40 md:w-64 md:h-screen md:bg-gradient-to-b transition-all duration-300 ease-in-out"
            :class="{ 'md:transform md:-translate-x-full': isNavCollapsed }" style="--nav-width: 16rem;">

            <div
                class="container mx-auto flex justify-between items-center py-4 px-6 md:flex-col md:items-start md:justify-start md:py-6 md:h-full">
                <div class="hidden md:flex md:items-center relative">
                    <h1 @click="goHome" class="text-white text-3xl md:text-4xl font-sans font-bold tracking-tight mr-4 cursor-pointer select-none">
                        PACTUM
                    </h1>
                    <div class="relative flex flex-col items-center justify-center">
                        <a @click="toggleUserMenu"
                            class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition flex items-center justify-center cursor-pointer">
                            <img src="/usuario.png" alt="Usuario"
                                class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" />
                        </a>
                        <span v-if="isConnected" class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-success text-neutral shadow z-10">Conectado</span>
                        <span v-else class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-danger text-neutral shadow z-10">Desconectado</span>
                    </div>
                </div>

                <!-- Logo / Nombre (Móvil) -->
                <h1 class="text-white text-3xl font-sans font-bold tracking-tight md:hidden">
                    SOLUTEL
                </h1>

                <!-- Menú hamburguesa (Móvil) - SIN CAMBIOS -->
                <button @click="toggleMenu"
                    class="md:hidden text-white focus:outline-none transition duration-300">
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Botón de usuario (Móvil) -->
                <a @click="toggleUserMenu"
                    class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition ml-6 flex items-center justify-center cursor-pointer md:hidden">
                    <div class="relative w-full h-full flex items-center justify-center">
                        <img src="/usuario.png" alt="Usuario"
                            class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" />
                        <span v-if="isConnected" class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white shadow z-10">Conectado</span>
                        <span v-else class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-red-500 text-white shadow z-10">Desconectado</span>
                    </div>
                </a>

                <!-- Botones de navegación (Escritorio) -->
                <div class="hidden md:flex flex-col space-y-4 w-full md:mt-4">
                    <a v-for="(option, index) in options" :key="index"
                        href="#"
                        class="text-white flex items-center px-4 py-3 rounded-lg border border-white transition group hover:bg-accent hover:text-black"
                        @click.prevent="handleNavigation(option.link); isNavCollapsed = true">
                        <img :src="option.src" alt=""
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300">
                        <span class="text-[15px]">{{ option.label }}</span>
                    </a>
                </div>


            </div>

            <!-- Overlay para el menú de usuario (SIN CAMBIOS) -->
            <div v-if="isUserMenuOpen" class="fixed inset-0 z-40" @click="isUserMenuOpen = false">
                <div class="fixed top-0 right-0 w-64 h-screen bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out"
                    :style="{ transform: isUserMenuOpen ? 'translateX(0)' : 'translateX(100%)' }" @click.stop>
                    <a href="/perfil"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black"
                        @click.prevent="handlePerfilClick">
                        <img src="/perfil.png" alt="Perfil"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Mi Perfil
                    </a>
                    <hr class="border-white" />
                    <a href="/cerrar-sesion"
                        class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black"
                        @click.prevent="handleLogout">
                        <img src="/cerrar-sesion.png" alt="Cerrar Sesión"
                            class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" />
                        Cerrar Sesión
                    </a>
                </div>
            </div>

            <!-- Menú desplegable (Móvil) - SIN CAMBIOS -->
            <div v-if="isMenuOpen"
                class="md:hidden fixed top-16 left-0 w-full bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out">
                <a v-for="(option, index) in options" :key="index"
                    href="#"
                    class="flex items-center block text-white text-center py-2 rounded-lg transition group hover:bg-accent"
                    @click.prevent="handleNavigation(option.link); isMenuOpen = false">
                    <img :src="option.src" alt=""
                        class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300">
                    <span>{{ option.label }}</span>
                </a>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { navigateTo } from 'nuxt/app';

const navRoot = ref(null);

// Estado del navbar colapsado (solo desktop)
const isNavCollapsed = ref(true);

// Controla el estado del menú de usuario y del menú móvil
const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

// Estado de conexión
const isConnected = ref(false);

// Chevron wobble animation state
const isChevronAnimating = ref(false);
let chevronInterval = null;

// Función para alternar el estado del navbar
const toggleNav = () => {
    isNavCollapsed.value = !isNavCollapsed.value;
    // start or clear inactivity timer depending on expanded/collapsed
    if (!isNavCollapsed.value) startInactivityTimer(); else clearInactivityTimer();
};

// Opciones de navegación
const options = [
    { label: "Entidades", src: "/edificios.png", link: "/entidades" },
    { label: "Contratos", src: "/contrato.png", link: "/contratos" },
    { label: "Trabajadores", src: "/lanza-libre.png", link: "/trabajadores" },
    { label: "Productos", src: "/contrato.png", link: "/productos" },
    { label: "Facturas", src: "/contrato.png", link: "/facturas" },
    { label: "Servicios", src: "/contrato.png", link: "/servicios" },
    { label: "Tipos de Contratos", src: "/firmar.png", link: "/tipos-contratos" },
    { label: "Ofertas", src: "/oferta-de-trabajo.png", link: "/ofertas" },
    { label: "Usuario", src: "/usuarios.png", link: "/usuarios" }
];

// Función para alternar el menú de usuario
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
    // start/clear inactivity timer when opening/closing user menu
    if (isUserMenuOpen.value) startInactivityTimer(); else clearInactivityTimer();
};

// Función para alternar el menú móvil (hamburguesa)
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    if (isMenuOpen.value) startInactivityTimer(); else clearInactivityTimer();
};

function goHome() {
    navigateTo('/');
}

function handleLogout() {
    localStorage.clear();
    console.log("Cerrando seción");
    if (window.location.pathname === '/') {
        window.location.reload();
    } else {
        navigateTo('/');
    }
}

function handlePerfilClick() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        navigateTo('/perfil');
    } else {
        navigateTo('/login');
    }
}

function handleNavigation(link) {
    const token = localStorage.getItem('token');
    // collapse navbar when navigating and clear inactivity timer
    isNavCollapsed.value = true;
    clearInactivityTimer();
    if (token) {
        navigateTo(link);
    } else {
        navigateTo('/login');
    }
}

onMounted(() => {
    const hasVisited = localStorage.getItem('hasVisitedNavbar');
    if (!hasVisited) {
        isNavCollapsed.value = false; // Expandir la primera vez
        localStorage.setItem('hasVisitedNavbar', 'true');
    }
    isConnected.value = !!localStorage.getItem('token');
    
    // Set up click-outside and Escape key handlers to close menus
    // Define handlers in outer scope variables so we can remove them on unmount
    onDocClick = (e) => {
        if (!navRoot.value) return;
        const target = e.target || e;
        if (!navRoot.value.contains(target)) {
            // If user clicked/touched outside the navbar area, close menus
            if (!isNavCollapsed.value) isNavCollapsed.value = true;
            if (isMenuOpen.value) isMenuOpen.value = false;
            if (isUserMenuOpen.value) isUserMenuOpen.value = false;
        }
    };

    onKeydown = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (!isNavCollapsed.value) isNavCollapsed.value = true;
            if (isMenuOpen.value) isMenuOpen.value = false;
            if (isUserMenuOpen.value) isUserMenuOpen.value = false;
        }
    };

    document.addEventListener('click', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    document.addEventListener('keydown', onKeydown);
    // Reset inactivity timer when interacting inside the navbar
    if (navRoot.value && navRoot.value.addEventListener) {
        navRoot.value.addEventListener('click', resetInactivityTimer);
        navRoot.value.addEventListener('touchstart', resetInactivityTimer);
    }

    // Start chevron interval which will trigger wobble every 5s only when collapsed
    chevronInterval = setInterval(() => {
        if (isNavCollapsed.value) {
            // Trigger short animation (match CSS duration below)
            isChevronAnimating.value = true;
            setTimeout(() => { isChevronAnimating.value = false; }, 1200); // animation duration
        }
    }, 5000);
});

let onDocClick = null;
let onKeydown = null;
let inactivityTimeout = null;
const INACTIVITY_MS = 10000; // 10 seconds

function clearInactivityTimer() {
    if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = null;
    }
}

function startInactivityTimer() {
    clearInactivityTimer();
    // only start timer if any menu is open (desktop expanded or mobile/user menus)
    if (!isNavCollapsed.value || isMenuOpen.value || isUserMenuOpen.value) {
        inactivityTimeout = setTimeout(() => {
            isNavCollapsed.value = true;
            isMenuOpen.value = false;
            isUserMenuOpen.value = false;
            inactivityTimeout = null;
        }, INACTIVITY_MS);
    }
}

function resetInactivityTimer() {
    // Reset only if some menu is open
    if (!isNavCollapsed.value || isMenuOpen.value || isUserMenuOpen.value) {
        startInactivityTimer();
    }
}

onUnmounted(() => {
    if (onDocClick) {
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('touchstart', onDocClick);
    }
    if (onKeydown) {
        document.removeEventListener('keydown', onKeydown);
    }
    if (navRoot.value && navRoot.value.removeEventListener) {
        navRoot.value.removeEventListener('click', resetInactivityTimer);
        navRoot.value.removeEventListener('touchstart', resetInactivityTimer);
    }
    clearInactivityTimer();
        if (chevronInterval) {
                clearInterval(chevronInterval);
                chevronInterval = null;
        }

});

</script>

<style scoped>
.chevron-wobble {
    animation: chevron-wobble 1.2s cubic-bezier(.36,.07,.19,.97);
    transform-origin: center;
    filter: drop-shadow(0 6px 8px rgba(0,0,0,0.15));
}

@keyframes chevron-wobble {
    0% { transform: translateX(0) rotate(0deg) scale(1); }
    12% { transform: translateX(-6px) rotate(-12deg) scale(1.05); }
    25% { transform: translateX(10px) rotate(14deg) scale(1.08); }
    45% { transform: translateX(-8px) rotate(-8deg) scale(1.03); }
    65% { transform: translateX(6px) rotate(6deg) scale(1.02); }
    85% { transform: translateX(-3px) rotate(-3deg) scale(1.01); }
    100% { transform: translateX(0) rotate(0deg) scale(1); }
}
</style>
 