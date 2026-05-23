<template>
  <a-layout class="layout-dashboard" id="layout-dashboard">
    <a-layout-sider :trigger="null" collapsible width="250" class="sidebar-fixed">
      <div class="brand">
        <img src="https://demos.creative-tim.com/muse-vue-ant-design-dashboard/images/logo-ct-black.png" alt="Muse Logo" />
        <span>Task Management Workspace</span>
      </div>
      <hr />
      <a-menu mode="inline" :selected-keys="[activePage]" @click="handleMenuClick">
        <a-menu-item key="dashboard">
          <template #icon><dashboard-outlined /></template>
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="tasks">
          <template #icon><project-outlined /></template>
          <span>Tasks</span>
        </a-menu-item>
        <a-menu-item key="admin-page">
          <template #icon><setting-outlined /></template>
          <span>Admin Page</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="navbar-header">
        <div class="header-title">
          <h5>{{ headerTitle }}</h5>
        </div>
      </a-layout-header>

      <a-layout-content class="content-body">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DashboardOutlined, ProjectOutlined, SettingOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

// Compute active page from the route path (e.g. /dashboard -> dashboard)
const activePage = computed(() => {
  const path = route.path.replace(/^\//, '');
  return path || 'dashboard';
});

// Compute page header title based on current active view
const headerTitle = computed(() => {
  switch (activePage.value) {
    case 'dashboard':
      return 'Dashboard Overview';
    case 'tasks':
      return 'Tasks Management';
    case 'admin-page':
      return 'Admin Dashboard';
    default:
      return 'Workspace';
  }
});

const handleMenuClick = (e) => {
  router.push(`/${e.key}`);
};
</script>

<style scoped>
.layout-dashboard {
  background-color: #f8f9fa !important;
  min-height: 100vh;
}

.sidebar-fixed {
  background: #ffffff !important;
  border-right: 1px solid #e2e8f0;
}
.brand {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
.brand img {
  width: 30px;
}
.brand span {
  font-weight: 700;
  color: #141414;
  font-size: 16px;
}

.navbar-header {
  background: transparent !important;
  padding: 16px 24px !important;
  height: auto !important;
}
.header-title h5 {
  font-weight: 700;
  color: #141414;
  margin: 0;
  font-size: 18px;
}

.content-body {
  padding: 0 24px 24px 24px;
}
</style>
