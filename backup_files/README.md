# MCP服务配置说明

## 配置步骤

1. 打开Cursor IDE
2. 进入 `Cursor Settings > Features > MCP`
3. 点击 `+ Add New MCP Server` 按钮
4. 在弹出的配置窗口中填写以下信息：
   - Type: stdio
   - Name: sequential-thinking
   - Command: `node C:\Users\1024\AppData\Roaming\npm\node_modules\@modelcontextprotocol\server-sequential-thinking\dist\index.js`

## 验证配置

1. 配置完成后，可以在Cursor的Agent功能中使用Sequential Thinking工具
2. 服务启动时会显示 "Sequential Thinking MCP Server running on stdio"

## 注意事项

1. 确保已全局安装 `@modelcontextprotocol/server-sequential-thinking` 包
2. 如遇到问题，可以通过以下方式排查：
   - 检查Node.js是否正确安装
   - 验证包是否正确安装在全局目录
   - 确认路径中不包含特殊字符

## 手动启动方式

如果需要手动启动服务，可以：

1. 使用提供的 `start-mcp.bat` 批处理文件
2. 或直接在命令行运行配置文件中指定的命令

## 配置文件位置

MCP配置文件位于：`cursor/mcp.json` 