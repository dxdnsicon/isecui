const build = require('../build/build.js')
const shelljs = require('shelljs/global');
const packJson = require('../../package.json')
const program = require('commander');
program.version(packJson.version, '-v, --version');


program.command('build')
    .action(option => {
        build(option)
    });

program.parse(process.argv);