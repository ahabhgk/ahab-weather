import '../style/font/iconfont.css'
import '../style/style.scss'
import '../img/clear.jpg'
import '../img/cloud.jpg'
import '../img/overcast.jpg'
import '../img/rain.jpg'
import '../img/snow.jpg'
import '../img/thunder.jpg'


async function getData(parameters) {
  const data = await fetch(`https://free-api.heweather.net/s6${parameters}&key=b52a498653264e23a6a795fb4ede5c97`)
  const json = await data.json()
  return json.HeWeather6[0]
}

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


// 页面加载好后的处理
const historyInfos = document.querySelector('.history>.infos')

async function ready() {
  document.body.style.height = `${document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight}px`
  document.querySelector('.search-page').style.transition = 'all .6s'
  getHotCity()
  displayHistory()
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
function debounce(fn, wait) { // 防抖
  let timeout
  return function (...arg) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arg)
    }, wait)
  }
}

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

// 对搜索结果进行委托
search.addEventListener('input', debounce(displaySearchResult, 400))
searchPage.addEventListener('click', e => {
  if (e.target.classList.contains('result') || e.target.classList.contains('info')) {
    // 展示 hot 或搜索结果
    displayResult(e.target.dataset.location)
  } else if (e.target.classList.contains('search')) {
  } else {
    results.style.display = 'none'
  }
})
