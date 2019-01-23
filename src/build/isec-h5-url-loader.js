/** 
 *  针对特殊的业务情况， 做url转换。
 *  因为部门H5页面需要接入移动网关， 所以本地的"/xxx" 会被代理成 "/an:matrixq/{:appname}/xxx"格式
 *  这个模块用来统一做这个path转换，所有用到path的地方都需要调用_resolve('/xxxx')
 *  created by shiningding 2018-12-21
 */
const path = require('path')
const config = require(path.resolve('.')+'/config')
const origin = config.origin;
const originPath = origin || "";
function loader(source){
    let path = '';
    if(process.env.NODE_ENV == 'production'){
        //正式环境, 给所有的资源 形如url="/static/"加上前缀
        source = source.replace(/([url|src][:|=|\(][\"|\']{0,1})(\/static)/g,'$1'+origin+'/static') 
        path = originPath
    }
    //替换js中的_resolve()方法.
    source = source.replace(/(_resolve\([\'|\"]{0,1})(.+?)('\))/g,'"'+path+'$2"')
    return source
}

module.exports = loader