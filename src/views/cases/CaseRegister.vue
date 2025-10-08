<template>
  <div class="case-register">
    <div class="layout-container">
      <!-- 左侧：登记表单 -->
      <div class="form-section">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>病例登记</span>
              <div class="header-actions">
                <el-button type="primary" @click="handleSubmit" :loading="submitting">
                  保存
                </el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </div>
          </template>

          <el-form
            ref="caseFormRef"
            :model="caseForm"
            :rules="caseRules"
            label-width="100px"
          >
            <!-- 第一块：基本信息 -->
            <div class="form-section-block">
              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="病理号" prop="pathologyNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.pathologyNo"
                      placeholder="病理号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请号" prop="applicationNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.applicationNo"
                      placeholder="申请号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="冰冻号" prop="frozenNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.frozenNo"
                      placeholder="冰冻号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="登记号" prop="registrationNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.registrationNo"
                      placeholder="登记号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="医嘱号" prop="medicalOrderNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.medicalOrderNo"
                      placeholder="医嘱号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="姓名" prop="patientName" class="compact-form-item">
                    <el-input
                      v-model="caseForm.patientName"
                      placeholder="患者姓名"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="性别" prop="gender" class="compact-form-item">
                    <DictSelect
                      v-model="caseForm.gender"
                      dict-code="gender"
                      placeholder="性别"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="年龄" prop="age" class="compact-form-item">
                    <el-input-number
                      v-model="caseForm.age"
                      :min="0"
                      :max="120"
                      placeholder="年龄"
                      size="small"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="婚否" prop="maritalStatus" class="compact-form-item">
                    <DictSelect
                      v-model="caseForm.maritalStatus"
                      dict-code="marital_status"
                      placeholder="婚否"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="职业" prop="occupation" class="compact-form-item">
                    <el-input
                      v-model="caseForm.occupation"
                      placeholder="职业"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="身份证" prop="idCard" class="compact-form-item">
                    <el-input
                      v-model="caseForm.idCard"
                      placeholder="身份证号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="民族" prop="ethnicity" class="compact-form-item">
                    <el-input
                      v-model="caseForm.ethnicity"
                      placeholder="民族"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="籍贯" prop="nativePlace" class="compact-form-item">
                    <el-input
                      v-model="caseForm.nativePlace"
                      placeholder="籍贯"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联系电话" prop="phone" class="compact-form-item">
                    <el-input
                      v-model="caseForm.phone"
                      placeholder="联系电话"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="家庭住址" prop="address" class="compact-form-item">
                    <el-input
                      v-model="caseForm.address"
                      placeholder="家庭住址"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="送检医院" prop="hospital" class="compact-form-item">
                    <el-input
                      v-model="caseForm.hospital"
                      placeholder="送检医院"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="送检科室" prop="department" class="compact-form-item">
                    <DictSelect
                      v-model="caseForm.department"
                      dict-code="department"
                      placeholder="送检科室"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="送检医生" prop="doctor" class="compact-form-item">
                    <el-select
                      v-model="caseForm.doctor"
                      placeholder="送检医生"
                      filterable
                      size="small"
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
                <el-col :span="6">
                  <el-form-item label="就诊类型" prop="visitType" class="compact-form-item">
                    <DictSelect
                      v-model="caseForm.visitType"
                      dict-code="visit_type"
                      placeholder="就诊类型"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="门诊号" prop="outpatientNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.outpatientNo"
                      placeholder="门诊号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="病区" prop="ward" class="compact-form-item">
                    <el-input
                      v-model="caseForm.ward"
                      placeholder="病区"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="床号" prop="bedNo" class="compact-form-item">
                    <el-input
                      v-model="caseForm.bedNo"
                      placeholder="床号"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="费别" prop="feeType" class="compact-form-item">
                    <DictSelect
                      v-model="caseForm.feeType"
                      dict-code="fee_type"
                      placeholder="费别"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-divider />

            <!-- 第二块：标本信息（支持多个） -->
            <div class="form-section-block">
              <div class="specimen-header">
                <el-button type="primary" size="small" @click="addSpecimen">
                  <el-icon><Plus /></el-icon>
                  添加标本
                </el-button>
              </div>

              <div class="specimen-table">
                <div class="specimen-table-header">
                  <div class="specimen-col-number">序号</div>
                  <div class="specimen-col-type">标本类型</div>
                  <div class="specimen-col-location">取材部位</div>
                  <div class="specimen-col-description">标本描述</div>
                  <div class="specimen-col-actions">操作</div>
                </div>
                <div class="specimen-table-body">
                  <div v-for="(specimen, index) in caseForm.specimens" :key="index" class="specimen-table-row">
                    <div class="specimen-col-number">{{ index + 1 }}</div>
                    <div class="specimen-col-type">
                      <el-form-item 
                        :prop="`specimens[${index}].type`"
                        :rules="specimenRules.type"
                        class="compact-form-item"
                      >
                        <DictSelect
                          v-model="specimen.type"
                          dict-code="specimen_type"
                          placeholder="选择类型"
                          style="width: 100%"
                        />
                      </el-form-item>
                    </div>
                    <div class="specimen-col-location">
                      <el-form-item 
                        :prop="`specimens[${index}].location`"
                        :rules="specimenRules.location"
                        class="compact-form-item"
                      >
                        <el-input
                          v-model="specimen.location"
                          placeholder="取材部位"
                          size="small"
                        />
                      </el-form-item>
                    </div>
                    <div class="specimen-col-description">
                      <el-form-item 
                        :prop="`specimens[${index}].description`"
                        :rules="specimenRules.description"
                        class="compact-form-item"
                      >
                        <el-input
                          v-model="specimen.description"
                          placeholder="标本描述"
                          size="small"
                        />
                      </el-form-item>
                    </div>
                    <div class="specimen-col-actions">
                      <el-button
                        v-if="caseForm.specimens.length > 1"
                        type="danger"
                        size="small"
                        text
                        @click="removeSpecimen(index)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <el-divider />

            <!-- 第三块：临床相关信息 -->
            <div class="form-section-block">
              <el-form-item label="临床诊断" prop="clinicalDiagnosis">
                <el-input
                  v-model="caseForm.clinicalDiagnosis"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入临床诊断"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="手术方式" prop="surgeryMethod">
                <el-input
                  v-model="caseForm.surgeryMethod"
                  placeholder="请输入手术方式"
                />
              </el-form-item>

              <el-form-item label="备注信息" prop="remark">
                <el-input
                  v-model="caseForm.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注信息"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </div>

      <!-- 右侧：历史登记列表 -->
      <div class="history-section">
        <CaseHistoryList
          :case-list="historyList"
          :current-case-id="currentCaseId"
          @case-click="handleCaseClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '../../utils/axios'
import CaseHistoryList from '../../components/CaseHistoryList.vue'
import DictSelect from '../../components/DictSelect.vue'

const caseFormRef = ref()
const submitting = ref(false)
const currentCaseId = ref(null)
const historyList = ref([])

// 处理病例点击事件
const handleCaseClick = (caseItem) => {
  loadCase(caseItem.id)
}

const caseForm = reactive({
  // 基本信息
  pathologyNo: '',
  applicationNo: '',
  frozenNo: '',
  registrationNo: '',
  medicalOrderNo: '',
  patientName: '',
  gender: '男',
  age: null,
  maritalStatus: '',
  occupation: '',
  idCard: '',
  ethnicity: '',
  nativePlace: '',
  phone: '',
  address: '',
  hospital: '',
  department: '',
  doctor: '',
  visitType: '',
  outpatientNo: '',
  ward: '',
  bedNo: '',
  feeType: '',
  
  // 临床信息
  clinicalDiagnosis: '',
  surgeryMethod: '',
  remark: '',
  
  // 标本信息
  specimens: [
    {
      type: '',
      location: '',
      description: ''
    }
  ]
})

const doctorList = ref([])

const caseRules = {
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  doctor: [
    { required: true, message: '请选择送检医生', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择送检科室', trigger: 'change' }
  ],
  clinicalDiagnosis: [
    { required: true, message: '请输入临床诊断', trigger: 'blur' }
  ]
}

const specimenRules = {
  type: [
    { required: true, message: '请选择标本类型', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入取材部位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入标本描述', trigger: 'blur' }
  ]
}

// 添加标本
const addSpecimen = () => {
  caseForm.specimens.push({
    type: '',
    location: '',
    description: ''
  })
}

// 删除标本
const removeSpecimen = (index) => {
  if (caseForm.specimens.length > 1) {
    caseForm.specimens.splice(index, 1)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!caseFormRef.value) return
  
  try {
    await caseFormRef.value.validate()
    submitting.value = true
    
    const submitData = {
      ...caseForm,
      status: '已登记'
    }
    
    let result
    if (currentCaseId.value) {
      // 更新现有病例
      result = await axios.put(`/cases/${currentCaseId.value}`, submitData)
    } else {
      // 新增病例
      result = await axios.post('/cases', submitData)
    }
    
    if (result.success) {
      ElMessage.success(currentCaseId.value ? '病例更新成功' : '病例登记成功')
      if (!currentCaseId.value) {
        handleReset()
      }
      loadHistoryList()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  caseFormRef.value?.resetFields()
  Object.assign(caseForm, {
    pathologyNo: '',
    applicationNo: '',
    frozenNo: '',
    registrationNo: '',
    medicalOrderNo: '',
    patientName: '',
    gender: '男',
    age: null,
    maritalStatus: '',
    occupation: '',
    idCard: '',
    ethnicity: '',
    nativePlace: '',
    phone: '',
    address: '',
    hospital: '',
    department: '',
    doctor: '',
    visitType: '',
    outpatientNo: '',
    ward: '',
    bedNo: '',
    feeType: '',
    clinicalDiagnosis: '',
    surgeryMethod: '',
    remark: '',
    specimens: [
      {
        type: '',
        location: '',
        description: ''
      }
    ]
  })
  currentCaseId.value = null
}

// 加载病例
const loadCase = async (caseId) => {
  try {
    const result = await axios.get(`/cases/${caseId}`)
    if (result.success) {
      const caseData = result.data
      Object.assign(caseForm, {
        pathologyNo: caseData.pathologyNo || '',
        applicationNo: caseData.applicationNo || '',
        frozenNo: caseData.frozenNo || '',
        registrationNo: caseData.registrationNo || '',
        medicalOrderNo: caseData.medicalOrderNo || '',
        patientName: caseData.patientName || '',
        gender: caseData.gender || '男',
        age: caseData.age || null,
        maritalStatus: caseData.maritalStatus || '',
        occupation: caseData.occupation || '',
        idCard: caseData.idCard || '',
        ethnicity: caseData.ethnicity || '',
        nativePlace: caseData.nativePlace || '',
        phone: caseData.phone || '',
        address: caseData.address || '',
        hospital: caseData.hospital || '',
        department: caseData.department || '',
        doctor: caseData.doctor || '',
        visitType: caseData.visitType || '',
        outpatientNo: caseData.outpatientNo || '',
        ward: caseData.ward || '',
        bedNo: caseData.bedNo || '',
        feeType: caseData.feeType || '',
        clinicalDiagnosis: caseData.clinicalDiagnosis || '',
        surgeryMethod: caseData.surgeryMethod || '',
        remark: caseData.remark || '',
        specimens: caseData.specimens || [
          {
            type: '',
            location: '',
            description: ''
          }
        ]
      })
      currentCaseId.value = caseId
    }
  } catch (error) {
    console.error('加载病例失败:', error)
    ElMessage.error('加载病例失败')
  }
}


// 加载历史列表
const loadHistoryList = async () => {
  try {
    const result = await axios.get('/cases', { params: { size: 50 } })
    if (result.success) {
      historyList.value = result.data.list
    }
  } catch (error) {
    console.error('加载历史列表失败:', error)
  }
}


onMounted(async () => {
  // 加载医生列表
  try {
    const result = await axios.get('/doctors')
    if (result.success) {
      doctorList.value = result.data.list
    }
  } catch (error) {
    console.error('加载医生列表失败:', error)
  }
  
  // 加载历史列表
  loadHistoryList()
})
</script>

<style scoped>
.case-register {
  padding: 12px;
  height: 100%;
  overflow: hidden;
}

.layout-container {
  display: flex;
  gap: 16px;
  height: 100%;
}

.form-section {
  flex: 1;
  min-width: 0;
}

.history-section {
  width: 480px;
  flex-shrink: 0;
}

.form-card, .history-card {
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.history-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-section-block {
  margin-bottom: 24px;
}

.form-section-block:last-child {
  margin-bottom: 0;
}

:deep(.el-divider) {
  margin: 24px 0;
}

/* 标本表格样式 */
.specimen-header {
  margin-bottom: 12px;
}

.specimen-table {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.specimen-table-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.specimen-table-header > div {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 13px;
  color: #606266;
  border-right: 1px solid #e8e8e8;
}

.specimen-table-header > div:last-child {
  border-right: none;
}

.specimen-table-body {
  background-color: white;
}

.specimen-table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.specimen-table-row:last-child {
  border-bottom: none;
}

.specimen-table-row > div {
  padding: 8px 12px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.specimen-table-row > div:last-child {
  border-right: none;
}

/* 列宽定义 */
.specimen-col-number {
  width: 60px;
  justify-content: center;
  font-weight: 500;
  color: #909399;
}

.specimen-col-type {
  width: 180px;
}

.specimen-col-location {
  width: 180px;
}

.specimen-col-description {
  flex: 1;
}

.specimen-col-actions {
  width: 80px;
  justify-content: center;
}

.compact-form-item {
  margin-bottom: 0;
  width: 100%;
}

.compact-form-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.compact-form-item :deep(.el-form-item__error) {
  padding-top: 2px;
}

</style>
