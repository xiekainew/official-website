import { ref, Ref } from 'vue'

interface AsyncDataState<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
}

type AsyncFunction<T> = (...args: any[]) => Promise<T>

export function useAsyncData<T>(asyncFunction: AsyncFunction<T>): AsyncDataState<T> & {
  execute: (...args: any[]) => Promise<T | null>
} {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const execute = async (...args: any[]): Promise<T | null> => {
    loading.value = true
    error.value = null
    
    try {
      const result = await asyncFunction(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
