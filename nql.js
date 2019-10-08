#!/usr/bin/env node

const inquirer = require("inquirer");   // cmd
const chalk = require("chalk");  
const figlet = require("figlet"); 
// const shell = require("shelljs");

let path = require('path')
let baseUrl = path.join(__dirname , '/data')
let nodedb = require('node-edb')
nodedb.init(baseUrl,'db')

const init = () => { 
  console.log(chalk.green( 
     figlet.textSync("node db", { 
       font: "Ghost", 
       horizontalLayout: "default", 
       verticalLayout: "default" 
     }) 
  )); 
} 

const askQuestions = () => { 
  const questions = [ 
   { 
     name: "cmd",
     type: "input", 
     message: "->" 
   }, 
  ]; 
  return inquirer.prompt(questions); 
};
const reCmd = async() => {
  const answers = await askQuestions(); 
  const { cmd } = answers; 
  
  let str = ''
  switch(cmd){
    case 'exit':
      break;
    default:
        try{
          let result = eval(`nodedb.execute.${cmd}`)
          if(result){
            str = result
          }else{
            str = `${cmd} is  not a normal command!`
          }
          
        }catch(e){
          console.log(e)
          str = `${cmd} is  not a normal command!`
        }
        console.log(str)
      reCmd();
      break;
  }
  
}
const run = async () => { 
  // show script introduction 
  init(); 
  // ask questions 
  
  reCmd();
  // create the file 
  // show success message 
}; 
run();