const date = new Date();
// 获取地理位置
function handle(ip) {
    const localip = localStorage.getItem('localip');
    if (localip) {
        //判断是否移动
        if (JSON.parse(localip).city != ip.content.address_detail.city || JSON.parse(localip).province != ip.content.address_detail.province) {
            localStorage.clear();
        }
    }
    localStorage.setItem('localip', JSON.stringify(ip.content.address_detail))
    const uip = ip.content.address_detail;
    getID(uip);
}
// 获取位置id信息
function getID(ip) {
    const localid = localStorage.getItem('localid');
    if (!localid) {
        axios({
            method: 'get',
            url: `https://geoapi.qweather.com/v2/city/lookup?location=${ip.city}&amd=${ip.province}&key=400c64aae1f14d379bbb241dc6897b6a`,
            type: 'json',
            success: function (id) {
                localStorage.setItem('localid', JSON.stringify(id.response.location[0]))
                getWeather(id.response.location[0]);
            }
        })
    } else {
        const uid = JSON.parse(localid);
        getWeather(uid);
    }
    wh(ip.province, ip.city);
}
// 获取天气信息
function getWeather(uid) {
    const localnow = localStorage.getItem('localnow');
    const localair = localStorage.getItem('localair');
    const localwh24 = localStorage.getItem('localwh24');
    if (!localwh24) {
        weatherAxios(uid, true);
    } else if (!judge(localwh24)) {
        weatherAxios(uid, true);
    } else {
        info(JSON.parse(localnow));
        aqiGet(JSON.parse(localair));
        const h24 = getHoursArray(JSON.parse(localwh24));
        hourly(h24, JSON.parse(localwh24));
    }
}
// 获取逐小时数组
function getHoursArray(wh24) {
    const timeArray = [];
    for (let i = 0; i < 24; i++) {
        timeArray.push(wh24.hourly[i].fxTime.slice(11, 13))
    }
    return timeArray;
}
// 请求限制时间判断
function judge(localwh24) {
    const localtime = getHoursArray(JSON.parse(localwh24));
    return localtime[0] - 1 == date.getHours() ? true : false;
}
// 发送天气请求
// 参数1服务器返回值location数组中的第一个对象
// 参数2判断是否进行浏览器储存
function weatherAxios(uid, local) {
    axios({
        method: 'get',
        url: `https://devapi.qweather.com/v7/weather/now?location=${uid.id}&key=400c64aae1f14d379bbb241dc6897b6a`,
        type: 'json',
        success: function (result) {
            if (local) {
                localStorage.setItem('localnow', JSON.stringify(result.response.now))
            }
            info(result.response.now);
        }
    })
    axios({
        method: 'get',
        url: `https://devapi.qweather.com/v7/air/now?location=${uid.id}&key=400c64aae1f14d379bbb241dc6897b6a`,
        type: 'json',
        success: function (result) {
            if (local) {
                localStorage.setItem('localair', JSON.stringify(result.response.now))
            }
            aqiGet(result.response.now);
        }
    })
    axios({
        method: 'get',
        url: `https://devapi.qweather.com/v7/weather/24h?location=${uid.id}&key=64d3525bb6694fbca1104d890d18c0b5`,
        type: 'json',
        success: function (result) {
            if (local) {
                localStorage.setItem('localwh24', JSON.stringify(result.response))
            }
            const h24 = getHoursArray(result.response);
            hourly(h24, result.response);
        }
    })
}