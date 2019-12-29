<template>
    <div class="a-card">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ACard"
    }
</script>

<style scoped lang="less">
    .a-card{
        padding: 14px;
        background: white;
        border-style: solid;
        border-width: 0;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

</style>