import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(bodyParser.json())

// 从JSON文件加载数据
function loadData() {
  try {
    const dataPath = path.join(process.cwd(), 'mock', 'db.json')
    const data = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('加载数据文件失败:', error)
    return {
      users: [],
      cases: [],
      doctors: [],
      dictTypes: [],
      dictData: []
    }
  }
}

// 保存数据到JSON文件
function saveData(data) {
  try {
    const dataPath = path.join(process.cwd(), 'mock', 'db.json')
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('保存数据文件失败:', error)
  }
}

// 获取当前数据
function getData() {
  return loadData()
}

// 更新数据
function updateData(newData) {
  saveData(newData)
}

// 响应格式包装器
function success(data, message = '操作成功') {
  return {
    success: true,
    data,
    message
  }
}

function error(message = '操作失败') {
  return {
    success: false,
    message
  }
}

// 认证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json(error('未授权访问'))
  }
  next()
}

// 登录接口
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const data = getData()
  
  const user = data.users.find(u => u.username === username && u.password === password)
  if (user) {
    const token = 'mock-jwt-token-' + Date.now()
    res.json(success({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    }, '登录成功'))
  } else {
    res.status(401).json(error('用户名或密码错误'))
  }
})

// 获取用户信息
app.get('/api/auth/user', authMiddleware, (req, res) => {
  const data = getData()
  const user = data.users[0] // 模拟获取第一个用户
  res.json(success({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role
  }))
})

// 获取菜单数据
app.get('/api/menu', (req, res) => {
  const menuData = [
    {
      "id": 1,
      "name": "仪表盘",
      "path": "/dashboard",
      "icon": "Odometer",
      "children": []
    },
    {
      "id": 2,
      "name": "病例管理",
      "path": "/cases",
      "icon": "Document",
      "children": [
        {
          "id": 21,
          "name": "病例登记",
          "path": "/cases/register",
          "icon": "Edit"
        },
        {
          "id": 22,
          "name": "病例列表",
          "path": "/cases/list",
          "icon": "List"
        },
        {
          "id": 23,
          "name": "病例查询",
          "path": "/cases/search",
          "icon": "Search"
        }
      ]
    },
    {
      "id": 4,
      "name": "医生管理",
      "path": "/doctors",
      "icon": "User",
      "children": [
        {
          "id": 41,
          "name": "医生列表",
          "path": "/doctors/list",
          "icon": "List"
        },
        {
          "id": 42,
          "name": "添加医生",
          "path": "/doctors/add",
          "icon": "Plus"
        }
      ]
    },
    {
      "id": 5,
      "name": "数据统计",
      "path": "/statistics",
      "icon": "DataAnalysis",
      "children": [
        {
          "id": 51,
          "name": "病例统计",
          "path": "/statistics/cases",
          "icon": "TrendCharts"
        },
        {
          "id": 52,
          "name": "医生统计",
          "path": "/statistics/doctors",
          "icon": "User"
        }
      ]
    },
    {
      "id": 6,
      "name": "系统管理",
      "path": "/system",
      "icon": "Setting",
      "children": [
        {
          "id": 61,
          "name": "字典管理",
          "path": "/system/dict",
          "icon": "Notebook"
        },
        {
          "id": 62,
          "name": "个人资料",
          "path": "/profile",
          "icon": "User"
        }
      ]
    }
  ]
  res.json(success(menuData))
})

// 病例管理接口
app.get('/api/cases', (req, res) => {
  const { page = 1, size = 10, keyword = '', status = '', department = '' } = req.query
  const data = getData()
  
  let filtered = data.cases
  
  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(caseItem => 
      caseItem.patientName.includes(keyword) || 
      caseItem.caseNumber.includes(keyword) ||
      caseItem.doctor.includes(keyword)
    )
  }
  
  // 状态筛选
  if (status) {
    filtered = filtered.filter(caseItem => caseItem.status === status)
  }
  
  // 科室筛选
  if (department) {
    filtered = filtered.filter(caseItem => caseItem.department === department)
  }

  const start = (page - 1) * size
  const end = start + parseInt(size)
  const list = filtered.slice(start, end)

  res.json(success({
    list,
    total: filtered.length,
    page: parseInt(page),
    size: parseInt(size)
  }))
})

// 获取单个病例
app.get('/api/cases/:id', (req, res) => {
  const caseId = parseInt(req.params.id)
  const data = getData()
  const caseItem = data.cases.find(c => c.id === caseId)
  
  if (caseItem) {
    res.json(success(caseItem))
  } else {
    res.status(404).json(error('病例不存在'))
  }
})

// 登记病例
app.post('/api/cases', (req, res) => {
  const caseData = req.body
  const data = getData()
  const newCase = {
    id: Date.now(),
    caseNumber: 'CASE' + Date.now(),
    ...caseData,
    createTime: new Date().toISOString(),
    status: '已登记'
  }
  
  data.cases.unshift(newCase)
  updateData(data)
  res.json(success(newCase, '病例登记成功'))
})

// 更新病例
app.put('/api/cases/:id', (req, res) => {
  const caseId = parseInt(req.params.id)
  const data = getData()
  const caseIndex = data.cases.findIndex(c => c.id === caseId)
  
  if (caseIndex !== -1) {
    data.cases[caseIndex] = {
      ...data.cases[caseIndex],
      ...req.body
    }
    updateData(data)
    res.json(success(data.cases[caseIndex], '病例更新成功'))
  } else {
    res.status(404).json(error('病例不存在'))
  }
})

// 医生管理接口
app.get('/api/doctors', (req, res) => {
  const { page = 1, size = 10, keyword = '' } = req.query
  const data = getData()
  
  let filtered = data.doctors
  
  if (keyword) {
    filtered = data.doctors.filter(doctor => 
      doctor.name.includes(keyword) || 
      doctor.department.includes(keyword)
    )
  }

  const start = (page - 1) * size
  const end = start + parseInt(size)
  const list = filtered.slice(start, end)

  res.json(success({
    list,
    total: filtered.length,
    page: parseInt(page),
    size: parseInt(size)
  }))
})

// 添加医生
app.post('/api/doctors', (req, res) => {
  const doctorData = req.body
  const data = getData()
  const newDoctor = {
    id: Date.now(),
    ...doctorData,
    status: '在职',
    createTime: new Date().toISOString()
  }
  
  data.doctors.unshift(newDoctor)
  updateData(data)
  res.json(success(newDoctor, '医生添加成功'))
})

// 更新医生
app.put('/api/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id)
  const data = getData()
  const doctorIndex = data.doctors.findIndex(d => d.id === doctorId)
  
  if (doctorIndex !== -1) {
    data.doctors[doctorIndex] = {
      ...data.doctors[doctorIndex],
      ...req.body
    }
    updateData(data)
    res.json(success(data.doctors[doctorIndex], '医生信息更新成功'))
  } else {
    res.status(404).json(error('医生不存在'))
  }
})

// 字典管理接口
app.get('/api/dict/types', (req, res) => {
  const data = getData()
  res.json(success(data.dictTypes))
})

app.get('/api/dict/data/:typeId', (req, res) => {
  const typeId = parseInt(req.params.typeId)
  const data = getData()
  const filteredData = data.dictData.filter(d => d.typeId === typeId)
  res.json(success(filteredData))
})

// 启动服务器
app.listen(3002, () => {
  console.log(`Mock Server is running on http://localhost:3002`)
  console.log('Available endpoints:')
  console.log('  POST   /api/auth/login')
  console.log('  GET    /api/auth/user')
  console.log('  GET    /api/menu')
  console.log('  GET    /api/cases')
  console.log('  GET    /api/cases/:id')
  console.log('  POST   /api/cases')
  console.log('  PUT    /api/cases/:id')
  console.log('  GET    /api/doctors')
  console.log('  POST   /api/doctors')
  console.log('  PUT    /api/doctors/:id')
  console.log('  GET    /api/dict/types')
  console.log('  GET    /api/dict/data/:typeId')
})
