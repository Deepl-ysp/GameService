// composables/useGoToRouter.ts
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

/**
 * 路由跳转组合式函数
 * 提供 goToRouter 方法，支持字符串路径、命名路由、带参数/查询字符串、替换跳转等
 */
export function useGoToRouter() {
  const router = useRouter()

  /**
   * 核心路由跳转函数
   * @param to - 路由地址（字符串路径 或 路由对象）
   * @param options - 可选配置，如 replace 是否替换历史记录
   * @returns Promise
   *
   * 示例：
   *   goToRouter('/user')                         // 普通路径跳转
   *   goToRouter({ name: 'user', params: { id: 123 } })  // 命名路由 + 动态参数
   *   goToRouter({ path: '/search', query: { keyword: 'vue' } }) // 路径 + 查询参数
   *   goToRouter('/profile', { replace: true })   // 替换当前历史记录
   */
  async function goToRouter(
    to: RouteLocationRaw,
    options?: { replace?: boolean }
  ): Promise<void> {
    const { replace = false } = options || {}
    try {
      if (replace) {
        await router.replace(to)
      } else {
        await router.push(to)
      }
    } catch (err) {
      console.error('路由跳转失败:', err)
      throw err
    }
  }

  function push(to: RouteLocationRaw) {
    return goToRouter(to)
  }

  function replace(to: RouteLocationRaw) {
    return goToRouter(to, { replace: true })
  }

  function back() {
    return router.back()
  }

  function forward() {
    return router.forward()
  }

  return {
    goToRouter,   // 主函数
    push,         // 别名，等价于 goToRouter(to)
    replace,      // 直接替换
    back,
    forward
  }
}