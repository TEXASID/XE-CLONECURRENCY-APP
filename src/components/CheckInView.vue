<template>
  <div class="checkin-view">
    <div class="container">
      <!-- Share Links Card -->
      <div class="card mb-3">
        <div class="card-body">
          <h5>🔗 Share Clinic System</h5>
          <div class="row">
            <div class="col-md-3">
              <button class="btn btn-outline-primary w-100 mb-2" @click="copyLink('checkin')">
                📝 Check-in Link
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-info w-100 mb-2" @click="copyLink('queue')">
                👥 Queue Link
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-success w-100 mb-2" @click="copyLink('profile')">
                👤 Profile Link
              </button>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-warning w-100 mb-2" @click="copyLink('game')">
                🎮 Game Link
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Registration Form -->
      <div class="card" v-if="showRegistrationForm">
        <div class="card-header bg-primary text-white">
          <h4>📋 Patient Registration</h4>
        </div>
        <div class="card-body">
          <!-- Error/Success Messages -->
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>
          
          <!-- Form with v-model data binding -->
          <form @submit.prevent="submitCheckIn">
            <!-- Name Input -->
            <div class="mb-3">
              <label class="form-label">Full Name *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="patientName" 
                placeholder="Enter patient name"
                :class="{ 'is-invalid': errors.name }"
              >
              <div class="invalid-feedback" v-if="errors.name">
                {{ errors.name }}
              </div>
            </div>
            
            <!-- National ID Input with validation -->
            <div class="mb-3">
              <label class="form-label">National ID (16 digits) *</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="nationalID" 
                placeholder="1234567890123456" 
                maxlength="16"
                @input="validateNationalID"
                :class="{ 'is-invalid': errors.nationalID }"
              >
              <div class="invalid-feedback" v-if="errors.nationalID">
                {{ errors.nationalID }}
              </div>
            </div>
            
            <!-- Symptom Collection with Array and checkboxes -->
            <div class="mb-3">
              <label class="form-label">Symptoms *</label>
              <div class="row">
                <div 
                  v-for="symptom in symptomOptions" 
                  :key="symptom.id" 
                  class="col-md-6 mb-2"
                >
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :value="symptom.name" 
                      v-model="selectedSymptoms"
                      :id="'symptom-' + symptom.id"
                    >
                    <label class="form-check-label" :for="'symptom-' + symptom.id">
                      {{ symptom.icon }} {{ symptom.name }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="invalid-feedback d-block" v-if="errors.symptoms">
                {{ errors.symptoms }}
              </div>
            </div>
            
            <!-- Additional Notes -->
            <div class="mb-3">
              <label class="form-label">Additional Notes</label>
              <textarea 
                class="form-control" 
                v-model="additionalNotes" 
                rows="3" 
                placeholder="Any additional symptoms or notes..."
              ></textarea>
            </div>
            
            <!-- Event Handling Functions on buttons -->
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              ✅ Submit Check-in
            </button>
            <button 
              type="button" 
              class="btn btn-secondary ms-2" 
              @click="cancelRegistration"
            >
              ❌ Cancel
            </button>
          </form>
        </div>
      </div>
      
      <!-- Queue Status View (v-show alternative) -->
      <div class="card" v-show="showQueueStatus">
        <div class="card-header bg-success text-white">
          <h4>✅ Registration Complete!</h4>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <h5>Your queue number is: <strong>{{ clinicStore.currentQueueNumber - 1 }}</strong></h5>
            <p>Waiting patients ahead: {{ waitingCount - 1 }}</p>
            <p>Estimated wait time: {{ averageWaitTime }} minutes</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary" @click="clinicStore.resetRegistration">
              📝 Register Another Patient
            </button>
            <button class="btn btn-info" @click="changeView('queue')">
              👥 View Queue
            </button>
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
  name: 'CheckInView',
  setup() {
    const clinicStore = useClinicStore()
    
    // Reactive Variables for form data
    const patientName = ref('')
    const nationalID = ref('')
    const selectedSymptoms = ref([]) // Array for symptom collection
    const additionalNotes = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const errors = ref({})
    
    // Computed properties
    const showRegistrationForm = computed(() => !clinicStore.isRegistered)
    const showQueueStatus = computed(() => clinicStore.isRegistered)
    const waitingCount = computed(() => clinicStore.waitingCount)
    const averageWaitTime = computed(() => clinicStore.averageWaitTime)
    const isLoading = computed(() => clinicStore.isLoading)
    const symptomOptions = computed(() => clinicStore.symptomOptions)
    
    // Form validation
    const isFormValid = computed(() => {
      return patientName.value.trim() !== '' && 
             nationalID.value.length === 16 && 
             /^\d{16}$/.test(nationalID.value) &&
             selectedSymptoms.value.length > 0 &&
             Object.keys(errors.value).length === 0
    })
    
    // Form Validation - Conditional check for National ID
    const validateForm = () => {
      errors.value = {}
      
      // Conditional statements for validation
      if (!patientName.value || patientName.value.trim() === '') {
        errors.value.name = '❌ Patient name is required!'
        return false
      }
      
      // Check format: should be 16 digits
      const idRegex = /^\d{16}$/
      if (!idRegex.test(nationalID.value)) {
        errors.value.nationalID = '❌ National ID must be 16 digits!'
        return false
      }
      
      if (selectedSymptoms.value.length === 0) {
        errors.value.symptoms = '❌ Please select at least one symptom!'
        return false
      }
      
      return true
    }
    
    // Validate National ID on input
    const validateNationalID = () => {
      if (nationalID.value.length > 0 && !/^\d*$/.test(nationalID.value)) {
        errors.value.nationalID = 'National ID must contain only numbers'
      } else if (nationalID.value.length > 0 && nationalID.value.length < 16) {
        errors.value.nationalID = 'National ID must be exactly 16 digits'
      } else {
        delete errors.value.nationalID
      }
    }
    
    // Event Handling Functions
    const submitCheckIn = () => {
      // Conditional validation before submission
      if (!validateForm()) {
        return
      }
      
      // Prepare patient data
      const patientData = {
        name: patientName.value,
        nationalID: nationalID.value,
        symptoms: selectedSymptoms.value,
        notes: additionalNotes.value
      }
      
      // State Mutations - Push new patient into array
      const newPatient = clinicStore.addPatient(patientData)
      
      if (newPatient) {
        // Clear form
        resetForm()
        
        // Show success message
        successMessage.value = `✅ Check-in successful! Your queue number is: ${newPatient.queueNumber}`
        errorMessage.value = ''
      }
    }
    
    const cancelRegistration = () => {
      resetForm()
      clinicStore.resetRegistration()
      errorMessage.value = ''
      successMessage.value = ''
    }
    
    const resetForm = () => {
      patientName.value = ''
      nationalID.value = ''
      selectedSymptoms.value = []
      additionalNotes.value = ''
      errors.value = {}
    }
    
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
    
    const changeView = (view) => {
      clinicStore.setView(view)
    }
    
    // Lifecycle Methods - mounted() to initialize
    onMounted(() => {
      // Clear any existing error messages
      errorMessage.value = ''
      successMessage.value = ''
    })
    
    return {
      // Reactive variables
      patientName,
      nationalID,
      selectedSymptoms,
      additionalNotes,
      errorMessage,
      successMessage,
      errors,
      
      // Computed properties
      showRegistrationForm,
      showQueueStatus,
      waitingCount,
      averageWaitTime,
      isLoading,
      isFormValid,
      symptomOptions,
      
      // Methods
      submitCheckIn,
      cancelRegistration,
      validateNationalID,
      copyLink,
      changeView
    }
  }
}
</script>

<style scoped>
.checkin-view {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  border: none;
  padding: 20px;
  font-weight: bold;
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.form-check {
  margin-bottom: 10px;
}

.form-check-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.alert {
  border-radius: 10px;
  border: none;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 768px) {
  .card-body {
    padding: 15px;
  }
  
  .btn {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
