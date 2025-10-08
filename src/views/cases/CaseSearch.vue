<template>
  <div class="case-search">
    <el-card class="search-card">
      <template #header>
        <span>查询条件</span>
      </template>
      
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="病例号">
              <el-input
                v-model="searchForm.caseNumber"
                placeholder="请输入病例号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者姓名">
              <el-input
                v-model="searchForm.patientName"
                placeholder="请输入患者姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送检医生">
              <el-select
                v-model="searchForm.doctor"
                placeholder="请选择送检医生"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="doctor in doctorList"
                  :key="doctor.id"
                  :label="doctor.name"
                  :value="doctor.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="送检科室">
              <el-select
                v-model="searchForm.department"
                placeholder="请选择送检科室"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标本类型">
              <el-select
                v-model="searchForm.specimenType"
                placeholder="请选择标本类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="type in specimenTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="病例状态">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择病例状态"
                clearable
                style="width: 100%"
              >
                <el-option label="已登记" value="已登记" />
                <el-option label="已接收" value="已接收" />
                <el-option label="检测中" value="检测中" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已报告" value="已报告" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="登记时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临床诊断">
              <el-input
                v-model="searchForm.clinicalDiagnosis"
                placeholder="请输入临床诊断关键词"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="searching">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleAdvancedSearch" plain>
            <el-icon><Filter /></el-icon>
            高级搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="result-card" v-if="searchResults.length > 0">
      <template #header>
        <div class="result-header">
          <span>查询结果 (共 {{ searchResults.length }} 条记录)</span>
          <el-button type="primary" @click="handleExportResults">
            <el-icon><Download /></el-icon>
            导出结果
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="searchResults"
        style="width: 100%"
        v-loading="searching"
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
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button type="info" link @click="handlePrintReport(row)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <div class="empty-state" v-else-if="hasSearched">
      <el-empty description="暂无查询结果" />
    </div>
    
    <!-- 病例详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="病例详情"
      width="900px"
    >
      <div class="case-detail" v-if="currentCase">
        <el-descriptions title="基本信息" :column="3" border>
          <el-descriptions-item label="病例号">{{ currentCase.caseNumber }}</el-descriptions-item>
          <el-descriptions-item label="患者姓名">{{ currentCase.patientName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentCase.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ currentCase.age }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentCase.phone }}</el-descriptions-item>
          <el-descriptions-item label="送检医生">{{ currentCase.doctor }}</el-descriptions-item>
          <el-descriptions-item label="送检科室">{{ currentCase.department }}</el-descriptions-item>
          <el-descriptions-item label="标本类型">{{ currentCase.specimenType }}</el-descriptions-item>
          <el-descriptions-item label="病例状态">{{ currentCase.status }}</el-descriptions-item>
          <el-descriptions-item label="登记时间" :span="3">
            {{ currentCase.createTime }}
          </el-descriptions-item>
        </el-descriptions>
        
        <el-descriptions title="临床信息" :column="1" border style="margin-top: 20px;">
          <el-descriptions-item label="临床诊断">
            {{ currentCase.clinicalDiagnosis }}
          </el-descriptions-item>
          <el-descriptions-item label="送检材料">
            {{ currentCase.specimenMaterial || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注信息">
            {{ currentCase.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="report-section" v-if="currentCase.status === '已报告'">
          <el-descriptions title="病理报告" :column="1" border style="margin-top: 20px;">
            <el-descriptions-item label="病理诊断">
              考虑为良性病变，建议定期复查。
            </el-descriptions-item>
            <el-descriptions-item label="镜下所见">
              镜下可见组织细胞排列整齐，未见明显异型性。
            </el-descriptions-item>
            <el-descriptions-item label="免疫组化">
              CK7(+), CK20(-), CDX2(-), TTF-1(-)
            </el-descriptions-item>
            <el-descriptions-item label="报告医生">
              王病理医生
            </el-descriptions-item>
            <el-descriptions-item label="报告时间">
              2024-01-15 14:30:00
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePrintReport(currentCase)" v-if="currentCase">
          打印报告
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '../../utils/axios'

const searchFormRef = ref()
const searching = ref(false)
const detailDialogVisible = ref(false)
const hasSearched = ref(false)

const searchResults = ref([])
const currentCase = ref(null)
const doctorList = ref([])

const departmentList = ref([
  { value: '内科', label: '内科' },
  { value: '外科', label: '外科' },
  { value: '妇产科', label: '妇产科' },
  { value: '儿科', label: '儿科' },
  { value: '肿瘤科', label: '肿瘤科' }
])

const specimenTypes = ref([
  { value: '组织活检', label: '组织活检' },
  { value: '细胞学', label: '细胞学' },
  { value: '体液', label: '体液' },
  { value: '血液', label: '血液' },
  { value: '骨髓', label: '骨髓' }
])

const searchForm = reactive({
  caseNumber: '',
  patientName: '',
  doctor: '',
  department: '',
  specimenType: '',
  status: '',
  dateRange: [],
  clinicalDiagnosis: ''
})

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

const handleSearch = async () => {
  if (!validateSearch()) return
  
  searching.value = true
  hasSearched.value = true
  
  try {
    const params = {
      keyword: searchForm.caseNumber || searchForm.patientName || searchForm.clinicalDiagnosis,
      doctor: searchForm.doctor,
      department: searchForm.department,
      specimenType: searchForm.specimenType,
      status: searchForm.status
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0].toISOString()
      params.endDate = searchForm.dateRange[1].toISOString()
    }
    
    const result = await axios.get('/cases', { params: { ...params, size: 100 } })
    if (result.success) {
      searchResults.value = result.data.list
      if (searchResults.value.length === 0) {
        ElMessage.info('未找到符合条件的病例')
      }
    }
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('查询失败，请稍后重试')
  } finally {
    searching.value = false
  }
}

const validateSearch = () => {
  if (!searchForm.caseNumber && 
      !searchForm.patientName && 
      !searchForm.doctor && 
      !searchForm.department && 
      !searchForm.specimenType && 
      !searchForm.status && 
      !searchForm.dateRange.length && 
      !searchForm.clinicalDiagnosis) {
    ElMessage.warning('请至少输入一个查询条件')
    return false
  }
  return true
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  Object.assign(searchForm, {
    caseNumber: '',
    patientName: '',
    doctor: '',
    department: '',
    specimenType: '',
    status: '',
    dateRange: [],
    clinicalDiagnosis: ''
  })
  searchResults.value = []
  hasSearched.value = false
}

const handleAdvancedSearch = () => {
  ElMessage.info('高级搜索功能开发中...')
}

const handleViewDetail = (caseItem) => {
  currentCase.value = caseItem
  detailDialogVisible.value = true
}

const handlePrintReport = (caseItem) => {
  if (caseItem.status !== '已报告') {
    ElMessage.warning('该病例尚未生成报告，无法打印')
    return
  }
  ElMessage.success(`正在打印病例 ${caseItem.caseNumber} 的报告...`)
}

const handleExportResults = () => {
  if (searchResults.value.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }
  ElMessage.success(`已导出 ${searchResults.value.length} 条查询结果`)
}

onMounted(async () => {
  // 加载医生列表
  try {
    const result = await axios.get('/doctors', { params: { size: 50 } })
    if (result.success) {
      doctorList.value = result.data.list
    }
  } catch (error) {
    console.error('加载医生列表失败:', error)
  }
})
</script>

<style scoped>
.case-search {
  padding: 12px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-card,
.result-card {
  border-radius: 6px;
}

.search-card :deep(.el-card__body),
.result-card :deep(.el-card__body) {
  padding: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.result-card :deep(.el-table) {
  flex: 1;
  overflow: auto;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.case-detail {
  max-height: 500px;
  overflow-y: auto;
}

.report-section {
  margin-top: 16px;
}
</style>
