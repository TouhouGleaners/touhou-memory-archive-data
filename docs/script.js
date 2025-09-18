// 状态描述映射
const statusMap = {
    0: "未检查",
    1: "自动检测为东方",
    2: "自动检测为非东方",
    3: "人工检测为东方",
    4: "人工检测为非东方",
    5: "自动+人工检测为东方"
};

// 全局存储视频数据和筛选状态
let allVideos = [];
let currentFilterState = {
    searchTerm: '',
    statusFilter: 'all'
};

// 格式化日期
function formatDate(timestamp, locale = "zh-CN") {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 格式化时间
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) {
        parts.push(hours.toString().padStart(2, '0'));
    }
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(seconds.toString().padStart(2, '0'));

    return parts.join(':');
}

// 应用筛选函数
function applyFilters() {
    let filteredVideos = [...allVideos];
    
    // 应用状态筛选
    if (currentFilterState.statusFilter !== 'all') {
        if (currentFilterState.statusFilter === '5') {
            filteredVideos = filteredVideos.filter(video => 
                video.touhou_status === 1 || video.touhou_status === 3
            );
        } else {
            const statusNum = parseInt(currentFilterState.statusFilter, 10);
            filteredVideos = filteredVideos.filter(video => 
                video.touhou_status === statusNum
            );
        }
    }
    
    // 应用搜索筛选
    if (currentFilterState.searchTerm) {
        const term = currentFilterState.searchTerm.toLowerCase().trim();
        
        // 搜索多个字段：标题、UP主、标签、BVID、AID
        filteredVideos = filteredVideos.filter(video => {
            // 标题
            const titleMatch = video.title && 
                video.title.toLowerCase().includes(term);
            
            // UP主
            const uploaderMatch = video.uploader_name && 
                video.uploader_name.toLowerCase().includes(term);
            
            // 标签
            const tagsMatch = video.tags && 
                video.tags.some(tag => tag.toLowerCase().includes(term));
            
            // AID
            const aidMatch = video.aid && 
                video.aid.toString().includes(term);

            // BVID
            const bvidMatch = video.bvid && 
                video.bvid.toLowerCase().includes(term);
            
            return titleMatch || uploaderMatch || tagsMatch || bvidMatch || aidMatch;
        });
    }
    
    // 渲染结果
    renderVideos(filteredVideos);
}

// 处理搜索操作
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        currentFilterState.searchTerm = searchInput.value;
        applyFilters();
    }
}

// 处理状态筛选变化
function handleStatusChange() {
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        currentFilterState.statusFilter = statusFilter.value;
        applyFilters();
    }
}

// 重置所有筛选
function resetFilters() {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'all';
    
    currentFilterState = {
        searchTerm: '',
        statusFilter: 'all'
    };
    applyFilters();
}

// 渲染视频列表
function renderVideos(videoData) {
    const container = document.getElementById('videos-container');
    const counter = document.getElementById('video-counter');

    if (!container) return;
    
    container.innerHTML = '';
    
    if (counter) {
        counter.textContent = `找到 ${videoData.length} 个视频`;
    }
    
    // 更新筛选状态显示
    updateFilterDisplay();
    
    if (videoData.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="no-results">
                    <div>没有找到匹配的视频</div>
                    <div class="suggestion">尝试使用不同的搜索词或重置筛选</div>
                </td>
            </tr>
        `;
        return;
    }

    videoData.forEach(video => {
        const videoRow = createVideoRow(video);
        container.appendChild(videoRow);
    });
}

// 创建单个视频行
function createVideoRow(video) {
    const row = document.createElement('tr');

    // 计算视频总时长
    let totalDuration = 0;
    if (video.parts && video.parts.length > 0) {
        video.parts.forEach(part => {
            totalDuration += part.duration;
        });
    }

    // 处理标签
    const tagsHtml = video.tags && video.tags.length > 0 ? 
        `<div class="tags">${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : 
        '';
    
    // 处理分P信息
    let partsHtml = '';
    if (video.parts && video.parts.length > 0) {
        partsHtml = video.parts.map(part => `
            <div class="part-item">
                <div class="part-title">P${part.page}: ${part.part}</div>
                <div class="part-meta">
                    <span>时长: ${formatTime(part.duration)}</span>
                    <span>创建: ${formatDate(part.ctime)}</span>
                </div>
            </div>
        `).join('');
    } else {
        partsHtml = '<div class="part-item">无分P信息</div>';
    }

    // 高亮匹配的搜索词
    const highlightSearchTerm = (text) => {
        if (!currentFilterState.searchTerm || !text) return text;
        
        const term = currentFilterState.searchTerm.toLowerCase();
        const lowerText = text.toLowerCase();
        const startIndex = lowerText.indexOf(term);
        
        if (startIndex === -1) return text;
        
        const endIndex = startIndex + term.length;
        return `${text.substring(0, startIndex)}<span class="highlight">${text.substring(startIndex, endIndex)}</span>${text.substring(endIndex)}`;
    };

    // 应用高亮到标题和UP主
    const highlightedTitle = highlightSearchTerm(video.title || '无标题');
    const highlightedUploader = highlightSearchTerm(video.uploader_name || '未知UP主');

    row.innerHTML = `
        <td>
            <div class="video-title">${highlightedTitle}</div>
            <div class="video-meta">AV${video.aid || ''} | ${video.bvid || ''} | 时长: ${formatTime(totalDuration)}</div>
            ${tagsHtml}
        </td>
        <td>${highlightedUploader}</td>
        <td>${video.created ? formatDate(video.created) : '未知日期'}</td>
        <td>
            <div class="status status-${video.touhou_status}">
                ${statusMap[video.touhou_status] || '未知状态'}
            </div>
        </td>
        <td>
            <div class="parts-container">
                ${partsHtml}
            </div>
        </td>
    `;

    return row;
}

// 更新UI显示当前筛选状态
function updateFilterDisplay() {
    const statusDisplay = document.getElementById('current-filter');
    if (!statusDisplay) return;
    
    // 获取状态文本
    let statusText = '所有状态';
    if (currentFilterState.statusFilter !== 'all') {
        if (currentFilterState.statusFilter === '5') {
            statusText = statusMap['5'];
        } else {
            statusText = statusMap[currentFilterState.statusFilter] || `状态 ${currentFilterState.statusFilter}`;
        }
    }
    
    // 获取搜索文本
    const searchText = currentFilterState.searchTerm ? 
        `搜索: "${currentFilterState.searchTerm}"` : 
        '';
    
    // 组合显示文本
    statusDisplay.textContent = `${statusText} ${searchText}`.trim();
}

// 加载视频数据
async function loadVideoData() {
    try {
        const response = await fetch('./data/videos.json');
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        allVideos = await response.json();
        applyFilters(); // 初始加载后应用筛选
        updateDataTimestamp();
    } catch (error) {
        console.error('加载视频失败:', error);
        showError(error.message);
    }
}

// 更新数据时间戳
function updateDataTimestamp() {
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const dataUpdateEl = document.getElementById('data-update');
    if (dataUpdateEl) {
        dataUpdateEl.textContent = `数据更新于 ${dateTimeStr}`;
    }
}

// 显示错误信息
function showError(message) {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = `
        <tr>
            <td colspan="5" class="error-message">
                <div>视频数据加载失败: ${message}</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">
                    请确保videos.json文件位于data文件夹下
                </div>
                <button class="reload-btn" onclick="location.reload()">重新加载</button>
            </td>
        </tr>
    `;
    
    const dataUpdateEl = document.getElementById('data-update');
    if (dataUpdateEl) {
        dataUpdateEl.textContent = "数据加载失败";
    }
}

// ====================初始化页面====================
document.addEventListener('DOMContentLoaded', () => {
    // 设置事件监听器
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    
    // 搜索输入防抖
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                handleSearch();
            }, 500);
        });
        
        // 回车键搜索支持
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(debounceTimer); // 清除防抖定时器
                handleSearch();
            }
        });
    }
    
    // 状态筛选变化
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusChange);
    }
    
    // 加载数据
    loadVideoData();
});
