#!/bin/bash
this_file=`pwd`"/"$0
DEPLOY_DIR_OLD=`dirname $this_file`
DEPLOY_DIR=`dirname $DEPLOY_DIR_OLD`
NAME="com.bitkeep.mbus"
TARGET_DIR="/data/vhosts/${NAME}"
REPOS_DIR="./mbus"
HISTORY_DIR="${DEPLOY_DIR}/history"

INSTANCES=(
"10.7.138.108"
)

function deploy_message() {
    echo "========" "[$(/bin/date '+%Y-%m-%d %H:%M:%S')]" ${1} "========"
}

function remote_ssh() {
    deploy_message ${2}
    sudo /usr/bin/ssh -i /home/devops-user/.ssh/id_rsa -t devops-user@${1} ${2}
}

PRODUCT_NAME='友矿商户后台管理'
PRODUCT_VERSION='1.0.0'

a=$1
b=$2
if [[ $b -ne 1 ]]
then
echo '----------------------'
echo '| 执行生产服务器编译 |'
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

# make directory
deploy_message "Making new directory"
TAG=`/bin/date "+%Y-%m-%d-%H-%M-%S"`
TGZ_NAME="${NAME}_${TAG}.tgz"
TARGET_TAG_DIR="/data/vhosts/${NAME}_${TAG}"
TARGET_TGZ_FILE="/data/vhosts/${TGZ_NAME}"


# create code tarball
deploy_message "Create tarball"
cd ${DEPLOY_DIR}/;
/bin/tar zcf ${TGZ_NAME} ./* --exclude=logs --exclude=data --exclude=history --exclude=web  --exclude=node_modules;
mkdir -p ${HISTORY_DIR};
/bin/mv ./${TGZ_NAME} ${HISTORY_DIR}/

for instance in ${INSTANCES[*]}; do
    #创建远程文件夹
    remote_ssh ${instance} "/bin/mkdir -p ${TARGET_TAG_DIR};/bin/mkdir -p --mode=777 /data/logs/vhosts/${NAME};"
    #将压缩文件拷贝到相应的目录
    sudo /usr/bin/scp -i /home/devops-user/.ssh/id_rsa ${HISTORY_DIR}/${TGZ_NAME} devops-user@${instance}:/data/vhosts/
    #解压文件,重新建立项目所需配置文件连接,重新启动pm
    remote_ssh ${instance} "/bin/tar xzf ${TARGET_TGZ_FILE} -C ${TARGET_TAG_DIR};/bin/rm -f ${TARGET_TGZ_FILE};/bin/rm -f ${TARGET_TAG_DIR}/conf/config.json;/bin/ln -s ${TARGET_TAG_DIR}/conf/config.release.json ${TARGET_TAG_DIR}/conf/config.json;/bin/unlink ${TARGET_DIR};/bin/ln -s ${TARGET_TAG_DIR} ${TARGET_DIR}; export NODE_PATH=\"/usr/lib/node_modules\"; cd ${TARGET_DIR};  pm2 start index.json;"
done

deploy_message "Deployment completed!!"
