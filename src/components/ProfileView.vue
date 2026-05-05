<template>
  <div class="profile-view">
    <div class="container">
      <!-- Profile Hero -->
      <div class="profile-hero">
        <div class="text-center">
          <h1><i class="fas fa-user-circle"></i> My Profile</h1>
          <p>Manage your personal information and preferences</p>
        </div>
      </div>

      <div class="row">
        <!-- Profile Card -->
        <div class="col-md-4">
          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar" @click="toggleEditMode">
                <i class="fas fa-user"></i>
              </div>
              <div class="profile-name">{{ patientName || 'Guest User' }}</div>
              <div class="profile-id">ID: {{ patientId || 'Not registered' }}</div>
            </div>
            <div class="info-section">
              <div class="info-group">
                <div class="info-label">Registration Status</div>
                <div class="info-value">
                  <span class="badge" :class="isRegistered ? 'bg-success' : 'bg-secondary'">
                    {{ isRegistered ? '✅ Registered' : '❌ Not registered' }}
                  </span>
                </div>
              </div>
              <div class="info-group">
                <div class="info-label">Queue Position</div>
                <div class="info-value">{{ queuePosition || 'N/A' }}</div>
              </div>
              <div class="info-group">
                <div class="info-label">Total Visits</div>
                <div class="info-value">{{ totalVisits }}</div>
              </div>
              <div class="info-group">
                <div class="info-label">Member Since</div>
                <div class="info-value">{{ memberSince }}</div>
              </div>
            </div>
            <div class="text-center p-3">
              <button class="btn btn-primary w-100" @click="toggleEditMode">
                <i class="fas fa-edit"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-md-8">
          <!-- Edit Profile Form -->
          <div v-if="editMode" class="form-card">
            <h4><i class="fas fa-user-edit"></i> Edit Profile Information</h4>
            <form @submit.prevent="saveProfile">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Full Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="editForm.name"
                      placeholder="Enter your full name"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="editForm.email"
                      placeholder="your@email.com"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="editForm.phone"
                      placeholder="+250 788 123 456"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Date of Birth</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="editForm.dateOfBirth"
                    >
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea 
                  class="form-control" 
                  v-model="editForm.address"
                  rows="3" 
                  placeholder="Enter your address"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Medical Notes</label>
                <textarea 
                  class="form-control" 
                  v-model="editForm.medicalNotes"
                  rows="3" 
                  placeholder="Any medical conditions or allergies..."
                ></textarea>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn-save">
                  <i class="fas fa-save"></i> Save Changes
                </button>
                <button type="button" class="btn-cancel" @click="cancelEdit">
                  <i class="fas fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Health Statistics -->
          <div class="row">
            <div class="col-md-6">
              <div class="vital-card">
                <h6><i class="fas fa-heartbeat"></i> Health Vitals</h6>
                <div class="vital-value">120/80</div>
                <small class="text-muted">Blood Pressure</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="vital-card">
                <h6><i class="fas fa-weight"></i> Weight</h6>
                <div class="vital-value">68 kg</div>
                <small class="text-muted">Last checkup</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="vital-card">
                <h6><i class="fas fa-ruler-vertical"></i> Height</h6>
                <div class="vital-value">175 cm</div>
                <small class="text-muted">Last checkup</small>
              </div>
            </div>
            <div class="col-md-6">
              <div class="vital-card">
                <h6><i class="fas fa-thermometer-half"></i> Temperature</h6>
                <div class="vital-value">36.5°C</div>
                <small class="text-muted">Normal</small>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card mt-4">
            <div class="card-header bg-info text-white">
              <h5><i class="fas fa-history"></i> Recent Activity</h5>
            </div>
            <div class="card-body">
              <div class="timeline">
                <div v-for="activity in recentActivities" :key="activity.id" class="timeline-item">
                  <div class="timeline-icon">
                    <i :class="activity.icon"></i>
                  </div>
                  <div class="timeline-content">
                    <h6>{{ activity.title }}</h6>
                    <p>{{ activity.description }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-4">
            <div class="card-header bg-warning">
              <h5><i class="fas fa-bolt"></i> Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <button class="btn btn-outline-primary w-100 mb-2" @click="changeView('checkin')">
                    <i class="fas fa-edit"></i> New Check-in
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn-outline-info w-100 mb-2" @click="changeView('queue')">
                    <i class="fas fa-users"></i> View Queue
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn-outline-success w-100 mb-2" @click="downloadHistory">
                    <i class="fas fa-download"></i> Download History
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn-outline-secondary w-100 mb-2" @click="printProfile">
                    <i class="fas fa-print"></i> Print Profile
                  </button>
                </div>
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
  name: 'ProfileView',
  setup() {
    const clinicStore = useClinicStore()
    
    // Reactive variables
    const editMode = ref(false)
    const patientName = ref('John Doe')
    const patientId = ref('P123456')
    const totalVisits = ref(12)
    const memberSince = ref('January 2023')
    
    const editForm = ref({
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+250 788 123 456',
      dateOfBirth: '1990-01-15',
      address: 'Kigali, Rwanda',
      medicalNotes: 'No known allergies'
    })
    
    // Recent activities data
    const recentActivities = ref([
      {
        id: 1,
        title: 'Check-in Completed',
        description: 'Registered for general consultation',
        time: '2 hours ago',
        icon: 'fas fa-check-circle text-success'
      },
      {
        id: 2,
        title: 'Lab Results',
        description: 'Blood test results available',
        time: '1 day ago',
        icon: 'fas fa-vial text-info'
      },
      {
        id: 3,
        title: 'Appointment',
        description: 'Scheduled follow-up visit',
        time: '3 days ago',
        icon: 'fas fa-calendar text-warning'
      }
    ])
    
    // Computed properties
    const isRegistered = computed(() => clinicStore.isRegistered)
    const queuePosition = computed(() => {
      if (!clinicStore.isRegistered) return null
      return clinicStore.waitingCount > 0 ? clinicStore.waitingCount : 'Next in line'
    })
    
    // Methods
    const toggleEditMode = () => {
      editMode.value = !editMode.value
    }
    
    const saveProfile = () => {
      // Save profile data to localStorage
      localStorage.setItem('userProfile', JSON.stringify(editForm.value))
      patientName.value = editForm.value.name
      
      // Show success message
      const notification = document.createElement('div')
      notification.className = 'alert alert-success position-fixed top-0 end-0 m-3'
      notification.style.zIndex = '9999'
      notification.innerHTML = '✅ Profile updated successfully!'
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
      
      editMode.value = false
    }
    
    const cancelEdit = () => {
      editMode.value = false
      // Reset form to original values
      editForm.value = {
        name: patientName.value,
        email: 'john.doe@email.com',
        phone: '+250 788 123 456',
        dateOfBirth: '1990-01-15',
        address: 'Kigali, Rwanda',
        medicalNotes: 'No known allergies'
      }
    }
    
    const changeView = (view) => {
      clinicStore.setView(view)
    }
    
    const downloadHistory = () => {
      // Create a simple text file with patient history
      const history = `Patient History for ${patientName.value}\n` +
                   `ID: ${patientId.value}\n` +
                   `Total Visits: ${totalVisits.value}\n` +
                   `Member Since: ${memberSince.value}\n` +
                   `Last Updated: ${new Date().toLocaleString()}`
      
      const blob = new Blob([history], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `patient-history-${patientId.value}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
    }
    
    const printProfile = () => {
      window.print()
    }
    
    // Lifecycle method
    onMounted(() => {
      // Load profile data from localStorage if available
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        editForm.value = { ...editForm.value, ...profile }
        patientName.value = profile.name || 'Guest User'
      }
    })
    
    return {
      // Reactive variables
      editMode,
      patientName,
      patientId,
      totalVisits,
      memberSince,
      editForm,
      recentActivities,
      
      // Computed properties
      isRegistered,
      queuePosition,
      
      // Methods
      toggleEditMode,
      saveProfile,
      cancelEdit,
      changeView,
      downloadHistory,
      printProfile
    }
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  color: white;
  text-align: center;
  margin-bottom: 30px;
  border-radius: 15px;
}

.profile-hero h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.profile-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  text-align: center;
  color: white;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.3);
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.profile-id {
  font-size: 14px;
  opacity: 0.9;
}

.info-section {
  padding: 20px;
}

.info-group {
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.info-group:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.form-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
}

.form-card h4 {
  color: #667eea;
  margin-bottom: 20px;
}

.btn-save {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-cancel {
  background: #6c757d;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.vital-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.vital-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.vital-card h6 {
  color: #667eea;
  margin-bottom: 10px;
}

.vital-value {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-icon {
  position: absolute;
  left: -30px;
  top: 0;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
}

.timeline-content h6 {
  margin-bottom: 5px;
  color: #333;
}

.timeline-content p {
  margin-bottom: 5px;
  color: #666;
}

@media (max-width: 768px) {
  .profile-hero h1 {
    font-size: 24px;
  }
  
  .profile-name {
    font-size: 20px;
  }
  
  .vital-card {
    margin-bottom: 15px;
  }
}

@media print {
  .btn, .timeline-icon {
    display: none;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
