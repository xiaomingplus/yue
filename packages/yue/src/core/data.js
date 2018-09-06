import {proxy,removeProxy} from './proxy';
import {createObserve} from './observe'
export function handleData(vm,data){
    let dataKeys = Object.keys(data);
    vm._data = {};
    dataKeys.forEach( key =>{
        vm._data[key] = data[key];
        proxy(vm,key);
    });
    //响应式
    createObserve(vm,vm._data);
}