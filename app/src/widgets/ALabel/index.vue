<template>
    <div class="flex-row padding-y-4 flex-justify-start">
        <div :style="{width:labelWidth}">{{label}}</div>
        <slot class="flex-1"></slot>
    </div>

</template>

<script>
    export default {
        name: "ALabel",
        props: {
            labelWidth: {
                type: String,
                default: '100px'
            },
            label: ''
        },
    }
</script>

<style scoped lang="less">
    @import "../../assets/widgets";

</style>