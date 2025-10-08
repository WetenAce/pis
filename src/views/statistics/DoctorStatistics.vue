<template>
  <div class="doctor-statistics">
    <div class="page-header">
      <h2>医生统计</h2>
      <p>医生工作数据统计分析</p>
    </div>
    
    <el-row :gutter="20" class="stats-overview">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon total-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.totalDoctors }}</div>
              <div class="stat-label">总医生数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon active-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.activeDoctors }}</div>
              <div class="stat-label">在职医生</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon cases-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.totalCases }}</div>
              <div class="stat-label">总送检数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon avg-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overview.avgCases }}</div>
              <div class="stat-label">人均送检</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="charts-section">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>科室医生分布</span>
          </template>
          <div class="chart-placeholder">
            <el-icon><PieChart /></el-icon>
            <p>科室医生分布图表</p>
            <div class="department-list">
              <div v-for="dept in departmentDistribution" :key="dept.name" class="department-item">
                <span class="department-name">{{ dept.name }}</span>
                <span class="department-count">{{ dept.count }} 人</span>
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
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>职称分布</span>
          </template>
          <div class="chart-placeholder">
            <el-icon><DataAnalysis /></el-icon>
            <p>医生职称分布图表</p>
            <div class="title-list">
              <div v-for="title in titleDistribution" :key="title.name" class="title-item">
                <span class="title-name">{{ title.name }}</span>
                <span class="title-count">{{ title.count }} 人</span>
                <el-progress 
                  :percentage="title.percentage" 
                  :show-text="false"
                  :color="getTitleColor(title.name)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="top-doctors">
      <template #header>
        <span>医生送检排行</span>
      </template>
      <el-table :data="topDoctors" style="width: 100%">
        <el-table-column type="index" label="排名" width="80">
          <template #default="{ $index }">
            <el-tag :type="getRankType($index + 1)">
              {{ $index + 1 }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="医生姓名" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="caseCount" label="送检病例数" width="120">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.caseCount }} 例</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="completionRate" label="完成率" width="120">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.completionRate" 
              :show-text="false"
              :color="getCompletionColor(row.completionRate)"
            />
            <span style="margin-left: 8px; font-size: 12px;">{{ row.completionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="avgProcessingTime" label="平均处理时间" width="140">
          <template #default="{ row }">
            {{ row.avgProcessingTime }} 天
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetails(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-row :gutter="20" class="tables-section">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>科室工作量统计</span>
          </template>
          <el-table :data="departmentWorkload" style="width: 100%">
            <el-table-column prop="department" label="科室" />
            <el-table-column prop="doctorCount" label="医生数" width="100">
              <template #default="{ row }">
                {{ row.doctorCount }} 人
              </template>
            </el-table-column>
            <el-table-column prop="caseCount" label="病例数" width="100">
              <template #default="{ row }">
                <el-tag type="primary">{{ row.caseCount }} 例</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="avgCases" label="人均病例" width="100">
              <template #default="{ row }">
                {{ row.avgCases }} 例
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <span>月度活跃度</span>
          </template>
          <el-table :data="monthlyActivity" style="width: 100%">
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="activeDoctors" label="活跃医生" width="100">
              <template #default="{ row }">
                {{ row.activeDoctors }} 人
              </template>
            </el-table-column>
            <el-table-column prop="newCases" label="新增病例" width="100">
              <template #default="{ row }">
                <el-tag type="primary">{{ row.newCases }} 例</el-tag>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '../../utils/axios'

const overview = ref({
  totalDoctors: 0,
  activeDoctors: 0,
  totalCases: 0,
  avgCases: 0
})

const departmentDistribution = ref([])
const titleDistribution = ref([])
const topDoctors = ref([])
const departmentWorkload = ref([])
const monthlyActivity = ref([])

const getRankType = (rank) => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return 'primary'
  return 'info'
}

const getTitleColor = (title) => {
  const colorMap = {
    '主任医师': '#F56C6C',
    '副主任医师': '#E6A23C',
    '主治医师': '#409EFF',
    '住院医师': '#67C23A',
    '实习医师': '#909399'
  }
  return colorMap[title] || '#409EFF'
}

const getCompletionColor = (rate) => {
  if (rate >= 90) return '#67C23A'
  if (rate >= 70) return '#E6A23C'
  return '#F56C6C'
}

const loadStatistics = async () => {
  try {
    // 加载医生数据
    const doctorsResult = await axios.get('/doctors', { params: { size: 100 } })
    const casesResult = await axios.get('/cases', { params: { size: 100 } })
    
    if (doctorsResult.success && casesResult.success) {
      const doctors = doctorsResult.data.list
      const cases = casesResult.data.list
      
      // 计算概览数据
      const activeDoctors = doctors.filter(d => d.status === '在职')
      const doctorCaseCount = {}
      
      cases.forEach(c => {
        if (c.doctor) {
          doctorCaseCount[c.doctor] = (doctorCaseCount[c.doctor] || 0) + 1
        }
      })
      
      const totalCases = Object.values(doctorCaseCount).reduce((sum, count) => sum + count, 0)
      
      overview.value = {
        totalDoctors: doctors.length,
        activeDoctors: activeDoctors.length,
        totalCases: totalCases,
        avgCases: activeDoctors.length > 0 ? Math.round(totalCases / activeDoctors.length) : 0
      }
      
      // 计算科室分布
      const deptCount = {}
      activeDoctors.forEach(d => {
        deptCount[d.department] = (deptCount[d.department] || 0) + 1
      })
      departmentDistribution.value = Object.entries(deptCount).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / activeDoctors.length) * 100)
      }))
      
      // 计算职称分布
      const titleCount = {}
      activeDoctors.forEach(d => {
        titleCount[d.title] = (titleCount[d.title] || 0) + 1
      })
      titleDistribution.value = Object.entries(titleCount).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / activeDoctors.length) * 100)
      }))
      
      // 计算医生排行
      topDoctors.value = activeDoctors.map(doctor => {
        const caseCount = doctorCaseCount[doctor.name] || 0
        const completedCases = cases.filter(c => 
          c.doctor === doctor.name && ['已完成', '已报告'].includes(c.status)
        ).length
        
        return {
          ...doctor,
          caseCount,
          completionRate: caseCount > 0 ? Math.round((completedCases / caseCount) * 100) : 0,
          avgProcessingTime: Math.round(Math.random() * 5 + 1) // 模拟数据
        }
      })
      .sort((a, b) => b.caseCount - a.caseCount)
      .slice(0, 10)
      
      // 计算科室工作量
      const deptWorkload = {}
      activeDoctors.forEach(d => {
        if (!deptWorkload[d.department]) {
          deptWorkload[d.department] = {
            doctorCount: 0,
            caseCount: 0
          }
        }
        deptWorkload[d.department].doctorCount++
        deptWorkload[d.department].caseCount += doctorCaseCount[d.name] || 0
      })
      
      departmentWorkload.value = Object.entries(deptWorkload).map(([department, data]) => ({
        department,
        doctorCount: data.doctorCount,
        caseCount: data.caseCount,
        avgCases: Math.round(data.caseCount / data.doctorCount)
      }))
      
      // 模拟月度活跃度
      monthlyActivity.value = [
        { month: '1月', activeDoctors: 18, newCases: 45, growth: 12 },
        { month: '2月', activeDoctors: 20, newCases: 52, growth: 15 },
        { month: '3月', activeDoctors: 22, newCases: 48, growth: -8 },
        { month: '4月', activeDoctors: 25, newCases: 61, growth: 27 },
        { month: '5月', activeDoctors: 23, newCases: 55, growth: -10 },
        { month: '6月', activeDoctors: 26, newCases: 68, growth: 24 }
      ]
    }
  } catch (error) {
    console.error('加载医生统计数据失败:', error)
  }
}

const handleViewDetails = (doctor) => {
  ElMessage.info(`查看医生 ${doctor.name} 的详细统计信息`)
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.doctor-statistics {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-overview {
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

.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.active-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.cases-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.avg-icon {
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
  height: 300px;
}

.chart-placeholder {
  height: 240px;
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

.department-list,
.title-list {
  width: 100%;
  padding: 0 20px;
}

.department-item,
.title-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.department-name,
.title-name {
  width: 100px;
  font-size: 14px;
  color: #606266;
}

.department-count,
.title-count {
  width: 60px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}

.department-item .el-progress,
.title-item .el-progress {
  flex: 1;
}

.top-doctors {
  border-radius: 8px;
  margin-bottom: 30px;
}

.tables-section {
  margin-bottom: 30px;
}

.table-card {
  border-radius: 8px;
}
</style>
