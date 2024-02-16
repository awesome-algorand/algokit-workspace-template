#!/usr/bin/env node

const fs = require('fs')
const { spawn } = require('node:child_process');

console.log(__dirname, process.cwd())
let isNPM = fs.existsSync('package.json')
const pkg = isNPM ? require('../package.json') : {
  workspaces: []
}

// Count Site Packages in NPM
let sitePkgCount = 0;
fs.readdirSync('sites').forEach(file => {
  if(fs.existsSync(`sites/${file}/package.json`)) {
    sitePkgCount++
  }
})

let contractPkgCount = 0;
fs.readdirSync('contracts').forEach(file => {
  if(fs.existsSync(`contracts/${file}/package.json`)) {
    contractPkgCount++
  }
})

if(sitePkgCount + contractPkgCount >= 2) {
  if(!isNPM) {
    pkg.workspaces.push('sites/*')
    pkg.workspaces.push('contracts/*')
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
    isNPM = true
  }
}

if(isNPM){
  const install = spawn('npm.cmd', ['install'])
  install.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  install.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  install.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
  });
}
console.log('Engineering magic!', __dirname, process.cwd())
