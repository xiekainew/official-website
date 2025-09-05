<template>
    <div>
        <h1>Home</h1>
        <div>
            {{ name }}
        </div>
        <div id="counter">{{ count }}</div>
        <button @click="increment">+1</button>
        <button @click="decrement">-1</button>
        <div>{{ state.name }}</div>
        <div>{{ id }}</div>
        <div>{{ id2 }}</div>
        <div @click="clickSort">{{ list }}</div>
    </div>
</template>

<script setup>
import {nextTick, reactive, ref, toRefs, shallowRef, useAttrs, useId} from 'vue'

import {useCounter} from '../hooks/useCounter.ts'

const {count, increment, decrement} = useCounter()



const userData = reactive({
    name: '张三',
    age: 20
})

let list = reactive([1,3,5,2,4])

const {name} = toRefs(userData)

const id = ref(useId())
const id2 = ref(useId())

name.value = '历史3'

const clickCount = async () => {
    count.value++

    console.log(document.getElementById('counter').textContent)
    await nextTick()
    console.log(document.getElementById('counter').textContent)
}

const state = shallowRef({name: '333'})
state.value.name = '33444'
// console.log(state.value)

state.value = {name: 455}

const fastSort = (list) => {
    if (list.length <= 1) return list

    const c = parseInt(list.length / 2)
    const center = list.splice(c, 1)[0]

    const left = []
    const right = []

    for (let i = 0; i < list.length; i++) {
        if (list[i] < center) {
            left.push(list[i])
        } else {
            right.push(list[i])
        }
    }

    return [...fastSort(left), center, ...fastSort(right)]
}

const clickSort = () => {
    list = fastSort(list)
}

</script>