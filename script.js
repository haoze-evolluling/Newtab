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
                icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_mmTnMtPCj_MKK8FsWpnxBhWVNdFVSiWW4BujyQUtdqt-vuveed8HRMY_BJ7Tbee6tu3Ow1qHpL4tdDShGiTXDrpeHhVQhkkcoDr66vJOrPq2sTWA_6btNNYbmfUuFqBccJ5hzS8SsAOmTIOS3yFDMG0y-tQZW38g8jh1WFF-NQ3dJXY0K0iRXTOp1v4i4KJZf-YdvFhQs06U_2-Mj06171PKnFw7ylgckIxcAFAms1wSsjPAHnXepmLPr-t-P9N3BG0wjW5OsK8',
                bgColor: 'bg-blue-100'
            },
            {
                name: '豆瓣',
                url: 'https://www.douban.com',
                icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzbzL6CjpKypebzKMU3golrBJ_0cFdRXa71JbI_bpyA7ijSNRZFunCbl62YGR05VzJ1w-WT4mRbpceCiSMWk4AcUBVvNC9Bc1Fl3jEXOqqTe0bDOGzrgiFei4113l0JZMGg_-Lk00Zg94LQ-fRXdTsVaMVhUhUqqBZWBPjVqq7LZ5IEbfK_UmMYpQFXYRSMAlp2oFk-QZhw7azTJbAs74IXfVNFGf-FHC7ZaogkPnEQY7FauprVdC_jWRSqkE7mCX-WA76Hj8TI4I',
                bgColor: 'bg-green-100'
            },
            {
                name: 'YouTube',
                url: 'https://www.youtube.com',
                icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2OG3oGytAWFs22FEem5ofQTD9c-c8Ukp9J5p9wpZufETiuy4_73FwLS1euJM_34ue6ea_k4E9hPFRlTyfCZsczh01XzF7dejaI5CWKvVZJ10SyGI7cs2cavOUIg6HTgVB1oMbAFEuMNrIT84kYSlAf21I1NcHe9V7mZQBLcs384gd4gbNxLsI5AfaDYfADuPH7ScbFA_vO1iOcW_i-c7v3UPDfNzGLS1tN6NppYqC8NFVqRD39tQZr1NsIBlBEL6cDv8DukgOlIo',
                bgColor: 'bg-red-100'
            },
            {
                name: 'GitHub',
                url: 'https://github.com',
                icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaej0kZi2YhFs28mx8m5K77w0N1d9vQ4lP0szb3XrydO2BJy6xyTOd1kY5CRsq_9K6IxE9v0_cIW4oF1KCOVIj6aaE3JOEn9iomt68FF31_w_fzW4NqJMgNtXJv4zQXeaHbpzKuXFLHZrYJuvHGh4x6Ht8GdEESmivCg6VE56hAqO6hhwrWfht1F4z75AbGo3NVa6e1K2-DRdIboQo4rv54CLgAmnNoYkAbRVzhfVwNovpb_qMgBElRyAIEpV08MrrIKgmkEPoO2E',
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
                <img alt="${shortcut.name}" class="h-8 w-8" src="${shortcut.icon}"/>
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

    addShortcut(name, url, icon = '', bgColor = 'bg-gray-100') {
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
                </div>
                <div class="form-group">
                    <label class="form-label" for="shortcut-icon">图标URL（可选）</label>
                    <input type="url" id="shortcut-icon" class="form-input">
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
            <div class="form-group">
                <label class="form-label">背景图片</label>
                <input type="url" id="bg-image-url" class="form-input" placeholder="输入图片URL">
                <button type="button" class="btn btn-secondary" onclick="resetBackground()">重置默认背景</button>
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
        
        // 尝试获取favicon.ico
        const faviconUrl = `https://${domain}/favicon.ico`;
        
        // 检查favicon是否存在
        const response = await fetch(faviconUrl, { method: 'HEAD' });
        if (response.ok) {
            return faviconUrl;
        }
        
        // 如果favicon不存在，使用必应的ico服务
        return `https://www.bing.com/s/a/h/${domain}`;
        
    } catch (error) {
        console.log('获取图标失败，使用必应ico服务:', error);
        // 如果所有方法都失败，使用必应的ico服务
        try {
            const domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
            return `https://www.bing.com/s/a/h/${domain}`;
        } catch (e) {
            // 最后的备用方案
            return 'https://www.bing.com/s/a/h/default';
        }
    }
}

// 背景图片管理
function resetBackground() {
    const defaultBg = 'https://images.unsplash.com/photo-1507525428034-b723a996f6ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    document.body.style.backgroundImage = `url('${defaultBg}')`;
    localStorage.removeItem('customBackground');
}

function setCustomBackground(url) {
    if (url) {
        document.body.style.backgroundImage = `url('${url}')`;
        localStorage.setItem('customBackground', url);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);

    // 初始化快捷方式管理器
    window.shortcutManager = new ShortcutManager();

    // 加载自定义背景
    const customBg = localStorage.getItem('customBackground');
    if (customBg) {
        setCustomBackground(customBg);
    }

    // 处理添加快捷方式表单提交
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'add-shortcut-form') {
            e.preventDefault();
            const name = document.getElementById('shortcut-name').value;
            const url = document.getElementById('shortcut-url').value;
            const icon = document.getElementById('shortcut-icon').value;
            
            window.shortcutManager.addShortcut(name, url, icon);
            e.target.closest('.modal').remove();
        }
    });

    // 处理背景图片设置
    document.addEventListener('change', function(e) {
        if (e.target.id === 'bg-image-url') {
            setCustomBackground(e.target.value);
        }
        
        // 处理搜索引擎设置
        if (e.target.id === 'search-engine') {
            window.shortcutManager.setSearchEngine(e.target.value);
        }
    });
});
