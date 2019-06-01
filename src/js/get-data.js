import clear from'../img/clear.jpg'
import cloud from '../img/cloud.jpg'
import overcast from '../img/overcast.jpg'
import rain from '../img/rain.jpg'
import snow from '../img/snow.jpg'
import thunder from '../img/thunder.jpg'

// 用于获取数据的
async function getData(parameters) {
  const data = await fetch(`https://free-api.heweather.net/s6${parameters}&key=b52a498653264e23a6a795fb4ede5c97`)
  const json = await data.json()
  return json.HeWeather6[0]
}

// 用于搜索的
async function getSearch(parameters) {
  const data = await fetch(`https://search.heweather.net${parameters}&key=b52a498653264e23a6a795fb4ede5c97`)
  const json = await data.json()
  return json.HeWeather6[0]
}


// 获取热门城市
async function getHotCity() {
  const data = await getSearch('/top?group=world&number=15')
  const html = data.basic.map(info => `
    <div class="info" data-location="${info.location}">${info.location}</div>
  `).join('')
  document.querySelector('.hot-city>.infos').innerHTML = html
}


// 天气图标、背景和描述处理
function getSetByDesc(description) {
  const set = {}
  if (description.includes('晴')) {
    set.bg = clear
    set.iconClass = 'icon-clear'
    set.desc = '今天天气不错呦～'
  } else if (description.includes('阴')) {
    set.bg = overcast
    set.iconClass = 'icon-overcast'
    set.desc = '天暗下来，你就是阳光～'
  } else if (description.includes('雨')) {
    set.bg = rain
    set.iconClass = 'icon-rain'
    set.desc = '下雨记得带伞哦～'
  } else if (description.includes('多云')) {
    set.bg = cloud
    set.iconClass = 'icon-cloud'
    set.desc = '现在温度比较凉爽～'
  } else if (description.includes('雪')) {
    set.bg = snow
    set.iconClass = 'icon-snow'
    set.desc = '来堆雪人吧～'
  } else if (description.includes('雷')) {
    set.bg = thunder
    set.iconClass = 'icon-thunder'
    set.desc = '小心装逼遭雷劈哦～'
  }
  return set
}


// 获取 now 的数据
async function getNow(location) {
  const data = await getData(`/weather/now?location=${location}`)
  const airData = await getData(`/air/now?location=${location}`)
  const set = getSetByDesc(data.now.cond_txt)
  return { location, ...data.now, ...airData.air_now_city, ...set }
}


// 获取今明两天数据
async function getTwoRecent(location) {
  const data = await getData(`/weather/forecast?location=${location}`)
  const todaySet = getSetByDesc(data.daily_forecast[0].cond_txt_d)
  const tomorrowSet = getSetByDesc(data.daily_forecast[1].cond_txt_d)
  return { ...data.daily_forecast, todaySet, tomorrowSet }
}


export default {
  search: getSearch,
  now: getNow,
  twoRecent: getTwoRecent,
  hotCity: getHotCity,
}
