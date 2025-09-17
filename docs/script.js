// 状态描述映射
const statusMap = {
    0: "未检查",
    1: "自动检测为东方",
    2: "自动检测为非东方",
    3: "人工检测为东方",
    4: "人工检测为非东方"
};

// 格式化日期
function formatDate(timestamp, locale="zh-CN") {
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
    const minutes = Math.floor((totalSeconds % 3600 ) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) {
        parts.push(hours.toString().padStart(2, '0'));
    }
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(seconds.toString().padStart(2, '0'));

    return parts.join(':')
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    loadVideoData();
})

// 加载视频数据
async function loadVideoData() {
    try {
        // 从data加载videos.json
        const response = await fetch('./data/videos.json');

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }

        const videoData = await response.json();

        // 渲染视频列表
        renderVideos(videoData);

        // 更新数据时间戳
        updateDataTimestamp();
    } catch (error) {
        console.error('加载视频失败:', error);
        showError(error.message);
    }
}

// 渲染视频列表
function renderVideos(videoData) {
    const container = document.getElementById('videos-container');
    container.innerHTML = '';

    if (videoData.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    <div>没有找到视频数据</div>
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
    const row = document.createElement('tr')

    // 计算视频总时长
    let totalDuration = 0;
    video.parts.forEach(part => {
        totalDuration += part.duration;
    });

    row.innerHTML = `
        <td>
            <div class="video-title">${video.title}</div>
            <div class="video-meta">AV${video.aid} | ${video.bvid} | 时长: ${formatTime(totalDuration)}</div>
            <div class="tags">${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        </td>
        <td>${video.uploader_name}</td>
        <td>${formatDate(video.created)}</td>
        <td>
            <div class="status status-${video.touhou_status}">
                ${statusMap[video.touhou_status]}
            </div>
        </td>
        <td>
            <div class="parts-container">
                ${video.parts.map(part => `
                    <div class="part-item">
                        <div class="part-title">P${part.page}: ${part.part}</div>
                        <div class="part-meta">
                            <span>时长: ${formatTime(part.duration)}</span>
                            <span>创建: ${formatDate(part.ctime)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </td>
    `;

    return row;
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
    document.getElementById('data-update').textContent =
        `数据更新于 ${dateTimeStr}`;
}

// 显示错误信息
function showError(message) {
    const container = document.getElementById('videos-container');
    container.innerHTML = `
        <tr>
            <td colspan="5" class="error-message">
                <div>视频数据加载失败: ${message}</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">
                    请确保videos.json文件位于data文件夹下
                </div>
                <button class="reload-btn" onclick="location.relaod()">重新加载</button>
            </td>
        </tr>
    `;
    document.getElementById('data-update').textContent = "数据加载失败";
}