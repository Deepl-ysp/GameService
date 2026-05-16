import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

/**
 * 修改窗口全屏状态
 * @param targetState 目标全屏状态，true表示进入全屏，false表示退出全屏
 * @returns Promise<void> 表示操作完成的Promise
 * @throws Error 如果操作失败，将抛出错误
 */
async function toggleFullscreen(targetState: boolean) {
  const appWindow = getCurrentWindow();
  try {
    const currentFullscreen = await appWindow.isFullscreen();
    if (currentFullscreen !== targetState) {
      await appWindow.setFullscreen(targetState);
    }
  } catch (error) {
    console.error('Failed to toggle fullscreen:', error);
  }
};

/**
 * 设置窗口大小
 * @param width 目标宽度
 * @param height 目标高度
 * @returns Promise<void> 表示操作完成的Promise
 * @throws Error 如果操作失败，将抛出错误
 */
async function setWindowSize(width: number, height: number) {
  const appWindow = getCurrentWindow();
  try {
    await appWindow.setSize(new LogicalSize(width, height));
  } catch (error) {
    console.error('Failed to set window size:', error);
  }
}

export { toggleFullscreen , setWindowSize }
