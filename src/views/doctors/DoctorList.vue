<template>
  <div class="doctor-list">
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加医生
          </el-button>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索医生姓名或科室"
              style="width: 300px"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </template>
      
      <el-table
        :data="doctorList"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="医生姓名" min-width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === '男' ? 'primary' : 'danger'">
              {{ row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="科室" min-width="120" />
        <el-table-column prop="title" label="职称" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="warning" link @click="handleResetPassword(row)">
              重置密码
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleDelete(row)"
              v-if="row.status === '在职'"
            >
              停用
            </el-button>
            <el-button 
              type="success" 
              link 
              @click="handleEnable(row)"
              v-else
            >
              启用
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
    
    <!-- 添加/编辑医生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="doctorFormRef"
        :model="doctorForm"
        :rules="doctorRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="医生姓名" prop="name">
              <el-input
                v-model="doctorForm.name"
                placeholder="请输入医生姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="doctorForm.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科室" prop="department">
              <el-select
                v-model="doctorForm.department"
                placeholder="请选择科室"
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
          <el-col :span="12">
            <el-form-item label="职称" prop="title">
              <el-select
                v-model="doctorForm.title"
                placeholder="请选择职称"
                style="width: 100%"
              >
                <el-option
                  v-for="title in titleList"
                  :key="title.value"
                  :label="title.label"
                  :value="title.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="doctorForm.phone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="doctorForm.email"
                placeholder="请输入邮箱地址"
                type="email"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="doctorForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
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

const doctorFormRef = ref()
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const doctorList = ref([])
const editingDoctor = ref(null)

const departmentList = ref([
  { value: '内科', label: '内科' },
  { value: '外科', label: '外科' },
  { value: '妇产科', label: '妇产科' },
  { value: '儿科', label: '儿科' },
  { value: '肿瘤科', label: '肿瘤科' },
  { value: '病理科', label: '病理科' }
])

const titleList = ref([
  { value: '主任医师', label: '主任医师' },
  { value: '副主任医师', label: '副主任医师' },
  { value: '主治医师', label: '主治医师' },
  { value: '住院医师', label: '住院医师' },
  { value: '实习医师', label: '实习医师' }
])

const doctorForm = reactive({
  name: '',
  gender: '男',
  department: '',
  title: '',
  phone: '',
  email: '',
  remark: ''
})

const doctorRules = {
  name: [
    { required: true, message: '请输入医生姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择科室', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请选择职称', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => {
  return editingDoctor.value ? '编辑医生' : '添加医生'
})

const loadDoctors = async () => {
  loading.value = true
  try {
    const result = await axios.get('/doctors', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        keyword: searchKeyword.value
      }
    })
    if (result.success) {
      doctorList.value = result.data.list
      total.value = result.data.total
    }
  } catch (error) {
    console.error('加载医生列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadDoctors()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  loadDoctors()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadDoctors()
}

const handleAdd = () => {
  editingDoctor.value = null
  Object.assign(doctorForm, {
    name: '',
    gender: '男',
    department: '',
    title: '',
    phone: '',
    email: '',
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (doctor) => {
  editingDoctor.value = doctor
  Object.assign(doctorForm, {
    name: doctor.name,
    gender: doctor.gender,
    department: doctor.department,
    title: doctor.title,
    phone: doctor.phone,
    email: doctor.email,
    remark: doctor.remark || ''
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!doctorFormRef.value) return
  
  try {
    await doctorFormRef.value.validate()
    submitting.value = true
    
    const result = editingDoctor.value 
      ? await axios.put(`/doctors/${editingDoctor.value.id}`, doctorForm)
      : await axios.post('/doctors', doctorForm)
    
    if (result.success) {
      ElMessage.success(editingDoctor.value ? '编辑成功' : '添加成功')
      dialogVisible.value = false
      loadDoctors()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleDialogClose = () => {
  dialogVisible.value = false
  doctorFormRef.value?.resetFields()
}

const handleResetPassword = async (doctor) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置医生 ${doctor.name} 的密码吗？`,
      '重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await axios.post(`/doctors/${doctor.id}/reset-password`)
    if (result.success) {
      ElMessage.success('密码重置成功')
    } else {
      ElMessage.error(result.message || '重置失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleDelete = async (doctor) => {
  try {
    await ElMessageBox.confirm(
      `确定要停用医生 ${doctor.name} 吗？`,
      '停用医生',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await axios.put(`/doctors/${doctor.id}/disable`)
    if (result.success) {
      ElMessage.success('停用成功')
      loadDoctors()
    } else {
      ElMessage.error(result.message || '停用失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleEnable = async (doctor) => {
  try {
    await ElMessageBox.confirm(
      `确定要启用医生 ${doctor.name} 吗？`,
      '启用医生',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await axios.put(`/doctors/${doctor.id}/enable`)
    if (result.success) {
      ElMessage.success('启用成功')
      loadDoctors()
    } else {
      ElMessage.error(result.message || '启用失败')
    }
  } catch (error) {
    // 用户取消操作
  }
}

onMounted(() => {
  loadDoctors()
})
</script>

<style scoped>
.doctor-list {
  padding: 12px;
  height: 100%;
  overflow: hidden;
}

.table-card {
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
}

.table-card :deep(.el-table) {
  flex: 1;
  overflow: auto;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
