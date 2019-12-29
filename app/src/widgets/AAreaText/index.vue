<template>

    <div class="flex-row flex-start padding-y-4"
    style="align-items: start">
        <div :style="{width:labelWidth}">{{label}}
        <slot></slot></div>

        <el-input
                class="flex-1"
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="text">
        </el-input>

    </div>

</template>

<script>

    import AInput from '../AInput'

    export default {
        name: "AAreaText",
        mixins:[
            AInput
        ]

    }
</script>

<style scoped lang="less">
    @import "../../assets/widgets";

</style>