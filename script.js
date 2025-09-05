// 时间显示功能
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const timeElement = document.querySelector('h1');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 搜索功能
function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            // 检查是否是网址
            if (query.includes('.') && !query.includes(' ')) {
                // 添加协议如果没有
                if (!query.startsWith('http://') && !query.startsWith('https://')) {
                    query = 'https://' + query;
                }
                window.open(query, '_blank');
            } else {
                // 使用选定的搜索引擎搜索
                const shortcutManager = window.shortcutManager;
                const searchUrl = shortcutManager.getSearchUrl(query);
                window.open(searchUrl, '_blank');
            }
            event.target.value = '';
        }
    }
}

// 快捷方式管理
class ShortcutManager {
    constructor() {
        this.shortcuts = this.loadShortcuts();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderShortcuts();
    }

    bindEvents() {
        // 搜索框事件
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('keypress', handleSearch);
        }

        // 添加快捷方式按钮
        const addBtn = document.getElementById('add-shortcut-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddModal());
        }

        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }
    }

    loadShortcuts() {
        const saved = localStorage.getItem('shortcuts');
        if (saved) {
            return JSON.parse(saved);
        }
        // 默认快捷方式
        return [
            {
                name: 'Bilibili',
                url: 'https://www.bilibili.com',
                icon: 'https://www.bilibili.com/favicon.ico',
                bgColor: 'bg-blue-100'
            },
            {
                name: '豆瓣',
                url: 'https://www.douban.com',
                icon: 'https://www.douban.com/favicon.ico',
                bgColor: 'bg-green-100'
            },
            {
                name: 'YouTube',
                url: 'https://www.youtube.com',
                icon: 'https://www.youtube.com/favicon.ico',
                bgColor: 'bg-red-100'
            },
            {
                name: 'GitHub',
                url: 'https://github.com',
                icon: 'https://github.com/favicon.ico',
                bgColor: 'bg-gray-200'
            }
        ];
    }

    saveShortcuts() {
        localStorage.setItem('shortcuts', JSON.stringify(this.shortcuts));
    }

    getSearchEngine() {
        return localStorage.getItem('searchEngine') || 'bing';
    }

    setSearchEngine(engine) {
        localStorage.setItem('searchEngine', engine);
    }

    getSearchUrl(query) {
        const searchEngine = this.getSearchEngine();
        const encodedQuery = encodeURIComponent(query);
        
        switch (searchEngine) {
            case 'google':
                return `https://www.google.com/search?q=${encodedQuery}`;
            case 'baidu':
                return `https://www.baidu.com/s?wd=${encodedQuery}`;
            case 'bing':
            default:
                return `https://www.bing.com/search?q=${encodedQuery}`;
        }
    }

    renderShortcuts() {
        const container = document.getElementById('shortcuts-container');
        if (!container) return;

        // 清空现有内容（除了添加按钮）
        const addButton = container.querySelector('#add-shortcut-btn');
        container.innerHTML = '';

        // 渲染快捷方式
        this.shortcuts.forEach((shortcut, index) => {
            const shortcutElement = this.createShortcutElement(shortcut, index);
            container.appendChild(shortcutElement);
        });

        // 重新添加添加按钮
        if (addButton) {
            container.appendChild(addButton);
        }
    }

    createShortcutElement(shortcut, index) {
        const element = document.createElement('a');
        element.className = 'flex flex-col items-center justify-center p-4 rounded-xl shortcut-item shadow-md';
        element.href = shortcut.url;
        element.target = '_blank';

        element.innerHTML = `
            <div class="delete-btn" data-index="${index}">
                <span class="material-symbols-outlined text-sm">close</span>
            </div>
            <div class="flex items-center justify-center size-16 ${shortcut.bgColor} rounded-full mb-3">
                <img alt="${shortcut.name}" class="h-8 w-8" src="${shortcut.icon}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"/>
                <div class="icon-fallback">${shortcut.name.charAt(0).toUpperCase()}</div>
            </div>
            <p class="font-semibold text-sm">${shortcut.name}</p>
        `;

        // 添加删除事件
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeShortcut(index);
        });

        return element;
    }

    async addShortcut(name, url, icon = '', bgColor = 'bg-gray-100') {
        // 自动获取图标
        if (!icon) {
            try {
                icon = await getWebsiteIcon(url);
            } catch (error) {
                console.log('获取图标失败，使用默认图标:', error);
                icon = 'https://www.bing.com/s/a/h/default';
            }
        }
        
        const newShortcut = {
            name,
            url: url.startsWith('http') ? url : `https://${url}`,
            icon,
            bgColor
        };
        this.shortcuts.push(newShortcut);
        this.saveShortcuts();
        this.renderShortcuts();
    }

    removeShortcut(index) {
        this.shortcuts.splice(index, 1);
        this.saveShortcuts();
        this.renderShortcuts();
    }

    showAddModal() {
        const modal = this.createModal('添加快捷方式', this.createAddForm());
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    showSettingsModal() {
        const modal = this.createModal('设置', this.createSettingsForm());
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                ${content}
            </div>
        `;

        // 关闭按钮事件
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.hideModal(modal));

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });

        return modal;
    }

    createAddForm() {
        return `
            <form id="add-shortcut-form">
                <div class="form-group">
                    <label class="form-label" for="shortcut-name">名称</label>
                    <input type="text" id="shortcut-name" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="shortcut-url">网址</label>
                    <input type="url" id="shortcut-url" class="form-input" required>
                    <small class="text-gray-500 text-sm">图标将自动从网站获取</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
                    <button type="submit" class="btn btn-primary">添加</button>
                </div>
            </form>
        `;
    }

    createSettingsForm() {
        const currentSearchEngine = this.getSearchEngine();
        return `
            <div class="form-group">
                <label class="form-label">搜索引擎</label>
                <select id="search-engine" class="form-input">
                    <option value="bing" ${currentSearchEngine === 'bing' ? 'selected' : ''}>必应 (Bing)</option>
                    <option value="google" ${currentSearchEngine === 'google' ? 'selected' : ''}>Google</option>
                    <option value="baidu" ${currentSearchEngine === 'baidu' ? 'selected' : ''}>百度</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">关闭</button>
            </div>
        `;
    }

    showModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.remove();
    }
}

// 图标管理
async function getWebsiteIcon(url) {
    try {
        // 确保URL有协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const domain = new URL(url).hostname;
        
        // 尝试多个图标源
        const iconSources = [
            `https://${domain}/favicon.ico`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            `https://www.bing.com/s/a/h/${domain}`
        ];
        
        // 依次尝试每个图标源
        for (const iconUrl of iconSources) {
            try {
                const response = await fetch(iconUrl, { 
                    method: 'HEAD',
                    mode: 'cors'
                });
                if (response.ok) {
                    return iconUrl;
                }
            } catch (e) {
                // 继续尝试下一个源
                continue;
            }
        }
        
        // 如果所有方法都失败，使用默认图标
        return 'https://www.google.com/s2/favicons?domain=default&sz=32';
        
    } catch (error) {
        console.log('获取图标失败，使用默认图标:', error);
        return 'https://www.google.com/s2/favicons?domain=default&sz=32';
    }
}


// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);

    // 初始化快捷方式管理器
    window.shortcutManager = new ShortcutManager();


    // 处理添加快捷方式表单提交
    document.addEventListener('submit', async function(e) {
        if (e.target.id === 'add-shortcut-form') {
            e.preventDefault();
            const name = document.getElementById('shortcut-name').value;
            const url = document.getElementById('shortcut-url').value;
            
            // 显示加载状态
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '添加中...';
            submitBtn.disabled = true;
            
            try {
                await window.shortcutManager.addShortcut(name, url);
                e.target.closest('.modal').remove();
            } catch (error) {
                console.error('添加快捷方式失败:', error);
                alert('添加快捷方式失败，请重试');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    // 处理搜索引擎设置
    document.addEventListener('change', function(e) {
        if (e.target.id === 'search-engine') {
            window.shortcutManager.setSearchEngine(e.target.value);
        }
    });
});
