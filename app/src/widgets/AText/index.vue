<template>
    <div class="flex-row padding-y-4">
        <!--<div :style="{width:labelWidth}">{{label}}</div>-->
        <div style="width:100px;">{{label}}
        <slot></slot>
        </div>
        <el-input
                :autosize="{ minRows: min}"
                :disabled="disabled"
                @keyup.enter.native="actionOnEnterClick"
                class="flex-1"
                v-model="text"
                type="textarea"
                :placeholder="holder"></el-input>
    </div>
</template>

<script>
    export default {
        name: "AText",
        model: {
            event: 'onTextChanged',
            prop: 'value'
        },
        props: {
            labelWidth: {
                type: String,
                default: '100px'
            },
            disabled:{
                type:Boolean,
                default:false
            },
            value: [String,Number],
            data: '',
            label: '',
            holder: '',
            min: {
                type:String,
                default:'1',
            },
            type: {
                type: String,
                default: 'text'
            },
        },
        data() {
            return {
                text: '',

            }
        },
        watch: {
            value() {
                this.text=this.value;
            },
            text() {
                this.actionTextChanged();
            }
        },
        methods: {
            actionOnEnterClick(){
                this.$emit('onEnterClick');
            },
            actionTextChanged() {
                this.$emit('onTextChanged', this.text);
            }
        },
        mounted() {
            this.text = this.value;
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/widgets";


</style>