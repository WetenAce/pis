<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="nav-header">
        <h1 class="logo">Vue PIS</h1>
      </div>
      
      <!-- 顶部菜单 -->
      <div class="nav-menu">
        <div class="menu-items">
          <template v-for="menu in menuData" :key="menu.id">
            <div v-if="menu.children && menu.children.length" class="menu-item has-children">
              <el-dropdown @command="handleMenuCommand" placement="bottom">
                <div class="menu-link">
                  <div class="menu-icon">
                    <el-icon><component :is="menu.icon" /></el-icon>
                  </div>
                  <div class="menu-text">{{ menu.name }}</div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="child in menu.children"
                      :key="child.id"
                      :command="child.path"
                      :divided="child.divided"
                    >
                      <el-icon><component :is="child.icon" /></el-icon>
                      <span>{{ child.name }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div v-else class="menu-item">
              <router-link :to="menu.path" class="menu-link">
                <div class="menu-icon">
                  <el-icon><component :is="menu.icon" /></el-icon>
                </div>
                <div class="menu-text">{{ menu.name }}</div>
              </router-link>
            </div>
          </template>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="user-section">
        <span class="welcome-text">欢迎，{{ userInfo?.name || '用户' }}</span>
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userInfo?.avatar" />
            <span class="username">{{ userInfo?.name }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import menuData from '../data/menu.json'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.user)
const activeMenu = computed(() => route.path)

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

const handleMenuCommand = (path) => {
  router.push(path)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    authStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    // 用户取消退出
  }
}

onMounted(() => {
  console.log('菜单数据:', menuData)
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航栏样式 */
.top-navbar {
  height: 60px;
  background-color: #304156;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-header .logo {
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-left: 20px;
}

.menu-items {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item {
  position: relative;
}

.menu-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 60px;
  padding: 8px 4px;
  color: #bfcbd9;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #409EFF;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.menu-icon .el-icon {
  font-size: 18px;
}

.menu-text {
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
}

/* 激活状态 */
.menu-item .router-link-active .menu-link,
.menu-item .router-link-active .menu-link:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

/* 下拉菜单样式 */
.menu-item.has-children .menu-link {
  cursor: pointer;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  color: #bfcbd9;
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
  color: #bfcbd9;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  margin: 0 8px;
  color: #bfcbd9;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
