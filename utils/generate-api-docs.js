const fs = require('fs');

// 读取swagger.json
const swaggerJson = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// 生成Markdown文档
let markdown = `# API接口文档\n\n`;

// 添加基本信息
markdown += `## 基本信息\n\n`;
markdown += `- 标题: ${swaggerJson.info.title}\n`;
markdown += `- 版本: ${swaggerJson.info.version}\n\n`;

// 按照标签对接口进行分组
const pathsByTag = {};
const pathsWithoutTags = [];

// 遍历所有路径
for (const [path, methods] of Object.entries(swaggerJson.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    if (details.tags && details.tags.length > 0) {
      // 有标签的接口按标签分组
      for (const tag of details.tags) {
        if (!pathsByTag[tag]) {
          pathsByTag[tag] = [];
        }
        pathsByTag[tag].push({ path, method, details });
      }
    } else {
      // 没有标签的接口放入未分组列表
      pathsWithoutTags.push({ path, method, details });
    }
  }
}

// 首先添加带标签的接口
for (const [tag, paths] of Object.entries(pathsByTag)) {
  markdown += `## ${tag}\n\n`;
  
  for (const { path, method, details } of paths) {
    markdown += `### ${method.toUpperCase()} ${path}\n\n`;
    markdown += `**摘要**: ${details.summary || '无'}\n\n`;
    markdown += `**描述**: ${details.description || '无'}\n\n`;
    
    // 添加参数信息
    if (details.parameters && details.parameters.length > 0) {
      markdown += `**参数**:\n\n`;
      markdown += `| 名称 | 位置 | 类型 | 必填 | 描述 |\n`;
      markdown += `| ---- | ---- | ---- | ---- | ---- |\n`;
      
      for (const param of details.parameters) {
        const schema = param.schema || {};
        markdown += `| ${param.name} | ${param.in} | ${schema.type || '未知'} | ${param.required ? '是' : '否'} | ${param.description || '无'} |\n`;
      }
      markdown += `\n`;
    }
    
    // 添加请求体信息
    if (details.requestBody) {
      markdown += `**请求体**:\n\n`;
      
      if (details.requestBody.content) {
        for (const [contentType, contentDetails] of Object.entries(details.requestBody.content)) {
          markdown += `- Content-Type: ${contentType}\n`;
          
          if (contentDetails.schema) {
            if (contentDetails.schema.$ref) {
              const schemaName = contentDetails.schema.$ref.split('/').pop();
              markdown += `- Schema: ${schemaName}\n`;
            } else {
              markdown += `- Schema: 内联架构\n`;
            }
          }
        }
      }
      
      markdown += `- 必填: ${details.requestBody.required ? '是' : '否'}\n\n`;
    }
    
    // 添加响应信息
    markdown += `**响应**:\n\n`;
    markdown += `| 状态码 | 描述 |\n`;
    markdown += `| ---- | ---- |\n`;
    
    for (const [statusCode, response] of Object.entries(details.responses)) {
      markdown += `| ${statusCode} | ${response.description || '无'} |\n`;
    }
    markdown += `\n`;
    
    // 添加安全要求
    if (details.security && details.security.length > 0) {
      markdown += `**安全要求**:\n\n`;
      
      for (const security of details.security) {
        for (const [name, scopes] of Object.entries(security)) {
          markdown += `- ${name}`;
          
          if (scopes.length > 0) {
            markdown += ` (作用域: ${scopes.join(', ')})`;
          }
          
          markdown += `\n`;
        }
      }
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  }
}

// 然后添加未分组的接口
if (pathsWithoutTags.length > 0) {
  markdown += `## 未分组的接口\n\n`;
  
  for (const { path, method, details } of pathsWithoutTags) {
    markdown += `### ${method.toUpperCase()} ${path}\n\n`;
    markdown += `**摘要**: ${details.summary || '无'}\n\n`;
    markdown += `**描述**: ${details.description || '无'}\n\n`;
    
    // 添加参数信息
    if (details.parameters && details.parameters.length > 0) {
      markdown += `**参数**:\n\n`;
      markdown += `| 名称 | 位置 | 类型 | 必填 | 描述 |\n`;
      markdown += `| ---- | ---- | ---- | ---- | ---- |\n`;
      
      for (const param of details.parameters) {
        const schema = param.schema || {};
        markdown += `| ${param.name} | ${param.in} | ${schema.type || '未知'} | ${param.required ? '是' : '否'} | ${param.description || '无'} |\n`;
      }
      markdown += `\n`;
    }
    
    // 添加请求体信息
    if (details.requestBody) {
      markdown += `**请求体**:\n\n`;
      
      if (details.requestBody.content) {
        for (const [contentType, contentDetails] of Object.entries(details.requestBody.content)) {
          markdown += `- Content-Type: ${contentType}\n`;
          
          if (contentDetails.schema) {
            if (contentDetails.schema.$ref) {
              const schemaName = contentDetails.schema.$ref.split('/').pop();
              markdown += `- Schema: ${schemaName}\n`;
            } else {
              markdown += `- Schema: 内联架构\n`;
            }
          }
        }
      }
      
      markdown += `- 必填: ${details.requestBody.required ? '是' : '否'}\n\n`;
    }
    
    // 添加响应信息
    markdown += `**响应**:\n\n`;
    markdown += `| 状态码 | 描述 |\n`;
    markdown += `| ---- | ---- |\n`;
    
    for (const [statusCode, response] of Object.entries(details.responses)) {
      markdown += `| ${statusCode} | ${response.description || '无'} |\n`;
    }
    markdown += `\n`;
    
    // 添加安全要求
    if (details.security && details.security.length > 0) {
      markdown += `**安全要求**:\n\n`;
      
      for (const security of details.security) {
        for (const [name, scopes] of Object.entries(security)) {
          markdown += `- ${name}`;
          
          if (scopes.length > 0) {
            markdown += ` (作用域: ${scopes.join(', ')})`;
          }
          
          markdown += `\n`;
        }
      }
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  }
}

// 添加模型定义
if (swaggerJson.components && swaggerJson.components.schemas) {
  markdown += `## 模型定义\n\n`;
  
  for (const [schemaName, schema] of Object.entries(swaggerJson.components.schemas)) {
    markdown += `### ${schemaName}\n\n`;
    
    if (schema.description) {
      markdown += `${schema.description}\n\n`;
    }
    
    if (schema.type) {
      markdown += `**类型**: ${schema.type}\n\n`;
    }
    
    if (schema.properties) {
      markdown += `**属性**:\n\n`;
      markdown += `| 名称 | 类型 | 描述 | 必填 |\n`;
      markdown += `| ---- | ---- | ---- | ---- |\n`;
      
      const requiredProps = schema.required || [];
      
      for (const [propName, prop] of Object.entries(schema.properties)) {
        let type = prop.type || '';
        
        if (prop.$ref) {
          type = prop.$ref.split('/').pop();
        } else if (prop.items && prop.items.$ref) {
          type = `Array<${prop.items.$ref.split('/').pop()}>`;
        } else if (prop.items) {
          type = `Array<${prop.items.type || 'any'}>`;
        }
        
        markdown += `| ${propName} | ${type} | ${prop.description || '无'} | ${requiredProps.includes(propName) ? '是' : '否'} |\n`;
      }
      markdown += `\n`;
    }
    
    if (schema.enum) {
      markdown += `**枚举值**: ${schema.enum.join(', ')}\n\n`;
    }
    
    markdown += `---\n\n`;
  }
}

// 写入文件
fs.writeFileSync('api-docs.md', markdown);
console.log('API文档已生成: api-docs.md'); 