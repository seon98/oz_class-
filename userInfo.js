// 사용자 정보 JavaScript 함수들

/**
 * navigator 객체에서 브라우저 정보 가져오기
 */
function getBrowserInfo() {
    const browserInfo = document.getElementById('browserInfo');
    
    const info = {
        '사용자 에이전트': navigator.userAgent,
        '브라우저 이름': getBrowserName(),
        '브라우저 버전': getBrowserVersion(),
        '플랫폼': navigator.platform,
        '언어': navigator.language,
        '지원 언어': navigator.languages ? navigator.languages.join(', ') : '사용할 수 없음',
        '쿠키 활성화': navigator.cookieEnabled,
        '온라인 상태': navigator.onLine,
        'Java 활성화': navigator.javaEnabled(),
        '공급업체': navigator.vendor || '사용할 수 없음'
    };
    
    displayInfo(browserInfo, info);
}

/**
 * 브라우저 이름을 감지하는 도우미 함수
 */
function getBrowserName() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        return 'Google Chrome';
    } else if (userAgent.includes('Firefox')) {
        return 'Mozilla Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        return 'Safari';
    } else if (userAgent.includes('Edg')) {
        return 'Microsoft Edge';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        return 'Opera';
    } else {
        return '알 수 없는 브라우저';
    }
}

/**
 * 브라우저 버전을 가져오는 도우미 함수
 */
function getBrowserVersion() {
    const userAgent = navigator.userAgent;
    let version = '알 수 없음';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
        version = match ? match[1] : '알 수 없음';
    } else if (userAgent.includes('Firefox')) {
        const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
        version = match ? match[1] : '알 수 없음';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        const match = userAgent.match(/Version\/(\d+\.\d+)/);
        version = match ? match[1] : '알 수 없음';
    } else if (userAgent.includes('Edg')) {
        const match = userAgent.match(/Edg\/(\d+\.\d+)/);
        version = match ? match[1] : '알 수 없음';
    }
    
    return version;
}

/**
 * 사용자의 지리적 위치 가져오기
 */
function getUserLocation() {
    const locationInfo = document.getElementById('locationInfo');
    
    if (!navigator.geolocation) {
        locationInfo.innerHTML = '<div class="info-section"><div class="info-title">오류</div><div class="info-value">이 브라우저에서는 지리적 위치를 지원하지 않습니다.</div></div>';
        return;
    }
    
    locationInfo.innerHTML = '<div class="info-section"><div class="info-title">상태</div><div class="info-value">위치를 가져오는 중...</div></div>';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const info = {
                '위도': position.coords.latitude.toFixed(6),
                '경도': position.coords.longitude.toFixed(6),
                '정확도': position.coords.accuracy + ' 미터',
                '고도': position.coords.altitude ? position.coords.altitude + ' 미터' : '사용할 수 없음',
                '고도 정확도': position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy + ' 미터' : '사용할 수 없음',
                '방향': position.coords.heading ? position.coords.heading + ' 도' : '사용할 수 없음',
                '속도': position.coords.speed ? position.coords.speed + ' m/s' : '사용할 수 없음',
                '타임스탬프': new Date(position.timestamp).toLocaleString()
            };
            
            displayInfo(locationInfo, info);
        },
        function(error) {
            let errorMessage = '';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '사용자가 지리적 위치 요청을 거부했습니다.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '위치 정보를 사용할 수 없습니다.';
                    break;
                case error.TIMEOUT:
                    errorMessage = '사용자 위치를 가져오는 요청이 시간 초과되었습니다.';
                    break;
                default:
                    errorMessage = '알 수 없는 오류가 발생했습니다.';
                    break;
            }
            
            locationInfo.innerHTML = `<div class="info-section"><div class="info-title">오류</div><div class="info-value">${errorMessage}</div></div>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

/**
 * 화면 정보 가져오기
 */
function getScreenInfo() {
    const screenInfo = document.getElementById('screenInfo');
    
    const info = {
        '화면 너비': screen.width + ' 픽셀',
        '화면 높이': screen.height + ' 픽셀',
        '사용 가능한 너비': screen.availWidth + ' 픽셀',
        '사용 가능한 높이': screen.availHeight + ' 픽셀',
        '색상 깊이': screen.colorDepth + ' 비트',
        '픽셀 깊이': screen.pixelDepth + ' 비트',
        '창 너비': window.innerWidth + ' 픽셀',
        '창 높이': window.innerHeight + ' 픽셀',
        '창 외부 너비': window.outerWidth + ' 픽셀',
        '창 외부 높이': window.outerHeight + ' 픽셀',
        '장치 픽셀 비율': window.devicePixelRatio || '사용할 수 없음'
    };
    
    displayInfo(screenInfo, info);
}

/**
 * 사용자 정보를 localStorage에 저장
 */
function saveUserInfo() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const savedUserInfo = document.getElementById('savedUserInfo');
    
    if (!userName.trim() || !userEmail.trim()) {
        savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">오류</div><div class="info-value">이름과 이메일 필드를 모두 입력해주세요.</div></div>';
        return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">오류</div><div class="info-value">유효한 이메일 주소를 입력해주세요.</div></div>';
        return;
    }
    
    const userInfo = {
        name: userName,
        email: userEmail,
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
    };
    
    try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">성공</div><div class="info-value">사용자 정보가 성공적으로 저장되었습니다!</div></div>';
        
        // 양식 지우기
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
    } catch (error) {
        savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">오류</div><div class="info-value">사용자 정보 저장에 실패했습니다: ' + error.message + '</div></div>';
    }
}

/**
 * localStorage에서 사용자 정보 불러오기
 */
function loadUserInfo() {
    const savedUserInfo = document.getElementById('savedUserInfo');
    
    try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
            savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">데이터 없음</div><div class="info-value">저장된 사용자 정보를 찾을 수 없습니다.</div></div>';
            return;
        }
        
        const parsedInfo = JSON.parse(userInfo);
        const info = {
            '이름': parsedInfo.name,
            '이메일': parsedInfo.email,
            '저장 시간': new Date(parsedInfo.timestamp).toLocaleString(),
            '세션 ID': parsedInfo.sessionId
        };
        
        displayInfo(savedUserInfo, info);
        
    } catch (error) {
        savedUserInfo.innerHTML = '<div class="info-section"><div class="info-title">오류</div><div class="info-value">사용자 정보 불러오기에 실패했습니다: ' + error.message + '</div></div>';
    }
}

/**
 * 장치 정보 가져오기
 */
function getDeviceInfo() {
    const deviceInfo = document.getElementById('deviceInfo');
    
    const info = {
        '장치 유형': getDeviceType(),
        '운영 체제': getOperatingSystem(),
        '터치 지원': 'ontouchstart' in window ? '예' : '아니오',
        '하드웨어 동시성': navigator.hardwareConcurrency || '사용할 수 없음',
        '최대 터치 포인트': navigator.maxTouchPoints || '사용할 수 없음',
        '메모리 (GB)': navigator.deviceMemory ? navigator.deviceMemory + ' GB' : '사용할 수 없음',
        '연결 유형': getConnectionType(),
        '배터리 상태': 'getBattery' in navigator ? '사용 가능 (콘솔 확인)' : '사용할 수 없음',
        '진동 지원': 'vibrate' in navigator ? '예' : '아니오'
    };
    
    displayInfo(deviceInfo, info);
    
    // 배터리 정보 가져오기 (사용 가능한 경우)
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            console.log('배터리 정보:');
            console.log('충전 중: ' + battery.charging);
            console.log('레벨: ' + (battery.level * 100) + '%');
            console.log('충전 시간: ' + battery.chargingTime + ' 초');
            console.log('방전 시간: ' + battery.dischargingTime + ' 초');
        }).catch(function(error) {
            console.log('배터리 API 오류:', error);
        });
    }
}

/**
 * 네트워크 정보 가져오기
 */
function getNetworkInfo() {
    const networkInfo = document.getElementById('networkInfo');
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    let info = {
        '온라인 상태': navigator.onLine ? '온라인' : '오프라인',
        '연결 API': connection ? '사용 가능' : '사용할 수 없음'
    };
    
    if (connection) {
        info = {
            ...info,
            '유효 유형': connection.effectiveType || '사용할 수 없음',
            '다운링크': connection.downlink ? connection.downlink + ' Mbps' : '사용할 수 없음',
            'RTT': connection.rtt ? connection.rtt + ' ms' : '사용할 수 없음',
            '데이터 절약': connection.saveData ? '활성화' : '비활성화'
        };
    }
    
    displayInfo(networkInfo, info);
}

/**
 * 장치 유형을 감지하는 도우미 함수
 */
function getDeviceType() {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        return '태블릿';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        return '모바일';
    } else {
        return '데스크톱';
    }
}

/**
 * 운영 체제를 감지하는 도우미 함수
 */
function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    if (userAgent.includes('Windows NT')) {
        return 'Windows';
    } else if (userAgent.includes('Mac OS X')) {
        return 'macOS';
    } else if (userAgent.includes('Linux')) {
        return 'Linux';
    } else if (userAgent.includes('Android')) {
        return 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'iOS';
    } else {
        return platform || '알 수 없음';
    }
}

/**
 * Helper function to get connection type
 */
function getConnectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection && connection.type) {
        return connection.type;
    } else if (connection && connection.effectiveType) {
        return connection.effectiveType;
    } else {
        return 'Not available';
    }
}

/**
 * Helper function to generate a simple session ID
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Helper function to display information in a formatted way
 */
function displayInfo(container, infoObject) {
    let html = '';
    
    for (const [key, value] of Object.entries(infoObject)) {
        html += `
            <div class="info-section">
                <div class="info-title">${key}</div>
                <div class="info-value">${value}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Event listeners for online/offline status
window.addEventListener('online', function() {
    console.log('User is now online');
});

window.addEventListener('offline', function() {
    console.log('User is now offline');
});

// Load user info on page load if available
document.addEventListener('DOMContentLoaded', function() {
    console.log('User Information Demo loaded successfully');
    
    // Auto-load saved user info if it exists
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
        console.log('Found saved user information');
    }
});