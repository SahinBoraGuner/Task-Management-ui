<template>
  <div>
    <a-row :gutter="[24, 24]" style="margin-bottom: 24px;">
      <a-col :xs="24" :sm="12" :md="6" v-for="(card, index) in statCards" :key="index">
        <a-card :bordered="false" class="widget-card">
          <div class="widget-content">
            <p>{{ card.title }}</p>
            <h3>{{ card.value }}</h3>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false" class="header-solid">
      <h4>Welcome to your Workspace!</h4>
      <p style="color: #8c8c8c;">
        Yukarıdaki kartlardan görevlerinizin genel durumunu izleyebilirsiniz. 
        Görevleri yönetmek, eklemek veya silmek için sol menüden <strong>Tasks</strong>
        sayfasına geçiş yapın.
      </p>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TaskService from '@/service/TaskService';

const tasks = ref([]);

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

const statCards = computed(() => [
  { title: 'Total Tasks', value: totalTasks.value },
  { title: 'In Progress', value: inProgressTasks.value },
  { title: 'Completed', value: completedTasks.value },
  { title: 'Pending', value: pendingTasks.value },
]);

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
.widget-card {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
}
.widget-content p {
  color: #8c8c8c;
  font-size: 12px;
  margin-bottom: 2px;
  font-weight: 600;
  text-transform: uppercase;
}
.widget-content h3 {
  font-weight: 700;
  color: #141414;
  margin: 0;
  font-size: 24px;
}

.header-solid {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
  padding: 16px;
  text-align: left;
}
</style>
