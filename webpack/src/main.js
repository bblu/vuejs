// main.js
// npm install -g webpack-cli
// webpack ./src/main.js --mode development

import { A } from './a'
import B from './b'

import('./c').then(test=>{
    console.log(test)
})
console.log(A)
B()
console.log(B.__prop__)