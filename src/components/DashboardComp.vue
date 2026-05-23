<template>
  <div class="dashboard-container">
    <!-- Welcome Banner Section -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h2>Çalışma Alanınıza Hoş Geldiniz! <span class="wave">👋</span></h2>
          <p>
            Bugünkü hedeflerinizi tamamlamaya hazır mısınız? Aşağıdaki panelden tüm görevlerinizin güncel durumunu gerçek zamanlı izleyebilirsiniz.
          </p>
          <div class="banner-badge">
            <span class="badge-dot"></span>
            Genel Tamamlanma Oranı: <strong>%{{ completionRate }}</strong>
          </div>
        </div>
        <div class="banner-gauge-container">
          <div class="banner-progress-wrapper">
            <div class="banner-progress-bar" :style="{ width: completionRate + '%' }"></div>
          </div>
          <span class="banner-progress-label">%{{ completionRate }} Bitti</span>
        </div>
      </div>
    </div>

    <!-- Stat Cards Row -->
    <a-row :gutter="[24, 24]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6" v-for="(card, index) in statCards" :key="index">
        <div :class="['stat-card', card.colorClass]">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="stat-title">{{ card.title }}</span>
              <h3 class="stat-value">{{ card.value }}</h3>
              <span class="stat-subtext">{{ card.subtext }}</span>
            </div>
            <div class="stat-icon-wrapper">
              <component :is="card.icon" class="stat-icon" />
            </div>
          </div>
          <!-- Mini Bottom Progress Indicator -->
          <div class="card-progress">
            <div class="card-progress-fill" :style="{ width: card.percentage + '%' }"></div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Analytics & Active Tasks Split Row -->
    <a-row :gutter="[24, 24]" class="analytics-row">
      <!-- Donut / Circular Gauge Chart -->
      <a-col :xs="24" :lg="10">
        <a-card :bordered="false" class="premium-card chart-card">
          <template #title>
            <div class="card-header-title">
              <span class="header-icon">📊</span>
              <h4>Görev Dağılım Analizi</h4>
            </div>
          </template>
          <div class="chart-content">
            <!-- Custom Premium SVG Gauge -->
            <div class="svg-gauge-wrapper">
              <svg class="progress-ring" width="180" height="180">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#3b82f6" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <!-- Background Circle -->
                <circle
                  class="progress-ring-bg"
                  stroke="#e2e8f0"
                  stroke-width="12"
                  fill="transparent"
                  r="70"
                  cx="90"
                  cy="90"
                />
                <!-- Animated Progress Circle -->
                <circle
                  class="progress-ring-fill"
                  stroke="url(#gaugeGradient)"
                  stroke-width="12"
                  stroke-linecap="round"
                  fill="transparent"
                  r="70"
                  cx="90"
                  cy="90"
                  :stroke-dasharray="strokeDasharray"
                  :stroke-dashoffset="strokeDashoffset"
                  filter="url(#glow)"
                />
              </svg>
              <!-- Center Text inside Ring -->
              <div class="gauge-center-text">
                <span class="percent-num">{{ completionRate }}%</span>
                <span class="percent-label">Başarı</span>
              </div>
            </div>

            <!-- Legend Grid -->
            <div class="chart-legend">
              <div 
                v-for="(legend, i) in legendItems" 
                :key="i" 
                class="legend-item"
              >
                <div class="legend-info">
                  <span class="legend-badge" :style="{ backgroundColor: legend.color }"></span>
                  <span class="legend-label">{{ legend.label }}</span>
                </div>
                <div class="legend-stats">
                  <strong class="legend-count">{{ legend.count }}</strong>
                  <span class="legend-pct">%{{ legend.percentage }}</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Active Tasks Quick View List -->
      <a-col :xs="24" :lg="14">
        <a-card :bordered="false" class="premium-card tasks-preview-card">
          <template #title>
            <div class="card-header-title">
              <span class="header-icon">⚡</span>
              <h4>Aktif Görevler (Özet)</h4>
            </div>
          </template>
          <template #extra>
            <a-button type="link" class="view-all-btn" @click="navigateToTasks">
              Tümünü Gör <ArrowRightOutlined />
            </a-button>
          </template>

          <div class="tasks-preview-list">
            <div 
              v-for="task in activeTasksLimit" 
              :key="task.id" 
              class="task-preview-item"
              :class="getStatusBorderClass(task.status)"
            >
              <div class="task-preview-main">
                <div class="task-preview-header">
                  <h5>{{ task.title }}</h5>
                  <a-tag :color="getStatusColor(task.status)" class="task-badge">
                    {{ getStatusTranslation(task.status) }}
                  </a-tag>
                </div>
                <p class="task-preview-desc">{{ task.description || 'Açıklama belirtilmemiş.' }}</p>
                <div class="task-preview-meta">
                  <span class="task-meta-item">
                    <CalendarOutlined class="meta-icon" />
                    {{ task.dueDate ? formatDate(task.dueDate) : 'Tarih Belirtilmemiş' }}
                  </span>
                </div>
              </div>
              <div class="task-action">
                <a-button type="text" shape="circle" class="go-to-task-btn" @click="navigateToTasks">
                  <template #icon><ArrowRightOutlined /></template>
                </a-button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="activeTasksLimit.length === 0" class="empty-tasks-state">
              <div class="empty-icon-wrapper">
                <SmileOutlined class="empty-icon" />
              </div>
              <h4>Harika! Aktif Göreviniz Kalmadı</h4>
              <p>Tüm hedeflerinize ulaştınız. Yeni bir görev eklemek ister misiniz?</p>
              <a-button type="primary" class="create-task-btn" @click="navigateToTasks">
                Görev Oluştur
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TaskService from '@/service/TaskService';
import { 
  FileTextOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ArrowRightOutlined, 
  CalendarOutlined, 
  SmileOutlined 
} from '@ant-design/icons-vue';

const tasks = ref([]);
const router = useRouter();

// SVG Gauge Circle Constants
const radius = 70;
const strokeDasharray = computed(() => 2 * Math.PI * radius); // ~439.82
const strokeDashoffset = computed(() => {
  const rate = completionRate.value;
  return strokeDasharray.value - (strokeDasharray.value * rate) / 100;
});

const totalTasks = computed(() => {
  return tasks.value ? tasks.value.length : 0;
});

const inProgressTasks = computed(() => {
  if (!tasks.value) return 0;
  return tasks.value.filter(item => item.status === 'IN_PROGRESS').length;
});

const completedTasks = computed(() => {
  if (!tasks.value) return 0;
  return tasks.value.filter(item => item.status === 'COMPLETED').length;
});

const pendingTasks = computed(() => {
  if (!tasks.value) return 0;
  return tasks.value.filter(item => item.status === 'READY' || item.status === 'PENDING').length;
});

const cancelledTasks = computed(() => {
  if (!tasks.value) return 0;
  return tasks.value.filter(item => item.status === 'CANCELLED').length;
});

const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// Navigation to Tasks view
const navigateToTasks = () => {
  router.push('/tasks');
};

// Map status key to Turkish translation
const getStatusTranslation = (status) => {
  const translations = {
    READY: 'Hazır',
    PENDING: 'Beklemede',
    IN_PROGRESS: 'Devam Ediyor',
    COMPLETED: 'Tamamlandı',
    CANCELLED: 'İptal Edildi'
  };
  return translations[status] || status;
};

// Ant Design badge color mappings
const getStatusColor = (status) => {
  const colors = {
    READY: 'blue',
    PENDING: 'orange',
    IN_PROGRESS: 'purple',
    COMPLETED: 'success',
    CANCELLED: 'error'
  };
  return colors[status] || 'default';
};

// Left border CSS classes for tasks preview
const getStatusBorderClass = (status) => {
  const borders = {
    READY: 'border-ready',
    PENDING: 'border-pending',
    IN_PROGRESS: 'border-progress',
    COMPLETED: 'border-completed',
    CANCELLED: 'border-cancelled'
  };
  return borders[status] || 'border-default';
};

// Format ISO date to Turkish date format
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

// Filter out active tasks (not completed, not cancelled) and show top 3
const activeTasksLimit = computed(() => {
  if (!tasks.value) return [];
  return tasks.value
    .filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 3);
});

// Dynamic statistics layout data
const statCards = computed(() => {
  const total = totalTasks.value || 1; // Avoid division by zero
  return [
    { 
      title: 'Toplam Görev', 
      value: totalTasks.value, 
      subtext: 'Projedeki tüm görevler',
      colorClass: 'card-total',
      icon: FileTextOutlined,
      percentage: 100
    },
    { 
      title: 'Devam Edenler', 
      value: inProgressTasks.value, 
      subtext: 'Şu an çalışılanlar',
      colorClass: 'card-progress-active',
      icon: SyncOutlined,
      percentage: Math.round((inProgressTasks.value / total) * 100)
    },
    { 
      title: 'Tamamlananlar', 
      value: completedTasks.value, 
      subtext: 'Başarıyla bitirilenler',
      colorClass: 'card-completed',
      icon: CheckCircleOutlined,
      percentage: Math.round((completedTasks.value / total) * 100)
    },
    { 
      title: 'Bekleyenler', 
      value: pendingTasks.value, 
      subtext: 'Sırada bekleyenler',
      colorClass: 'card-pending',
      icon: ClockCircleOutlined,
      percentage: Math.round((pendingTasks.value / total) * 100)
    },
  ];
});

// Dynamic SVG Legend items
const legendItems = computed(() => {
  const total = totalTasks.value || 1;
  return [
    { label: 'Tamamlandı', count: completedTasks.value, percentage: Math.round((completedTasks.value / total) * 100), color: '#10b981' },
    { label: 'Devam Ediyor', count: inProgressTasks.value, percentage: Math.round((inProgressTasks.value / total) * 100), color: '#a855f7' },
    { label: 'Hazır / Beklemede', count: pendingTasks.value, percentage: Math.round((pendingTasks.value / total) * 100), color: '#eab308' },
    { label: 'İptal Edildi', count: cancelledTasks.value, percentage: Math.round((cancelledTasks.value / total) * 100), color: '#ef4444' },
  ];
});

const getTasks = async () => {
  try {
    tasks.value = await TaskService.getTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

onMounted(async () => {
  await getTasks();
});
</script>

<style scoped>
.dashboard-container {
  padding: 8px 0;
  text-align: left;
}

/* Welcome Banner Styling */
.welcome-banner {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 16px;
  padding: 32px;
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.25);
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.banner-text {
  max-width: 60%;
  flex: 1 1 400px;
}

.banner-text h2 {
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 10px;
}

.banner-text p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 18px;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  backdrop-filter: blur(4px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: pulse 1.8s infinite;
}

.banner-gauge-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 200px;
}

.banner-progress-wrapper {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.banner-progress-bar {
  height: 100%;
  background-color: #10b981;
  border-radius: 4px;
  box-shadow: 0 0 10px #10b981;
  transition: width 1s ease-in-out;
}

.banner-progress-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Wave emoji animation */
.wave {
  display: inline-block;
  animation: waveAnim 2.5s infinite;
  transform-origin: 70% 70%;
}

/* Stats Cards Grid */
.stats-row {
  margin-bottom: 28px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.06);
}

.stat-card-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.stat-title {
  font-size: 13px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-subtext {
  font-size: 12px;
  color: #94a3b8;
}

.stat-icon-wrapper {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-icon {
  font-size: 20px;
}

.card-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f1f5f9;
}

.card-progress-fill {
  height: 100%;
  width: 0;
  transition: width 1s ease-in-out;
}

/* Card-specific Colors & Glowing Effects */
.card-total .stat-icon-wrapper { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-total .card-progress-fill { background-color: #3b82f6; }
.card-total:hover { border-color: rgba(59, 130, 246, 0.2); }

.card-progress-active .stat-icon-wrapper { background-color: rgba(168, 85, 247, 0.1); color: #a855f7; }
.card-progress-active .card-progress-fill { background-color: #a855f7; }
.card-progress-active:hover { border-color: rgba(168, 85, 247, 0.2); }

.card-completed .stat-icon-wrapper { background-color: rgba(16, 185, 129, 0.1); color: #10b981; }
.card-completed .card-progress-fill { background-color: #10b981; }
.card-completed:hover { border-color: rgba(16, 185, 129, 0.2); }

.card-pending .stat-icon-wrapper { background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.card-pending .card-progress-fill { background-color: #f59e0b; }
.card-pending:hover { border-color: rgba(245, 158, 11, 0.2); }

/* Premium Card (General Card Restyling) */
.premium-card {
  background: #ffffff !important;
  border-radius: 16px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02) !important;
  border: 1px solid #f1f5f9 !important;
  overflow: hidden;
  height: 100%;
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 18px;
}

.premium-card h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

/* Donut Chart Component */
.chart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  min-height: 310px;
}

.svg-gauge-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 24px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-fill {
  transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.gauge-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.percent-num {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.percent-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}

.chart-legend {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background-color: #f8fafc;
}

.legend-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.legend-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-count {
  font-size: 12px;
  color: #0f172a;
}

.legend-pct {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

/* Active Tasks Quick View List */
.tasks-preview-card {
  min-height: 400px;
}

.view-all-btn {
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5 !important;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tasks-preview-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
  min-height: 290px;
  justify-content: flex-start;
}

.task-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  border-left: 4px solid #cbd5e1;
  transition: all 0.2s ease;
}

.task-preview-item:hover {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transform: translateX(4px);
}

.task-preview-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-preview-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.task-preview-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.task-badge {
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  padding: 1px 6px;
}

.task-preview-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-preview-meta {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.task-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 12px;
}

.task-action {
  margin-left: 12px;
}

.go-to-task-btn {
  color: #94a3b8;
  background-color: transparent;
  transition: all 0.2s ease;
}

.task-preview-item:hover .go-to-task-btn {
  color: #4f46e5;
  background-color: rgba(79, 70, 229, 0.08);
}

/* Status borders decoration */
.border-ready { border-left-color: #3b82f6; }
.border-pending { border-left-color: #f59e0b; }
.border-progress { border-left-color: #a855f7; }
.border-completed { border-left-color: #10b981; }
.border-cancelled { border-left-color: #ef4444; }

/* Empty state list widget */
.empty-tasks-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 16px;
  text-align: center;
  flex-grow: 1;
}

.empty-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 32px;
}

.empty-tasks-state h4 {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.empty-tasks-state p {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 16px 0;
  max-width: 280px;
}

.create-task-btn {
  border-radius: 20px;
  font-weight: 600;
  background-color: #10b981;
  border-color: #10b981;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
}

.create-task-btn:hover, .create-task-btn:focus {
  background-color: #059669 !important;
  border-color: #059669 !important;
}

/* Keyframe Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes waveAnim {
  0% { transform: rotate( 0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}

/* Responsiveness overrides */
@media (max-width: 768px) {
  .welcome-banner {
    padding: 24px;
  }
  .banner-text {
    max-width: 100%;
    text-align: center;
  }
  .banner-gauge-container {
    align-items: center;
    width: 100%;
  }
  .banner-progress-wrapper {
    width: 100%;
  }
  .chart-legend {
    grid-template-columns: 1fr;
  }
}
</style>
