<template>
  <div class="history-container">
    <div class="search-header">
      <div class="search-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索病理号/登记号/申请单号"
          size="small"
          style="width: 200px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="statusFilter"
          placeholder="状态筛选"
          size="small"
          style="width: 120px"
          clearable
        >
          <el-option label="已登记" value="已登记" />
          <el-option label="已接收" value="已接收" />
          <el-option label="检测中" value="检测中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已报告" value="已报告" />
        </el-select>
      </div>
      
      <div class="search-row">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 240px"
          value-format="YYYY-MM-DD"
        />
      </div>
    </div>
    
    <div class="table-container">
      <el-table
        :data="filteredList"
        v-bind="tableConfig"
        @row-click="handleRowClick"
      >
        <el-table-column
          v-for="col in columnsConfig"
          :key="col.prop"
          v-bind="col"
        >
          <template v-if="col.prop === 'status'" #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
          <template v-else-if="col.prop === 'createTime'" #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      
      <div v-if="filteredList.length === 0" class="empty-state">
        <el-empty description="暂无数据" :image-size="60" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  caseList: {
    type: Array,
    default: () => []
  },
  currentCaseId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['case-click'])

// Local state
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref([])

// Table configuration
const tableConfig = {
  stripe: true,
  border: true,
  size: 'small',
  highlightCurrentRow: true,
  'row-class-name': ({ row }) => props.currentCaseId === row.id ? 'current-row' : ''
}

// Columns configuration
const columnsConfig = [
  {
    prop: 'pathologyNo',
    label: '病理号',
    width: 120,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: '状态',
    width: 80,
    align: 'center'
  },
  {
    prop: 'patientName',
    label: '患者姓名',
    width: 80,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'gender',
    label: '性别',
    width: 80,
    align: 'center'
  },
  {
    prop: 'age',
    label: '年龄',
    width: 80,
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '登记时间',
    width: 80,
    align: 'center'
  }
]

// Computed
const filteredList = computed(() => {
  let filtered = props.caseList
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.pathologyNo?.toLowerCase().includes(keyword) ||
      item.registrationNo?.toLowerCase().includes(keyword) ||
      item.applicationNo?.toLowerCase().includes(keyword) ||
      item.patientName?.toLowerCase().includes(keyword)
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }
  
  // 日期范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    filtered = filtered.filter(item => {
      if (!item.createTime) return false
      const itemDate = new Date(item.createTime).toISOString().split('T')[0]
      return itemDate >= startDate && itemDate <= endDate
    })
  }
  
  return filtered
})

// Methods
const handleRowClick = (row) => {
  emit('case-click', row)
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
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
</script>

<style scoped>
.history-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.search-header {
  padding: 8px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
}

.search-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.search-row:last-child {
  margin-bottom: 0;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.table-container :deep(.el-table) {
  height: 100%;
}

.table-container :deep(.el-table .el-table__body-wrapper) {
  height: 100%;
  overflow-y: auto;
}

.table-container :deep(.el-table .current-row) {
  background-color: #ecf5ff !important;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
