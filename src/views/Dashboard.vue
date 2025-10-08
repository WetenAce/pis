<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>仪表盘</h2>
      <p>系统概览和统计数据</p>
    </div>
    
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon user-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">1,234</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon order-icon">
                <el-icon><ShoppingCart /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">567</div>
                <div class="stat-label">今日订单</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon revenue-icon">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">¥89,456</div>
                <div class="stat-label">总收入</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon growth-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">+12.5%</div>
                <div class="stat-label">增长率</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <span>销售趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-icon><DataAnalysis /></el-icon>
              <p>销售趋势图表区域</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <span>用户分布</span>
            </template>
            <div class="chart-placeholder">
              <el-icon><PieChart /></el-icon>
              <p>用户分布图表区域</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="recent-activities">
      <el-card shadow="never">
        <template #header>
          <span>最近活动</span>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="activity in activities"
            :key="activity.id"
            :timestamp="activity.time"
            :type="activity.type"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../utils/axios'

const activities = ref([
  {
    id: 1,
    time: '2024-01-15 14:30',
    type: 'primary',
    content: '用户 admin 登录系统'
  },
  {
    id: 2,
    time: '2024-01-15 13:20',
    type: 'success',
    content: '新增用户 张三 注册成功'
  },
  {
    id: 3,
    time: '2024-01-15 11:45',
    type: 'warning',
    content: '系统备份任务执行完成'
  },
  {
    id: 4,
    time: '2024-01-15 09:15',
    type: 'info',
    content: '数据库优化任务已启动'
  }
])

onMounted(async () => {
  // 获取仪表盘数据
  try {
    const userInfo = await axios.get('/auth/user')
    console.log('用户信息:', userInfo)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.dashboard-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.growth-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  border-radius: 8px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 16px;
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.recent-activities {
  margin-bottom: 20px;
}
</style>
