/**
 * 调度引擎
 */
import {nextTick} from '../util/next-tick'
let has = {};//watcher map
let queues = [];//watch队列
let pending = false;
export function push(watcher){
     //添加到队列
     let watchId = watcher.getWatchId();
     if(!has[watchId]){
         has[watchId] = true;
        //如果没有，就添加
        queues.push(watcher)
     }
     if(!pending){
        pending = true;

        nextTick(()=>{
            pending = false;
            queues.forEach(watch =>{
                watch.run();
            })
            queues = [];
            has = {}
        })
     }
 }