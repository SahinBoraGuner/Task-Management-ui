<template>
  <div>
    <a-modal v-model:open="open" title="Add Task To User" @ok="addUserTask" :width="520">
      <div class="modal-form-item">
        <h4>Title</h4>
        <a-input type="text" v-model:value="task.title" placeholder="Enter task title" />
      </div>
      <div class="modal-form-item">
        <h4>Description</h4>
        <a-textarea v-model:value="task.description" placeholder="Enter task description" :rows="3" />
      </div>
      <div class="modal-form-item">
        <h4>Due Date</h4>
        <date-picker v-model:value="task.dueDate" style="width: 100%" />
      </div>
      <div class="modal-form-item">
        <h4>Status</h4>
        <a-select ref="select" v-model:value="task.status" style="width: 100%">
          <a-select-option value="READY">Ready</a-select-option>
          <a-select-option value="PENDING">Pending</a-select-option>
          <a-select-option value="CANCELLED">Cancelled</a-select-option>
          <a-select-option value="IN_PROGRESS">In Progress</a-select-option>
          <a-select-option value="COMPLETED">Completed</a-select-option>
        </a-select>
      </div>
      <div class="modal-form-item">
        <h4>User ID</h4>
        <a-input type="text" v-model:value="task.userId" disabled />
      </div>
    </a-modal>

    <a-card :bordered="false" class="header-solid mb-24" title="Users List">
      <a-table :columns="columns" :data-source="users" row-key="id" class="muse-table" :pagination="{ pageSize: 8 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span style="font-weight: 600; color: #262626;">{{ record.name }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a-button type="primary" shape="circle" @click="showModal(record.id)">+</a-button>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import AdminService from '@/service/AdminService';
import { DatePicker, message } from 'ant-design-vue';
import { ref, onMounted } from 'vue';

const users = ref([]);
const open = ref(false);

const task = ref({
  title: '',
  description: '',
  dueDate: null,
  status: 'READY',
  userId: null
});

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '80%',
  },
  {
    title: 'Action',
    key: 'action',
    width: '20%',
    align: 'center'
  }
];

const getUsers = async () => {
  try {
    users.value = await AdminService.getUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    message.error('Failed to load users');
  }
};

const addUserTask = async () => {
  if (!task.value.title || task.value.title.trim() === '') {
    message.warning('Please enter a task title');
    return;
  }

  try {
    await AdminService.addUserTask(task.value);
    message.success('Task Added to User Successfully');

    task.value = {
      title: '',
      description: '',
      dueDate: null,
      status: 'READY',
      userId: null
    };
    open.value = false;
  } catch (error) {
    console.error('Error adding task to user:', error);
    message.error('Something went wrong while adding task');
  }
};

const showModal = (userId) => {
  task.value.userId = userId;
  open.value = true;
};

onMounted(async () => {
  await getUsers();
});
</script>

<style scoped>
.mb-24 {
  margin-bottom: 24px;
}

.modal-form-item {
  margin-bottom: 16px;
}

.modal-form-item h4 {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

.header-solid {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
  padding: 16px;
  text-align: left;
}

:deep(.ant-table) {
  background: #ffffff !important;
}

:deep(.ant-table-thead > tr > th) {
  background: transparent !important;
  color: #8c8c8c !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f0f0 !important;
}
</style>