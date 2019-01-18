const inquirer = require('inquirer');

function prompt(promptList){
    return new Promise((resolve,reject)=>{
        inquirer.prompt(promptList).then((answers) => {
            resolve(answers)
        },(err)=>{
            reject(err)
        })
    })
}
module.exports = prompt
