<template>
  <div class="career-heat">
    <el-card class="heat-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <h2>职业需求热力分布</h2>
            <el-select v-model="selectedCareer" class="career-select" placeholder="选择职业">
              <el-option
                v-for="career in careers"
                :key="career.value"
                :label="career.label"
                :value="career.value"
              />
            </el-select>
          </div>
          <div class="header-right">
            <el-select v-model="selectedYear" class="year-select">
              <el-option
                v-for="year in years"
                :key="year"
                :label="year + '年'"
                :value="year"
              />
            </el-select>
            <el-select v-model="selectedQuarter" class="quarter-select">
              <el-option
                v-for="quarter in quarters"
                :key="quarter.value"
                :label="quarter.label"
                :value="quarter.value"
              />
            </el-select>
          </div>
        </div>
      </template>
      
      <div class="heat-content">
        <div class="filters">
          <el-radio-group v-model="viewType">
            <el-radio-button label="city">城市分布</el-radio-button>
            <el-radio-button label="trend">趋势分析</el-radio-button>
          </el-radio-group>
        </div>
        
        <div ref="heatmapContainer" class="heatmap-container"></div>
        
        <div class="heat-summary">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="summary-card">
                <h3>需求最高城市</h3>
                <div class="top-cities">
                  <div v-for="city in topCities" :key="city.name" class="city-item">
                    <span>{{ city.name }}</span>
                    <span>{{ city.value }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="summary-card">
                <h3>增长最快城市</h3>
                <div class="growing-cities">
                  <div v-for="city in growingCities" :key="city.name" class="city-item">
                    <span>{{ city.name }}</span>
                    <span class="growth-rate">+{{ city.growth }}%</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="summary-card">
                <h3>市场洞察</h3>
                <div class="market-insights">
                  <p>{{ currentInsight }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 职业选项
const careers = [
  { value: 'software_engineer', label: '软件工程师' },
  { value: 'data_analyst', label: '数据分析师' },
  { value: 'product_manager', label: '产品经理' },
  { value: 'ui_designer', label: 'UI设计师' }
]

// 季度选项
const quarters = [
  { value: 'Q1', label: '第一季度' },
  { value: 'Q2', label: '第二季度' },
  { value: 'Q3', label: '第三季度' },
  { value: 'Q4', label: '第四季度' }
]

const selectedCareer = ref('')
const selectedYear = ref(2024)
const selectedQuarter = ref('Q1')
const viewType = ref('city')
const years = [2024, 2023, 2022, 2021, 2020]

// 热力图相关
const heatmapContainer = ref<HTMLElement | null>(null)
let heatmapChart: ECharts | null = null

// 模拟数据
const topCities = ref([
  { name: '北京', value: '2,345' },
  { name: '上海', value: '2,156' },
  { name: '深圳', value: '1,897' },
  { name: '杭州', value: '1,654' },
  { name: '广州', value: '1,432' }
])

const growingCities = ref([
  { name: '成都', growth: 45 },
  { name: '西安', growth: 38 },
  { name: '武汉', growth: 35 },
  { name: '长沙', growth: 32 },
  { name: '南京', growth: 30 }
])

const currentInsight = ref('当前软件工程师职位在一线城市需求趋于稳定，二线城市呈现快速增长态势，其中成都、西安等新一线城市增长最为显著。建议求职者关注新一线城市的发展机会。')

// 初始化热力图
const initHeatmap = () => {
  if (!heatmapContainer.value) return
  
  if (heatmapChart) {
    heatmapChart.dispose()
  }

  heatmapChart = echarts.init(heatmapContainer.value)

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', 
                 '7月', '8月', '9月', '10月', '11月', '12月']
  const cities = ['北京', '上海', '广州', '深圳', '杭州', 
                 '成都', '武汉', '南京', '西安', '重庆']
  
  const data: [number, number, number][] = []
  for (let i = 0; i < months.length; i++) {
    for (let j = 0; j < cities.length; j++) {
      data.push([i, j, Math.round(Math.random() * 100)])
    }
  }

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const value = params.value
        return `${cities[value[1]]} ${months[value[0]]}<br/>需求量: ${value[2]}`
      }
    },
    grid: {
      top: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: months,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: cities,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      text: ['高', '低'],
      inRange: {
        color: ['#e5f5e0', '#31a354']
      }
    },
    series: [{
      name: '职业需求热力',
      type: 'heatmap',
      data: data,
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }

  heatmapChart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  if (heatmapChart) {
    heatmapChart.resize()
  }
}

onMounted(() => {
  initHeatmap()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (heatmapChart) {
    heatmapChart.dispose()
  }
})
</script>

<style scoped>
.career-heat {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.heat-card {
  height: calc(100vh - 100px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.career-select {
  width: 160px;
}

.year-select,
.quarter-select {
  width: 120px;
}

.heat-content {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.heatmap-container {
  flex: 1;
  min-height: 400px;
}

.heat-summary {
  margin-top: 20px;
}

.summary-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.summary-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
}

.city-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #606266;
}

.growth-rate {
  color: #67c23a;
}

.market-insights {
  color: #606266;
  line-height: 1.6;
}

:deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 0 20px 20px;
}
</style> 