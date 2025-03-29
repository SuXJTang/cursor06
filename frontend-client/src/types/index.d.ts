// 路径别名类型定义
declare module '@/*' {
  const content: any;
  export default content;
}

// 全局组件类型定义
declare module '@element-plus/icons-vue' {
  import { Component } from 'vue';
  const components: {
    [key: string]: Component;
  };
  export const School: Component;
  export const UserFilled: Component;
  export const Menu: Component;
  export const Close: Component;
  export const Search: Component;
  export const Setting: Component;
  export const Plus: Component;
  export const Delete: Component;
  export const Edit: Component;
  export const View: Component;
  export const More: Component;
  export const Location: Component;
  export const Download: Component;
  export const Upload: Component;
  export const Refresh: Component;
  export const Camera: Component;
  export const Chart: Component;
  export const Help: Component;
  export const Info: Component;
  export const Loading: Component;
  export const Message: Component;
  export const Star: Component;
  export const Switch: Component;
  export const Tickets: Component;
  export const User: Component;
  export const Warning: Component;
}

// 为.vue文件定义类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
} 