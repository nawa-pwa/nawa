module.exports = {
    // 站点相关，项目名
    name: 'now',
    // 离线包发布先关配置
    offline: {
        'publish': true, // 这个参数用来告诉cgi，创建包的同时是否需要发布
        'compatible': 0, // 兼容版本
        'bid': 2452, // 所属业务
        'qversionfrom': '0', // 手Q起始版本号
        'qversionto': '0', // 手Q结束版本号
        'platform': [2, 3], // 支持平台， 2， 3表示ios android平台都都勾选上了
        'loadmode': 2, // 加载模式， 2表示拦截加载
        'frequency': 1, // 更新检测的时间频率， 1表示1分钟检测一次
        'verifyType': 0,
        'expire_time': 1577836800000, // 过期时间毫秒数，默认为 2020-1-1
        'cdn': 'defaultCDN', // 连线包使用cdn，默认为 defaultCDN
        'note': '', // 备注
        'gray': true, // 是否灰度， true表示灰度
        // 要灰度的QQ号
        'uins': [
            { "min": 12339972, "max": 12339972 },
            { "min": 584605965, "max": 584605965 },
            { "min": 812865052, "max": 812865052 },
            { "min": 578557687, "max": 578557687 },
            { "min": 498551795, "max": 498551795 },
            { "min": 790671954, "max": 790671954 },
            { "min": 329111361, "max": 329111361 },
            { "min": 624005743, "max": 624005743 },
            { "min": 769754270, "max": 769754270 },
            { "min": 382184760, "max": 382184760 },
            { "min": 380533073, "max": 380533073 },
            { "min": 410964963, "max": 410964963 },
            { "min": 569649184, "max": 569649184 },
            { "min": 2018170271, "max": 2018170271 },
            { "min": 3000000000, "max": 3200000000} //灰度号码包
        ],
        // 文件校验过滤，仅支持正则基本语法
        'verifyFilterRegex': 'jpg|jpeg|png|gif'
    },
    // ARS发布相关配置
    ars: {
        // 以支持自定义拆单发布
        splitReceipt: [['webserver', 'cdn']]
        // splitReceipt: ['webserver', 'cdn']
    },
    // 请求重定向(限用于无线测试环境) 类似fiddler的willow插件的extentions
    extentions: [
        // {'match': 'http://qun.qq.com/qunpay/','action': 'wired.alloyproxy.com:8003'}
    ],
    // 编译发布相关配置
    distConfig: {
        // 设置环境变量
        environmentVariables: {
            //测试部署使用，NODE_ENV=development
            'development': 'development',
            //发布部署使用，NODE_ENV=production
            'production': 'production',
        },
        //支持自定义构建命令，如需开启请自行去除注释
        //开启之后如果需要设置环境变量的话，请自行添加 `NODE_ENV=**`
        //如果需要调用grunt/gulp之类构建命令，查看
        //http://dcloud.oa.com/waltz/alloyteam.html#7846
        buildCommand: {
           command: 'npm',
           args: ['run','compile']
        }
        //如果需要区分环境使用不同的部署命令，请使用以下写法
        //buildCommand: {
        // 对应测试部署操作
        //    'development': {
        //        // `NODE_ENV=development  node /data/frontend/install/AlloyDist/runtime-edu/node_modules/lego/bin/lego-config set registry http://lego.oa.com & cd src & node /data/frontend/install/AlloyDist/runtime-edu/node_modules/lego/bin/lego-install & cd .. & fis3 release dist -c`
        //        command: 'npm',
        //        args: ['run', 'development']
        //    },
        //  对应预编译发布操作
        //    'production': {
        //        command: 'npm',
        //        args: ['run', 'production']
        //    }
        //}
    }
    // cdnUrl: '//8.url.cn/now/h5/component',// todo
    // serverUrl: '//now.qq.com/h5/component',
    // libDomain: '//8.url.cn/now/lib/2'
};
