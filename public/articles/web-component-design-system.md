# Web组件设计系统构建指南

设计系统是现代Web开发的重要组成部分，它确保了产品的一致性和可维护性。本文将详细介绍如何从零开始构建一个完整的Web组件设计系统。

## 设计系统基础

设计系统不仅仅是UI组件库，它包含：

- **设计原则**：指导设计决策的核心理念
- **设计令牌**：颜色、字体、间距等基础变量
- **组件库**：可重用的UI组件
- **模式库**：常见的交互模式和布局
- **文档**：使用指南和最佳实践

## 设计令牌（Design Tokens）

设计令牌是设计系统的原子单位，定义了所有视觉属性：

```css
/* tokens/colors.css */
:root {
  /* 主色调 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* 语义化颜色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* 中性色 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}

/* tokens/typography.css */
:root {
  /* 字体家族 */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  /* 字体大小 */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* tokens/spacing.css */
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
}
```

## 基础组件开发

### Button 组件

```vue
<!-- components/Button.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <Icon v-if="icon && iconPosition === 'left'" :name="icon" />
    <span v-if="$slots.default" class="button__text">
      <slot />
    </span>
    <Icon v-if="icon && iconPosition === 'right'" :name="icon" />
    <Spinner v-if="loading" class="button__spinner" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import Spinner from './Spinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--disabled': props.disabled,
    'button--loading': props.loading,
    'button--icon-only': props.icon && !$slots.default
  }
])
</script>

<style lang="scss" scoped>
.button {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  
  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  
  /* 尺寸变体 */
  &--small {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-sm);
    min-height: 2rem;
  }
  
  &--medium {
    padding: var(--spacing-3) var(--spacing-4);
    font-size: var(--font-size-base);
    min-height: 2.5rem;
  }
  
  &--large {
    padding: var(--spacing-4) var(--spacing-6);
    font-size: var(--font-size-lg);
    min-height: 3rem;
  }
  
  /* 颜色变体 */
  &--primary {
    background-color: var(--color-primary-500);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary-600);
    }
    
    &:active:not(:disabled) {
      background-color: var(--color-primary-700);
    }
  }
  
  &--secondary {
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
    
    &:hover:not(:disabled) {
      background-color: var(--color-gray-200);
    }
  }
  
  &--outline {
    background-color: transparent;
    border-color: var(--color-primary-500);
    color: var(--color-primary-500);
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary-50);
    }
  }
  
  &--ghost {
    background-color: transparent;
    color: var(--color-primary-500);
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary-50);
    }
  }
  
  &--danger {
    background-color: var(--color-error);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-red-600);
    }
  }
  
  /* 状态 */
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &--loading {
    cursor: wait;
    
    .button__text {
      opacity: 0.7;
    }
  }
  
  &--icon-only {
    padding: var(--spacing-2);
    aspect-ratio: 1;
  }
}

.button__spinner {
  position: absolute;
  right: var(--spacing-3);
}
</style>
```

### Input 组件

```vue
<!-- components/Input.vue -->
<template>
  <div class="input-group">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-wrapper" :class="inputWrapperClasses">
      <Icon v-if="prefixIcon" :name="prefixIcon" class="input-icon input-icon--prefix" />
      
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      
      <Icon v-if="suffixIcon" :name="suffixIcon" class="input-icon input-icon--suffix" />
      
      <button
        v-if="clearable && inputValue"
        type="button"
        class="input-clear"
        @click="clearInput"
      >
        <Icon name="x" />
      </button>
    </div>
    
    <div v-if="helpText || errorMessage" class="input-help">
      <span v-if="errorMessage" class="input-error">{{ errorMessage }}</span>
      <span v-else-if="helpText" class="input-help-text">{{ helpText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useAttrs } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  prefixIcon: {
    type: String,
    default: null
  },
  suffixIcon: {
    type: String,
    default: null
  },
  clearable: {
    type: Boolean,
    default: false
  },
  helpText: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input', 'clear'])

// 移除 class 属性，避免传递到 input 元素
const attrs = useAttrs()
const { class: _, ...inputAttrs } = attrs

const isFocused = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputWrapperClasses = computed(() => [
  'input-wrapper',
  `input-wrapper--${props.size}`,
  {
    'input-wrapper--focused': isFocused.value,
    'input-wrapper--disabled': props.disabled,
    'input-wrapper--error': props.errorMessage,
    'input-wrapper--with-prefix': props.prefixIcon,
    'input-wrapper--with-suffix': props.suffixIcon || props.clearable
  }
])

const inputClasses = computed(() => [
  'input',
  `input--${props.size}`
])

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event) => {
  emit('input', event)
}

const clearInput = () => {
  inputValue.value = ''
  emit('clear')
}
</script>

<style lang="scss" scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.input-required {
  color: var(--color-error);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  background-color: white;
  transition: all 0.2s ease-in-out;
  
  &:hover:not(.input-wrapper--disabled) {
    border-color: var(--color-gray-400);
  }
  
  &--focused {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &--error {
    border-color: var(--color-error);
    
    &.input-wrapper--focused {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
  
  &--disabled {
    background-color: var(--color-gray-50);
    cursor: not-allowed;
  }
  
  &--small {
    min-height: 2rem;
  }
  
  &--medium {
    min-height: 2.5rem;
  }
  
  &--large {
    min-height: 3rem;
  }
}

.input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--color-gray-900);
  
  &::placeholder {
    color: var(--color-gray-400);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &--small {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-sm);
  }
  
  &--medium {
    padding: var(--spacing-3) var(--spacing-4);
  }
  
  &--large {
    padding: var(--spacing-4) var(--spacing-6);
    font-size: var(--font-size-lg);
  }
}

.input-wrapper--with-prefix .input {
  padding-left: var(--spacing-2);
}

.input-wrapper--with-suffix .input {
  padding-right: var(--spacing-2);
}

.input-icon {
  color: var(--color-gray-400);
  
  &--prefix {
    margin-left: var(--spacing-3);
  }
  
  &--suffix {
    margin-right: var(--spacing-3);
  }
}

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: var(--spacing-2);
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--color-gray-400);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-gray-600);
  }
}

.input-help {
  font-size: var(--font-size-sm);
}

.input-error {
  color: var(--color-error);
}

.input-help-text {
  color: var(--color-gray-500);
}
</style>
```

## 组件文档系统

### 使用Storybook

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-a11y'
  ]
}

// stories/Button.stories.js
import Button from '../components/Button.vue'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    onClick: { action: 'clicked' }
  }
}

const Template = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args">{{ args.default }}</Button>'
})

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary',
  default: 'Primary Button'
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
  default: 'Secondary Button'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  variant: 'primary',
  icon: 'plus',
  default: 'Add Item'
}
```

## 主题系统

### 深色模式支持

```css
/* themes/dark.css */
[data-theme="dark"] {
  --color-gray-50: #1f2937;
  --color-gray-100: #374151;
  --color-gray-500: #9ca3af;
  --color-gray-900: #f9fafb;
  
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}

/* 主题切换器 */
.theme-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-full);
  background: var(--bg-primary);
}

.theme-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &--active {
    background: var(--color-primary-500);
    color: white;
  }
}
```

### 主题切换逻辑

```javascript
// composables/useTheme.js
import { ref, watchEffect } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }
  
  // 初始化主题
  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })
  
  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme
  }
}
```

## 测试策略

### 组件测试

```javascript
// tests/Button.test.js
import { mount } from '@vue/test-utils'
import Button from '../components/Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('button--primary')
  })
  
  it('emits click event', async () => {
    const wrapper = mount(Button)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  it('applies correct variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary'
      }
    })
    
    expect(wrapper.classes()).toContain('button--secondary')
  })
  
  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })
    
    expect(wrapper.element.disabled).toBe(true)
    expect(wrapper.classes()).toContain('button--disabled')
  })
})
```

### 视觉回归测试

```javascript
// tests/visual.test.js
import { chromium } from 'playwright'

describe('Visual Regression Tests', () => {
  let browser, page
  
  beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
  })
  
  afterAll(async () => {
    await browser.close()
  })
  
  it('button variants look correct', async () => {
    await page.goto('http://localhost:6006/iframe.html?id=components-button--all-variants')
    
    const screenshot = await page.screenshot()
    expect(screenshot).toMatchSnapshot('button-variants.png')
  })
})
```

## 发布和版本管理

### 语义化版本

```json
{
  "name": "@company/design-system",
  "version": "1.2.3",
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "release": "semantic-release",
    "storybook": "storybook dev -p 6006"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```

### 自动化发布

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - run: npm run build-storybook
      
      - name: Deploy Storybook
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
      
      - run: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 最佳实践

1. **一致性优先**：确保所有组件遵循相同的设计原则
2. **可访问性**：遵循WCAG指南，确保组件可访问
3. **性能优化**：按需加载，避免不必要的重渲染
4. **文档完善**：提供详细的使用文档和示例
5. **版本管理**：使用语义化版本，提供迁移指南

## 总结

构建一个成功的设计系统需要考虑设计、开发、测试、文档等多个方面。关键是要建立清晰的设计原则，创建可重用的组件，并提供完善的文档和工具支持。
