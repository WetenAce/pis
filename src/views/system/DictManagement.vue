<template>
  <div class="dict-management">
    <div class="page-header">
      <h2>字典管理</h2>
      <p>管理系统中的字典数据</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="dict-type-card">
          <template #header>
            <div class="dict-type-header">
              <span>字典类型</span>
              <el-button type="primary" size="small" @click="handleAddType">
                <el-icon><Plus /></el-icon>
                新增
              </el-button>
            </div>
          </template>
          
          <div class="dict-type-list">
            <div
              v-for="type in dictTypes"
              :key="type.id"
              :class="['dict-type-item', { active: activeType?.id === type.id }]"
              @click="handleTypeSelect(type)"
            >
              <div class="type-info">
                <div class="type-name">{{ type.name }}</div>
                <div class="type-code">{{ type.code }}</div>
              </div>
              <div class="type-actions">
                <el-button type="primary" link @click.stop="handleEditType(type)">
                  编辑
                </el-button>
                <el-button type="danger" link @click.stop="handleDeleteType(type)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-card class="dict-data-card">
          <template #header>
            <div class="dict-data-header">
              <span v-if="activeType">字典数据 - {{ activeType.name }}</span>
              <span v-else>请选择字典类型</span>
              <div class="header-actions" v-if="activeType">
                <el-button type="primary" @click="handleAddData">
                  <el-icon><Plus /></el-icon>
                  新增数据
                </el-button>
                <el-button @click="handleRefresh">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          
          <el-table
            :data="dictDataList"
            v-loading="dataLoading"
            style="width: 100%"
            v-if="activeType"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="label" label="标签" min-width="120" />
            <el-table-column prop="value" label="值" min-width="120" />
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditData(row)">
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  @click="handleDeleteData(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="empty-state" v-else>
            <el-empty description="请选择左侧的字典类型查看数据" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 字典类型对话框 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="typeDialogTitle"
      width="500px"
    >
      <el-form
        ref="typeFormRef"
        :model="typeForm"
        :rules="typeRules"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="typeForm.name"
            placeholder="请输入字典类型名称"
          />
        </el-form-item>
        
        <el-form-item label="类型编码" prop="code">
          <el-input
            v-model="typeForm.code"
            placeholder="请输入字典类型编码"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="typeForm.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="typeForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTypeSubmit" :loading="typeSubmitting">
          确认
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 字典数据对话框 -->
    <el-dialog
      v-model="dataDialogVisible"
      :title="dataDialogTitle"
      width="500px"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRules"
        label-width="100px"
      >
        <el-form-item label="标签" prop="label">
          <el-input
            v-model="dataForm.label"
            placeholder="请输入字典标签"
          />
        </el-form-item>
        
        <el-form-item label="值" prop="value">
          <el-input
            v-model="dataForm.value"
            placeholder="请输入字典值"
          />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="dataForm.sort"
            :min="0"
            :max="999"
            placeholder="请输入排序号"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dataDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDataSubmit" :loading="dataSubmitting">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from '../../utils/axios'

const typeFormRef = ref()
const dataFormRef = ref()
const typeDialogVisible = ref(false)
const dataDialogVisible = ref(false)
const typeSubmitting = ref(false)
const dataSubmitting = ref(false)
const dataLoading = ref(false)

const dictTypes = ref([])
const activeType = ref(null)
const dictDataList = ref([])
const editingType = ref(null)
const editingData = ref(null)

const typeForm = reactive({
  name: '',
  code: '',
  status: '启用',
  remark: ''
})

const dataForm = reactive({
  label: '',
  value: '',
  sort: 0,
  status: '启用',
  remark: ''
})

const typeRules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入类型编码', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const dataRules = {
  label: [
    { required: true, message: '请输入标签', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入值', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const typeDialogTitle = computed(() => {
  return editingType.value ? '编辑字典类型' : '新增字典类型'
})

const dataDialogTitle = computed(() => {
  return editingData.value ? '编辑字典数据' : '新增字典数据'
})

const loadDictTypes = async () => {
  try {
    const result = await axios.get('/dict/types')
    if (result.success) {
      dictTypes.value = result.data.list
      if (dictTypes.value.length > 0 && !activeType.value) {
        handleTypeSelect(dictTypes.value[0])
      }
    }
  } catch (error) {
    console.error('加载字典类型失败:', error)
  }
}

const loadDictData = async (typeId) => {
  if (!typeId) return
  
  dataLoading.value = true
  try {
    const result = await axios.get(`/dict/data/${typeId}`)
    if (result.success) {
      dictDataList.value = result.data.list
    }
  } catch (error) {
    console.error('加载字典数据失败:', error)
  } finally {
    dataLoading.value = false
  }
}

const handleTypeSelect = (type) => {
  activeType.value = type
  loadDictData(type.id)
}

const handleAddType = () => {
  editingType.value = null
  Object.assign(typeForm, {
    name: '',
    code: '',
    status: '启用',
    remark: ''
  })
  typeDialogVisible.value = true
}

const handleEditType = (type) => {
  editingType.value = type
  Object.assign(typeForm, {
    name: type.name,
    code: type.code,
    status: type.status,
    remark: type.remark || ''
  })
  typeDialogVisible.value = true
}

const handleTypeSubmit = async () => {
  if (!typeFormRef.value) return
  
  try {
    await typeFormRef.value.validate()
    typeSubmitting.value = true
    
    const result = editingType.value
      ? await axios.put(`/dict/types/${editingType.value.id}`, typeForm)
      : await axios.post('/dict/types', typeForm)
    
    if (result.success) {
      ElMessage.success(editingType.value ? '编辑成功' : '新增成功')
      typeDialogVisible.value = false
      loadDictTypes()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    typeSubmitting.value = false
  }
}

const handleDeleteType = async (type) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典类型 "${type.name}" 吗？此操作会删除该类型下的所有数据！`,
      '删除字典类型',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await axios.delete(`/dict/types/${type.id}`)
    if (result.success) {
      ElMessage.success('删除成功')
      loadDictTypes()
      if (activeType.value?.id === type.id) {
        activeType.value = null
        dictDataList.value = []
      }
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleAddData = () => {
  if (!activeType.value) {
    ElMessage.warning('请先选择字典类型')
    return
  }
  
  editingData.value = null
  Object.assign(dataForm, {
    label: '',
    value: '',
    sort: 0,
    status: '启用',
    remark: ''
  })
  dataDialogVisible.value = true
}

const handleEditData = (data) => {
  editingData.value = data
  Object.assign(dataForm, {
    label: data.label,
    value: data.value,
    sort: data.sort,
    status: data.status,
    remark: data.remark || ''
  })
  dataDialogVisible.value = true
}

const handleDataSubmit = async () => {
  if (!dataFormRef.value) return
  
  try {
    await dataFormRef.value.validate()
    dataSubmitting.value = true
    
    const payload = {
      ...dataForm,
      typeId: activeType.value.id
    }
    
    const result = editingData.value
      ? await axios.put(`/dict/data/${editingData.value.id}`, payload)
      : await axios.post('/dict/data', payload)
    
    if (result.success) {
      ElMessage.success(editingData.value ? '编辑成功' : '新增成功')
      dataDialogVisible.value = false
      loadDictData(activeType.value.id)
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    dataSubmitting.value = false
  }
}

const handleDeleteData = async (data) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典数据 "${data.label}" 吗？`,
      '删除字典数据',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await axios.delete(`/dict/data/${data.id}`)
    if (result.success) {
      ElMessage.success('删除成功')
      loadDictData(activeType.value.id)
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleRefresh = () => {
  if (activeType.value) {
    loadDictData(activeType.value.id)
  }
}

onMounted(() => {
  loadDictTypes()
})
</script>

<style scoped>
.dict-management {
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

.dict-type-card,
.dict-data-card {
  border-radius: 8px;
  height: 600px;
}

.dict-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dict-type-list {
  max-height: 520px;
  overflow-y: auto;
}

.dict-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.dict-type-item:hover {
  border-color: #409EFF;
  background-color: #f5f7fa;
}

.dict-type-item.active {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.type-info .type-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.type-info .type-code {
  font-size: 12px;
  color: #909399;
}

.type-actions {
  display: flex;
  gap: 8px;
}

.dict-data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
