<template>
  <div 
    class="virtual-career-list" 
    :class="{ 'loading': loading }"
    ref="scrollContainerRef"
  >
    <!-- 加载状态 -->
    <div v-if="loading && !careers.length" class="career-loading-state">
      <el-skeleton :rows="5" animated />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="career-error-state">
      <el-empty :description="error">
        <el-button type="primary" @click="onRetry">重试</el-button>
      </el-empty>
    </div>
    
    <!-- 空数据状态 -->
    <div v-else-if="!careers.length" class="career-empty-state">
      <el-empty :description="emptyText">
        <slot name="empty-action"></slot>
      </el-empty>
    </div>
    
    <!-- 职业列表 -->
    <div v-else class="career-list-container">
      <!-- 调试信息 -->
      <div class="debug-info" style="padding: 10px; margin: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">
        <p><strong>调试信息</strong></p>
        <p>加载状态: {{ loading ? '加载中' : '加载完成' }}</p>
        <p>错误信息: {{ error || '无' }}</p>
        <p>数据条数: {{ careers.length }}</p>
        <p>是否还有更多: {{ hasMore ? '是' : '否' }}</p>
        <p>选中ID: {{ selectedCareerId }}</p>
      </div>
      
      <!-- 虚拟滚动列表 -->
      <div 
        class="career-items" 
        :style="{ height: `${totalHeight}px` }"
      >
        <div
          v-for="item in visibleCareers"
          :key="item.id"
          class="career-item-wrapper"
          :style="{
            transform: `translateY(${item._offsetY}px)`,
            height: `${itemHeight}px`
          }"
        >
          <slot 
            name="career-item" 
            :career="item"
            :index="item._index"
            :is-selected="selectedCareerId === item.id"
          >
            <!-- 默认卡片实现 -->
            <el-card 
              class="career-item-card" 
              :class="{ 'is-selected': selectedCareerId === item.id }"
              @click="onSelectCareer(item)"
            >
              <div class="career-title">{{ item.title || item.name }}</div>
              <div class="career-info">
                <div class="salary" v-if="item.salary_range">
                  <el-icon><ElementIcons.Money /></el-icon>
                  <span>{{ item.salary_range }}</span>
                </div>
                <div class="education" v-if="item.education_required || item.education_requirements">
                  <el-icon><ElementIcons.School /></el-icon>
                  <span>{{ item.education_required || item.education_requirements }}</span>
                </div>
              </div>
              <div class="career-skills" v-if="hasSkills(item)">
                <el-tag 
                  v-for="(skill, index) in getSkills(item).slice(0, 3)" 
                  :key="index"
                  size="small"
                  effect="plain"
                >
                  {{ skill }}
                </el-tag>
                <span v-if="getSkills(item).length > 3" class="more-skills">
                  +{{ getSkills(item).length - 3 }}
                </span>
              </div>
              <div class="career-actions">
                <el-button size="small" @click.stop="onViewCareer(item)">详情</el-button>
                <el-button 
                  size="small" 
                  :type="item.is_favorite ? 'danger' : 'success'"
                  @click.stop="onToggleFavorite(item)"
                >
                  {{ item.is_favorite ? '取消收藏' : '收藏' }}
                </el-button>
              </div>
            </el-card>
          </slot>
        </div>
      </div>
      
      <!-- 底部加载状态 -->
      <div v-if="loading && careers.length" class="career-loading-more">
        <el-icon class="loading-icon"><ElementIcons.Loading /></el-icon>
        <span>加载更多...</span>
      </div>
      
      <!-- 全部加载完成 -->
      <div v-if="!hasMore && careers.length" class="career-loaded-all">
        <span>{{ finishedText }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, nextTick, defineComponent } from 'vue'
import { useThrottleFn, useElementSize, useScroll, useResizeObserver } from '@vueuse/core'
import * as ElementIcons from '@element-plus/icons-vue'
import type { Career } from '../../types/career'

export default defineComponent({
  name: 'VirtualCareerList',
  props: {
    careers: {
      type: Array as () => Career[],
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default: '没有找到职业数据'
    },
    finishedText: {
      type: String,
      default: '没有更多数据了'
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    itemHeight: {
      type: Number,
      default: 180 // 每个职业卡片的高度
    },
    buffer: {
      type: Number,
      default: 5 // 额外加载的项数，避免滚动时出现空白
    },
    selectedCareerId: {
      type: [String, Number],
      default: null
    }
  },
  emits: [
    'load-more',    // 加载更多数据
    'select',       // 选择职业
    'view',         // 查看详情
    'toggle-favorite', // 切换收藏状态
    'retry'         // 重试加载
  ],
  setup(props, { emit }) {
    // 获取滚动容器引用
    const scrollContainerRef = ref<HTMLElement | null>(null)

    // 使用VueUse的useScroll获取滚动信息
    const { y: scrollTop } = useScroll(scrollContainerRef)

    // 使用VueUse的useElementSize获取容器尺寸
    const { height: containerHeight } = useElementSize(scrollContainerRef)

    // 计算总高度
    const totalHeight = computed(() => {
      return props.careers.length * props.itemHeight
    })

    // 跟踪滚动区域底部是否可见
    const isNearBottom = computed(() => {
      if (!scrollContainerRef.value) return false
      
      // 当滚动到距离底部100px时触发加载更多
      const threshold = 100
      const scrollPosition = scrollTop.value
      const visibleHeight = containerHeight.value
      const totalContentHeight = totalHeight.value
      
      return (scrollPosition + visibleHeight + threshold) >= totalContentHeight
    })

    // 计算可见区域的职业项
    const visibleCareers = computed(() => {
      if (!props.careers.length) return []
      
      // 当前滚动位置
      const currentScrollTop = scrollTop.value
      
      // 可见区域的起始索引
      const startIndex = Math.max(0, Math.floor(currentScrollTop / props.itemHeight) - props.buffer)
      
      // 可见区域的结束索引
      const visibleCount = Math.ceil(containerHeight.value / props.itemHeight) + props.buffer * 2
      const endIndex = Math.min(props.careers.length - 1, startIndex + visibleCount)
      
      // 返回可见项并添加位置信息
      return props.careers.slice(startIndex, endIndex + 1).map((career, index) => {
        return {
          ...career,
          _index: startIndex + index,
          _offsetY: (startIndex + index) * props.itemHeight
        }
      })
    })
    
    // 加载更多
    const onLoadMore = useThrottleFn(() => {
      if (!props.loading && props.hasMore && isNearBottom.value) {
        emit('load-more')
      }
    }, 200)

    // 检查是否到达底部并加载更多
    const checkScrollPosition = () => {
      if (isNearBottom.value) {
        onLoadMore()
      }
    }

    // 监听滚动事件
    watch(scrollTop, () => {
      checkScrollPosition()
    })

    // 监听容器大小变化
    useResizeObserver(scrollContainerRef, () => {
      nextTick(() => {
        checkScrollPosition()
      })
    })

    // 职业项交互方法
    const onSelectCareer = (career: Career) => {
      emit('select', career)
    }

    const onViewCareer = (career: Career) => {
      emit('view', career)
    }

    const onToggleFavorite = (career: Career) => {
      emit('toggle-favorite', career)
    }

    const onRetry = () => {
      emit('retry')
    }

    // 技能处理函数
    const hasSkills = (career: Career) => {
      return (
        (Array.isArray(career.skills_required) && career.skills_required.length > 0) ||
        (Array.isArray(career.required_skills) && career.required_skills.length > 0)
      )
    }

    const getSkills = (career: Career) => {
      if (Array.isArray(career.skills_required) && career.skills_required.length > 0) {
        return career.skills_required
      }
      
      if (Array.isArray(career.required_skills) && career.required_skills.length > 0) {
        return career.required_skills
      }
      
      return []
    }

    // 组件挂载后初始检查
    onMounted(() => {
      nextTick(() => {
        checkScrollPosition()
      })
    })

    return {
      scrollContainerRef,
      totalHeight,
      visibleCareers,
      onSelectCareer,
      onViewCareer,
      onToggleFavorite,
      onRetry,
      hasSkills,
      getSkills,
      ElementIcons
    }
  }
})
</script>

<style scoped>
.virtual-career-list {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.career-list-container {
  position: relative;
}

.career-items {
  position: relative;
}

.career-item-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  padding: 8px;
  box-sizing: border-box;
  will-change: transform;
}

.career-item-card {
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.career-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.career-item-card.is-selected {
  border: 2px solid var(--el-color-primary);
}

.career-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.career-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.career-info > div {
  display: flex;
  align-items: center;
  gap: 4px;
}

.career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0;
  flex: 1;
}

.more-skills {
  font-size: 12px;
  color: #909399;
  display: inline-flex;
  align-items: center;
}

.career-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.career-loading-state,
.career-error-state,
.career-empty-state {
  padding: 20px;
  text-align: center;
}

.career-loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #909399;
}

.loading-icon {
  animation: rotating 2s linear infinite;
  margin-right: 6px;
}

.career-loaded-all {
  text-align: center;
  color: #909399;
  padding: 16px;
  font-size: 14px;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 