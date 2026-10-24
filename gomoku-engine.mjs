export const N=15, CELLS=N*N;
export const AXES=[[1,0],[0,1],[1,1],[1,-1]];
export const inside=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
export const coordinate=index=>`${String.fromCharCode(65+index%N)}${N-Math.floor(index/N)}`;
export function winningLine(board,index,side=board[index]){
 if(!side||index<0||index>=CELLS)return null;
 const x=index%N,y=Math.floor(index/N);
 for(const [dx,dy]of AXES){const line=[index];for(const sign of [-1,1])for(let d=1;d<N;d++){const xx=x+dx*d*sign,yy=y+dy*d*sign;if(!inside(xx,yy)||board[yy*N+xx]!==side)break;if(sign===-1)line.unshift(yy*N+xx);else line.push(yy*N+xx);}if(line.length>=5)return line;}
 return null;
}
export class GomokuGame{
 constructor(){this.reset();}
 reset(){this.board=new Int8Array(CELLS);this.history=[];this.turn=1;this.winner=0;this.line=null;this.draw=false;}
 play(index){if(!Number.isInteger(index)||index<0||index>=CELLS||this.board[index]||this.winner||this.draw)return false;const side=this.turn;this.board[index]=side;this.history.push({index,side});this.line=winningLine(this.board,index,side);if(this.line)this.winner=side;else if(this.history.length===CELLS)this.draw=true;this.turn=3-side;return true;}
 undo(){const move=this.history.pop();if(!move)return false;this.board[move.index]=0;this.turn=move.side;this.winner=0;this.line=null;this.draw=false;return true;}
 undoToHuman(human){const minimum=human===2?1:0;if(this.history.length<=minimum)return false;this.undo();while(this.history.length>minimum&&this.turn!==human)this.undo();return true;}
}
