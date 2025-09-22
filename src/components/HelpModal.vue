<script setup lang="ts">
import SvgIcon from './SvgIcon.vue'

interface Emits {
  close: []
}

function handleClose() {
  emit('close')
}

const emit = defineEmits<Emits>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]" @click.self="handleClose">
      <div class="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-[800px] max-h-[90vh] overflow-y-auto relative w-[90vw] md:p-4 md:m-5">
        <div class="flex justify-between items-center mb-5 pb-2.5 border-b border-gray-600">
          <h3 class="text-lg font-semibold text-white">使用说明</h3>
          <button class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded transition-all duration-200 hover:bg-gray-600 hover:text-white" @click="handleClose">
            ×
          </button>
        </div>

        <div class="mb-5 max-h-[70vh] overflow-y-auto pr-2.5">
          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="trophy" :size="20" class="text-blue-500" />
              排行模式
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold"><strong class="text-white">娱乐杯级（默认）</strong>：超大杯、大杯、中杯、小杯</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold"><strong class="text-white">严肃杯级</strong>：更细致的九个等级划分</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold"><strong class="text-white">从夯到拉</strong>：经典的五个等级</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold"><strong class="text-white">自定义</strong>：可以创建自己的等级体系</li>
            </ul>
            <div class="bg-blue-500/10 border-l-4 border-blue-500 px-4 py-3 my-4 rounded-r-md text-sm text-blue-100">
              <SvgIcon name="lightbulb" :size="16" class="text-blue-500 inline mr-1" />
              <strong class="text-blue-500">小提示：</strong>不同模式的排行结果会独立保存，你可以随时切换。
            </div>
          </div>

          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="target" :size="20" class="text-blue-500" />
              基本操作
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击标题旁的 <strong class="text-white inline-flex items-center"><SvgIcon name="edit" :size="14" /></strong> 按钮可以修改页面标题</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">使用顶部的下拉菜单切换不同的排行模式</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击 <strong class="text-white inline-flex items-center"><SvgIcon name="refresh" :size="14" /></strong> 按钮可以重置当前模式的排行数据</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击 <strong class="text-white inline-flex items-center"><SvgIcon name="help" :size="14" /></strong> 按钮可以随时查看使用说明</li>
            </ul>
          </div>

          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="medal" :size="20" class="text-blue-500" />
              等级管理
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击等级右侧的 <strong class="text-white inline-flex items-center"><SvgIcon name="settings" :size="14" /></strong> 按钮可以编辑等级名称和颜色</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击等级右侧的 <strong class="text-white inline-flex items-center"><SvgIcon name="close" :size="14" /></strong> 按钮可以删除该等级</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">在自定义模式下，点击底部的 <strong class="text-white">+ 添加等级</strong> 按钮可以创建新等级</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">等级的背景颜色可以帮助你直观区分重要性</li>
            </ul>
            <div class="bg-blue-500/10 border-l-4 border-blue-500 px-4 py-3 my-4 rounded-r-md text-sm text-blue-100">
              <SvgIcon name="lightbulb" :size="16" class="text-blue-500 inline mr-1" />
              <strong class="text-blue-500">小提示：</strong>颜色选择器支持点击选择或直接输入十六进制色值。
            </div>
          </div>

          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="image" :size="20" class="text-blue-500" />
              素材管理
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击素材库的 <strong class="text-white">+ 添加素材</strong> 按钮可以上传图片</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">直接拖拽图片文件到素材库也可以添加素材</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">双击素材可以修改其名称</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">点击 <strong class="text-white">显示/隐藏素材名称</strong> 按钮控制名称显示</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">上传的图片会自动压缩以节省存储空间</li>
            </ul>
          </div>

          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="refresh" :size="20" class="text-blue-500" />
              拖拽排序
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">将素材从素材库拖拽到任意等级进行分类</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">在不同等级之间拖拽素材来调整排序</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">将素材从等级拖回素材库可以取消分类</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">将素材拖到删除区域可以永久删除</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">拖拽时会显示视觉反馈，帮助你准确操作</li>
            </ul>
            <div class="bg-blue-500/10 border-l-4 border-blue-500 px-4 py-3 my-4 rounded-r-md text-sm text-blue-100">
              <SvgIcon name="warning" :size="16" class="text-blue-500 inline mr-1" />
              <strong class="text-blue-500">注意：</strong>删除操作不可恢复，请谨慎操作。
            </div>
          </div>

          <div class="mb-6 pb-5 border-b border-gray-600 last:border-b-0 last:mb-0">
            <h4 class="text-blue-500 text-lg mb-3 flex items-center gap-2">
              <SvgIcon name="save" :size="20" class="text-blue-500" />
              数据保存
            </h4>
            <ul class="list-none p-0">
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">所有数据自动保存到浏览器本地存储</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">不同排行模式的数据独立保存</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">下次打开页面时会自动恢复所有设置</li>
              <li class="mb-2 pl-4 relative leading-6 text-gray-300 before:content-['•'] before:text-blue-500 before:absolute before:left-0 before:font-bold">数据仅保存在你的浏览器中，隐私安全</li>
            </ul>
            <div class="bg-blue-500/10 border-l-4 border-blue-500 px-4 py-3 my-4 rounded-r-md text-sm text-blue-100">
              <SvgIcon name="warning" :size="16" class="text-blue-500 inline mr-1" />
              <strong class="text-blue-500">重要：</strong>清除浏览器数据会导致排行榜数据丢失！
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
