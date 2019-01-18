const print = require('../res/echo')
const prompt = require('../res/prompt.js')
const download = require('../res/download.js')
const step = require('../config/step.js')
const gzip = require('../gzip/gzip.js')
const build = require('../build/build.js')
const shelljs = require('shelljs/global');
const runjs = require('../server/run.js')
const packJson = require('../../package.json')
const program = require('commander');
const dependencies = require('../config/dependencies.js')
program.version(packJson.version, '-v, --version');

program.command('init').action((name) => {
    console.log("start a isecui project...");
    console.log("Auther by shiningding@tencent.com 2018-11-19");
    prompt(step).then(rs => {
        rs.project = rs.project.indexOf('web_') > -1 ? rs.project : 'web_' + rs.project;
        rs.email = rs.auther + '@tencent.com'
        console.log('Shiningding.....')
        console.log('......')
        console.log('......')
        console.log(JSON.stringify(rs))
        download(rs)
    })
});

program.command('gzip').action((name) => {
    console.log("start zip isec_web_components.zip");
    gzip();
});

program.command('build')
    .option('-z, --zip', 'Zip build result.')
    .option('-i, --input [path]', 'Zip path.')
    .option('-o, --output [path]', 'Output path.')
    .action(option => {
        build(option)
    });

program.command('install').action((name) => {
    console.log("install build dependencies.....");
    console.log("install build dependencies.....");
    var command = "tnpm install -S-D ";
    dependencies.forEach(function(item, index) {
        command += item + ' '
    })
    console.log(command)
    exec(command)
});

program.command('run dev').action((name) => {
    console.log("start isecui webpack-dev-server.....");
    runjs();
});

program.parse(process.argv);