declare module '../api/career' {
  export function generateRecommendations(userId: string | number, forceNew?: boolean): Promise<any>;
  export function getRecommendationProgress(userId?: string | number): Promise<any>;
  export function getRecommendationStatus(userId?: string | number, checkRedis?: boolean): Promise<any>;
  export function syncRecommendationStatus(userId: string | number): Promise<any>;
  export function getRecommendations(userId?: string | number): Promise<any>;
  export function getRecommendationCandidates(userId?: string | number): Promise<any>;
  export function toggleFavoriteCareer(data: { is_favorite: boolean, career_id?: string | number, user_id?: string | number }): Promise<any>;
  export function getUserRecommendations(userId: string | number): Promise<any>;
  export function checkRecommendationData(userId?: string | number): Promise<any>;
  export function getAssessmentData(userId?: string | number): Promise<any>;
  export function getRawRecommendationData(userId?: string | number): Promise<any>;
  export function checkResumeData(userId?: string | number): Promise<any>;
  export function getUserProfile(userId?: string | number): Promise<any>;
  export function getUserProfileDebug(userId: string): Promise<any>;
  export function getResumeDataDebug(userId: string): Promise<any>;
  export function injectUserProfileDebug(userId: string): Promise<any>;
  export function injectResumeDebug(userId: string): Promise<any>;
}

declare module '../stores/user' {
  export function useCurrentUser(): {
    user: {
      id?: string;
      username?: string;
      email?: string;
      [key: string]: any;
    } | null;
    [key: string]: any;
  };
} 