import GetDataUtil from './get-data.js'
import displayChart from './chart.js'

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



// 展示今明两天数据
const todayTempMax = document.querySelector('.today-temp>.max')
const todayTempMin = document.querySelector('.today-temp>.min')
const tomorrowTempMax = document.querySelector('.tomorrow-temp>.max')
const tomorrowTempMin = document.querySelector('.tomorrow-temp>.min')
const todayWeather = document.querySelector('.today-weather')
const tomorrowWeather = document.querySelector('.tomorrow-weather')
const todayWeatherIcon = document.querySelector('#todayWeatherIcon')
const tomorrowWeatherIcon = document.querySelector('#tomorrowWeatherIcon')

function displayTwoRecent(data) {
  todayTempMax.textContent = data[0].tmp_max
  todayTempMin.textContent = data[0].tmp_min
  tomorrowTempMax.textContent = data[1].tmp_max
  tomorrowTempMin.textContent = data[1].tmp_min
  todayWeather.textContent = data[0].cond_txt_d !== data[0].cond_txt_n
    ? `${data[0].cond_txt_d}转${data[0].cond_txt_n}`
    : `${data[0].cond_txt_n}`
  tomorrowWeather.textContent = data[1].cond_txt_d !== data[1].cond_txt_n
    ? `${data[1].cond_txt_d}转${data[1].cond_txt_n}`
    : `${data[1].cond_txt_n}`
  todayWeatherIcon.className = `iconfont ${data.todaySet.iconClass}`
  tomorrowWeatherIcon.className = `iconfont ${data.tomorrowSet.iconClass}`
}


// 展示结果
const cancel = document.querySelector('.cancel')

async function displayResult(result) {
  try {
    const nowData = await GetDataUtil.now(result)
    displayNow(nowData)

    const twoRecentData = await GetDataUtil.twoRecent(result)
    displayTwoRecent(twoRecentData)

    const weekData = await GetDataUtil.weekData(result)
    displayWeek(weekData)
    cancel.click()
  } catch {
    alert('获取数据失败 😢...')
  }
}


// 对搜索历史进行储存
function handleStorage(value) {
  const history = JSON.parse(window.localStorage.history || '[]')
  !history.includes(value) && value !== '' && history.push(value)
  window.localStorage.history = JSON.stringify(history)
}

// 展示搜索结果
const results = document.querySelector('.results')

async function displaySearchResult() {
  handleStorage(this.value)
  displayHistory()
  try {
    const data = await GetDataUtil.search(`/find?location=${this.value}`)
    const html = data.basic.map(info => `
      <li class="result" data-location="${info.location}">${info.location}</li>
    `).join('')
    results.innerHTML = html
  } catch {
    results.innerHTML = '没有数据 😢...'
  }
  results.style.display = 'block'
}


// 展示 7 天天气
const chartTop = document.querySelector('.chart-top')
const chartBottom = document.querySelector('.chart-bottom')

function displayWeek(json) {
  let topHtml = ''
  let bottomHtml = ''
  const maxArr = []
  const minArr = []
  json.data.forEach(info => {
    const set = GetDataUtil.set(info.wea)
    topHtml += `
      <div class="top-item">
        <div class="day">${info.day.slice(3, 5)}</div>
        <div class="date">${info.date}</span></div>
        <span class="iconfont ${set.iconClass}"></span>
      </div>`
    
    bottomHtml += `
    <div class="bottom-item">
      <div class="weather">${info.wea}</div>
      <div class="wind">${info.win[0]}${info.win_speed}</div>
    </div>`

    maxArr.push(info.tem1.slice(0, 2))
    minArr.push(info.tem2.slice(0, 2))
  })

  chartTop.innerHTML = topHtml
  chartBottom.innerHTML = bottomHtml

  displayChart(maxArr, minArr)
}


// 展示 hourly 数据
const hourlyWrap = document.querySelector('.hourly-wrap')

function displayHourly(json) {
  const html = json.data[0].hours.map(hour => {
    const set = GetDataUtil.set(hour.wea)
    return `
      <div class="hour">
        <div class="time">${hour.day.slice(3)}</div>
        <span class="iconfont ${set.iconClass}"></span>
        <div class="temp">${hour.tem}</div>
      </div>
  `}).join('')
  hourlyWrap.innerHTML = html
}


// 展示搜索历史
const historyInfos = document.querySelector('.history>.infos')

function displayHistory() {
  const history = JSON.parse(window.localStorage.history || '[]')
  const html = history.map(his => `
    <div class="info" data-location="${his}">${his}</div>
  `).join('')
  historyInfos.innerHTML = html
}


async function firstDisplay() {
  GetDataUtil.hotCity()
  displayHistory()

  const location = '重庆'
  let cqNowData = await GetDataUtil.now(location)
  let cqTwoRecentData = await GetDataUtil.twoRecent(location)
  let cqWeekData = await GetDataUtil.weekData(location)
  let cqHourlyData = await GetDataUtil.hourlyData(location)

  displayNow(cqNowData)
  displayTwoRecent(cqTwoRecentData)
  displayWeek(cqWeekData)
  displayHourly(cqHourlyData)
}


export default {
  firstDisplay,
  searchResult: displaySearchResult,
  result: displayResult,
}
