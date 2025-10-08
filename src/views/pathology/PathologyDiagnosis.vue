<template>
  <div class="pathology-diagnosis">
    <!-- 没有病例ID时显示选择病例界面 -->
    <div v-if="!currentCase" class="case-selection">
      <el-card class="selection-card">
        <template #header>
          <div class="selection-header">
            <h3>选择病例进行病理诊断</h3>
            <el-button type="primary" @click="goToCaseList">
              <el-icon><List /></el-icon>
              前往病例列表
            </el-button>
          </div>
        </template>
        
        <div class="selection-content">
          <el-empty description="请从病例列表中选择一个病例进行病理诊断">
            <template #description>
              <p>请从病例列表中选择一个病例进行病理诊断</p>
              <p>或者直接在下方搜索待诊断病例</p>
            </template>
          </el-empty>
          
          <div class="quick-search">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索待诊断病例（病例号、患者姓名）"
              style="width: 400px; margin: 20px 0;"
              clearable
              @keyup.enter="handleQuickSearch"
            >
              <template #append>
                <el-button @click="handleQuickSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          
          <el-table
            v-if="searchResults.length > 0"
            :data="searchResults"
            style="width: 100%"
            @row-click="handleCaseSelect"
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
                <el-button type="primary" link @click.stop="handleCaseSelect(row)">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    
    <!-- 有病例ID时显示诊断表单 -->
    <div v-else>
      <el-card class="form-card">
        <template #header>
          <div class="form-header">
            <h3>病理诊断报告 - {{ currentCase?.caseNumber }}</h3>
            <div class="form-actions">
              <el-button @click="handleBack">
                <el-icon><ArrowLeft /></el-icon>
                返回列表
              </el-button>
              <el-button type="primary" @click="handleSave" :loading="submitting">
                <el-icon><Check /></el-icon>
                保存记录
              </el-button>
              <el-button type="success" @click="handleComplete" :loading="submitting" v-if="!isCompleted">
                <el-icon><Finished /></el-icon>
                完成诊断
              </el-button>
              <el-button type="warning" @click="handlePrintReport" v-if="isCompleted">
                <el-icon><Printer /></el-icon>
                打印报告
              </el-button>
            </div>
          </div>
        </template>
        
        <el-form
          ref="diagnosisFormRef"
          :model="diagnosisForm"
          :rules="diagnosisRules"
          label-width="120px"
        >
          <!-- 病例基本信息 -->
          <el-descriptions title="病例基本信息" :column="2" border>
            <el-descriptions-item label="病例号">{{ currentCase?.caseNumber }}</el-descriptions-item>
            <el-descriptions-item label="患者姓名">{{ currentCase?.patientName }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ currentCase?.gender }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ currentCase?.age }}</el-descriptions-item>
            <el-descriptions-item label="送检科室">{{ currentCase?.department }}</el-descriptions-item>
            <el-descriptions-item label="标本类型">{{ currentCase?.specimenType }}</el-descriptions-item>
            <el-descriptions-item label="送检材料" :span="2">
              {{ currentCase?.specimenMaterial }}
            </el-descriptions-item>
            <el-descriptions-item label="临床诊断" :span="2">
              {{ currentCase?.clinicalDiagnosis }}
            </el-descriptions-item>
            <el-descriptions-item label="取材部位" :span="2">
              {{ currentCase?.collectionSite || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="取材描述" :span="2">
              {{ currentCase?.collectionDescription || '无' }}
            </el-descriptions-item>
          </el-descriptions>
          
          <el-divider content-position="left">病理诊断信息</el-divider>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="诊断时间" prop="diagnosisTime">
                <el-date-picker
                  v-model="diagnosisForm.diagnosisTime"
                  type="datetime"
                  placeholder="选择诊断时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="诊断医生" prop="diagnostician">
                <el-input
                  v-model="diagnosisForm.diagnostician"
                  placeholder="请输入诊断医生姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="诊断状态" prop="diagnosisStatus">
                <el-select
                  v-model="diagnosisForm.diagnosisStatus"
                  placeholder="请选择诊断状态"
                  style="width: 100%"
                >
                  <el-option label="待诊断" value="待诊断" />
                  <el-option label="诊断中" value="诊断中" />
                  <el-option label="已诊断" value="已诊断" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="镜下所见" prop="microscopicFindings">
            <el-input
              v-model="diagnosisForm.microscopicFindings"
              type="textarea"
              :rows="4"
              placeholder="请输入镜下所见描述"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="病理诊断" prop="pathologicalDiagnosis">
            <el-input
              v-model="diagnosisForm.pathologicalDiagnosis"
              type="textarea"
              :rows="4"
              placeholder="请输入病理诊断结果"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="免疫组化" prop="immunohistochemistry">
            <el-input
              v-model="diagnosisForm.immunohistochemistry"
              type="textarea"
              :rows="3"
              placeholder="请输入免疫组化结果"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="特殊染色" prop="specialStaining">
            <el-input
              v-model="diagnosisForm.specialStaining"
              type="textarea"
              :rows="3"
              placeholder="请输入特殊染色结果"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="分子检测" prop="molecularTesting">
            <el-input
              v-model="diagnosisForm.molecularTesting"
              type="textarea"
              :rows="3"
              placeholder="请输入分子检测结果"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="诊断意见" prop="diagnosisOpinion">
            <el-input
              v-model="diagnosisForm.diagnosisOpinion"
              type="textarea"
              :rows="3"
              placeholder="请输入诊断意见"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="diagnosisForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from '../../utils/axios'

const router = useRouter()
const route = useRoute()
const diagnosisFormRef = ref()
const submitting = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])

const currentCase = ref(null)
const isCompleted = ref(false)

const diagnosisForm = reactive({
  diagnosisTime: new Date(),
  diagnostician: '',
  diagnosisStatus: '待诊断',
  microscopicFindings: '',
  pathologicalDiagnosis: '',
  immunohistochemistry: '',
  specialStaining: '',
  molecularTesting: '',
  diagnosisOpinion: '',
  remark: ''
})

const diagnosisRules = {
  diagnostician: [
    { required: true, message: '请输入诊断医生姓名', trigger: 'blur' }
  ],
  microscopicFindings: [
    { required: true, message: '请输入镜下所见描述', trigger: 'blur' }
  ],
  pathologicalDiagnosis: [
    { required: true, message: '请输入病理诊断结果', trigger: 'blur' }
  ],
  diagnosisOpinion: [
    { required: true, message: '请输入诊断意见', trigger: 'blur' }
  ]
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

const goToCaseList = () => {
  router.push('/cases/list')
}

const handleQuickSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  try {
    const result = await axios.get('/cases', {
      params: {
        keyword: searchKeyword.value,
        status: '检测中',
        size: 20
      }
    })
    if (result.success) {
      searchResults.value = result.data.list
      if (searchResults.value.length === 0) {
        ElMessage.info('未找到符合条件的待诊断病例')
      }
    }
  } catch (error) {
    console.error('搜索失败:', error)
  }
}

const handleCaseSelect = (caseItem) => {
  currentCase.value = caseItem
  // 如果已有诊断记录，填充表单
  if (currentCase.value.diagnosisStatus) {
    Object.assign(diagnosisForm, {
      diagnosisTime: currentCase.value.diagnosisTime ? new Date(currentCase.value.diagnosisTime) : new Date(),
      diagnostician: currentCase.value.diagnostician || '',
      diagnosisStatus: currentCase.value.diagnosisStatus || '待诊断',
      microscopicFindings: currentCase.value.microscopicFindings || '',
      pathologicalDiagnosis: currentCase.value.pathologicalDiagnosis || '',
      immunohistochemistry: currentCase.value.immunohistochemistry || '',
      specialStaining: currentCase.value.specialStaining || '',
      molecularTesting: currentCase.value.molecularTesting || '',
      diagnosisOpinion: currentCase.value.diagnosisOpinion || '',
      remark: currentCase.value.remark || ''
    })
    isCompleted.value = currentCase.value.diagnosisStatus === '已诊断'
  }
}

const handleBack = () => {
  router.push('/cases/list')
}

const handleSave = async () => {
  if (!diagnosisFormRef.value) return
  
  try {
    await diagnosisFormRef.value.validate()
    submitting.value = true
    
    const result = await axios.put(`/cases/${currentCase.value.id}`, {
      ...diagnosisForm
    })
    
    if (result.success) {
      ElMessage.success('诊断记录保存成功')
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleComplete = async () => {
  if (!diagnosisFormRef.value) return
  
  try {
    await diagnosisFormRef.value.validate()
    submitting.value = true
    
    const result = await axios.put(`/cases/${currentCase.value.id}`, {
      ...diagnosisForm,
      diagnosisStatus: '已诊断'
    })
    
    if (result.success) {
      ElMessage.success('诊断完成')
      isCompleted.value = true
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    submitting.value = false
  }
}

const handlePrintReport = () => {
  ElMessage.success('正在打印病理诊断报告...')
}

const loadCaseData = async () => {
  const caseId = route.query.id
  if (caseId) {
    // 如果有URL参数，加载指定病例
    try {
      const result = await axios.get(`/cases/${caseId}`)
      if (result.success) {
        currentCase.value = result.data
        // 如果已有诊断记录，填充表单
        if (currentCase.value.diagnosisStatus) {
          Object.assign(diagnosisForm, {
            diagnosisTime: currentCase.value.diagnosisTime ? new Date(currentCase.value.diagnosisTime) : new Date(),
            diagnostician: currentCase.value.diagnostician || '',
            diagnosisStatus: currentCase.value.diagnosisStatus || '待诊断',
            microscopicFindings: currentCase.value.microscopicFindings || '',
            pathologicalDiagnosis: currentCase.value.pathologicalDiagnosis || '',
            immunohistochemistry: currentCase.value.immunohistochemistry || '',
            specialStaining: currentCase.value.specialStaining || '',
            molecularTesting: currentCase.value.molecularTesting || '',
            diagnosisOpinion: currentCase.value.diagnosisOpinion || '',
            remark: currentCase.value.remark || ''
          })
          isCompleted.value = currentCase.value.diagnosisStatus === '已诊断'
        }
      } else {
        ElMessage.error('加载病例数据失败')
      }
    } catch (error) {
      console.error('加载病例数据失败:', error)
      ElMessage.error('加载病例数据失败')
    }
  }
  // 如果没有URL参数，显示选择病例界面（不报错）
}

onMounted(() => {
  loadCaseData()
})
</script>

<style scoped>
.pathology-diagnosis {
  padding: 12px;
  height: 100%;
  overflow-y: auto;
}

.case-selection {
  height: 100%;
}

.selection-card {
  border-radius: 6px;
  height: 100%;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.selection-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
}

.quick-search {
  text-align: center;
}

.form-card {
  border-radius: 6px;
}

.form-card :deep(.el-card__body) {
  padding: 16px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.form-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.form-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-card :deep(.el-descriptions) {
  margin-bottom: 20px;
}

.form-card :deep(.el-divider) {
  margin: 20px 0;
}

.selection-card :deep(.el-table) {
  margin-top: 20px;
  cursor: pointer;
}

.selection-card :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
