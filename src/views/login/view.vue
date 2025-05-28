<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import appConfigs from '@/configs/app.config'
const mode = appConfigs.loginMode

import { useSystemInfosStore } from '@/commons/stores/index'
const systemInfosStore = useSystemInfosStore()
import { useLoadingStore } from '@/commons/stores/index'
const loadingStore = useLoadingStore()

import eventBus from '@/commons/utils/eventBus'
import * as extend from '@/commons/utils/extends'
import * as messageBox from '@/commons/utils/messages'
import * as current from './login.service'

onMounted(async () => {
  // systemInfosStore.setHeader(false)
  // 背景
  if (activeDynamic) {
    ctx = canvas.value.getContext('2d')
    resizeCanvas()
    initialCircle()
    animate()
  }
  // 回车触发登录
  window.addEventListener('keydown', onKeyDown)
  // 记住用户名
  let remember = JSON.parse(extend.LocalStore.get('remember'))
  if (remember && remember.remember) {
    loginForm.account = remember.account
    loginForm.remember = remember.remember
  }
  // 跳转
  let params = extend.ExWeb.params()
  if (params.type) {
    switch (params.type) {
      case 'logout': {
        eventBus.emit('clearSystem')
        break
      }
      default: {
        break
      }
    }
  }
})
onUnmounted(() => {
  systemInfosStore.setHeader(true)
  //
  window.removeEventListener('keydown', onKeyDown)
})

const onKeyDown = (event: any) => {
  if (event.keyCode == 13) {
    login()
  }
}

//#region Back
const activeDynamic = false
const canvas: any = ref(null)
let ctx: any = null
let circles: any[] = []
const colors = ['#836fff', '#15f5ba', '#692ff']
const initialCircle = () => {
  circles = []
  //
  let circleCount = window.innerWidth / 100
  for (let loop = 0; loop < circleCount; loop++) {
    let radius = window.innerWidth / 4
    let x = extend.ExNumber.createRand(radius, canvas.value.width - radius)
    let y = extend.ExNumber.createRand(radius, canvas.value.height - radius)
    let dx = extend.ExNumber.createRand(window.innerWidth / -2000, window.innerWidth / 2000)
    let dy = extend.ExNumber.createRand(window.innerWidth / -2000, window.innerWidth / 2000)
    //
    let color = colors[Math.floor(Math.random() * colors.length)]
    circles.push({
      x,
      y,
      dx,
      dy,
      radius,
      color
    })
  }
}
const drawCircle = (circle: any) => {
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false)
  ctx.fillStyle = circle.color
  ctx.fill()
  ctx.closePath()
}
const animate = () => {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  //
  circles.map((circle: any) => {
    if (circle.x + circle.radius > canvas.value.width || circle.x - circle.radius < 0) {
      circle.dx = -circle.dx
    }
    if (circle.y + circle.radius > canvas.value.height || circle.y - circle.radius < 0) {
      circle.dy = -circle.dy
    }
    //
    circle.x += circle.dx
    circle.y += circle.dy
    //
    drawCircle(circle)
  })
}
const resizeCanvas = () => {
  canvas.value.width = window.innerWidth * 1.5
  canvas.value.height = window.innerHeight * 1.5
  //
  initialCircle()
}
//#endregion

// Login
const loginForm = reactive({
  account: '',
  password: '',
  remember: false
})
const login = () => {
  loadingStore.loading()
  //
  extend.LocalStore.set(
    'remember',
    JSON.stringify({
      remember: loginForm.remember,
      account: loginForm.account
    })
  )
  //
  switch (systemInfosStore.systemInfos.loginMode) {
    case 'sso-local': {
      const params = {
        userno: loginForm.account,
        password: loginForm.password
      }
      current.login(params).then(
        (resp: any) => {
          loadingStore.end()
          //
          const { status, message } = resp
          if (status) {
            eventBus.emit('getinfosUser')
            //
            eventBus.emit('jumpHome')
          } else {
            messageBox.showError(message)
          }
        },
        (err: any) => {
          loadingStore.end()
          //
          messageBox.showError(err)
        }
      )
      break
    }
    case 'sso-iuser': {
      let params = {
        ntAccount: loginForm.account,
        password: loginForm.password
      }
      current.loginiUser(params).then(
        (resp: any) => {
          loadingStore.end()
          //
          const { status, message } = resp
          if (status) {
            eventBus.emit('getinfosUser')
            //
            eventBus.emit('jumpHome')
          } else {
            messageBox.showError(message)
          }
        },
        (err: any) => {
          loadingStore.end()
          //
          messageBox.showError(err)
        }
      )
      break
    }
    default: {
      break
    }
  }
}
//
const loginSSO = () => {
  const redirect_uri = extend.ExWeb.url().server + '/sso-auth'
  const { host, client_id, scope, response_type } = systemInfosStore.systemInfos.azureConfigs
  let url = `${host}?` + extend.ExObject.stringfyParams({ client_id, scope, response_type, redirect_uri, })
  window.open(url, '_self')
}
</script>

<template>
  <div class="contents">
    <canvas ref="canvas" width="500" height="500"></canvas>
    <div class="box-contents">
      <div class="col-left">
        <div class="box-img">
          <div class="login-titles">
            <p>
              Login to <br />
              Open the World
            </p>
          </div>
        </div>
      </div>
      <div class="col-right">
        <div class="box-login">
          <div class="titles">{{ systemInfosStore.systemInfos.name }}</div>
          <div class="box-sso" v-if="mode == 'sso-only'">
            <p class="title-second">- Login for employee -</p>
            <p class="title-desc">Login only works from Bosch network</p>
            <a-button type="primary" class="btn btn-sso" @click="loginSSO">
              <i class="fa-solid fa-cloud"></i>
              <span>{{ $t('system.login.sso') }}</span>
            </a-button>
          </div>
          <div class="box-iuser" v-else>
            <a-form :model="loginForm" layout="vertical" name="basic" :label-col="{ span: 5 }" autocomplete="off"
              @finish="login">
              <a-form-item :label="$t('system.account')" name="account"
                :rules="[{ required: true, message: 'Please input your account!' }]">
                <a-input v-model:value="loginForm.account" />
              </a-form-item>

              <a-form-item :label="$t('system.password')" name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="loginForm.password" />
              </a-form-item>

              <a-form-item name="remember">
                <a-checkbox v-model:checked="loginForm.remember" class="btn-check">
                  {{ $t('system.remember') }}
                </a-checkbox>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" class="btn btn-login" html-type="submit">
                  {{ $t('system.login') }}
                </a-button>
              </a-form-item>
            </a-form>
            <div class="others">
              <div class="line-divider">
                <div class="line"></div>
                <span>{{ $t('system.login.other') }}</span>
                <div class="line"></div>
              </div>
              <div class="btns">
                <a-button type="primary" class="btn btn-sso" @click="loginSSO">
                  <i class="fa-solid fa-cloud"></i>
                  <span>{{ $t('system.login.sso') }}</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contents {
  position: relative;
  overflow: hidden;
  background: var(--color-content-bg);

  .bg-img {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  canvas {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  .box-contents {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .col-left,
  .col-right {
    z-index: 0;
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.box-img {
  .login-titles {
    position: relative;
    padding: 70px 0;

    &::before {
      content: '';
      position: absolute;
      top: 15%;
      left: 0;
      width: 280px;
      height: 100px;
      background: linear-gradient(to right, #4460f1, #c471ed, #f64f59);
      z-index: -1;
      filter: blur(70px);
    }

    p {
      font-size: 35px;
      font-weight: 700;
    }
  }

  img {
    width: 500px;
    object-fit: contain;
    border-radius: 15px;
    animation: jump 4s infinite ease-in-out;
  }
}

@keyframes jump {
  0% {
    margin-top: 0;
  }

  50% {
    margin-top: -30px;
  }

  100% {
    margin-top: 0;
  }
}

.col-right {
  border-radius: 25px;
  background: #ffffff3d;
}

.box-login {
  width: 500px;
  padding: 70px 40px;

  .titles {
    margin-bottom: 30px;
    text-align: center;
    font-size: 2.3rem;
    line-height: 4.5rem;
    font-weight: 700;
  }

  .btn {
    height: 45px;
    font-size: 16px;
    font-weight: 700;
  }

  .btn-login {
    width: 100%;
    background: #4c40f7;
  }

  .btn-check {
    color: #5a5a5f;
  }

  .others {
    margin-top: 65px;
  }

  .line-divider {
    position: relative;
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    display: flex;
    align-items: center;
    column-gap: 10px;

    .line {
      flex: 1;
      height: 1px;
      background: #dcdfe6;
    }

    span {
      color: #5a5a5f;
      font-weight: 900;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.box-sso {
  p {
    text-align: center;
  }

  .title-second {
    margin: 36px 0 24px;
    color: #9da1a8;
    font-size: 18px;
    font-weight: 400;
    line-height: 20px;
  }

  .title-desc {
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 700;
    line-height: 30px;
  }

  .btn-sso {
    width: 100%;
    border-radius: 30px;
  }
}
</style>
