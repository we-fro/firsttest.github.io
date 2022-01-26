//输入搜索请求
const search = document.querySelector('.search');
const inputSearch = search.querySelector('input');
const slide = search.querySelector('.slide');
let cityID;
let i = 0;
inputSearch.addEventListener('keyup', function (e) {
    let searchCity = this.value;
    //限制一下请求 因为一开始打字输入法可能打很多字母却没有输入
    if (searchCity.length > 1) {
        axios({
            method: 'get',
            url: `https://geoapi.qweather.com/v2/city/lookup?location=${searchCity}&key=dfd0a7189f4b479eaa8146489540f4bb`,
            type: 'json',
            success: function (ip) {
                if (!ip.response.location) {
                    if (i === 0) {
                        slide.innerHTML = '';
                        const slideLi = document.createElement('li');
                        slideLi.innerHTML = '未找到该城市';
                        slide.appendChild(slideLi);
                        i++;
                        slide.style.height = i * 35 + 'px';
                        slide.style.transition = 'all .5s';
                    }
                } else {
                    slide.innerHTML = '';
                    for (let index = 0; index < ip.response.location.length; index++) {
                        const slideLi = document.createElement('li');
                        const text = ip.response.location[index]
                        slideLi.innerHTML = text.country + ' - ' + text.adm1 + ' - ' + text.name;
                        slide.appendChild(slideLi);
                        // 绑定选中事件
                        slideLi.addEventListener('click', function () {
                            inputSearch.value = this.innerHTML;
                            cityID = ip.response.location[index];
                            inputSearch.blur();
                            enter();
                        })
                    }
                    slide.style.height = ip.response.location.length * 35 + 'px';
                    slide.style.transition = 'all .5s';
                }
            }
        })
    } else {
        slide.innerHTML = '';
        slide.style.height = 0;
        i = 0;
    }
})
// 失去焦点下拉列表消失
inputSearch.addEventListener('blur', function () {
    setTimeout(() => {
        slide.innerHTML = '';
        slide.style.height = 0;
        i = 0
    }, 100);
})
// 回车后搜索处理
function enter() {
    if (cityID) {
        weatherAxios(cityID, false);
        wh(cityID.adm1, cityID.name)
    }
}
// 下拉列表搜索
const provinceslt = document.querySelector('#province');
const cityslt = document.querySelector('#city');
// 请求对象
const selectID = {};
// 省请求
axios({
    method: 'get',
    url: 'https://restapi.amap.com/v3/config/district?key=6132a1953c45529ca64ed24c802479bf',
    type: 'json',
    success: function (province) {
        province.response.districts[0].districts.forEach(value => {
            const poption = document.createElement('option');
            poption.innerHTML = value.name;
            provinceslt.appendChild(poption);
        });
    }
})
// 市区请求
provinceslt.addEventListener('change', function() {
    axios({
        method: 'get',
        url: `https://restapi.amap.com/v3/config/district?keywords=${this.value}&key=6132a1953c45529ca64ed24c802479bf`,
        type: 'json',
        success: function (city) {
            cityslt.innerHTML = '<option value="">请选择</option>';
            city.response.districts[0].districts.forEach(value => {
                const option = document.createElement('option');
                option.innerHTML = value.name;
                cityslt.appendChild(option);
            });
        }
    })
    // 请求对象赋值
    selectID.province = this.value;
})
// 请求对象赋值
cityslt.addEventListener('change', function() {
    selectID.city = this.value;
    // 搜索
    const btn = document.querySelector('.btn');
    btn.addEventListener('click', function() {
        axios({
            method: 'get',
            url: `https://geoapi.qweather.com/v2/city/lookup?location=${selectID.city}&amd=${selectID.province}&key=400c64aae1f14d379bbb241dc6897b6a`,
            type: 'json',
            success: function (id) {
                weatherAxios(id.response.location[0], false);
            }
        })
        wh(selectID.province, selectID.city)
    })
})

