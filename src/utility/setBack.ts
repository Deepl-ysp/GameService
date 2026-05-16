import { getImage } from "./image";

/**
 * 获取时间所属时段
 * @returns 0: 早上 (6:00-11:59), 1: 中午 (12:00-13:59), 2: 晚上 (14:00-5:59)
 */
function getTimePeriod(): number {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 0;
    if (hour >= 12 && hour < 18) return 1;
    return 2;
}

/**
 * 设置背景图
 * @param Element 目标 HTML 元素
 * @param imagePath 可选：单张图片路径，或按时段的三元组 [早上, 中午, 晚上]
 */
export async function setBack(Element: HTMLElement, imagePath?: string | [string, string, string]): Promise<void> {
    let targetPath: string;

    if (imagePath === undefined) {
        // 默认背景图（按时段选择）
        const defaultPaths = [
            "images/background/bg_bambooforest.jpg",
            "images/background/bg_bambooforest_sunset.jpg",
            "images/background/bg_bambooforest_night.jpg"
        ];
        targetPath = defaultPaths[getTimePeriod()];
    } else if (Array.isArray(imagePath)) {
        targetPath = imagePath[getTimePeriod()];
    } else {
        targetPath = imagePath;
    }

    try {
        // getImage 已返回完整的 Data URL
        const dataUrl = await getImage(targetPath);
        Element.style.backgroundImage = `url("${dataUrl}")`;
    } catch (error) {
        console.error("设置背景图失败:", error);
    }
}