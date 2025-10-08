<template>
  <div class="profile">
    <div class="profile-header">
      <h2>个人资料</h2>
      <p>管理您的个人信息和账户设置</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card" shadow="never">
          <template #header>
            <span>个人信息</span>
          </template>
          <div class="avatar-section">
            <el-avatar :size="100" :src="userInfo.avatar" class="avatar">
              {{ userInfo.name?.charAt(0) }}
            </el-avatar>
            <div class="avatar-actions">
              <el-button type="primary" text>更换头像</el-button>
            </div>
          </div>
          
          <div class="user-info">
            <div class="info-item">
              <label>用户名:</label>
              <span>{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <label>姓名:</label>
              <span>{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>邮箱:</label>
              <span>{{ userInfo.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>角色:</label>
              <el-tag type="success">{{ userInfo.role }}</el-tag>
            </div>
            <div class="info-item">
              <label>注册时间:</label>
              <span>2024-01-01</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card class="profile-card" shadow="never">
          <template #header>
            <span>编辑资料</span>
          </template>
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="80px"
          >
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="profileForm.name"
                placeholder="请输入姓名"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="profileForm.email"
                placeholder="请输入邮箱地址"
                type="email"
              />
            </el-form-item>
            
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="profileForm.phone"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
            
            <el-form-item label="部门" prop="department">
              <el-input
                v-model="profileForm.department"
                placeholder="请输入所在部门"
              />
            </el-form-item>
            
            <el-form-item label="职位" prop="position">
              <el-input
                v-model="profileForm.position"
                placeholder="请输入职位"
              />
            </el-form-item>
            
            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="profileForm.bio"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSave" :loading="saving">
                保存修改
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card class="profile-card" shadow="never" style="margin-top: 20px;">
          <template #header>
            <span>安全设置</span>
          </template>
          <div class="security-settings">
            <div class="security-item">
              <div class="security-info">
                <h4>修改密码</h4>
                <p>定期修改密码可以提高账户安全性</p>
              </div>
              <el-button type="primary" text @click="showChangePassword = true">
                修改
              </el-button>
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <h4>登录设备</h4>
                <p>查看最近登录的设备信息</p>
              </div>
              <el-button type="info" text>查看</el-button>
            </div>
            
            <div class="security-item">
              <div class="security-info">
                <h4>账户安全</h4>
                <p>管理账户的安全设置和权限</p>
              </div>
              <el-button type="info" text>管理</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePassword"
      title="修改密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const profileFormRef = ref()
const passwordFormRef = ref()

const userInfo = computed(() => authStore.user)

const saving = ref(false)
const showChangePassword = ref(false)
const changingPassword = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  bio: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSave = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    saving.value = true
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  Object.assign(profileForm, {
    name: userInfo.value?.name || '',
    email: userInfo.value?.email || '',
    phone: '',
    department: '',
    position: '',
    bio: ''
  })
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true
    
    // 模拟修改密码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    showChangePassword.value = false
    passwordFormRef.value.resetFields()
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  // 初始化表单数据
  handleReset()
})
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-header {
  margin-bottom: 30px;
}

.profile-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.profile-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.profile-card {
  border-radius: 8px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  margin-bottom: 10px;
}

.avatar-actions {
  margin-top: 10px;
}

.user-info {
  padding: 0 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  color: #606266;
  font-weight: 500;
}

.info-item span {
  color: #303133;
}

.security-settings {
  padding: 0 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
}

.security-info p {
  margin: 0;
  color: #909399;
  font-size: 12px;
}
</style>
