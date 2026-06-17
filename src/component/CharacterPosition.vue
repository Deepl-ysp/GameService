<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Character, getCharacterList } from "../utility/character";
import { getImage } from "../utility/image";

interface RenderedCharacter {
  name: string;
  imageUrl: string;
  position: [number, number, number];
  imageHeight?: number;
  imageWidth?: number;
}

const CharacterList = ref<Character[]>([]);
const renderedCharacters = ref<RenderedCharacter[]>([]);

const VALID_Z_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
type ValidZValue = typeof VALID_Z_VALUES[number];

// 基准屏幕尺寸（1920x1080 Full HD）
const BASE_SCREEN_HEIGHT = 1080;

let screenScaleFactor = 1;

onMounted(async () => { 
    CharacterList.value = await getCharacterList();
    updateScreenScaleFactor();
    window.addEventListener('resize', updateScreenScaleFactor);
});

const updateScreenScaleFactor = () => {
    const currentHeight = window.innerHeight;
    screenScaleFactor = currentHeight / BASE_SCREEN_HEIGHT;
};

const getZIndex = (z: number): number => {
    return z * 10;
};

// 计算动态缩放比例：z值从1到10，基准比例与原3级保持一致
const getDynamicScale = (z: number): number => {
    // 原3级比例：z=1→0.75, z=2→0.90, z=3→1.05
    // 扩展到10级的计算公式：保持原z=1-3不变，z=4-10按比例递增
    let baseScale: number;
    if (z <= 3) {
        baseScale = 0.35 + (z * 0.15); // 与原比例保持一致
    } else {
        // z=4-10：从1.20开始，每级增加0.10
        baseScale = 1.05 + ((z - 3) * 0.10);
    }
    return baseScale * screenScaleFactor;
};

const getTransform = (x: number, y: number, z: number): string => {
    const scale = getDynamicScale(z);
    // X轴：0位置时图片左边贴窗口左边
    // Y轴：0位置时图片底部贴窗口底部，使用bottom left作为transform origin
    const scaledX = x * 100 * screenScaleFactor;
    const scaledY = -y * 50 * screenScaleFactor; // y越大，图片越往上
    return `translateX(${scaledX}px) translateY(${scaledY}px) scale(${scale})`;
};

const handleImageLoad = (characterName: string, event: Event) => {
    const img = event.target as HTMLImageElement;
    const character = renderedCharacters.value.find(c => c.name === characterName);
    if (character) {
        character.imageHeight = img.naturalHeight;
        character.imageWidth = img.naturalWidth;
        checkBoundary(character);
    }
};

const checkBoundary = (character: RenderedCharacter) => {
    const [x, y, z] = character.position;
    const scale = getDynamicScale(z);
    
    const actualImageWidth = (character.imageWidth || 300) * scale;
    const actualImageHeight = (character.imageHeight || 400) * scale;
    
    const scaledX = x * 100 * screenScaleFactor;
    const scaledY = -y * 50 * screenScaleFactor; // y越大，图片越往上
    
    // transform-origin是bottom left，元素定位在left:0, bottom:0
    // 所以：
    // 图片左边界 = scaledX
    // 图片右边界 = scaledX + actualImageWidth
    // 图片底部 = 0 (在窗口底部) + scaledY
    // 图片顶部 = -actualImageHeight + scaledY
    const leftBoundary = scaledX;
    const rightBoundary = scaledX + actualImageWidth;
    const bottomBoundary = scaledY;
    const topBoundary = -actualImageHeight + scaledY;
    
    const overflowInfo: string[] = [];
    
    // 使用屏幕尺寸作为边界判断
    const screenWidth = window.innerWidth;
    // const screenHeight = window.innerHeight;
    
    if (leftBoundary < 0) {
        overflowInfo.push(`X轴左边界超出: ${Math.abs(leftBoundary).toFixed(2)}px`);
    }
    if (rightBoundary > screenWidth) {
        overflowInfo.push(`X轴右边界超出: ${(rightBoundary - screenWidth).toFixed(2)}px`);
    }
    if (topBoundary < 0) {
        overflowInfo.push(`Y轴上边界超出: ${Math.abs(topBoundary).toFixed(2)}px`);
    }
    if (bottomBoundary > 0) {
        overflowInfo.push(`Y轴下边界超出: ${bottomBoundary.toFixed(2)}px`);
    }
    
    // if (overflowInfo.length > 0) {
    //     console.warn(`[CharacterPosition] ${character.name} 超出边界:`);
    //     overflowInfo.forEach(info => console.warn(`  - ${info}`));
    //     console.warn(`  当前位置: [${x}, ${y}, ${z}]`);
    //     console.warn(`  屏幕尺寸: ${screenWidth}x${screenHeight}`);
    //     console.warn(`  屏幕比例系数: ${screenScaleFactor.toFixed(4)}`);
    //     console.warn(`  图片尺寸(缩放后): ${actualImageWidth.toFixed(0)}x${actualImageHeight.toFixed(0)}`);
    //     console.warn(`  原始图片尺寸: ${character.imageWidth || 0}x${character.imageHeight || 0}`);
    //     console.warn(`  transform-origin: bottom left`);
    //     console.warn(`  元素定位: left:0, bottom:0`);
    // }
};

const renderCharacter = async (
    characterName: string, 
    position: [number, number, number] = [0, 0, 1],
    standingIllustrationIndex: number = 0
) => {
    const character = CharacterList.value.find(c => c.name === characterName);
    if (!character) {
        console.error(`Character not found: ${characterName}`);
        return false;
    }

    const [x, y, z] = position;
    if (!VALID_Z_VALUES.includes(z as ValidZValue)) {
        console.error(`Invalid Z value: ${z}. Z must be one of: ${VALID_Z_VALUES.join(', ')}`);
        return false;
    }

    const existingIndex = renderedCharacters.value.findIndex(c => c.name === characterName);
    if (existingIndex !== -1) {
        renderedCharacters.value.splice(existingIndex, 1);
    }

    const imagePath = character.standingIllustration?.[standingIllustrationIndex];
    
    if (!imagePath) {
        console.error(`No standing illustration found for character: ${characterName} at index ${standingIllustrationIndex}`);
        return false;
    }

    try {
        const imageUrl = await getImage(imagePath);
        
        renderedCharacters.value.push({
            name: characterName,
            imageUrl,
            position: [x, y, z]
        });

        renderedCharacters.value.sort((a, b) => a.position[2] - b.position[2]);
        
        return true;
    } catch (error) {
        console.error(`Failed to load image for character ${characterName}:`, error);
        return false;
    }
};

const removeCharacter = (characterName: string): boolean => {
    const index = renderedCharacters.value.findIndex(c => c.name === characterName);
    if (index !== -1) {
        renderedCharacters.value.splice(index, 1);
        return true;
    }
    return false;
};

const clearAllCharacters = (): void => {
    renderedCharacters.value = [];
};

defineExpose({
    renderCharacter,
    removeCharacter,
    clearAllCharacters
});
</script>

<template>
    <div class="character-position-container">
        <div 
            v-for="character in renderedCharacters" 
            :key="character.name"
            class="character-sprite"
            :style="{
                transform: getTransform(character.position[0], character.position[1], character.position[2]),
                zIndex: getZIndex(character.position[2])
            }"
        >
            <img 
                :src="character.imageUrl" 
                :alt="character.name" 
                @load="handleImageLoad(character.name, $event)"
            />
        </div>
    </div>
</template>

<style scoped>
.character-position-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.character-sprite {
    position: absolute;
    left: 0;
    bottom: 0;
    transform-origin: bottom left;
    transition: transform 0.3s ease-out;
}

.character-sprite img {
    object-fit: contain;
    pointer-events: none;
    user-select: none;
}
</style>