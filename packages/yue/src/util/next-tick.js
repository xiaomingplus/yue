import {error} from './log';
let callbacks = [];
let pending = false;
function flushCallbacks(){
    pending = false;
    callbacks.forEach(cb => {
        cb();
    })
    callbacks = []
}
let macroTimerFunc = () => {
    setTimeout(flushCallbacks,0);
}
export function nextTick(cb,context){
    callbacks.push(()=>{
        try {
            cb.call(context);
        } catch (error) {
            error('callback error',error);
        }
    })

    if(!pending){
        pending = true;
        macroTimerFunc();
    }
}