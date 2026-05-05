<template>
  <div class="queue-view">
    <div class="container">
      <!-- Queue Hero Section -->
      <div class="queue-hero">
        <div class="text-center">
          <h1><i class="fas fa-users"></i> Patient Queue Management</h1>
          <p>Real-time queue tracking and management system</p>
        </div>
      </div>

      <!-- Sort Options Card -->
      <div class="sort-options-card">
        <div class="card-header bg-gradient">
          <i class="fas fa-sort-amount-down-alt"></i> Sort & Organize Queue
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

          <div class="row mt-3">
            <div class="col-md-12">
              <div class="search-section">
                <h6><i class="fas fa-search"></i> Search Patients</h6>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="searchQuery"
                    placeholder="Search by name, queue number, or ID..."
                  >
                  <button class="btn btn-outline-primary" @click="clearSearch">
                    <i class="fas fa-times"></i> Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="sort-info mt-3 p-2 bg-light rounded">
            <small class="text-muted">
              <i class="fas fa-info-circle"></i>
              Currently sorting by: <strong>{{ currentSortInfo }}</strong> | 
              Showing: <strong>{{ filteredPatients.length }} patients</strong>
            </small>
          </div>
        </div>
      </div>

      <!-- Queue Display with Table (v-for table rendering) -->
      <div class="card">
        <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <h4 class="mb-0"><i class="fas fa-users"></i> Current Patient Queue</h4>
          <div>
            <span class="badge bg-light text-dark me-2">Total: {{ filteredPatients.length }}</span>
            <span class="badge bg-warning text-dark">Queue #: {{ clinicStore.currentQueueNumber }}</span>
          </div>
        </div>
        <div class="card-body">
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
                  <th><i class="fas fa-cogs"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- v-for to loop through patient array for Bootstrap table -->
                <tr 
                  v-for="(patient, index) in paginatedPatients" 
                  :key="patient.id"
                  :class="{ 'table-warning': hasHighSeveritySymptoms(patient) }"
                >
                  <td>
                    <div class="position-badge">{{ getPatientIndex(patient) + 1 }}</div>
                  </td>
                  <td><span class="queue-badge">#{{ patient.queueNumber }}</span></td>
                  <td>
                    <div class="patient-info">
                      <i class="fas fa-user-circle"></i> {{ patient.name }}
                    </div>
                  </td>
                  <td>
                    <!-- Loop through symptoms array -->
                    <span 
                      v-for="symptom in patient.symptoms" 
                      :key="symptom" 
                      class="badge bg-secondary me-1"
                    >
                      {{ symptom }}
                    </span>
                    <span v-if="patient.symptoms.length === 0" class="text-muted">
                      No symptoms reported
                    </span>
                  </td>
                  <td><i class="far fa-clock"></i> {{ patient.registrationTime }}</td>
                  <td>
                    <span class="wait-minutes">{{ calculateWaitTime(getPatientIndex(patient)) }} min</span>
                    <div class="progress">
                      <div 
                        class="progress-bar" 
                        :style="{ width: calculateProgress(getPatientIndex(patient)) + '%' }"
                      ></div>
                    </div>
                  </td>
                  <td>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="removePatient(patient.id)"
                      title="Remove from queue"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPatients.length === 0">
                  <td colspan="7" class="text-center">No patients in queue</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Card View -->
          <div v-else-if="sortOptions.viewMode === 'cards'" class="row">
            <div 
              v-for="(patient, index) in paginatedPatients" 
              :key="patient.id" 
              class="col-md-6 mb-3"
            >
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
                    <div class="position-badge">{{ getPatientIndex(patient) + 1 }}</div>
                  </div>
                  <div class="mt-2">
                    <span 
                      v-for="symptom in patient.symptoms" 
                      :key="symptom" 
                      class="badge bg-secondary me-1"
                    >
                      {{ symptom }}
                    </span>
                  </div>
                  <div class="progress mt-2">
                    <div 
                      class="progress-bar" 
                      :style="{ width: calculateProgress(getPatientIndex(patient)) + '%' }"
                    ></div>
                  </div>
                  <div class="mt-2 d-flex justify-content-between align-items-center">
                    <small class="text-muted">{{ calculateWaitTime(getPatientIndex(patient)) }} min wait</small>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="removePatient(patient.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Compact View -->
          <div v-else class="compact-view">
            <div 
              v-for="(patient, index) in paginatedPatients" 
              :key="patient.id" 
              class="compact-item"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="position-badge me-3">{{ getPatientIndex(patient) + 1 }}</div>
                  <div>
                    <strong>#{{ patient.queueNumber }}</strong> {{ patient.name }}
                    <small class="text-muted d-block">
                      <i class="far fa-clock"></i> {{ patient.registrationTime }}
                    </small>
                  </div>
                </div>
                <div class="text-end">
                  <span class="wait-minutes">{{ calculateWaitTime(getPatientIndex(patient)) }} min</span>
                  <button 
                    class="btn btn-sm btn-outline-danger ms-2" 
                    @click="removePatient(patient.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <div>
              <span class="text-muted">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
                {{ Math.min(currentPage * itemsPerPage, filteredPatients.length) }} 
                of {{ filteredPatients.length }} patients
              </span>
            </div>
            <div class="btn-group">
              <button 
                class="btn btn-outline-primary" 
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <i class="fas fa-chevron-left"></i> Previous
              </button>
              <button 
                class="btn btn-outline-primary" 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Queue Management Actions -->
          <div class="queue-actions mt-4">
            <div class="row">
              <div class="col-md-3">
                <button class="btn btn-success w-100" @click="serveNextPatient">
                  <i class="fas fa-user-md"></i> Serve Next Patient
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-warning w-100" @click="pauseQueue">
                  <i class="fas fa-pause"></i> Pause Queue
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-info w-100" @click="openQueue">
                  <i class="fas fa-play"></i> Open Queue
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-danger w-100" @click="resetQueue">
                  <i class="fas fa-trash-alt"></i> Reset Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useClinicStore } from '../stores/clinicStore'

export default {
  name: 'QueueView',
  setup() {
    const clinicStore = useClinicStore()
    
    // Reactive variables
    const searchQuery = ref('')
    const currentPage = ref(1)
    
    // Computed properties
    const sortedPatients = computed(() => clinicStore.sortedPatients)
    const sortOptions = computed(() => clinicStore.sortOptions)
    const itemsPerPage = computed(() => parseInt(sortOptions.value.itemsPerPage))
    
    // Filter patients based on search query
    const filteredPatients = computed(() => {
      if (!searchQuery.value) return sortedPatients.value
      
      const query = searchQuery.value.toLowerCase()
      return sortedPatients.value.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.queueNumber.toString().includes(query) ||
        patient.nationalID.includes(query)
      )
    })
    
    // Paginated patients
    const paginatedPatients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredPatients.value.slice(start, end)
    })
    
    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredPatients.value.length / itemsPerPage.value)
    })
    
    const currentSortInfo = computed(() => {
      const sortBy = sortOptions.value.sortBy.charAt(0).toUpperCase() + sortOptions.value.sortBy.slice(1)
      const order = sortOptions.value.sortOrder === 'asc' ? 'Ascending' : 'Descending'
      return `${sortBy} (${order})`
    })
    
    // Methods
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
    
    const clearSearch = () => {
      searchQuery.value = ''
      currentPage.value = 1
    }
    
    const getPatientIndex = (patient) => {
      return sortedPatients.value.findIndex(p => p.id === patient.id)
    }
    
    const calculateWaitTime = (index) => {
      return (index + 1) * 15
    }
    
    const calculateProgress = (index) => {
      return Math.min(100, (index + 1) * 20)
    }
    
    const hasHighSeveritySymptoms = (patient) => {
      return patient.symptoms.some(symptom => {
        const symptomOption = clinicStore.symptomOptions.find(opt => opt.name === symptom)
        return symptomOption?.severity === 'high'
      })
    }
    
    const removePatient = (patientId) => {
      if (confirm('Are you sure you want to remove this patient from the queue?')) {
        clinicStore.removePatient(patientId)
      }
    }
    
    const serveNextPatient = () => {
      clinicStore.serveNextPatient()
    }
    
    const pauseQueue = () => {
      clinicStore.pauseQueue()
    }
    
    const openQueue = () => {
      clinicStore.openQueue()
    }
    
    const resetQueue = () => {
      clinicStore.resetQueue()
    }
    
    // Watch for changes to reset page
    const resetPageOnFilterChange = () => {
      currentPage.value = 1
    }
    
    // Lifecycle method
    onMounted(() => {
      // Load clinic data
      clinicStore.loadQueueData()
    })
    
    return {
      // Reactive variables
      searchQuery,
      currentPage,
      
      // Computed properties
      filteredPatients,
      paginatedPatients,
      totalPages,
      sortOptions,
      itemsPerPage,
      currentSortInfo,
      
      // Methods
      setSortBy,
      setSortOrder,
      setFilter,
      setViewMode,
      clearSearch,
      getPatientIndex,
      calculateWaitTime,
      calculateProgress,
      hasHighSeveritySymptoms,
      removePatient,
      serveNextPatient,
      pauseQueue,
      openQueue,
      resetQueue,
      clinicStore
    }
  }
}
</script>

<style scoped>
.queue-view {
  max-width: 1400px;
  margin: 0 auto;
}

.queue-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  color: white;
  text-align: center;
  margin-bottom: 30px;
  border-radius: 15px;
}

.queue-hero h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.queue-hero p {
  font-size: 18px;
  opacity: 0.9;
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

.sort-section h6,
.order-section h6,
.display-section h6,
.quick-filters h6,
.view-toggle h6,
.search-section h6 {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sort-btn,
.order-btn,
.view-btn {
  transition: all 0.3s ease;
  font-size: 13px;
  padding: 8px 12px;
}

.sort-btn.active,
.order-btn.active,
.view-btn.active {
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

.queue-table tbody tr {
  transition: all 0.3s ease;
  animation: slideInLeft 0.3s ease;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.queue-table tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
  transform: scale(1.01);
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

.queue-actions .btn {
  margin-bottom: 10px;
}

.form-select {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 13px;
  padding: 8px 12px;
}

.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.sort-info {
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

@media (max-width: 768px) {
  .queue-hero h1 {
    font-size: 24px;
  }
  
  .queue-actions .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
