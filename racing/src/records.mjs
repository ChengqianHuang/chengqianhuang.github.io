import {TRACKS} from './track.mjs';
export const RECORD_KEY='harbor-rush-records-v2';
const valid=n=>Number.isFinite(n)&&n>0;
const parse=raw=>{try{return JSON.parse(raw||'{}')||{};}catch{return {};}};
export function readRecords(raw,legacyRaw){
  const source=parse(raw),legacy=parse(legacyRaw),records={};
  for(const track of TRACKS){records[track.id]={};for(const mode of ['race','trial']){
    const n=source[track.id]?.[mode];if(valid(n))records[track.id][mode]=n;
    else if(track.id==='harbor'&&valid(legacy[mode]))records.harbor[mode]=legacy[mode];
  }}
  return records;
}
export function saveBest(records,trackId,mode,time){
  if(!TRACKS.some(t=>t.id===trackId)||!records[trackId]||!['race','trial'].includes(mode)||!valid(time))return false;
  const previous=records[trackId][mode];if(previous&&time>=previous)return false;
  records[trackId][mode]=time;return true;
}
