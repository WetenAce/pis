<template>
  <div class="pathology-management">
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <h3>病理管理</h3>
          <div class="table-actions">
            <el-button type="primary" @click="handleSpecimenCollection">
              <el-icon><Scissors /></el-icon>
              病理取材
            </el-button>
            <el-button type="success" @click="handlePathologyDiagnosis">
              <el-icon><DocumentChecked /></el-icon>
              病理诊断
            </el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="待取材病例" name="specimen">
          <el-table
            :data="specimenCases"
            v-loading="loading"
            style="width: 100%"
            @row-click="handleRowClick"
          >
            <el-table-column type="index" label="序号" width="60" />
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
            <el-table-column prop="department" label="送检科室" width="120" />
            <el-table-column prop="specimenType" label="标本类型" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link 
                  @click.stop="handleSpecimenCollection(row)"
                >
                  病理取材
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="待诊断病例" name="diagnosis">
          <el-table
            :data="diagnosisCases"
            v-loading="loading"
            style="width: 100%"
            @row-click="handleRowClick"
          >
            <el-table-column type="index" label="序号" width="60" />
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
            <el-table-column prop="department" label="送检科室" width="120" />
            <el-table-column prop="specimenType" label="标本类型" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="success" 
                  link 
                  @click.stop="handlePathologyDiagnosis(row)"
                >
                  病理诊断
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '../../utils/axios'

const router = useRouter()
const loading = ref(false)
const activeTab = ref('specimen')

const specimenCases = ref([])
const diagnosisCases = ref([])

const loadCases = async () => {
  loading.value = true
  try {
    const result = await axios.get('/cases')
    if (result.success) {
      const allCases = result.data.list
      
      // 待取材病例：状态为"已接收"的病例
      specimenCases.value = allCases.filter(caseItem => 
        caseItem.status === '已接收' && 
        (caseItem.collectionStatus === '待取材' || !caseItem.collectionStatus)
      )
      
      // 待诊断病例：状态为"检测中"或"已完成"的病例
      diagnosisCases.value = allCases.filter(caseItem => 
        (caseItem.status === '检测中' || caseItem.status === '已完成') && 
        (caseItem.diagnosisStatus === '待诊断' || !caseItem.diagnosisStatus)
      )
    }
  } catch (error) {
    console.error('加载病例数据失败:', error)
  } finally {
    loading.value = false
  }
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

const handleRowClick = (row) => {
  // 行点击事件，可以显示更多信息
  console.log('点击病例:', row)
}

const handleSpecimenCollection = (caseItem = null) => {
  if (caseItem) {
    // 从表格行点击进入，传递病例ID
    router.push(`/pathology/collection?id=${caseItem.id}`)
  } else {
    // 从按钮点击进入，跳转到病例列表选择
    router.push('/cases/list')
  }
}

const handlePathologyDiagnosis = (caseItem = null) => {
  if (caseItem) {
    // 从表格行点击进入，传递病例ID
    router.push(`/pathology/diagnosis?id=${caseItem.id}`)
  } else {
    // 从按钮点击进入，跳转到病例列表选择
    router.push('/cases/list')
  }
}

const handleTabClick = (tab) => {
  // 切换标签页时重新加载数据
  loadCases()
}

onMounted(() => {
  loadCases()
})
</script>

<style scoped>
.pathology-management {
  padding: 12px;
}

.table-card {
  border-radius: 6px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.table-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.table-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.table-card :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.table-card :deep(.el-table) {
  margin-top: 16px;
}

.table-card :deep(.el-table__row) {
  cursor: pointer;
}

.table-card :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
