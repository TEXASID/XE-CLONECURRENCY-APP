<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title">
              <i class="fas fa-stethoscope"></i> Digital Patient Check-in System
            </h1>
            <p class="hero-subtitle">
              Experience hassle-free patient registration and queue management
            </p>
            <div class="hero-buttons mt-4">
              <a href="#checkin" class="btn btn-primary btn-lg me-3" @click.prevent="changeView('checkin')">
                <i class="fas fa-edit"></i> Check-in Now
              </a>
              <a href="#queue" class="btn btn-outline-light btn-lg me-3" @click.prevent="changeView('queue')">
                <i class="fas fa-users"></i> View Queue
              </a>
              <a href="#game" class="btn btn-outline-light btn-lg" @click.prevent="changeView('game')">
                <i class="fas fa-gamepad"></i> Play Game
              </a>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="stats-grid">
              <div class="stat-card-home">
                <div class="stat-icon">👥</div>
                <div class="stat-number">{{ totalPatients }}</div>
                <div class="stat-label">Patients Served</div>
              </div>
              <div class="stat-card-home">
                <div class="stat-icon">⏱️</div>
                <div class="stat-number">{{ avgWaitTime }} min</div>
                <div class="stat-label">Avg Wait Time</div>
              </div>
              <div class="stat-card-home">
                <div class="stat-icon">👨‍⚕️</div>
                <div class="stat-number">{{ doctorsOnline }}</div>
                <div class="stat-label">Doctors Online</div>
              </div>
              <div class="stat-card-home">
                <div class="stat-icon">⭐</div>
                <div class="stat-number">98%</div>
                <div class="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-3">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h4>Quick Check-in</h4>
            <p>Register patients in seconds with our streamlined form</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h4>Queue Management</h4>
            <p>Real-time queue tracking and management system</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>Analytics</h4>
            <p>Track patient flow and service efficiency</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h4>Health Game</h4>
            <p>Interactive game for health education</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort Options Section - Queue Preview -->
    <div class="container mt-4">
      <div class="sort-options-card">
        <div class="card-header bg-gradient">
          <i class="fas fa-sort-amount-down-alt"></i> Sort & Organize Queue Preview
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="sort-section">
                <h6><i class="fas fa-sort"></i> Sort By</h6>
                <div class="btn-group w-100 mb-2">
                  <button 
                    class="btn btn-outline-primary sort-btn" 
                    :class="{ active: sortOptions.sortBy === 'queue' }"
                    @click="setSortBy('queue')"
                  >
                    <i class="fas fa-hashtag"></i> Queue #
                  </button>
                  <button 
                    class="btn btn-outline-primary sort-btn" 
                    :class="{ active: sortOptions.sortBy === 'time' }"
                    @click="setSortBy('time')"
                  >
                    <i class="fas fa-clock"></i> Time
                  </button>
                  <button 
                    class="btn btn-outline-primary sort-btn" 
                    :class="{ active: sortOptions.sortBy === 'name' }"
                    @click="setSortBy('name')"
                  >
                    <i class="fas fa-user"></i> Name
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="order-section">
                <h6><i class="fas fa-arrow-up-arrow-down"></i> Order</h6>
                <div class="btn-group w-100 mb-2">
                  <button 
                    class="btn btn-outline-secondary order-btn" 
                    :class="{ active: sortOptions.sortOrder === 'asc' }"
                    @click="setSortOrder('asc')"
                  >
                    <i class="fas fa-arrow-up"></i> Ascending
                  </button>
                  <button 
                    class="btn btn-outline-secondary order-btn" 
                    :class="{ active: sortOptions.sortOrder === 'desc' }"
                    @click="setSortOrder('desc')"
                  >
                    <i class="fas fa-arrow-down"></i> Descending
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="quick-filters">
                <h6><i class="fas fa-filter"></i> Quick Filters</h6>
                <div class="d-flex flex-wrap gap-2">
                  <span 
                    class="quick-filter-badge" 
                    :class="{ active: sortOptions.filterBy === 'all' }"
                    @click="setFilter('all')"
                  >
                    <i class="fas fa-globe"></i> All
                  </span>
                  <span 
                    class="quick-filter-badge" 
                    :class="{ active: sortOptions.filterBy === 'high-severity' }"
                    @click="setFilter('high-severity')"
                  >
                    <i class="fas fa-exclamation-triangle"></i> High Severity
                  </span>
                  <span 
                    class="quick-filter-badge" 
                    :class="{ active: sortOptions.filterBy === 'waiting-long' }"
                    @click="setFilter('waiting-long')"
                  >
                    <i class="fas fa-hourglass"></i> Waiting Long
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="display-section">
                <h6><i class="fas fa-eye"></i> Display Options</h6>
                <div class="row">
                  <div class="col-6">
                    <select class="form-select items-per-page" v-model="sortOptions.itemsPerPage">
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <select class="form-select show-fields" v-model="sortOptions.viewMode">
                      <option value="table">Table view</option>
                      <option value="cards">Card view</option>
                      <option value="compact">Compact view</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="view-toggle">
                <h6><i class="fas fa-table"></i> View Mode</h6>
                <div class="btn-group w-100">
                  <button 
                    class="btn btn-outline-primary view-btn" 
                    :class="{ active: sortOptions.viewMode === 'table' }"
                    @click="setViewMode('table')"
                  >
                    <i class="fas fa-table"></i> Table
                  </button>
                  <button 
                    class="btn btn-outline-primary view-btn" 
                    :class="{ active: sortOptions.viewMode === 'cards' }"
                    @click="setViewMode('cards')"
                  >
                    <i class="fas fa-cards"></i> Cards
                  </button>
                  <button 
                    class="btn btn-outline-primary view-btn" 
                    :class="{ active: sortOptions.viewMode === 'compact' }"
                    @click="setViewMode('compact')"
                  >
                    <i class="fas fa-compress"></i> Compact
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="sort-info mt-3 p-2 bg-light rounded">
            <small class="text-muted">
              <i class="fas fa-info-circle"></i>
              Currently sorting by: <strong>{{ currentSortInfo }}</strong>
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample Queue Preview Table -->
    <div class="container mt-4">
      <div class="queue-container">
        <div class="queue-header d-flex justify-content-between align-items-center mb-3">
          <h4><i class="fas fa-list-ol"></i> Current Patient Queue Preview</h4>
          <span class="queue-count-badge">
            <i class="fas fa-users"></i> {{ sortedPatients.length }} patients
          </span>
        </div>
        
        <!-- Table View -->
        <div v-if="sortOptions.viewMode === 'table'" class="table-responsive">
          <table class="table queue-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> Position</th>
                <th><i class="fas fa-qrcode"></i> Queue #</th>
                <th><i class="fas fa-user"></i> Patient Name</th>
                <th><i class="fas fa-stethoscope"></i> Symptoms</th>
                <th><i class="fas fa-clock"></i> Check-in Time</th>
                <th><i class="fas fa-hourglass-half"></i> Est. Wait</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(patient, index) in sortedPatients.slice(0, 5)" :key="patient.id">
                <td>
                  <div class="position-badge">{{ index + 1 }}</div>
                </td>
                <td><span class="queue-badge">#{{ patient.queueNumber }}</span></td>
                <td>
                  <div class="patient-info"><i class="fas fa-user-circle"></i> {{ patient.name }}</div>
                </td>
                <td>
                  <span v-for="symptom in patient.symptoms" :key="symptom" class="badge bg-secondary me-1">
                    {{ symptom }}
                  </span>
                </td>
                <td><i class="far fa-clock"></i> {{ patient.registrationTime }}</td>
                <td>
                  <span class="wait-minutes">{{ calculateWaitTime(index) }} min</span>
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: calculateProgress(index) + '%' }"></div>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedPatients.length === 0">
                <td colspan="6" class="text-center">No patients in queue</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card View -->
        <div v-else-if="sortOptions.viewMode === 'cards'" class="row">
          <div v-for="(patient, index) in sortedPatients.slice(0, 5)" :key="patient.id" class="col-md-6 mb-3">
            <div class="card patient-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="card-title">
                      <span class="queue-badge">#{{ patient.queueNumber }}</span> {{ patient.name }}
                    </h5>
                    <p class="card-text">
                      <small class="text-muted">
                        <i class="far fa-clock"></i> {{ patient.registrationTime }}
                      </small>
                    </p>
                  </div>
                  <div class="position-badge">{{ index + 1 }}</div>
                </div>
                <div class="mt-2">
                  <span v-for="symptom in patient.symptoms" :key="symptom" class="badge bg-secondary me-1">
                    {{ symptom }}
                  </span>
                </div>
                <div class="progress mt-2">
                  <div class="progress-bar" :style="{ width: calculateProgress(index) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact View -->
        <div v-else class="compact-view">
          <div v-for="(patient, index) in sortedPatients.slice(0, 5)" :key="patient.id" class="compact-item">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="position-badge me-3">{{ index + 1 }}</div>
                <div>
                  <strong>#{{ patient.queueNumber }}</strong> {{ patient.name }}
                  <small class="text-muted d-block">
                    <i class="far fa-clock"></i> {{ patient.registrationTime }}
                  </small>
                </div>
              </div>
              <div class="text-end">
                <span class="wait-minutes">{{ calculateWaitTime(index) }} min</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-3">
          <a href="#queue" class="btn btn-primary" @click.prevent="changeView('queue')">
            <i class="fas fa-arrow-right"></i> View Full Queue Management
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useClinicStore } from '../stores/clinicStore'

export default {
  name: 'HomeView',
  setup() {
    const clinicStore = useClinicStore()
    
    // Computed properties
    const totalPatients = computed(() => clinicStore.dailyStats.totalServed + clinicStore.patients.length)
    const avgWaitTime = computed(() => {
      if (clinicStore.patients.length === 0) return 0
      return Math.floor(Math.random() * 20) + 10
    })
    const doctorsOnline = computed(() => clinicStore.availableDoctors.length)
    const sortedPatients = computed(() => clinicStore.sortedPatients)
    const sortOptions = computed(() => clinicStore.sortOptions)
    
    const currentSortInfo = computed(() => {
      const sortBy = sortOptions.value.sortBy.charAt(0).toUpperCase() + sortOptions.value.sortBy.slice(1)
      const order = sortOptions.value.sortOrder === 'asc' ? 'Ascending' : 'Descending'
      return `${sortBy} (${order})`
    })
    
    // Methods
    const changeView = (view) => {
      clinicStore.setView(view)
    }
    
    const setSortBy = (sortBy) => {
      clinicStore.sortPatients(sortBy)
    }
    
    const setSortOrder = (order) => {
      clinicStore.setSortOrder(order)
    }
    
    const setFilter = (filter) => {
      clinicStore.setFilter(filter)
    }
    
    const setViewMode = (mode) => {
      clinicStore.setViewMode(mode)
    }
    
    const calculateWaitTime = (index) => {
      return (index + 1) * 15
    }
    
    const calculateProgress = (index) => {
      return Math.min(100, (index + 1) * 20)
    }
    
    // Lifecycle method
    onMounted(() => {
      // Update stats from localStorage if available
      const clinicData = localStorage.getItem('clinicQueueData')
      if (clinicData) {
        const data = JSON.parse(clinicData)
        if (data.patients) {
          clinicStore.patients = data.patients
        }
        if (data.dailyStats) {
          clinicStore.dailyStats = data.dailyStats
        }
      }
    })
    
    return {
      totalPatients,
      avgWaitTime,
      doctorsOnline,
      sortedPatients,
      sortOptions,
      currentSortInfo,
      changeView,
      setSortBy,
      setSortOrder,
      setFilter,
      setViewMode,
      calculateWaitTime,
      calculateProgress
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: white;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.hero-buttons .btn {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 50px;
  margin: 5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card-home {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card-home:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h4 {
  margin-bottom: 15px;
  color: #333;
}

.sort-options-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.sort-options-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.sort-options-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  font-weight: bold;
  border: none;
}

.sort-options-card .card-body {
  padding: 20px;
}

.sort-btn, .order-btn, .view-btn {
  transition: all 0.3s ease;
  font-size: 13px;
  padding: 8px 12px;
}

.sort-btn.active, .order-btn.active, .view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.quick-filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
}

.quick-filter-badge:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.quick-filter-badge.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.queue-container {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.queue-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.queue-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.queue-table th {
  padding: 15px;
  font-weight: 600;
  border: none;
}

.queue-table td {
  padding: 12px 15px;
  vertical-align: middle;
}

.queue-badge {
  font-size: 16px;
  padding: 8px 15px;
  border-radius: 25px;
  font-weight: bold;
  background: var(--primary-color);
  color: white;
}

.position-badge {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.patient-card {
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.patient-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.compact-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.compact-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
}

.wait-minutes {
  font-weight: bold;
  color: #667eea;
}

.progress {
  height: 5px;
  border-radius: 10px;
}

.progress-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-buttons .btn {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
