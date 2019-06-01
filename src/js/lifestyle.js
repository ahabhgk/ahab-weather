import jiaonang from '../img/jiaonang.png'
import cloth from '../img/cloth.png'
import wind from '../img/wind.png'
import car from '../img/car.png'

export default class lifestyle extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    const wrapper = document.createElement('div')
    wrapper.classList.add('wrap')
    wrapper.innerHTML = `
      <span class="icon"></span>
      <p>${this.getAttribute('tit')}</p>
      <div class="popup-wrap">
        <div class="popup">
          <div class="popup-tit">${this.getAttribute('tit')}指数</div>
          <div class="popup-txt"></div>
          <button type="button" class="i-know">我知道了</button>
        </div>
      </div>
    `
    let icon
    switch (this.getAttribute('tit')) {
      case '紫外线指数':
        icon = jiaonang
        break
      case '穿衣指数':
        icon = cloth
        break
      case '洗车指数':
        icon = car
        break
      case '空气污染扩散指数':
        icon = wind
    }
    const style = document.createElement('style')
    style.textContent = `
      .wrap {
        width: 48vw;
        height: 48vw;
        border: 1vw solid #f2f2f2;
        display: inline-flex;
        background: #fff;
        flex-direction: column;
        align-items: center;
      }

      .icon {
        background: url(${icon}) no-repeat;
        background-size: 100%;
        background-position: center;
        width: 90px;
        height: 90px;
        margin-top: 8vw;
      }

      .popup-wrap {
        display: none;
        width: 100vw;
        position:fixed;
        top: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.7);
        height: ${document.body.clientHeight}px;
        justify-content: center;
        align-items: center;
      }

      .popup {
        width: 66vw;
        background: #fff;
        border-radius: 10px;
      }

      .popup-tit {
        text-align: center;
        background: #3bbcff;
        border-radius: 10px 10px 0 0;
        line-height: 58px;
        color: #fff;
        font-size: 22px;
        width: 66vw;
        height: 58px;
        background: ${this.getAttribute('color')};
      }

      .popup-txt {
        width: 50vw;
        padding: 8vw;
        color: #000;
        font-size: 16px;
      }

      .i-know {
        display: block;
        width: 50vw;
        height: 40px;
        margin: 0 auto 20px;
        background: #3bbcff;
        color: #fff;
        border-radius: 10px;
        border: none;
        outline: none;
      }`
    
    shadow.appendChild(wrapper)
    shadow.appendChild(style)

    this.bindEvent()
  }

  async changeData(city) {
    const json = await fetch(`https://www.tianqiapi.com/api/?version=v1&city=${city}`).then(res => res.json())
    const [obj] = json.data[0].index.filter(lifestyle => lifestyle.title === this.getAttribute('tit'))
    this.shadowRoot.querySelector('.popup-txt').innerHTML = obj.desc
  }

  bindEvent() {
    this.shadowRoot.querySelector('.i-know').addEventListener('click', e => {
      e.stopPropagation()
      document.querySelector('html').style.overflow = ''
      this.shadowRoot.querySelector('.popup-wrap').style.display = 'none'
    })

    this.addEventListener('click', e => {
      document.querySelector('html').style.overflow = 'hidden'
      this.shadowRoot.querySelector('.popup-wrap').style.display = 'flex'
    })
  }

  static get observedAttributes() { return ['city'] }

  attributeChangedCallback(attr, oldVal, newVal) {
    this.changeData(newVal)
  }
}
