const build    = require('../build/build.js')
const shelljs  = require('shelljs/global');
const runjs    = require('../server/run.js')

const program = require('commander');

program.version('1.0.0', '-v, --version').command('build').action((name) => {
    console.log("Isecui vue build tools.....");
    console.log("start build project for vue");
    build();
});

program.version('1.0.0', '-v, --version').command('install').action((name) => {
    console.log("install build dependencies.....");
    exec('tnpm install -S happypack')
});

program.version('1.0.0', '-v, --version').command('run dev').action((name) => {
    console.log("start isecui webpack-dev-server.....");
    runjs();
});

program.parse(process.argv);



