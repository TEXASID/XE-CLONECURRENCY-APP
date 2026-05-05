<template>
  <div id="app" class="app-container">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#home" @click.prevent="changeView('home')">
          <i class="fas fa-hospital-user"></i> Clinic System
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="#checkin" @click.prevent="changeView('checkin')">
            <i class="fas fa-edit"></i> Check-in
          </a>
          <a class="nav-link" href="#queue" @click.prevent="changeView('queue')">
            <i class="fas fa-users"></i> Queue
          </a>
          <a class="nav-link" href="#profile" @click.prevent="changeView('profile')">
            <i class="fas fa-user-circle"></i> Profile
          </a>
          <a class="nav-link" href="#game" @click.prevent="changeView('game')">
            <i class="fas fa-gamepad"></i> Game
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Home View -->
      <div v-if="currentView === 'home'">
        <HomeView />
      </div>

      <!-- Check-in View -->
      <div v-if="currentView === 'checkin'">
        <CheckInView />
      </div>

      <!-- Queue View -->
      <div v-if="currentView === 'queue'">
        <QueueView />
      </div>

      <!-- Profile View -->
      <div v-if="currentView === 'profile'">
        <ProfileView />
      </div>

      <!-- Game View -->
      <div v-if="currentView === 'game'">
        <GameView />
      </div>
    </main>

    <!-- Footer -->
    <footer>
      <div class="container">
        <h6><i class="fas fa-link"></i> Quick Navigation</h6>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <a href="#checkin" @click.prevent="changeView('checkin')">
            <i class="fas fa-edit"></i> Check-in
          </a>
          <a href="#queue" @click.prevent="changeView('queue')">
            <i class="fas fa-users"></i> Queue
          </a>
          <a href="#profile" @click.prevent="changeView('profile')">
            <i class="fas fa-user-circle"></i> Profile
          </a>
          <a href="#game" @click.prevent="changeView('game')">
            <i class="fas fa-gamepad"></i> Game
          </a>
        </div>
        <p class="text-muted mt-3 small">
          <i class="far fa-copyright"></i> 2024 Digital Patient Check-in System |
          <i class="fas fa-chart-line"></i> Real-time Updates
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useClinicStore } from './stores/clinicStore'
import HomeView from './components/HomeView.vue'
import CheckInView from './components/CheckInView.vue'
import QueueView from './components/QueueView.vue'
import ProfileView from './components/ProfileView.vue'
import GameView from './components/GameView.vue'

export default {
  name: 'App',
  components: {
    HomeView,
    CheckInView,
    QueueView,
    ProfileView,
    GameView
  },
  setup() {
    const clinicStore = useClinicStore()
    
    // Computed properties
    const currentView = computed(() => clinicStore.currentView)
    
    // Navigation handler
    const changeView = (view) => {
      clinicStore.setView(view)
      // Update URL hash without causing page reload
      window.location.hash = view
    }
    
    // Copy link function
    const copyLink = (page) => {
      const baseUrl = window.location.href.split('#')[0]
      const fullUrl = `${baseUrl}#${page}`
      
      // Copy to clipboard
      navigator.clipboard.writeText(fullUrl)
      
      // Show notification
      const notification = document.createElement('div')
      notification.className = 'alert alert-success position-fixed top-0 end-0 m-3'
      notification.style.zIndex = '9999'
      notification.innerHTML = `✅ Link copied: ${fullUrl}`
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 2000)
    }
    
    // Check URL hash on load
    const checkHashOnLoad = () => {
      const hash = window.location.hash.slice(1)
      if (hash && ['home', 'checkin', 'queue', 'profile', 'game'].includes(hash)) {
        clinicStore.setView(hash)
      }
    }
    
    // Lifecycle method - mounted()
    onMounted(() => {
      clinicStore.initializeClinic()
      checkHashOnLoad()
      
      // Listen for hash changes
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1)
        if (hash && ['home', 'checkin', 'queue', 'profile', 'game'].includes(hash)) {
          clinicStore.setView(hash)
        }
      })
    })
    
    return {
      currentView,
      changeView,
      copyLink
    }
  }
}
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.navbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-link {
  transition: all 0.3s ease;
  margin: 0 5px;
}

.nav-link:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.nav-link.active {
  background-color: var(--primary-color);
  border-radius: 5px;
}

/* Footer styles */
footer {
  margin-top: auto;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  animation: footerFullMove 5s ease-in-out infinite;
}

@keyframes footerFullMove {
  0%, 100% {
    transform: translateX(0) translateY(0);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
  2% {
    transform: translateX(-3px) translateY(-2px);
  }
  4% {
    transform: translateX(3px) translateY(0);
  }
  6% {
    transform: translateX(-2px) translateY(2px);
  }
  8% {
    transform: translateX(2px) translateY(0);
  }
  10% {
    transform: translateX(0) translateY(0);
    box-shadow: 0 -4px 15px rgba(102, 126, 234, 0.3);
  }
  15% {
    transform: translateX(0) translateY(0);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}

footer a {
  color: #6c757d;
  transition: all 0.3s ease;
  padding: 8px 15px;
  border-radius: 20px;
  text-decoration: none;
}

footer a:hover {
  color: var(--primary-color) !important;
  transform: translateY(-2px);
  background-color: rgba(102, 126, 234, 0.1);
}

footer:hover {
  animation-play-state: paused;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-nav {
    text-align: center;
    margin-top: 10px;
  }

  .nav-link {
    display: inline-block;
    margin: 5px;
  }
}
</style>
