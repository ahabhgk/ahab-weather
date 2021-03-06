import '../style/font/iconfont.css'
import '../style/style.scss'
import DisplayUtil from './display-data.js'
import Lifestyle from './lifestyle.js'


// 页面加载好后的处理
async function ready() {
  document.body.style.height = `${document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight}px`
  document.querySelector('.search-page').style.transition = 'all .6s'
  customElements.define('h-lifestyle', Lifestyle);
  await DisplayUtil.firstDisplay()
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

// 清楚搜索历史
const historyInfos = document.querySelector('.history>.infos')
const clearHistory = document.querySelector('.clear-history')

clearHistory.addEventListener('click', e => {
  historyInfos.innerHTML = ''
  window.localStorage.clear()
})

// 对搜索结果进行委托
search.addEventListener('change', DisplayUtil.searchResult)
searchPage.addEventListener('click', e => {
  if (e.target.classList.contains('result') || e.target.classList.contains('info')) {
    // 展示 hot 或搜索结果
    DisplayUtil.result(e.target.dataset.location)
  } else if (e.target.classList.contains('search')) {
  } else {
    results.style.display = 'none'
  }
})

// 下方 lifestyle 的滑动
const slideWrap = document.querySelector('.slide-wrap')

let startX
let spanX = 0
let endX = 0
function handleSlide(e) {
  switch (e.type) {
  case 'touchstart':
    startX = e.targetTouches[0].pageX
    break
  case 'touchmove':
    e.preventDefault()
    spanX = e.changedTouches[0].pageX - startX
    const offset = spanX + endX
    if (offset <= 0 && offset >= -document.body.offsetWidth) {
      this.style.left = `${offset}px`
    }
    break
  case 'touchend':
    if (endX + spanX > 0) {
      endX = 0
      this.style.left = '0px'
    } else if (endX + spanX < -document.body.offsetWidth) {
      endX = -document.body.offsetWidth
      this.style.left = `${-document.body.offsetWidth}px`
    } else {
      endX += spanX
    }
    break
  }
}

slideWrap.addEventListener('touchstart', handleSlide)
slideWrap.addEventListener('touchmove', handleSlide)
slideWrap.addEventListener('touchend', handleSlide)
