import {proxy,removeProxy} from './proxy';
import {createObserve} from './observe'
export function handleState(vm,data){
    let dataKeys = Object.keys(data);
    vm._data = {};
    dataKeys.forEach( key =>{
        vm._data[key] = data[key];
        proxy(vm,key);
    });
    //响应式
    createObserve(vm._data,vm._watchCallback);
}