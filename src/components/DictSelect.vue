<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :size="size"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :style="style"
    @change="handleChange"
  >
    <el-option
      v-for="item in dictData"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getDictData } from '../utils/dict'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  dictCode: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  size: {
    type: String,
    default: 'small'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// Local state
const selectedValue = ref(props.modelValue)
const dictData = ref([])
const loading = ref(false)

// Methods
const loadDictData = async () => {
  if (!props.dictCode) return
  
  loading.value = true
  try {
    const data = await getDictData(props.dictCode)
    dictData.value = data
  } catch (error) {
    console.error(`加载字典数据失败 (${props.dictCode}):`, error)
    dictData.value = []
  } finally {
    loading.value = false
  }
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

watch(() => props.dictCode, () => {
  loadDictData()
})

// Lifecycle
onMounted(() => {
  loadDictData()
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
