#!/bin/bash

function deploy_message() {
    echo "========" "[$(/bin/date '+%Y-%m-%d %H:%M:%S')]" ${1} "========"
}

PRODUCT_NAME='商户后台管理系统'
PRODUCT_VERSION='1.0.0'

this_file=`pwd`"/"$0
DEPLOY_DIR_OLD=`dirname $this_file`
DEPLOY_DIR=`dirname $DEPLOY_DIR_OLD`

a=$1
b=$2
if [[ $2 -ne 1 ]]
then
echo '----------------------'
echo '| 执行测试服务器编译 |'
echo '----------------------'
echo ''

if [[ $a -eq 1 ]]
then
    echo "开启INSTALL模式"
fi

start=`date +%s`
startTime=`date '+%Y-%m-%d %H:%M:%S'`

#build VUE
echo '  >>开始编译Web项目'
cd ${DEPLOY_DIR}/app/;
if [[ $a -eq 1 ]]
then
    echo '    执行 npm install'
    npm install
fi
echo ''
echo '    执行 npm run build'
npm run build


end=`date +%s`
endTime=`date '+%Y-%m-%d %H:%M:%S'`
dss=`expr $end - $start`;

#pm2 restart 27

echo '------------ 编译报告 ------------';
echo '  项目名称:' $PRODUCT_NAME;
echo '  项目版本:' $PRODUCT_VERSION;
echo '  开始时间:' $startTime;
echo '  结束时间:' $endTime;
echo '  编译时间:' $dss 's';
echo '--------------------------------'
fi

echo '     执行发布'

pm2 restart mbus | pm2 logs mbus


deploy_message "Deployment completed!!"
echo ''
