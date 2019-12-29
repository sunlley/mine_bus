
module.exports = {
    publicPath:'/',
    outputDir:__dirname+'/../public',
    assetsDir:'',
    indexPath:'../view/index.html',
    filenameHashing:false,
    productionSourceMap: true,
    devServer: {
        proxy: {
            '/api':{
                target:'http://dev.bitkeep.com:9929/',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
        }
    },
}
