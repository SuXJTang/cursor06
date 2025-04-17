-- 检查当前表结构
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH 
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_NAME = 'career_recommendations' 
    AND COLUMN_NAME = 'recommendation_session_id';

-- 修改recommendation_session_id列类型为VARCHAR(36)
ALTER TABLE career_recommendations MODIFY COLUMN recommendation_session_id VARCHAR(36);

-- 再次检查表结构，确认修改生效
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH 
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_NAME = 'career_recommendations' 
    AND COLUMN_NAME = 'recommendation_session_id';
