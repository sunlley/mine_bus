<template>
  <div class="vtitle-content flex-row">
    <div>
      <slot name="default"></slot>
    </div>
    <div style="flex: 1;text-align: right;">
    <slot name="right"></slot>
    </div>
  </div>

</template>

<script>
  export default {
    name: "ATitle",
  }
</script>

<style scoped lang="less">
  @import "../../assets/base";

  .vtitle-content {
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    background: white;
    justify-content: space-between;
    //.padding-x-7


  }

</style>
