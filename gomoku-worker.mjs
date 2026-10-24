import {chooseMove} from './gomoku-ai.mjs?v=2';
self.onmessage=({data})=>{try{const result=chooseMove(data.board,data.side,{difficulty:data.difficulty});self.postMessage({token:data.token,...result});}catch{self.postMessage({token:data.token,index:-1,error:true});}};
