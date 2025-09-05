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

function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            if (query.includes('.') && !query.includes(' ')) {
                if (!query.startsWith('http://') && !query.startsWith('https://')) {
                    query = 'https://' + query;
                }
                window.open(query, '_blank');
            } else {
                const shortcutManager = window.shortcutManager;
                const searchUrl = shortcutManager.getSearchUrl(query);
                window.open(searchUrl, '_blank');
            }
            event.target.value = '';
        }
    }
}

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
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('keypress', handleSearch);
        }

        const addBtn = document.getElementById('add-shortcut-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddModal());
        }

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

        const addButton = container.querySelector('#add-shortcut-btn');
        container.innerHTML = '';

        this.shortcuts.forEach((shortcut, index) => {
            const shortcutElement = this.createShortcutElement(shortcut, index);
            container.appendChild(shortcutElement);
        });

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
                <img alt="${shortcut.name}" class="h-8 w-8" src="${shortcut.icon}" onerror="this.src='no.png';"/>
            </div>
            <p class="font-semibold text-sm">${shortcut.name}</p>
        `;

        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeShortcut(index);
        });

        return element;
    }

    addShortcut(name, url, icon = '', bgColor = 'bg-gray-100') {
        const newShortcut = {
            name,
            url: url.startsWith('http') ? url : `https://${url}`,
            icon: icon || this.getDefaultIcon(url),
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

    getDefaultIcon(url) {
        try {
            const domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
            return `https://${domain}/favicon.ico`;
        } catch (e) {
            return '';
        }
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

        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.hideModal(modal));

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



document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);

    window.shortcutManager = new ShortcutManager();

    document.addEventListener('submit', function(e) {
        if (e.target.id === 'add-shortcut-form') {
            e.preventDefault();
            const name = document.getElementById('shortcut-name').value;
            const url = document.getElementById('shortcut-url').value;
            
            try {
                window.shortcutManager.addShortcut(name, url);
                e.target.closest('.modal').remove();
            } catch (error) {
                console.error('添加快捷方式失败:', error);
                alert('添加快捷方式失败，请重试');
            }
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target.id === 'search-engine') {
            window.shortcutManager.setSearchEngine(e.target.value);
        }
    });
});
