# 新标签页 (New Tab)

一个现代化、美观且功能丰富的新标签页应用，提供实时时间显示、智能搜索和可自定义的快捷方式管理。

## ✨ 功能特性

### 🕐 实时时间显示
- 大字体显示当前时间
- 自动更新，无需刷新页面
- 响应式设计，适配不同屏幕尺寸

### 🔍 智能搜索
- 支持多种搜索引擎（必应、Google、百度）
- 智能识别网址和搜索关键词
- 自动添加协议前缀（https://）
- 可自定义默认搜索引擎

### ⚡ 快捷方式管理
- 预设常用网站快捷方式（Bilibili、豆瓣、YouTube、GitHub）
- 支持添加自定义快捷方式
- 自动获取网站图标
- 支持删除不需要的快捷方式
- 数据本地存储，永久保存

### 🎨 现代化界面
- 渐变背景设计
- 毛玻璃效果
- 响应式布局
- 流畅的动画效果
- 悬停交互反馈

## 🚀 快速开始

### 安装使用

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Newtab
   ```

2. **直接使用**
   - 用浏览器打开 `index.html` 文件即可使用
   - 无需安装任何依赖或服务器

3. **设置为浏览器新标签页**
   - Chrome/Edge: 安装扩展程序如 "Custom New Tab" 或 "New Tab Redirect"
   - Firefox: 安装 "New Tab Override" 扩展
   - 将 `index.html` 的完整路径设置为新标签页地址

## 📁 项目结构

```
Newtab/
├── index.html          # 主页面文件
├── script.js           # JavaScript 功能代码
├── styles.css          # 样式文件
├── no.png             # 默认图标（当网站图标加载失败时使用）
└── README.md          # 项目说明文档
```

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 交互逻辑
- **Tailwind CSS** - 样式框架
- **Material Symbols** - 图标库
- **Google Fonts** - 字体

## 📖 使用说明

### 搜索功能
- 在搜索框中输入关键词，按回车键进行搜索
- 输入网址（如 `github.com`）可直接访问网站
- 系统会自动识别并添加 `https://` 前缀

### 快捷方式管理
1. **添加快捷方式**
   - 点击"添加快捷方式"按钮
   - 输入网站名称和网址
   - 系统会自动获取网站图标

2. **删除快捷方式**
   - 将鼠标悬停在快捷方式上
   - 点击右上角的删除按钮

3. **修改搜索引擎**
   - 点击右下角的"自定义"按钮
   - 在设置中选择喜欢的搜索引擎

## ⚙️ 自定义配置

### 修改默认快捷方式
编辑 `script.js` 文件中的 `loadShortcuts()` 方法：

```javascript
return [
    {
        name: '网站名称',
        url: 'https://example.com',
        icon: 'https://example.com/favicon.ico',
        bgColor: 'bg-blue-100'
    }
    // 添加更多快捷方式...
];
```

### 修改背景样式
编辑 `styles.css` 文件中的 `body` 样式：

```css
body {
    background: linear-gradient(135deg, #颜色1 0%, #颜色2 50%, #颜色3 100%);
}
```

### 添加新的搜索引擎
在 `script.js` 的 `getSearchUrl()` 方法中添加：

```javascript
case 'your-search-engine':
    return `https://your-search-engine.com/search?q=${encodedQuery}`;
```

## 🌐 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 响应式支持

- 桌面端：完整功能体验
- 平板端：适配中等屏幕
- 移动端：优化触摸操作

## 🔧 开发说明

### 本地开发
1. 直接打开 `index.html` 进行开发
2. 修改代码后刷新浏览器即可看到效果
3. 使用浏览器开发者工具进行调试

### 数据存储
- 使用 `localStorage` 存储用户设置和快捷方式
- 数据保存在浏览器本地，不会上传到服务器

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Material Symbols](https://fonts.google.com/icons) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务

---

**享受您的新标签页体验！** 🎉
