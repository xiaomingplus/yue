import {proxy,removeProxy} from './proxy';
import {createObserve} from './observe';
import {isObject} from '../util/object';
import {isFunction} from '../util/function';
import {error} from '../util/log';
export function handleState(vm){
    let options = vm.$options;
    let propsOptions = options.props || {};
    let propsKeys = Object.keys(propsOptions);
    propsKeys.forEach(propsKey=>{

    })
    let propsData = options.propsData || {};
    let propsDataKeys = Object.keys(propsData);
    vm._props = {};
    propsDataKeys.forEach( key =>{
        let value = propsData[key];
        proxy(vm,key,value,'_props');
    });

    let data;
    if(options.data){
        if(isFunction(options.data)){
            data = options.data.call(vm);
        }else if(isObject(options.data)){
            data = options.data;
        }else{
            data = {}
            error('data不合法')
        }
    }else{
        data = {}
    }
    vm._data = {};
    let dataKeys = Object.keys(data);
    dataKeys.forEach( key =>{
        vm._data[key] = data[key];
        proxy(vm,key,data[key],'_data');
    });
    //响应式
    createObserve(vm._data,vm._watcher);


}