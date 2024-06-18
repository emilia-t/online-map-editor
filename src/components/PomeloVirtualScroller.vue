<!--Use for reference(LayerElementPanel virtualList)-->
<template>
  <div class="PomeloVirtualScroller" ref="container" @scroll="handleScroll">
    <div
      v-for="(item, index) in visibleItems"
      :key="item.id"
      :style="{ transform: `translateY(${itemPositions[index]}px)` }"
      class="PVirtualScrollerItem"
    >
      {{ item.name }}
    </div>
    <div :style="{ height: totalHeight + 'px' }"></div>
  </div>
</template>

<script>
  export default {
    name: "PomeloVirtualScroller",
    data() {
      return {
        items: new Array(3000).fill(0).map((_, index) => ({
          id: index,
          name: `Item ${index}`,
        })),
        itemHeight: 50,
        containerHeight: 500,
        totalHeight: 0,
        startIndex: 0,
        endIndex: 0,
        buffer: 25, // 缓冲区大小
        downPreload:25,// 底部预加载数量
      };
    },
    computed: {
      visibleItems() {
        return this.items.slice(this.startIndex, this.endIndex+this.downPreload);
      },
      itemPositions() {
        return this.visibleItems.map((_, index) => (this.startIndex + index) * this.itemHeight);
      },
    },
    methods: {
      handleScroll() {
        // 防抖处理
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          const scrollTop = this.$refs.container.scrollTop;
          this.updateVisibleRange(scrollTop);
        }, 20);
      },
      updateVisibleRange(scrollTop) {
        const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
        const endIndex = Math.min(
          startIndex + Math.ceil(this.containerHeight / this.itemHeight) + this.buffer,
          this.items.length
        );
        this.startIndex = startIndex;
        this.endIndex = endIndex;
      },
    },
    mounted() {
      this.totalHeight = this.items.length * this.itemHeight;
      this.updateVisibleRange(0);
    },
  };
</script>

<style>
  .PomeloVirtualScroller{
    position: fixed;
    z-index: 99999;
    left: 50%;
    top:0%;
    width: 500px;
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  .PVirtualScrollerItem{
    position: absolute;
    z-index: 99999;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: red;
  }
</style>
