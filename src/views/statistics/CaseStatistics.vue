<template>
  <div class="case-statistics">
    <el-row :gutter="20" class="stats-overview">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon total-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.totalCases }}</div>
              <div class="stat-label">总病例数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon today-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.todayCases }}</div>
              <div class="stat-label">今日新增</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon processing-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.processingCases }}</div>
              <div class="stat-label">处理中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon completed-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.completedCases }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>病例状态分布</span>
          </template>
          <div class="chart-placeholder">
            <el-icon><PieChart /></el-icon>
            <p>病例状态分布图表</p>
            <div class="status-list">
              <div v-for="status in statusDistribution" :key="status.name" class="status-item">
                <span class="status-name">{{ status.name }}</span>
                <span class="status-count">{{ status.count }} 例</span>
                <el-progress 
                  :percentage="status.percentage" 
                  :show-text="false"
                  :color="getStatusColor(status.name)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>科室病例分布</span>
          </template>
          <div class="chart-placeholder">
            <el-icon><DataAnalysis /></el-icon>
            <p>科室病例分布图表</p>
            <div class="department-list">
              <div v-for="dept in departmentDistribution" :key="dept.name" class="department-item">
                <span class="department-name">{{ dept.name }}</span>
                <span class="department-count">{{ dept.count }} 例</span>
                <el-progress 
                  :percentage="dept.percentage" 
                  :show-text="false"
                  color="#409EFF"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="tables-section">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>标本类型统计</span>
          </template>
          <el-table :data="specimenStats" style="width: 100%">
            <el-table-column prop="type" label="标本类型" />
            <el-table-column prop="count" label="数量" width="100">
              <template #default="{ row }">
                <el-tag>{{ row.count }} 例</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="占比" width="100">
              <template #default="{ row }">
                {{ row.percentage }}%
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>月度趋势</span>
          </template>
          <el-table :data="monthlyTrend" style="width: 100%">
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="count" label="病例数" width="100">
              <template #default="{ row }">
                <el-tag type="primary">{{ row.count }} 例</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="growth" label="增长率" width="100">
              <template #default="{ row }">
                <el-tag :type="row.growth >= 0 ? 'success' : 'danger'">
                  {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="recent-cases">
      <template #header>
        <span>最近病例</span>
      </template>
      <el-table :data="recentCases" style="width: 100%">
        <el-table-column prop="caseNumber" label="病例号" width="140" />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === '男' ? 'primary' : 'danger'">
              {{ row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="specimenType" label="标本类型" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="登记时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../utils/axios'

const overview = ref({
  totalCases: 0,
  todayCases: 0,
  processingCases: 0,
  completedCases: 0
})

const statusDistribution = ref([])
const departmentDistribution = ref([])
const specimenStats = ref([])
const monthlyTrend = ref([])
const recentCases = ref([])

const getStatusColor = (status) => {
  const colorMap = {
    '已登记': '#909399',
    '已接收': '#409EFF',
    '检测中': '#E6A23C',
    '已完成': '#67C23A',
    '已报告': '#67C23A'
  }
  return colorMap[status] || '#909399'
}

const getStatusType = (status) => {
  const typeMap = {
    '已登记': 'info',
    '已接收': 'primary',
    '检测中': 'warning',
    '已完成': 'success',
    '已报告': 'success'
  }
  return typeMap[status] || 'info'
}

const loadStatistics = async () => {
  try {
    // 加载统计数据
    const result = await axios.get('/cases', { params: { size: 100 } })
    if (result.success) {
      const cases = result.data.list
      
      // 计算概览数据
      overview.value = {
        totalCases: cases.length,
        todayCases: cases.filter(c => {
          const today = new Date().toDateString()
          const caseDate = new Date(c.createTime).toDateString()
          return today === caseDate
        }).length,
        processingCases: cases.filter(c => ['已接收', '检测中'].includes(c.status)).length,
        completedCases: cases.filter(c => ['已完成', '已报告'].includes(c.status)).length
      }
      
      // 计算状态分布
      const statusCount = {}
      cases.forEach(c => {
        statusCount[c.status] = (statusCount[c.status] || 0) + 1
      })
      statusDistribution.value = Object.entries(statusCount).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / cases.length) * 100)
      }))
      
      // 计算科室分布
      const deptCount = {}
      cases.forEach(c => {
        deptCount[c.department] = (deptCount[c.department] || 0) + 1
      })
      departmentDistribution.value = Object.entries(deptCount).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / cases.length) * 100)
      }))
      
      // 计算标本类型统计
      const specimenCount = {}
      cases.forEach(c => {
        specimenCount[c.specimenType] = (specimenCount[c.specimenType] || 0) + 1
      })
      specimenStats.value = Object.entries(specimenCount).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / cases.length) * 100)
      }))
      
      // 模拟月度趋势
      monthlyTrend.value = [
        { month: '1月', count: 45, growth: 12 },
        { month: '2月', count: 52, growth: 15 },
        { month: '3月', count: 48, growth: -8 },
        { month: '4月', count: 61, growth: 27 },
        { month: '5月', count: 55, growth: -10 },
        { month: '6月', count: 68, growth: 24 }
      ]
      
      // 最近病例
      recentCases.value = cases.slice(0, 10)
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.case-statistics {
  padding: 12px;
  height: 100%;
  overflow-y: auto;
}

.stats-overview {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 6px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 20px;
  color: white;
}

.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.today-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.processing-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.completed-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.charts-section {
  margin-bottom: 16px;
}

.chart-card {
  border-radius: 6px;
  height: 280px;
}

.chart-card :deep(.el-card__body) {
  padding: 16px;
}

.chart-placeholder {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.chart-placeholder .el-icon {
  font-size: 40px;
  margin-bottom: 12px;
  color: #c0c4cc;
}

.status-list,
.department-list {
  width: 100%;
  padding: 0 16px;
}

.status-item,
.department-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.status-name,
.department-name {
  width: 70px;
  font-size: 13px;
  color: #606266;
}

.status-count,
.department-count {
  width: 50px;
  font-size: 11px;
  color: #909399;
  text-align: right;
}

.status-item .el-progress,
.department-item .el-progress {
  flex: 1;
}

.tables-section {
  margin-bottom: 16px;
}

.table-card {
  border-radius: 6px;
}

.table-card :deep(.el-card__body) {
  padding: 16px;
}

.table-card :deep(.el-table) {
  max-height: 200px;
  overflow: auto;
}

.recent-cases {
  border-radius: 6px;
}

.recent-cases :deep(.el-card__body) {
  padding: 16px;
}

.recent-cases :deep(.el-table) {
  max-height: 300px;
  overflow: auto;
}
</style>
