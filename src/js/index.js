import '../style/font/iconfont.css'
import '../style/style.scss'
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
function getImgsByDesc(description) {
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
  const set = getImgsByDesc(data.now.cond_txt)
  return { location, ...data.now, ...airData.air_now_city, ...set }
}

// 展示 now 数据
const nowTemp = document.querySelector('.now-temp')
const nowWeather = document.querySelector('.now-weather')
const humidityInfo = document.querySelector('.humidity-info')
const windDir = document.querySelector('.wind-dir')
const windSc = document.querySelector('.wind-sc')
const airAqi = document.querySelector('.aqi')
const airStatus = document.querySelector('.status')
const nowDesc = document.querySelector('.now-desc')
const now = document.querySelector('.now')
const locationTit = document.querySelector('.location-tit')

async function displayNow(data) {
  locationTit.textContent = data.location
  nowTemp.textContent = data.tmp
  nowWeather.textContent = data.cond_txt
  humidityInfo.textContent = data.hum
  windDir.textContent = data.wind_dir
  windSc.textContent = data.wind_sc
  nowDesc.textContent = data.desc
  now.style.backgroundImage = `url(${data.bg})`
  airAqi.textContent = data.aqi
  airStatus.textContent = data.qlty
}


// 页面加载好后的处理
const historyInfos = document.querySelector('.history>.infos')

async function ready() {
  document.body.style.height = `${document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight}px`
  document.querySelector('.search-page').style.transition = 'all .6s'
  getHotCity()
  displayHistory()
  let nowData
  if (window.localStorage.cqData) {
    nowData = JSON.parse(window.localStorage.cqData)
  } else {
    nowData = await getNow('重庆')
    window.localStorage.cqData = JSON.stringify(nowData)
  }
  displayNow(nowData)
}

ready()


// now-info 的动画
const infoAnimation = () => {
  const hide = document.querySelector('.hide')
  const show = document.querySelector('.show')
  hide.classList.add('show')
  hide.classList.remove('hide')
  show.classList.add('hide')
  show.classList.remove('show')
}

setInterval(infoAnimation, 1500)


// drop 下拉搜索页
const drop = document.querySelector('.drop')
const searchPage = document.querySelector('.search-page')

drop.addEventListener('click', e => {
  searchPage.style.transform = 'translate(0, 100%)'
  document.querySelector('html').style.overflow = 'hidden'
})


// 搜索页回收
const cancel = document.querySelector('.cancel')

cancel.addEventListener('click', e => {
  searchPage.style.transform = 'translate(0, 0)'
  document.querySelector('html').style.overflow = 'auto'
})


// 搜索
const search = document.querySelector('#search')
const results = document.querySelector('.results')

// 对搜索历史进行储存
function handleStorage(value) {
  const history = JSON.parse(window.localStorage.history || '[]')
  !history.includes(value) && value !== '' && history.push(value)
  window.localStorage.history = JSON.stringify(history)
}

// 展示搜索历史
function displayHistory() {
  const history = JSON.parse(window.localStorage.history || '[]')
  const html = history.map(his => `
    <div class="info" data-location="${his}">${his}</div>
  `).join('')
  historyInfos.innerHTML = html
}

// 清楚搜索历史
const clearHistory = document.querySelector('.clear-history')
clearHistory.addEventListener('click', e => {
  historyInfos.innerHTML = ''
  window.localStorage.clear()
})

// 展示搜索结果
async function displaySearchResult() {
  handleStorage(this.value)
  displayHistory()
  const data = await getSearch(`/find?location=${this.value}`)
  const html = data.basic.map(info => `
    <li class="result" data-location="${info.location}">${info.location}</li>
  `).join('')
  results.innerHTML = html
  results.style.display = 'block'
}

// 展示结果
async function displayResult(result) {
  const data = await getNow(result)
  displayNow(data)
  cancel.click()
}

// 对搜索结果进行委托
search.addEventListener('change', displaySearchResult)
searchPage.addEventListener('click', e => {
  if (e.target.classList.contains('result') || e.target.classList.contains('info')) {
    // 展示 hot 或搜索结果
    displayResult(e.target.dataset.location)
  } else if (e.target.classList.contains('search')) {
  } else {
    results.style.display = 'none'
  }
})
