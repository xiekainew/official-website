<template>
  <div class="contact">
    <div class="container">
      <!-- 页面标题 -->
      <section class="contact-header">
        <h1 class="page-title gradient-text">联系我</h1>
        <p class="page-subtitle">
          让我们一起探讨技术，分享创意
        </p>
      </section>
      
      <!-- 联系方式和表单 -->
      <section class="contact-content">
        <!-- 联系信息 -->
        <div class="contact-info">
          <h2 class="info-title">取得联系</h2>
          <p class="info-description">
            无论是技术讨论、项目合作还是简单的问候，
            我都很乐意与您交流。
          </p>
          
          <div class="contact-methods">
            <a 
              v-for="method in contactMethods" 
              :key="method.name"
              :href="method.link"
              class="contact-method"
              :class="`contact-method--${method.name}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="method-icon">
                <component :is="method.icon" />
              </div>
              <div class="method-content">
                <h3 class="method-title">{{ method.title }}</h3>
                <p class="method-value">{{ method.value }}</p>
                <span class="method-description">{{ method.description }}</span>
              </div>
            </a>
          </div>
          
          <!-- 社交媒体 -->
          <div class="social-links">
            <h3 class="social-title">关注我</h3>
            <div class="social-grid">
              <a 
                v-for="social in socialLinks" 
                :key="social.name"
                :href="social.url"
                class="social-link"
                :style="{ '--social-color': social.color }"
                target="_blank"
                rel="noopener noreferrer"
              >
                <component :is="social.icon" />
                <span class="social-label">{{ social.label }}</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- 联系表单 -->
        <div class="contact-form-wrapper">
          <form class="contact-form" @submit.prevent="submitForm">
            <h2 class="form-title">发送消息</h2>
            
            <div class="form-group">
              <label for="name" class="form-label">姓名 *</label>
              <input 
                id="name"
                v-model="form.name"
                type="text" 
                class="form-input"
                :class="{ 'form-input--error': errors.name }"
                placeholder="请输入您的姓名"
                required
              />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">邮箱 *</label>
              <input 
                id="email"
                v-model="form.email"
                type="email" 
                class="form-input"
                :class="{ 'form-input--error': errors.email }"
                placeholder="请输入您的邮箱"
                required
              />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>
            
            <div class="form-group">
              <label for="subject" class="form-label">主题 *</label>
              <select 
                id="subject"
                v-model="form.subject"
                class="form-select"
                :class="{ 'form-input--error': errors.subject }"
                required
              >
                <option value="">请选择主题</option>
                <option value="collaboration">项目合作</option>
                <option value="technical">技术讨论</option>
                <option value="consultation">技术咨询</option>
                <option value="other">其他</option>
              </select>
              <span v-if="errors.subject" class="form-error">{{ errors.subject }}</span>
            </div>
            
            <div class="form-group">
              <label for="message" class="form-label">消息内容 *</label>
              <textarea 
                id="message"
                v-model="form.message"
                class="form-textarea"
                :class="{ 'form-input--error': errors.message }"
                placeholder="请详细描述您的需求或想法..."
                rows="6"
                required
              ></textarea>
              <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  v-model="form.newsletter"
                  type="checkbox" 
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">订阅技术分享邮件</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="form-submit"
              :class="{ 'form-submit--loading': isSubmitting }"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">发送消息</span>
              <span v-else class="loading-text">
                <svg class="loading-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                  </circle>
                </svg>
                发送中...
              </span>
            </button>
          </form>
          
          <!-- 成功提示 -->
          <div v-if="showSuccess" class="success-message">
            <svg class="success-icon" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <h3>消息发送成功！</h3>
            <p>感谢您的来信，我会尽快回复您。</p>
          </div>
        </div>
      </section>
      
      <!-- 数字名片 -->
      <section class="digital-card">
        <div class="card-container">
          <div class="business-card" ref="businessCard">
            <div class="card-front">
              <div class="card-header">
                <h3 class="card-name">前端工程师</h3>
                <p class="card-title">Front-end Developer</p>
              </div>
              
              <div class="card-info">
                <div class="info-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>contact@example.com</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                  <span>中国 · 深圳</span>
                </div>
                <div class="info-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>5+ 年经验</span>
                </div>
              </div>
              
              <div class="card-tech">
                <span class="tech-tag">Vue.js</span>
                <span class="tech-tag">React</span>
                <span class="tech-tag">TypeScript</span>
                <span class="tech-tag">Three.js</span>
              </div>
            </div>
            
            <div class="card-back">
              <div class="qr-code">
                <svg viewBox="0 0 100 100" class="qr-placeholder">
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="2"/>
                  <rect x="15" y="15" width="20" height="20" fill="currentColor"/>
                  <rect x="65" y="15" width="20" height="20" fill="currentColor"/>
                  <rect x="15" y="65" width="20" height="20" fill="currentColor"/>
                  <circle cx="50" cy="50" r="10" fill="currentColor"/>
                </svg>
              </div>
              <p class="qr-text">扫码访问我的作品集</p>
            </div>
          </div>
          
          <button class="download-btn" @click="downloadCard">
            <svg viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            下载名片
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { gsap } from 'gsap'

// 表单数据
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const errors = reactive({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const businessCard = ref(null)

// 联系方式
const contactMethods = [
  {
    name: 'email',
    title: '邮箱联系',
    value: 'contact@example.com',
    description: '工作日24小时内回复',
    link: 'mailto:contact@example.com',
    icon: 'EmailIcon'
  },
  {
    name: 'wechat',
    title: '微信咨询',
    value: 'WeChat_ID',
    description: '扫码添加好友',
    link: '#',
    icon: 'WeChatIcon'
  },
  {
    name: 'phone',
    title: '电话沟通',
    value: '+86 138-0000-0000',
    description: '工作时间 9:00-18:00',
    link: 'tel:+8613800000000',
    icon: 'PhoneIcon'
  }
]

// 社交媒体链接
const socialLinks = [
  {
    name: 'github',
    label: 'GitHub',
    url: 'https://github.com/username',
    icon: 'GitHubIcon',
    color: '#333'
  },
  {
    name: 'juejin',
    label: '掘金',
    url: 'https://juejin.cn/user/123456',
    icon: 'JuejinIcon',
    color: '#007fff'
  },
  {
    name: 'zhihu',
    label: '知乎',
    url: 'https://zhihu.com/people/username',
    icon: 'ZhihuIcon',
    color: '#0084ff'
  },
  {
    name: 'bilibili',
    label: 'B站',
    url: 'https://space.bilibili.com/123456',
    icon: 'BilibiliIcon',
    color: '#ff6699'
  }
]

// 表单验证
const validateForm = () => {
  const newErrors = {}
  
  if (!form.name.trim()) {
    newErrors.name = '请输入姓名'
  }
  
  if (!form.email.trim()) {
    newErrors.email = '请输入邮箱'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = '请输入有效的邮箱地址'
  }
  
  if (!form.subject) {
    newErrors.subject = '请选择主题'
  }
  
  if (!form.message.trim()) {
    newErrors.message = '请输入消息内容'
  } else if (form.message.trim().length < 10) {
    newErrors.message = '消息内容至少需要10个字符'
  }
  
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 重置表单
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    })
    
    // 清除错误
    Object.keys(errors).forEach(key => delete errors[key])
    
    // 显示成功消息
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
    
  } catch (error) {
    console.error('发送失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 下载名片
const downloadCard = () => {
  // 这里可以实现名片下载功能
  console.log('下载名片')
}

// 名片翻转动画
const flipCard = () => {
  const card = businessCard.value
  if (!card) return
  
  gsap.to(card, {
    duration: 0.6,
    rotationY: '+=180',
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  // 页面入场动画
  gsap.from('.contact-header', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })
  
  gsap.from('.contact-info > *', {
    duration: 0.8,
    x: -50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.3
  })
  
  gsap.from('.contact-form-wrapper', {
    duration: 0.8,
    x: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.5
  })
  
  gsap.from('.digital-card', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.7
  })
  
  // 名片悬停效果
  if (businessCard.value) {
    businessCard.value.addEventListener('click', flipCard)
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.contact {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.contact-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  
  .page-title {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--spacing-lg);
  }
  
  .page-subtitle {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
  
  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-info {
  .info-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-lg);
    color: var(--text-color);
  }
  
  .info-description {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-2xl);
  }
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.contact-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-normal);
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }
}

.method-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
}

.method-content {
  flex: 1;
  
  .method-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-xs);
    color: var(--text-color);
  }
  
  .method-value {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--primary-color);
    margin-bottom: var(--spacing-xs);
  }
  
  .method-description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
}

.social-links {
  .social-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-lg);
    color: var(--text-color);
  }
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @include respond-to(sm) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-color);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--social-color);
    color: white;
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
}

.social-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

// 联系表单
.contact-form-wrapper {
  position: relative;
}

.contact-form {
  @include card;
  
  .form-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-xl);
    color: var(--text-color);
  }
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: var(--font-size-base);
  background: var(--bg-color);
  color: var(--text-color);
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &--error {
    border-color: #ff4757;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-error {
  display: block;
  color: #ff4757;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: normal;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
  
  &::after {
    opacity: 1;
  }
}

.checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.form-submit {
  @include button-primary;
  width: 100%;
  font-size: var(--font-size-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &--loading {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.loading-icon {
  width: 20px;
  height: 20px;
}

.success-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px solid var(--primary-color);
  
  .success-icon {
    width: 60px;
    height: 60px;
    fill: var(--primary-color);
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    color: var(--text-color);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
  }
}

// 数字名片
.digital-card {
  text-align: center;
}

.card-container {
  display: inline-block;
}

.business-card {
  width: 350px;
  height: 200px;
  position: relative;
  margin: 0 auto var(--spacing-lg);
  perspective: 1000px;
  cursor: pointer;
  
  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    background: var(--gradient-primary);
    color: white;
    display: flex;
    flex-direction: column;
  }
  
  .card-back {
    transform: rotateY(180deg);
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

.card-header {
  margin-bottom: var(--spacing-lg);
  
  .card-name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-xs);
  }
  
  .card-title {
    font-size: var(--font-size-base);
    opacity: 0.9;
  }
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
    opacity: 0.8;
  }
}

.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: auto;
}

.tech-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.qr-code {
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-md);
  
  .qr-placeholder {
    width: 100%;
    height: 100%;
    color: white;
  }
}

.qr-text {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.download-btn {
  @include button-primary;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
}

// 响应式调整
@include respond-to(sm) {
  .business-card {
    width: 400px;
    height: 240px;
  }
}
</style>
