<template>
  <div class="doctor-add">
    <div class="page-header">
      <h2>添加医生</h2>
      <p>添加新的医生信息到系统</p>
    </div>
    
    <el-card class="form-card">
      <el-form
        ref="doctorFormRef"
        :model="doctorForm"
        :rules="doctorRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="医生姓名" prop="name">
              <el-input
                v-model="doctorForm.name"
                placeholder="请输入医生姓名"
                maxlength="20"
                show-word-limit
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
                maxlength="11"
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

        <el-form-item label="工号" prop="employeeId">
          <el-input
            v-model="doctorForm.employeeId"
            placeholder="请输入工号"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="专业方向" prop="specialty">
          <el-input
            v-model="doctorForm.specialty"
            placeholder="请输入专业方向"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="工作经历" prop="experience">
          <el-input
            v-model="doctorForm.experience"
            type="textarea"
            :rows="4"
            placeholder="请输入工作经历"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="doctorForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交添加
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="$router.push('/doctors/list')">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '../../utils/axios'

const router = useRouter()
const doctorFormRef = ref()
const submitting = ref(false)

const doctorForm = reactive({
  name: '',
  gender: '男',
  department: '',
  title: '',
  phone: '',
  email: '',
  employeeId: '',
  specialty: '',
  experience: '',
  remark: ''
})

const departmentList = ref([
  { value: '内科', label: '内科' },
  { value: '外科', label: '外科' },
  { value: '妇产科', label: '妇产科' },
  { value: '儿科', label: '儿科' },
  { value: '肿瘤科', label: '肿瘤科' },
  { value: '病理科', label: '病理科' },
  { value: '急诊科', label: '急诊科' },
  { value: '麻醉科', label: '麻醉科' }
])

const titleList = ref([
  { value: '主任医师', label: '主任医师' },
  { value: '副主任医师', label: '副主任医师' },
  { value: '主治医师', label: '主治医师' },
  { value: '住院医师', label: '住院医师' },
  { value: '实习医师', label: '实习医师' }
])

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
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  employeeId: [
    { required: true, message: '请输入工号', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!doctorFormRef.value) return
  
  try {
    await doctorFormRef.value.validate()
    submitting.value = true
    
    const result = await axios.post('/doctors', doctorForm)
    
    if (result.success) {
      ElMessage.success('医生添加成功')
      handleReset()
      router.push('/doctors/list')
    } else {
      ElMessage.error(result.message || '添加失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  doctorFormRef.value?.resetFields()
  Object.assign(doctorForm, {
    name: '',
    gender: '男',
    department: '',
    title: '',
    phone: '',
    email: '',
    employeeId: '',
    specialty: '',
    experience: '',
    remark: ''
  })
}
</script>

<style scoped>
.doctor-add {
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

.form-card {
  border-radius: 8px;
}
</style>
