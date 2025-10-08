import { ref } from 'vue'
import axios from './axios'

// 字典数据缓存
const dictCache = ref({})

/**
 * 获取字典数据
 * @param {string} dictCode 字典类型编码
 * @returns {Promise<Array>} 字典数据列表
 */
export const getDictData = async (dictCode) => {
  // 如果缓存中有数据，直接返回
  if (dictCache.value[dictCode]) {
    return dictCache.value[dictCode]
  }

  try {
    const result = await axios.get(`/dict/data/${dictCode}`)
    if (result.success) {
      const data = result.data.list || []
      // 缓存数据
      dictCache.value[dictCode] = data
      return data
    }
    return []
  } catch (error) {
    console.error(`获取字典数据失败 (${dictCode}):`, error)
    return []
  }
}

/**
 * 清除字典缓存
 * @param {string} dictCode 字典类型编码，不传则清除所有缓存
 */
export const clearDictCache = (dictCode = null) => {
  if (dictCode) {
    delete dictCache.value[dictCode]
  } else {
    dictCache.value = {}
  }
}

/**
 * 预加载常用字典数据
 */
export const preloadCommonDicts = async () => {
  const commonDicts = [
    'gender',           // 性别
    'marital_status',   // 婚姻状况
    'visit_type',       // 就诊类型
    'fee_type',         // 费别
    'specimen_type',    // 标本类型
    'department'        // 科室
  ]

  try {
    await Promise.all(commonDicts.map(code => getDictData(code)))
  } catch (error) {
    console.error('预加载字典数据失败:', error)
  }
}
