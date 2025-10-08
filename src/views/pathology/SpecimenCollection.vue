<template>
  <div class="specimen-collection">
    <div class="layout-container">
      <!-- 左侧：取材表单 -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h3>病理取材记录</h3>
            <div class="header-actions">
              <el-button type="primary" @click="handleSave" :loading="submitting" size="small">
                保存记录
              </el-button>
              <el-button type="success" @click="handleComplete" :loading="submitting" size="small" v-if="currentCase && !isCompleted">
                完成取材
              </el-button>
              <el-button @click="handleReset" size="small">重置</el-button>
            </div>
          </div>

          <div v-if="!currentCase" class="no-case-selected">
            <el-empty description="请从右侧选择病例进行病理取材" :image-size="60" />
          </div>

          <div v-else>
            <!-- 病例基本信息（更紧凑） -->
            <div class="case-info-mini">
              <div class="info-row">
                <span class="info-label">病例号：</span>
                <span class="info-value">{{ currentCase.caseNumber }}</span>
                <span class="info-label">患者：</span>
                <span class="info-value">{{ currentCase.patientName }}</span>
                <span class="info-label">性别：</span>
                <span class="info-value">{{ currentCase.gender }}</span>
                <span class="info-label">年龄：</span>
                <span class="info-value">{{ currentCase.age }}岁</span>
              </div>
              <div class="info-row">
                <span class="info-label">科室：</span>
                <span class="info-value">{{ currentCase.department }}</span>
                <span class="info-label">诊断：</span>
                <span class="info-value truncate">{{ currentCase.clinicalDiagnosis }}</span>
              </div>
            </div>

            <el-divider />

              <!-- 取材信息表单 -->
              <el-form
                ref="collectionFormRef"
                :model="collectionForm"
                :rules="collectionRules"
                label-width="80px"
                size="small"
              >
                <el-form-item label="取材部位" prop="collectionSite" class="compact-form-item">
                  <el-input
                    v-model="collectionForm.collectionSite"
                    placeholder="取材部位"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>

              <!-- 标本显示 -->
              <div class="specimens-section">
                <div class="specimens-header">
                  <span class="section-title">标本列表</span>
                  <div class="specimens-actions">
                    <el-button type="primary" size="small" @click="addSpecimen">
                      <el-icon><Plus /></el-icon>
                      添加标本
                    </el-button>
                    <el-button type="danger" size="small" @click="removeLastSpecimen" :disabled="collectionForm.specimens.length <= 1">
                      <el-icon><Delete /></el-icon>
                      删除最后标本
                    </el-button>
                  </div>
                </div>
                
                <div class="specimens-tags">
                  <el-tag
                    v-for="(specimen, index) in collectionForm.specimens"
                    :key="index"
                    :type="currentSpecimenIndex === index ? 'primary' : 'info'"
                    size="large"
                    closable
                    :disable-transitions="false"
                    @close="removeSpecimen(index)"
                    @click="setCurrentSpecimen(index)"
                    class="specimen-tag"
                  >
                    标本 {{ index + 1 }}
                  </el-tag>
                </div>
              </div>

              <!-- 取材所见 -->
              <el-form-item label="取材所见" prop="collectionDescription" class="compact-form-item">
                <el-input
                  v-model="collectionForm.collectionDescription"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入取材所见，每个标本的描述用空行分隔"
                  maxlength="1000"
                  show-word-limit
                />
                <div class="description-hint">
                  <span>提示：每个标本的描述用空行分隔，会自动对应到上面的标本标签</span>
                </div>
              </el-form-item>

              <!-- 统一的材块列表 -->
              <div class="blocks-section">
                <div class="blocks-header">
                  <span class="section-title">材块列表</span>
                  <div class="blocks-actions">
                    <el-button type="primary" size="small" @click="addBlock">
                      <el-icon><Plus /></el-icon>
                      添加材块
                    </el-button>
                    <el-button type="success" size="small" @click="batchAddBlocks">
                      <el-icon><DocumentAdd /></el-icon>
                      批量添加
                    </el-button>
                  </div>
                </div>

                <!-- 预备数据输入区域 -->
                <div class="preparation-section">
                  <div class="preparation-header">
                    <span class="preparation-title">新材块预备数据</span>
                  </div>
                  <div class="preparation-form">
                    <el-row :gutter="8">
                      <el-col :span="6">
                        <el-form-item label="取材时间" class="compact-form-item">
                          <el-date-picker
                            v-model="collectionForm.collectionTime"
                            type="datetime"
                            placeholder="选择取材时间"
                            style="width: 100%"
                            size="small"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="取材医生" class="compact-form-item">
                          <el-input
                            v-model="collectionForm.collector"
                            placeholder="取材医生"
                            size="small"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="记录医生" class="compact-form-item">
                          <el-input
                            v-model="collectionForm.recorder"
                            placeholder="记录医生"
                            size="small"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="备注信息" class="compact-form-item">
                          <el-input
                            v-model="collectionForm.remark"
                            placeholder="备注信息"
                            size="small"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                
                <div class="blocks-table">
                  <div class="blocks-table-header">
                    <div class="block-col-number">序号</div>
                    <div class="block-col-code">编号</div>
                    <div class="block-col-name">名称</div>
                    <div class="block-col-description">描述</div>
                    <div class="block-col-time">时间</div>
                    <div class="block-col-specimen">所属标本</div>
                    <div class="block-col-type">特殊处理</div>
                    <div class="block-col-doctor">取材医生</div>
                    <div class="block-col-recorder">记录人</div>
                    <div class="block-col-actions">操作</div>
                  </div>
                  <div class="blocks-table-body">
                    <div v-for="(block, blockIndex) in collectionForm.blocks" :key="blockIndex" class="blocks-table-row">
                      <div class="block-col-number">{{ blockIndex + 1 }}</div>
                      <div class="block-col-code">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].code`"
                          :rules="blockRules.code"
                          class="compact-form-item"
                        >
                          <el-input
                            v-model="block.code"
                            placeholder="编号"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-name">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].name`"
                          :rules="blockRules.name"
                          class="compact-form-item"
                        >
                          <el-input
                            v-model="block.name"
                            placeholder="名称"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-description">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].description`"
                          :rules="blockRules.description"
                          class="compact-form-item"
                        >
                          <el-input
                            v-model="block.description"
                            placeholder="描述"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-time">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].time`"
                          :rules="blockRules.time"
                          class="compact-form-item"
                        >
                          <el-date-picker
                            v-model="block.time"
                            type="datetime"
                            placeholder="时间"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-specimen">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].specimenIndex`"
                          :rules="blockRules.specimenIndex"
                          class="compact-form-item"
                        >
                          <el-select
                            v-model="block.specimenIndex"
                            placeholder="选择标本"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="(specimen, index) in collectionForm.specimens"
                              :key="index"
                              :label="`标本 ${index + 1}`"
                              :value="index"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class="block-col-type">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].specialType`"
                          class="compact-form-item"
                        >
                          <DictSelect
                            v-model="block.specialType"
                            dict-code="special_treatment"
                            placeholder="特殊处理"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-doctor">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].doctor`"
                          :rules="blockRules.doctor"
                          class="compact-form-item"
                        >
                          <el-input
                            v-model="block.doctor"
                            placeholder="取材医生"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-recorder">
                        <el-form-item 
                          :prop="`blocks[${blockIndex}].recorder`"
                          :rules="blockRules.recorder"
                          class="compact-form-item"
                        >
                          <el-input
                            v-model="block.recorder"
                            placeholder="记录人"
                          />
                        </el-form-item>
                      </div>
                      <div class="block-col-actions">
                        <el-button
                          type="danger"
                          size="small"
                          text
                          @click="removeBlock(blockIndex)"
                        >
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <el-form-item label="备注信息" prop="remark" class="compact-form-item">
                <el-input
                  v-model="collectionForm.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="备注信息"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!-- 右侧：待取材病例列表 -->
      <div class="history-section">
        <CaseHistoryList
          :case-list="pendingCases"
          :current-case-id="currentCase?.id"
          @case-click="handleCaseSelect"
        />
      </div>
    </div>

    <!-- 标本弹框 -->
    <el-dialog
      v-model="specimenDialogVisible"
      title="添加标本"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="specimenFormRef"
        :model="specimenForm"
        :rules="specimenFormRules"
        label-width="80px"
      >
        <el-form-item label="标本类型" prop="type">
          <DictSelect
            v-model="specimenForm.type"
            dict-code="specimen_type"
            placeholder="请选择标本类型"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="取材部位" prop="location">
          <el-input
            v-model="specimenForm.location"
            placeholder="请输入取材部位"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标本大小" prop="size">
          <el-input
            v-model="specimenForm.size"
            placeholder="请输入标本大小"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标本重量" prop="weight">
          <el-input
            v-model="specimenForm.weight"
            placeholder="请输入标本重量"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标本描述" prop="description">
          <el-input
            v-model="specimenForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标本描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="specimenDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddSpecimen">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, DocumentAdd } from '@element-plus/icons-vue'
import axios from '../../utils/axios'
import CaseHistoryList from '../../components/CaseHistoryList.vue'
import DictSelect from '../../components/DictSelect.vue'

const router = useRouter()
const route = useRoute()
const collectionFormRef = ref()
const submitting = ref(false)

const currentCase = ref(null)
const isCompleted = ref(false)
const pendingCases = ref([])
const currentSpecimenIndex = ref(0)
const specimenDialogVisible = ref(false)
const specimenFormRef = ref()
const specimenForm = reactive({
  type: '',
  description: '',
  location: '',
  size: '',
  weight: ''
})

const collectionForm = reactive({
  collectionTime: new Date(),
  collector: '',
  recorder: '',
  collectionSite: '',
  collectionStatus: '待取材',
  collectionDescription: '',
  remark: '',
  specimens: [
    {
      type: '',
      description: '',
      location: '',
      size: '',
      weight: ''
    }
  ],
  blocks: [
    {
      code: '',
      name: '',
      description: '',
      time: new Date(),
      specimenIndex: 0,
      specialType: '',
      doctor: '',
      recorder: ''
    }
  ]
})

const collectionRules = {
  collector: [
    { required: true, message: '请输入取材医生', trigger: 'blur' }
  ],
  recorder: [
    { required: true, message: '请输入记录医生', trigger: 'blur' }
  ],
  collectionSite: [
    { required: true, message: '请输入取材部位', trigger: 'blur' }
  ]
}

const specimenRules = {
  type: [
    { required: true, message: '请选择标本类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入取材所见', trigger: 'blur' }
  ]
}

const blockRules = {
  code: [
    { required: true, message: '请输入编号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择时间', trigger: 'change' }
  ],
  specimenIndex: [
    { required: true, message: '请选择所属标本', trigger: 'change' }
  ],
  doctor: [
    { required: true, message: '请输入取材医生', trigger: 'blur' }
  ],
  recorder: [
    { required: true, message: '请输入记录人', trigger: 'blur' }
  ]
}

const specimenFormRules = {
  type: [
    { required: true, message: '请选择标本类型', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入取材部位', trigger: 'blur' }
  ],
  size: [
    { required: true, message: '请输入标本大小', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入标本重量', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入标本描述', trigger: 'blur' }
  ]
}

// 计算属性：过滤待取材病例
const filteredPendingCases = computed(() => {
  return pendingCases.value.filter(caseItem => 
    caseItem.status === '已接收' || caseItem.collectionStatus === '待取材' || caseItem.collectionStatus === '取材中'
  )
})

// 选择病例
const handleCaseSelect = (caseItem) => {
  currentCase.value = caseItem
  // 如果已有取材记录，填充表单
  if (currentCase.value.collectionStatus) {
    Object.assign(collectionForm, {
      collectionTime: currentCase.value.collectionTime ? new Date(currentCase.value.collectionTime) : new Date(),
      collector: currentCase.value.collector || '',
      recorder: currentCase.value.recorder || '',
      collectionSite: currentCase.value.collectionSite || '',
      collectionStatus: currentCase.value.collectionStatus || '待取材',
      remark: currentCase.value.remark || '',
      specimens: currentCase.value.specimens || [
        {
          type: '',
          description: ''
        }
      ],
      blocks: currentCase.value.blocks || [
        {
          code: '',
          name: '',
          description: '',
          time: new Date(),
          specimenIndex: 0,
          specialType: '',
          doctor: '',
          recorder: ''
        }
      ]
    })
    isCompleted.value = currentCase.value.collectionStatus === '已完成'
  } else {
    // 重置表单为新记录
    Object.assign(collectionForm, {
      collectionTime: new Date(),
      collector: '',
      recorder: '',
      collectionSite: '',
      collectionStatus: '待取材',
      remark: '',
      specimens: [
        {
          type: '',
          description: ''
        }
      ],
      blocks: [
        {
          code: '',
          name: '',
          description: '',
          time: new Date(),
          specimenIndex: 0,
          specialType: '',
          doctor: '',
          recorder: ''
        }
      ]
    })
    isCompleted.value = false
  }
}

// 设置当前标本
const setCurrentSpecimen = (index) => {
  currentSpecimenIndex.value = index
}

// 添加标本
const addSpecimen = () => {
  // 重置标本表单
  Object.assign(specimenForm, {
    type: '',
    description: '',
    location: '',
    size: '',
    weight: ''
  })
  specimenDialogVisible.value = true
}

// 确认添加标本
const confirmAddSpecimen = async () => {
  if (!specimenFormRef.value) return
  
  try {
    await specimenFormRef.value.validate()
    
    // 添加标本到列表
    collectionForm.specimens.push({
      type: specimenForm.type,
      description: specimenForm.description,
      location: specimenForm.location,
      size: specimenForm.size,
      weight: specimenForm.weight
    })
    
    specimenDialogVisible.value = false
    ElMessage.success('标本添加成功')
  } catch (error) {
    // 验证失败
  }
}

// 删除标本
const removeSpecimen = (specimenIndex) => {
  if (collectionForm.specimens.length > 1) {
    collectionForm.specimens.splice(specimenIndex, 1)
    // 如果删除的是当前选中的标本，切换到第一个标本
    if (currentSpecimenIndex.value === specimenIndex) {
      currentSpecimenIndex.value = 0
    }
  }
}

// 删除最后标本
const removeLastSpecimen = () => {
  if (collectionForm.specimens.length > 1) {
    const lastIndex = collectionForm.specimens.length - 1
    collectionForm.specimens.splice(lastIndex, 1)
    // 如果删除的是当前选中的标本，切换到第一个标本
    if (currentSpecimenIndex.value === lastIndex) {
      currentSpecimenIndex.value = 0
    }
  }
}

// 添加材块
const addBlock = () => {
  collectionForm.blocks.push({
    code: '',
    name: '',
    description: '',
    time: collectionForm.collectionTime || new Date(),
    specimenIndex: 0,
    specialType: '',
    doctor: collectionForm.collector || '',
    recorder: collectionForm.recorder || ''
  })
}

// 批量添加材块
const batchAddBlocks = async () => {
  try {
    const { value: count } = await ElMessageBox.prompt('请输入要添加的材块数量', '批量添加', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[1-9]\d*$/,
      inputErrorMessage: '请输入有效的数字'
    })
    
    const blockCount = parseInt(count)
    for (let i = 0; i < blockCount; i++) {
      collectionForm.blocks.push({
        code: '',
        name: '',
        description: '',
        time: new Date(),
        specimenIndex: 0,
        specialType: '',
        doctor: '',
        recorder: ''
      })
    }
    
    ElMessage.success(`成功添加 ${blockCount} 个材块`)
  } catch (error) {
    // 用户取消操作
  }
}

// 删除材块
const removeBlock = (blockIndex) => {
  if (collectionForm.blocks.length > 1) {
    collectionForm.blocks.splice(blockIndex, 1)
  }
}

// 重置表单
const handleReset = () => {
  if (collectionFormRef.value) {
    collectionFormRef.value.resetFields()
  }
  if (currentCase.value) {
    Object.assign(collectionForm, {
      collectionTime: new Date(),
      collector: '',
      recorder: '',
      collectionSite: '',
      collectionStatus: '待取材',
      remark: '',
      specimens: [
        {
          type: '',
          description: ''
        }
      ],
      blocks: [
        {
          code: '',
          name: '',
          description: '',
          time: new Date(),
          specimenIndex: 0,
          specialType: '',
          doctor: '',
          recorder: ''
        }
      ]
    })
  }
}

// 保存记录
const handleSave = async () => {
  if (!currentCase.value) {
    ElMessage.warning('请先选择病例')
    return
  }
  
  if (!collectionFormRef.value) return
  
  try {
    await collectionFormRef.value.validate()
    submitting.value = true
    
    const result = await axios.put(`/cases/${currentCase.value.id}`, {
      ...collectionForm
    })
    
    if (result.success) {
      ElMessage.success('取材记录保存成功')
      // 重新加载病例列表
      loadPendingCases()
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    submitting.value = false
  }
}

// 完成取材
const handleComplete = async () => {
  if (!currentCase.value) {
    ElMessage.warning('请先选择病例')
    return
  }
  
  if (!collectionFormRef.value) return
  
  try {
    await collectionFormRef.value.validate()
    submitting.value = true
    
    const result = await axios.put(`/cases/${currentCase.value.id}`, {
      ...collectionForm,
      collectionStatus: '已完成'
    })
    
    if (result.success) {
      ElMessage.success('取材完成')
      isCompleted.value = true
      // 重新加载病例列表
      loadPendingCases()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    submitting.value = false
  }
}

// 加载待取材病例
const loadPendingCases = async () => {
  try {
    const result = await axios.get('/cases', {
      params: {
        size: 50,
        status: '已接收'
      }
    })
    if (result.success) {
      pendingCases.value = result.data.list
    }
  } catch (error) {
    console.error('加载待取材病例失败:', error)
  }
}

// 加载指定病例数据
const loadCaseData = async () => {
  const caseId = route.query.id
  if (caseId) {
    try {
      const result = await axios.get(`/cases/${caseId}`)
      if (result.success) {
        handleCaseSelect(result.data)
      } else {
        ElMessage.error('加载病例数据失败')
      }
    } catch (error) {
      console.error('加载病例数据失败:', error)
      ElMessage.error('加载病例数据失败')
    }
  }
}

onMounted(() => {
  loadPendingCases()
  loadCaseData()
})
</script>

<style scoped>
.specimen-collection {
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

.form-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.form-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.no-case-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
}

/* 更紧凑的病人信息布局 */
.case-info-mini {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 8px 16px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 1.5;
}

.info-row:first-child {
  margin-bottom: 4px;
}

.info-label {
  font-weight: 600;
  color: #495057;
  margin-right: 4px;
}

.info-value {
  color: #6c757d;
  margin-right: 16px;
  min-width: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* 表单内容区域 */
.form-container > div:last-child {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 紧凑表单样式 */
.compact-form-item {
  margin-bottom: 12px;
  width: 100%;
}

.compact-form-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.compact-form-item :deep(.el-form-item__error) {
  padding-top: 2px;
  font-size: 12px;
}

:deep(.el-divider) {
  margin: 12px 0;
}

/* 标本列表样式 */
.specimens-section {
  margin: 16px 0;
}

.specimens-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.specimens-actions {
  display: flex;
  gap: 8px;
}

.specimens-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.specimen-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.specimen-tag:hover {
  transform: scale(1.05);
}

.description-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

/* 材块列表样式 */
.blocks-section {
  margin-top: 12px;
}

.blocks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.blocks-title {
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.blocks-actions {
  display: flex;
  gap: 8px;
}

.blocks-table {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.blocks-table-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.blocks-table-header > div {
  padding: 6px 4px;
  font-weight: 600;
  font-size: 11px;
  color: #606266;
  border-right: 1px solid #e8e8e8;
  text-align: center;
}

.blocks-table-header > div:last-child {
  border-right: none;
}

.blocks-table-body {
  background-color: white;
}

.blocks-table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.blocks-table-row:last-child {
  border-bottom: none;
}

.blocks-table-row > div {
  padding: 4px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.blocks-table-row > div:last-child {
  border-right: none;
}

/* 列宽定义 */
.block-col-number {
  width: 40px;
  justify-content: center;
  font-weight: 500;
  color: #909399;
  font-size: 11px;
}

.block-col-code {
  width: 80px;
}

.block-col-name {
  width: 100px;
}

.block-col-description {
  width: 120px;
}

.block-col-time {
  width: 120px;
}

.block-col-specimen {
  width: 100px;
}

.block-col-type {
  width: 100px;
}

.block-col-doctor {
  width: 100px;
}

.block-col-recorder {
  width: 100px;
}

.block-col-actions {
  width: 50px;
  justify-content: center;
}

/* 预备数据区域样式 */
.preparation-section {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: #fafafa;
}

.preparation-header {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.preparation-title {
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.preparation-form {
  padding: 12px;
}

.preparation-form .compact-form-item {
  margin-bottom: 8px;
}

.preparation-form .compact-form-item :deep(.el-form-item__label) {
  font-size: 12px;
  padding-right: 4px;
}

/* 紧凑表单在表格中的样式 */
.blocks-table-row .compact-form-item {
  margin-bottom: 0;
}

.blocks-table-row .compact-form-item :deep(.el-form-item__content) {
  line-height: 1;
}

.blocks-table-row .compact-form-item :deep(.el-input) {
  font-size: 11px;
}

.blocks-table-row .compact-form-item :deep(.el-date-editor) {
  font-size: 11px;
}
</style>
