<template>
    <div class="a-uploader" @click="actionOpenFiles">
        <a href="javascript:;"
           class="a-uploader-file">
            选择文件
            <input type="file" @change="actionOpenFiles" ref="AUploaderFiles">
        </a>

        <!--<img :src="image">-->
    </div>

</template>

<script>
    export default {
        name: "AUpload",
        props:{
            index:[String,Number]
        },
        data(){
            return{
                images:[],
                image:''
            }
        },
        methods: {
            actionOpenFiles(view) {
                let _this = this;
                console.info(view);
                let file = this.$refs.AUploaderFiles.files[0];
                // let fr = new FileReader();
                // console.info(file)
                // try {
                //     fr.readAsDataURL(file);
                // } catch (e) {
                // }
                // fr.onload = (e) => {
                //     this.image = e.target.result;
                // }

                if (file != undefined){
                    let url = "https://www.dezignlife.com.cn/v1/files/upload";
                    //上传文件
                    let form = new FormData(); // FormData 对象
                    form.append("file", file); // 文件对象
                    let xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                    xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                    xhr.onload = function (evt) {
                        let data = JSON.parse(evt.target.responseText);
                        if (data.status == 0) {
                            // alert("上传成功！\n" + data.data.files);
                            file['link']=data.data.files[0];
                            _this.$emit('onChange',file,_this.index);
                        }
                    }; //请求完成
                    xhr.onerror = function (evt) {
                        
                    }; //请求失败
                    xhr.upload.onprogress = function (evt) {
                        
                    };//【上传进度调用方法实现】
                    xhr.upload.onloadstart = function (evt) {//上传开始执行方法
                        // ot = new Date().getTime();   //设置上传开始时间
                        // oloaded = 0;//设置上传开始时，以上传的文件大小为0
                    };
                    xhr.send(form); //开始上传，发送form数据

                }
            }
        }
    }
</script>

<style scoped lang="less">
    .a-uploader {
        /*height: 100px;*/
        /*width: 100px;*/
        /*border: 1px dashed #d9d9d9;*/
        /*border-radius: 6px;*/
        /*cursor: pointer;*/
        position: relative;
        overflow: hidden;
        /*img{*/
            /*width: 100%;*/
            /*height: 100%;*/
        /*}*/
    }

    .a-uploader-file {
        position: relative;
        display: inline-block;
        background: #D0EEFF;
        border: 1px solid #99D3F5;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        color: #1E88C7;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;

        input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
        }

        &:hover {
            background: #AADFFD;
            border-color: #78C3F3;
            color: #004974;
            text-decoration: none;
        }
    }


</style>