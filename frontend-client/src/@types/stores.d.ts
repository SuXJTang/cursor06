declare module '@/stores/recommendation' {
  export interface RecommendationStore {
    recommendations: any[]
    loading: boolean
    error: string | null
    setRecommendations: (recommendations: any[]) => void
    clearRecommendations: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
  }

  export function useRecommendationStore(): RecommendationStore
} 