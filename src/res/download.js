#!/usr/bin/env node
const shelljs = require('shelljs/global');
const fs      = require('fs');
const print   = require('./echo')
function download(config){
    const path =process.cwd()+'/'+config.project;
    const downloadPath = './isec_ui_demo';
    const packagePath = downloadPath+'/package.json';
    const gitPath  = downloadPath +'/.git'
    //执行git clone
    print("Starting download template from http://git.code.oa.com/isec/isec_ui_demo.git....");
    exec('git clone http://git.code.oa.com/isec/isec_ui_demo.git '+downloadPath)

    //替换package.json
    fs.readFile(packagePath,'utf-8',(err,data)=>{
        if(err){
            throw err;
        }
        let content =data.toString()
        //读取package.json文件内容 替换对应的东西
        content = content.replace('isecui-project',config.project)
        content = content.replace('{isecui-description}',config.description)
        content = content.replace(/\{isecui-auther\}/g,config.auther)
        fs.writeFile(packagePath, content, function(err) {
            if (err) {
                throw err;
            }         
            print('Project move')
            fs.rename(downloadPath, path, (err)=>{console.error(err)});
            setTimeout(()=>{
                exec('rm -rf '+config.project+'/.git')
                exec('rd/s/q '+config.project+'\\.git')
                print('delete useless file .....')
                print('......',5)
                print('Project init')
            },1000)
            // console.log('Starting to install dependencies.....')
            // exec('tnpm install')
        })
    })
}

module.exports = download