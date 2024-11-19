export default function useStatus() {
  const status = ref<'idle' | 'running' | 'done'>('idle')
  const setStatus = (s: typeof status['value']) => {
    status.value = s
  }
  return { status, setStatus }
}
