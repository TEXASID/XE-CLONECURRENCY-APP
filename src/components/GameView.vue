<template>
  <div class="game-view">
    <div class="container">
      <!-- Game Header -->
      <div class="game-header text-center mb-4">
        <h1><i class="fas fa-gamepad"></i> Clinic Adventure Game</h1>
        <p>Interact with medical staff and learn about healthcare!</p>
      </div>

      <div class="row">
        <!-- Game Canvas Area -->
        <div class="col-md-8">
          <div class="game-container">
            <!-- Game Stats -->
            <div class="game-stats mb-3">
              <span class="badge bg-primary">Score: {{ gameStats.score }}</span>
              <span class="badge bg-success">Level: {{ gameStats.level }}</span>
              <span class="badge bg-info">Interactions: {{ gameStats.interactions }}</span>
            </div>
            
            <!-- NPCs Canvas Area -->
            <div class="npc-canvas" ref="canvas">
              <div 
                v-for="npc in npcs" 
                :key="npc.id" 
                class="npc-avatar" 
                :style="{ left: npc.x + 'px', top: npc.y + 'px' }"
                @click="interact(npc.id)"
                :title="npc.name"
              >
                <div class="npc-icon">{{ getNPCIcon(npc.id) }}</div>
                <div class="npc-name">{{ npc.name }}</div>
              </div>
            </div>
            
            <!-- Player Character -->
            <div 
              class="player-character" 
              :style="{ left: player.x + 'px', top: player.y + 'px' }"
            >
              <div class="player-icon">👤</div>
              <div class="player-name">You</div>
            </div>
            
            <!-- Game Controls -->
            <div class="game-controls mt-3">
              <button class="btn btn-outline-primary me-2" @click="moveAllNPCs">
                🔄 Move All NPCs
              </button>
              <button class="btn btn-outline-secondary me-2" @click="resetGame">
                🔄 Reset Game
              </button>
              <button 
                class="btn btn-outline-success me-2" 
                @click="startAutoMove"
                :disabled="autoMoveActive"
              >
                🤖 Auto Move: {{ autoMoveActive ? 'ON' : 'OFF' }}
              </button>
              <button 
                class="btn btn-outline-warning" 
                @click="toggleGameMode"
              >
                🎯 Mode: {{ gameMode }}
              </button>
            </div>
            
            <!-- Alert message -->
            <div v-if="gameMessage" class="alert mt-3" :class="gameMessageClass">
              {{ gameMessage }}
            </div>
          </div>
        </div>

        <!-- Game Info Panel -->
        <div class="col-md-4">
          <!-- Instructions -->
          <div class="card mb-3">
            <div class="card-header bg-info text-white">
              <h5><i class="fas fa-info-circle"></i> How to Play</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><i class="fas fa-mouse-pointer text-primary"></i> Click on NPCs to interact</li>
                <li><i class="fas fa-arrows-alt text-success"></i> Use WASD or Arrow keys to move</li>
                <li><i class="fas fa-star text-warning"></i> Earn points by helping staff</li>
                <li><i class="fas fa-trophy text-info"></i> Level up to unlock new features</li>
              </ul>
            </div>
          </div>

          <!-- Game Progress -->
          <div class="card mb-3">
            <div class="card-header bg-success text-white">
              <h5><i class="fas fa-chart-line"></i> Progress</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>Level Progress</span>
                  <span>{{ gameStats.score }}/50</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar bg-success" 
                    :style="{ width: levelProgress + '%' }"
                  ></div>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>Next Level</span>
                  <span>{{ 50 - gameStats.score }} points</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar bg-warning" 
                    :style="{ width: nextLevelProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- NPC Status -->
          <div class="card mb-3">
            <div class="card-header bg-warning">
              <h5><i class="fas fa-users"></i> NPC Status</h5>
            </div>
            <div class="card-body">
              <div v-for="npc in npcs" :key="npc.id" class="npc-status-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="me-2">{{ getNPCIcon(npc.id) }}</span>
                    <strong>{{ npc.name }}</strong>
                  </div>
                  <div class="npc-position">
                    <small class="text-muted">Pos: ({{ Math.round(npc.x) }}, {{ Math.round(npc.y) }})</small>
                  </div>
                </div>
                <div class="progress mt-1">
                  <div 
                    class="progress-bar" 
                    :class="getNPCProgressClass(npc)"
                    :style="{ width: getNPCProgress(npc) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5><i class="fas fa-trophy"></i> Achievements</h5>
            </div>
            <div class="card-body">
              <div class="achievement-list">
                <div 
                  v-for="achievement in achievements" 
                  :key="achievement.id"
                  class="achievement-item"
                  :class="{ unlocked: achievement.unlocked }"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-details">
                    <div class="achievement-title">{{ achievement.title }}</div>
                    <div class="achievement-desc">{{ achievement.description }}</div>
                  </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useClinicStore } from '../stores/clinicStore'

export default {
  name: 'GameView',
  setup() {
    const clinicStore = useClinicStore()
    
    // Reactive variables
    const gameMessage = ref('')
    const gameMessageClass = ref('alert-info')
    const canvas = ref(null)
    const autoMoveActive = ref(false)
    const gameMode = ref('normal')
    const autoMoveInterval = ref(null)
    
    // Player position
    const player = ref({
      x: 250,
      y: 200
    })
    
    // Keyboard state
    const keys = ref({
      w: false,
      a: false,
      s: false,
      d: false,
      ArrowUp: false,
      ArrowLeft: false,
      ArrowDown: false,
      ArrowRight: false
    })
    
    // Computed properties
    const gameStats = computed(() => clinicStore.gameState.gameStats)
    const npcs = computed(() => clinicStore.gameState.npcs)
    
    const levelProgress = computed(() => {
      return Math.min(100, (gameStats.value.score / 50) * 100)
    })
    
    const nextLevelProgress = computed(() => {
      return Math.min(100, ((50 - gameStats.value.score) / 50) * 100)
    })
    
    // Achievements data
    const achievements = ref([
      {
        id: 1,
        title: 'First Interaction',
        description: 'Interact with your first NPC',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 2,
        title: 'Helper',
        description: 'Complete 5 successful interactions',
        icon: '🤝',
        unlocked: false
      },
      {
        id: 3,
        title: 'Expert',
        description: 'Reach level 2',
        icon: '⭐',
        unlocked: false
      },
      {
        id: 4,
        title: 'Master',
        description: 'Reach level 3',
        icon: '🏆',
        unlocked: false
      }
    ])
    
    // Methods
    const getNPCIcon = (npcId) => {
      const icons = {
        1: '👩‍⚕️',
        2: '👨‍⚕️',
        3: '💁'
      }
      return icons[npcId] || '👤'
    }
    
    const getNPCProgress = (npc) => {
      return ((npc.x + npc.y) / 800) * 100
    }
    
    const getNPCProgressClass = (npc) => {
      if (npc.x < 200) return 'bg-danger'
      if (npc.x < 400) return 'bg-warning'
      return 'bg-success'
    }
    
    // NPC Interaction method
    const interact = (npcId) => {
      // Conditional Game Logic - Determine success/failure
      const result = clinicStore.interactWithNPC(npcId)
      
      gameMessage.value = result.message
      gameMessageClass.value = result.success ? 'alert-success' : 'alert-warning'
      
      // Update game stats display
      clinicStore.gameState.gameStats.interactions++
      
      // Check achievements
      checkAchievements()
      
      // Level up condition (Conditional logic)
      if (gameStats.value.score >= 50 && gameStats.value.level === 1) {
        clinicStore.gameState.gameStats.level = 2
        gameMessage.value = '🎉 LEVEL UP! You reached level 2! 🎉'
        gameMessageClass.value = 'alert-success'
      } else if (gameStats.value.score >= 100 && gameStats.value.level === 2) {
        clinicStore.gameState.gameStats.level = 3
        gameMessage.value = '🏆 AMAZING! You reached level 3! 🏆'
        gameMessageClass.value = 'alert-success'
      }
      
      setTimeout(() => {
        gameMessage.value = ''
      }, 2000)
    }
    
    // Looping - Move all NPCs repeatedly
    const moveAllNPCs = () => {
      // NPC Movements - Use loops to handle repeatable actions
      for (let i = 0; i < clinicStore.gameState.npcs.length; i++) {
        const randomX = Math.random() * 200 - 100
        const randomY = Math.random() * 100 - 50
        clinicStore.moveNPC(clinicStore.gameState.npcs[i].id, randomX, randomY)
      }
      gameMessage.value = '🚶 All NPCs moved around!'
      gameMessageClass.value = 'alert-info'
      setTimeout(() => {
        gameMessage.value = ''
      }, 1500)
    }
    
    const resetGame = () => {
      clinicStore.gameState.gameStats.score = 0
      clinicStore.gameState.gameStats.level = 1
      clinicStore.gameState.gameStats.interactions = 0
      
      // Reset NPC positions
      clinicStore.gameState.npcs[0].x = 100
      clinicStore.gameState.npcs[0].y = 200
      clinicStore.gameState.npcs[1].x = 300
      clinicStore.gameState.npcs[1].y = 200
      clinicStore.gameState.npcs[2].x = 500
      clinicStore.gameState.npcs[2].y = 200
      
      // Reset player position
      player.value.x = 250
      player.value.y = 200
      
      // Reset achievements
      achievements.value.forEach(a => a.unlocked = false)
      
      gameMessage.value = 'Game reset! Start playing!'
      gameMessageClass.value = 'alert-success'
      setTimeout(() => {
        gameMessage.value = ''
      }, 2000)
    }
    
    const startAutoMove = () => {
      autoMoveActive.value = !autoMoveActive.value
      
      if (autoMoveActive.value) {
        autoMoveInterval.value = setInterval(() => {
          clinicStore.moveAllNPCs()
        }, 2000)
      } else {
        clearInterval(autoMoveInterval.value)
      }
    }
    
    const toggleGameMode = () => {
      const modes = ['normal', 'hard', 'easy']
      const currentIndex = modes.indexOf(gameMode.value)
      gameMode.value = modes[(currentIndex + 1) % modes.length]
    }
    
    const updatePlayerPosition = () => {
      const speed = 5
      
      if (keys.value.w || keys.value.ArrowUp) {
        player.value.y = Math.max(10, player.value.y - speed)
      }
      if (keys.value.s || keys.value.ArrowDown) {
        player.value.y = Math.min(350, player.value.y + speed)
      }
      if (keys.value.a || keys.value.ArrowLeft) {
        player.value.x = Math.max(10, player.value.x - speed)
      }
      if (keys.value.d || keys.value.ArrowRight) {
        player.value.x = Math.min(550, player.value.x + speed)
      }
    }
    
    const checkCollisions = () => {
      npcs.value.forEach(npc => {
        const distance = Math.sqrt(
          Math.pow(player.value.x - npc.x, 2) + 
          Math.pow(player.value.y - npc.y, 2)
        )
        
        if (distance < 40) {
          // Auto-interact when player gets close to NPC
          if (!npc.recentlyInteracted) {
            interact(npc.id)
            npc.recentlyInteracted = true
            setTimeout(() => {
              npc.recentlyInteracted = false
            }, 2000)
          }
        }
      })
    }
    
    const checkAchievements = () => {
      // First interaction
      if (gameStats.value.interactions >= 1 && !achievements.value[0].unlocked) {
        achievements.value[0].unlocked = true
        showAchievementNotification(achievements.value[0])
      }
      
      // Helper achievement
      if (gameStats.value.interactions >= 5 && !achievements.value[1].unlocked) {
        achievements.value[1].unlocked = true
        showAchievementNotification(achievements.value[1])
      }
      
      // Level achievements
      if (gameStats.value.level >= 2 && !achievements.value[2].unlocked) {
        achievements.value[2].unlocked = true
        showAchievementNotification(achievements.value[2])
      }
      
      if (gameStats.value.level >= 3 && !achievements.value[3].unlocked) {
        achievements.value[3].unlocked = true
        showAchievementNotification(achievements.value[3])
      }
    }
    
    const showAchievementNotification = (achievement) => {
      const notification = document.createElement('div')
      notification.className = 'alert alert-warning position-fixed top-0 end-0 m-3 achievement-notification'
      notification.style.zIndex = '9999'
      notification.innerHTML = `
        <strong>🏆 Achievement Unlocked!</strong><br>
        ${achievement.icon} ${achievement.title}
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
    
    // Keyboard event handlers
    const handleKeyDown = (e) => {
      const key = e.key
      if (key in keys.value) {
        keys.value[key] = true
        e.preventDefault()
      }
    }
    
    const handleKeyUp = (e) => {
      const key = e.key
      if (key in keys.value) {
        keys.value[key] = false
        e.preventDefault()
      }
    }
    
    // Game loop
    let gameLoop = null
    const startGameLoop = () => {
      gameLoop = setInterval(() => {
        updatePlayerPosition()
        checkCollisions()
      }, 50) // 20 FPS
    }
    
    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      startGameLoop()
    })
    
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (gameLoop) clearInterval(gameLoop)
      if (autoMoveInterval.value) clearInterval(autoMoveInterval.value)
    })
    
    return {
      // Reactive variables
      gameMessage,
      gameMessageClass,
      canvas,
      autoMoveActive,
      gameMode,
      player,
      
      // Computed properties
      gameStats,
      npcs,
      levelProgress,
      nextLevelProgress,
      achievements,
      
      // Methods
      getNPCIcon,
      getNPCProgress,
      getNPCProgressClass,
      interact,
      moveAllNPCs,
      resetGame,
      startAutoMove,
      toggleGameMode
    }
  }
}
</script>

<style scoped>
.game-view {
  max-width: 1400px;
  margin: 0 auto;
}

.game-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 0;
  color: white;
  border-radius: 15px;
  margin-bottom: 30px;
}

.game-header h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.game-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}

.game-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.game-stats .badge {
  font-size: 14px;
  padding: 8px 15px;
}

.npc-canvas {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #dee2e6;
  border-radius: 10px;
  overflow: hidden;
}

.npc-avatar {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  z-index: 2;
}

.npc-avatar:hover {
  transform: scale(1.1);
  z-index: 3;
}

.npc-icon {
  font-size: 24px;
  margin-bottom: 2px;
}

.npc-name {
  font-size: 10px;
  font-weight: bold;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 2px 6px;
}

.player-character {
  position: absolute;
  text-align: center;
  z-index: 4;
  transition: all 0.1s linear;
}

.player-icon {
  font-size: 28px;
  margin-bottom: 2px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.player-name {
  font-size: 10px;
  font-weight: bold;
  color: #28a745;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2px 6px;
}

.game-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.npc-status-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.npc-status-item:last-child {
  border-bottom: none;
}

.npc-position {
  font-size: 11px;
}

.achievement-list {
  max-height: 300px;
  overflow-y: auto;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f8f9fa;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
}

.achievement-icon {
  font-size: 24px;
  margin-right: 12px;
}

.achievement-title {
  font-weight: bold;
  color: #333;
}

.achievement-desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.achievement-notification {
  animation: achievementPop 0.5s ease;
}

@keyframes achievementPop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  border: none;
  padding: 15px;
  font-weight: bold;
}

.progress {
  height: 6px;
  border-radius: 10px;
}

.progress-bar {
  transition: width 0.5s ease;
}

@media (max-width: 768px) {
  .game-header h1 {
    font-size: 24px;
  }
  
  .npc-canvas {
    height: 300px;
  }
  
  .game-controls .btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
