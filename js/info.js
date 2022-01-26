function info(obj) {
    // 顶部图标
    const icontop = document.querySelector('.icontop');
    icontop.className = `icontop qi-${obj.icon}`
    // 背景图片
    let bg = '';
    if (obj.icon == 100) {
        bg = 'sun';
    } else if (obj.icon == 150) {
        bg = 'night'
    } else if (obj.icon > 100 && obj.icon <= 104) {
        bg = 'cloud';
    } else if (obj.icon > 150 && obj.icon <= 153) {
        bg = 'cloudnight';
    } else if (obj.icon >= 300 && obj.icon <= 301 || obj.icon >= 350 && obj.icon <= 351) {
        bg = 'rain';
    } else if (obj.icon >= 302 && obj.icon <= 304) {
        bg = 'light';
    } else if (obj.icon >= 400 && obj.icon <= 499) {
        bg = 'snow';
    } else if (obj.icon >= 500 && obj.icon <= 515) {
        bg = 'fog';
    }
    const warpper = document.querySelector('.warpper');
    warpper.className = `warpper ${bg}`
    // 天气
    const weather = document.querySelector('.weather');
    weather.innerHTML = obj.text;
    // 实时详细信息
    const realtimeL = document.querySelector('.realtime_l');
    const lis = realtimeL.querySelectorAll('li');
    lis[0].lastElementChild.innerHTML = obj.temp + '℃';
    lis[1].lastElementChild.innerHTML = obj.humidity + '%';
    lis[2].lastElementChild.innerHTML = obj.feelsLike + '℃';
    lis[3].lastElementChild.innerHTML = obj.windDir + obj.windScale + '级';
    lis[4].lastElementChild.innerHTML = obj.precip + 'mm';
    lis[5].lastElementChild.innerHTML = obj.pressure + 'hPa';
    lis[6].lastElementChild.innerHTML = obj.vis + 'km';
}
// 地理信息显示
function wh(ipprovince,ipcity) {
    const province = document.querySelector('.province');
    const city = document.querySelector('.city');
    province.innerHTML = ipprovince;
    city.innerHTML = ipcity;
}
// 空气质量
function aqiGet(rps) {
    const aqi = document.querySelector('.aqi');
    aqi.lastElementChild.innerHTML = rps.aqi;
}
// 逐小时预测显示
function hourly(array, obj) {
    const xy = document.querySelector('.xy');
    const xytemp = xy.querySelectorAll('em');
    const xytime = xy.querySelectorAll('p');
    const xyicon = xy.querySelectorAll('i');
    const xyspan = xy.querySelectorAll('span');
    // 温度字符
    xytemp.forEach((value, index) => {
        value.innerHTML = obj.hourly[index * 2].temp + '°';
    })
    // 时间字符
    xytime.forEach((value, index) => {
        value.innerHTML = (array[index * 2] < 12 ? array[index * 2] / 1 + 'AM' : array[index * 2] - 12 + 'PM');
    })
    // 图标
    xyicon.forEach((value, index) => {
        value.classList.add('qi-' + obj.hourly[index * 2].icon);
    })
    // 温度显示条
    xyspan.forEach((value, index) => {
        let temp = obj.hourly[index * 2].temp;
        if (temp > 40) {
            temp = 40;
        } else if (temp < -10) {
            temp = -10;
        }
        const h = temp > -10 ? (temp / 1 + 10) * 3 : 0;
        value.style.height = h + 'px';
        value.style.transition = 'all .7s';
        value.parentElement.style.height = h + 25 +'px';
        value.parentElement.style.transition = 'all .7s';
    })
}
