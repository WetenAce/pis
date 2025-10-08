<template>
  <div class="case-list">
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <div class="search-filters">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索患者姓名或病例号"
              style="width: 200px"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
            <el-select
              v-model="searchForm.status"
              placeholder="病例状态"
              clearable
              style="width: 120px"
            >
              <el-option label="已登记" value="已登记" />
              <el-option label="已接收" value="已接收" />
              <el-option label="检测中" value="检测中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已报告" value="已报告" />
            </el-select>
            <el-select
              v-model="searchForm.department"
              placeholder="送检科室"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.value"
                :label="dept.label"
                :value="dept.value"
              />
            </el-select>
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
          <div class="table-actions">
            <el-button type="primary" @click="$router.push('/cases/register')">
              <el-icon><Plus /></el-icon>
              新增病例
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        :data="caseList"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :scroll="{ x: 1500 }"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="index" label="序号" width="60" fixed="left" />
        <el-table-column prop="caseNumber" label="病例号" width="140" fixed="left" />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === '男' ? 'primary' : 'danger'">
              {{ row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="doctor" label="送检医生" width="120" />
        <el-table-column prop="department" label="送检科室" width="120" />
        <el-table-column prop="specimenType" label="标本类型" width="120" />
        <el-table-column prop="clinicalDiagnosis" label="临床诊断" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="登记时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button 
              type="success" 
              link 
              @click="handleSpecimenCollection(row)"
              v-if="row.status === '已接收'"
            >
              病理取材
            </el-button>
            <el-button 
              type="info" 
              link 
              @click="handlePathologyDiagnosis(row)"
              v-if="row.status === '检测中' || row.status === '已完成'"
            >
              病理诊断
            </el-button>
            <el-button 
              type="success" 
              link 
              @click="handleUpdateStatus(row, '检测中')"
              v-if="row.status === '已接收'"
            >
              开始检测
            </el-button>
            <el-button 
              type="success" 
              link 
              @click="handleUpdateStatus(row, '已完成')"
              v-if="row.status === '检测中'"
            >
              完成检测
            </el-button>
            <el-button 
              type="info" 
              link 
              @click="handleUpdateStatus(row, '已报告')"
              v-if="row.status === '已完成'"
            >
              生成报告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 病例详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="病例详情"
      width="800px"
    >
      <el-descriptions :column="2" border v-if="currentCase">
        <el-descriptions-item label="病例号">{{ currentCase.caseNumber }}</el-descriptions-item>
        <el-descriptions-item label="患者姓名">{{ currentCase.patientName }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentCase.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentCase.age }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentCase.phone }}</el-descriptions-item>
        <el-descriptions-item label="送检医生">{{ currentCase.doctor }}</el-descriptions-item>
        <el-descriptions-item label="送检科室">{{ currentCase.department }}</el-descriptions-item>
        <el-descriptions-item label="标本类型">{{ currentCase.specimenType }}</el-descriptions-item>
        <el-descriptions-item label="临床诊断" :span="2">
          {{ currentCase.clinicalDiagnosis }}
        </el-descriptions-item>
        <el-descriptions-item label="病例状态">{{ currentCase.status }}</el-descriptions-item>
        <el-descriptions-item label="登记时间">{{ currentCase.createTime }}</el-descriptions-item>
      </el-descriptions>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from '../../utils/axios'

const loading = ref(false)
const detailDialogVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedCases = ref([])

const caseList = ref([])
const currentCase = ref(null)

const departmentList = ref([
  { value: '内科', label: '内科' },
  { value: '外科', label: '外科' },
  { value: '妇产科', label: '妇产科' },
  { value: '儿科', label: '儿科' },
  { value: '肿瘤科', label: '肿瘤科' }
])

const searchForm = reactive({
  keyword: '',
  status: '',
  department: '',
  dateRange: []
})

const loadCases = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchForm.keyword,
      status: searchForm.status,
      department: searchForm.department
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0].toISOString()
      params.endDate = searchForm.dateRange[1].toISOString()
    }
    
    const result = await axios.get('/cases', { params })
    if (result.success) {
      caseList.value = result.data.list
      total.value = result.data.total
    }
  } catch (error) {
    console.error('加载病例列表失败:', error)
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

const handleSearch = () => {
  currentPage.value = 1
  loadCases()
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    department: '',
    dateRange: []
  })
  currentPage.value = 1
  loadCases()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  loadCases()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadCases()
}

const handleSelectionChange = (selection) => {
  selectedCases.value = selection
}

const handleView = (caseItem) => {
  currentCase.value = caseItem
  detailDialogVisible.value = true
}

const handleEdit = (caseItem) => {
  ElMessage.info('编辑功能开发中...')
}

const handleUpdateStatus = async (caseItem, newStatus) => {
  try {
    await ElMessageBox.confirm(
      `确定要将病例 ${caseItem.caseNumber} 的状态更新为 "${newStatus}" 吗？`,
      '更新状态',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟更新状态
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('状态更新成功')
    loadCases()
  } catch (error) {
    // 用户取消操作
  }
}

const handleSpecimenCollection = (caseItem) => {
  // 跳转到病理取材页面，传递病例ID
  window.location.href = `/#/pathology/collection?id=${caseItem.id}`
}

const handlePathologyDiagnosis = (caseItem) => {
  // 跳转到病理诊断页面，传递病例ID
  window.location.href = `/#/pathology/diagnosis?id=${caseItem.id}`
}

const handleExport = () => {
  if (selectedCases.value.length === 0) {
    ElMessage.warning('请先选择要导出的病例')
    return
  }
  
  ElMessage.success(`已导出 ${selectedCases.value.length} 条病例数据`)
}

onMounted(() => {
  loadCases()
})
</script>

<style scoped>
.case-list {
  padding: 12px;
}

.table-card {
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-card :deep(.el-table) {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
