import { defineStore } from 'pinia'

export const useClinicStore = defineStore('clinic', {
  state: () => ({
    // Reactive Variables for patient data
    patients: [],
    currentQueueNumber: 1,
    queueStatus: 'open',
    waitingTime: 0,

    // Current patient and registration status
    currentPatient: null,
    patientCount: 0,
    isRegistered: false,

    // Navigation and UI state
    currentView: 'home',
    isLoading: false,
    errorMessage: null,
    successMessage: null,

    // Daily statistics
    dailyStats: {
      totalServed: 0,
      averageWaitTime: 0,
      peakHour: '10:00 AM - 12:00 PM'
    },

    // Doctors array for clinic management
    doctors: [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', status: 'available', queueNumber: null },
      { id: 2, name: 'Dr. James Wilson', specialty: 'Pediatrics', status: 'busy', queueNumber: 5 },
      { id: 3, name: 'Dr. Lisa Mbabazi', specialty: 'Dermatology', status: 'available', queueNumber: null }
    ],

    // Symptom options for checkbox selection
    symptomOptions: [
      { id: 1, name: 'Fever', severity: 'medium', icon: '🌡️' },
      { id: 2, name: 'Cough', severity: 'low', icon: '🤧' },
      { id: 3, name: 'Headache', severity: 'low', icon: '🤕' },
      { id: 4, name: 'Fatigue', severity: 'medium', icon: '😴' },
      { id: 5, name: 'Shortness of Breath', severity: 'high', icon: '😮' },
      { id: 6, name: 'Muscle Pain', severity: 'low', icon: '💪' }
    ],

    // Navigation items for dynamic menu generation
    navItems: [
      { name: 'Check-in', route: 'checkin', icon: 'fa-edit', link: '#checkin', active: false },
      { name: 'Queue', route: 'queue', icon: 'fa-users', link: '#queue', active: false },
      { name: 'Profile', route: 'profile', icon: 'fa-user-circle', link: '#profile', active: false },
      { name: 'Game', route: 'game', icon: 'fa-gamepad', link: '#game', active: false }
    ],

    // Game state for health guide
    gameState: {
      npcs: [
        { id: 1, name: 'Dr. Sarah', x: 100, y: 200, direction: 'right', speed: 2 },
        { id: 2, name: 'Nurse John', x: 300, y: 150, direction: 'left', speed: 1 },
        { id: 3, name: 'Receptionist', x: 500, y: 200, direction: 'right', speed: 1.5 }
      ],
      gameStats: {
        score: 0,
        level: 1,
        interactions: 0
      }
    },

    // Sort and filter options
    sortOptions: {
      sortBy: 'queue',
      sortOrder: 'asc',
      filterBy: 'all',
      itemsPerPage: 10,
      viewMode: 'table'
    }
  }),

  getters: {
    // Get current queue
    currentQueue: (state) => state.patients,
    waitingCount: (state) => state.patients.length,
    nextPatient: (state) => state.patients[0] || null,
    lastPatient: (state) => state.patients[state.patients.length - 1] || null,

    // Calculate average wait time
    averageWaitTime: (state) => {
      if (state.patients.length === 0) return 0;
      return state.patients.length * 15;
    },

    // Estimated time for specific position
    estimatedTimeForPosition: (state) => (position) => {
      return position * 15;
    },

    // Today's statistics
    todayStats: (state) => ({
      served: state.dailyStats.totalServed,
      waiting: state.patients.length,
      averageWait: state.dailyStats.averageWaitTime
    }),

    // Available and busy doctors
    availableDoctors: (state) => state.doctors.filter(d => d.status === 'available'),
    busyDoctors: (state) => state.doctors.filter(d => d.status === 'busy'),

    // Sorted and filtered patients
    sortedPatients: (state) => {
      let sorted = [...state.patients];

      // Apply sorting
      switch (state.sortOptions.sortBy) {
        case 'queue':
          sorted.sort((a, b) => state.sortOptions.sortOrder === 'asc'
            ? a.queueNumber - b.queueNumber
            : b.queueNumber - a.queueNumber);
          break;
        case 'name':
          sorted.sort((a, b) => state.sortOptions.sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name));
          break;
        case 'time':
          sorted.sort((a, b) => state.sortOptions.sortOrder === 'asc'
            ? a.queueNumber - b.queueNumber
            : b.queueNumber - a.queueNumber);
          break;
      }

      // Apply filtering
      if (state.sortOptions.filterBy !== 'all') {
        switch (state.sortOptions.filterBy) {
          case 'high-severity':
            sorted = sorted.filter(p =>
              p.symptoms.some(s =>
                state.symptomOptions.find(opt => opt.name === s)?.severity === 'high'
              )
            );
            break;
          case 'waiting-long':
            sorted = sorted.filter(p => {
              const waitTime = (Date.now() - new Date(p.registrationDate).getTime()) / 60000;
              return waitTime > 30;
            });
            break;
        }
      }

      return sorted;
    }
  },

  actions: {
    // Add new patient to queue
    addPatient(patientData) {
      this.isLoading = true;

      try {
        const newPatient = {
          id: Date.now(),
          queueNumber: this.currentQueueNumber,
          name: patientData.name,
          nationalID: patientData.nationalID,
          symptoms: patientData.symptoms,
          notes: patientData.notes || '',
          registrationTime: new Date().toLocaleTimeString(),
          registrationDate: new Date().toISOString(),
          status: 'waiting',
          estimatedWaitTime: this.currentQueueNumber * 15
        };

        this.patients.push(newPatient);
        this.currentQueueNumber++;
        this.patientCount = this.patients.length;
        this.isRegistered = true;

        this.saveQueueData();
        this.setSuccessMessage(`✅ ${patientData.name} registered! Queue #${newPatient.queueNumber}`);
        return newPatient;
      } catch (error) {
        this.setErrorMessage('Failed to add patient: ' + error.message);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Serve next patient in queue
    serveNextPatient() {
      if (this.patients.length === 0) {
        this.setWarningMessage('No patients in queue!');
        return null;
      }

      if (this.queueStatus === 'break') {
        this.setWarningMessage('Queue is on break! Cannot serve patients.');
        return null;
      }

      const served = this.patients.shift();
      served.status = 'served';
      served.servedTime = new Date().toLocaleTimeString();

      this.dailyStats.totalServed++;

      const availableDoctor = this.doctors.find(d => d.status === 'available');
      if (availableDoctor) {
        availableDoctor.status = 'busy';
        availableDoctor.queueNumber = served.queueNumber;
        setTimeout(() => {
          availableDoctor.status = 'available';
          availableDoctor.queueNumber = null;
        }, 30000);
      }

      this.saveQueueData();
      this.setSuccessMessage(`🩺 Now serving: ${served.name} (Queue #${served.queueNumber})`);
      this.updateAnnouncements(served);

      return served;
    },

    // Search patients
    searchPatients(query) {
      if (!query) return this.patients;
      const lowerQuery = query.toLowerCase();
      return this.patients.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.queueNumber.toString().includes(lowerQuery) ||
        p.nationalID.includes(lowerQuery)
      );
    },

    // Filter by symptoms
    filterBySymptoms(symptoms) {
      if (symptoms.length === 0) return this.patients;
      return this.patients.filter(p =>
        symptoms.some(s => p.symptoms.includes(s))
      );
    },

    // Sort patients
    sortPatients(sortBy) {
      this.sortOptions.sortBy = sortBy;
    },

    // Set sort order
    setSortOrder(order) {
      this.sortOptions.sortOrder = order;
    },

    // Set filter
    setFilter(filter) {
      this.sortOptions.filterBy = filter;
    },

    // Set view mode
    setViewMode(mode) {
      this.sortOptions.viewMode = mode;
    },

    // Open queue
    openQueue() {
      this.queueStatus = 'open';
      this.setSuccessMessage('Queue is now OPEN');
      this.addNotification('Queue Opened', 'The queue system is now open for registrations', 'success');
    },

    // Pause queue
    pauseQueue() {
      this.queueStatus = 'break';
      this.setWarningMessage('Queue is now PAUSED');
      this.addNotification('Queue Paused', 'The queue system is temporarily paused', 'warning');
    },

    // Reset queue
    resetQueue() {
      if (confirm('⚠️ Are you sure you want to reset the entire queue? This action cannot be undone!')) {
        this.patients = [];
        this.currentQueueNumber = 1;
        this.patientCount = 0;
        this.isRegistered = false;
        this.saveQueueData();
        this.setSuccessMessage('Queue has been reset');
      }
    },

    // Remove patient from queue
    removePatient(patientId) {
      const index = this.patients.findIndex(p => p.id === patientId);
      if (index !== -1) {
        const removed = this.patients.splice(index, 1)[0];
        this.saveQueueData();
        this.setSuccessMessage(`Removed ${removed.name} from queue`);
        return removed;
      }
      return null;
    },

    // Update announcements
    updateAnnouncements(served) {
      const nowServingElem = document.getElementById('nowServing');
      const nextUpElem = document.getElementById('nextUp');

      if (nowServingElem) {
        nowServingElem.innerHTML = `Queue #${served.queueNumber} - ${served.name}`;
      }

      if (nextUpElem && this.patients.length > 0) {
        const nextPatients = this.patients.slice(0, 2).map(p => `#${p.queueNumber}`).join(', ');
        nextUpElem.innerHTML = nextPatients;
      }
    },

    // Add notification
    addNotification(title, message, type = 'info') {
      const notification = {
        id: Date.now(),
        title,
        message,
        type,
        timestamp: new Date(),
        read: false
      };

      if (!this.notifications) this.notifications = [];
      this.notifications.unshift(notification);
      this.showToast(message, type);
    },

    // Show toast notification
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `alert alert-${type} notification-toast position-fixed top-0 end-0 m-3`;
      toast.style.zIndex = '9999';
      toast.style.animation = 'slideIn 0.3s ease';
      toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i> ${message}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    },

    // Save queue data to localStorage
    saveQueueData() {
      const dataToSave = {
        patients: this.patients,
        currentQueueNumber: this.currentQueueNumber,
        patientCount: this.patientCount,
        dailyStats: this.dailyStats,
        doctors: this.doctors
      };
      localStorage.setItem('clinicQueueData', JSON.stringify(dataToSave));
    },

    // Load queue data from localStorage
    loadQueueData() {
      const savedData = localStorage.getItem('clinicQueueData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.patients = data.patients || [];
        this.currentQueueNumber = data.currentQueueNumber || 1;
        this.patientCount = data.patientCount || 0;
        this.dailyStats = data.dailyStats || { totalServed: 0, averageWaitTime: 0 };
        this.doctors = data.doctors || this.doctors;
      }
    },

    // Set success message
    setSuccessMessage(message) {
      this.successMessage = message;
      this.showToast(message, 'success');
      setTimeout(() => { this.successMessage = null; }, 3000);
    },

    // Set error message
    setErrorMessage(message) {
      this.errorMessage = message;
      this.showToast(message, 'danger');
      setTimeout(() => { this.errorMessage = null; }, 3000);
    },

    // Set warning message
    setWarningMessage(message) {
      this.showToast(message, 'warning');
    },

    // Set current view
    setView(view) {
      this.currentView = view;
      // Update navigation active state
      this.navItems.forEach(item => {
        item.active = item.route === view;
      });
    },

    // Reset registration
    resetRegistration() {
      this.isRegistered = false;
      this.currentPatient = null;
    },

    // Initialize clinic
    initializeClinic() {
      this.loadQueueData();
      this.queueStatus = 'open';

      const hash = window.location.hash.slice(1);
      if (hash && ['home', 'checkin', 'queue', 'profile', 'game'].includes(hash)) {
        this.setView(hash);
      }

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1);
        if (newHash && ['home', 'checkin', 'queue', 'profile', 'game'].includes(newHash)) {
          this.setView(newHash);
        }
      });
    },

    // Game functions
    interactWithNPC(npcId) {
      const npc = this.gameState.npcs.find(n => n.id === npcId);
      if (!npc) return { success: false, message: 'NPC not found' };

      const interactions = [
        { success: true, message: `Great! You helped ${npc.name}! +10 points` },
        { success: true, message: `Excellent work with ${npc.name}! +15 points` },
        { success: false, message: `${npc.name} needs more assistance. Try again!` },
        { success: true, message: `Perfect diagnosis with ${npc.name}! +20 points` }
      ];

      const result = interactions[Math.floor(Math.random() * interactions.length)];

      if (result.success) {
        this.gameState.gameStats.score += 10;
      }

      return result;
    },

    // Move NPC
    moveNPC(npcId, deltaX, deltaY) {
      const npc = this.gameState.npcs.find(n => n.id === npcId);
      if (npc) {
        npc.x = Math.max(0, Math.min(600, npc.x + deltaX));
        npc.y = Math.max(0, Math.min(300, npc.y + deltaY));
      }
    },

    // Move all NPCs
    moveAllNPCs() {
      this.gameState.npcs.forEach(npc => {
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 100 - 50;
        this.moveNPC(npc.id, randomX, randomY);
      });
    }
  }
})
