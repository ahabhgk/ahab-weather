import '../style/font/iconfont.css'
import '../style/style.scss'
import '../img/clear.jpg'
import '../img/cloud.jpg'
import '../img/overcast.jpg'
import '../img/rain.jpg'
import '../img/snow.jpg'
import '../img/thunder.jpg'

// 页面加载好后的处理
function ready() {
  document.body.style.height = `${document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight}px`
  document.querySelector('.search-page').style.transition = 'all .6s'
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
