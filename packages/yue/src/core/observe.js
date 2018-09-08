import {define,isObject} from '../util/object';
import {yueArrayPrototype} from './array';
import {push} from './schedule'
class Observe {
    constructor(data,watcher) {
        this._watcher = watcher;
        this.value = data;
        this.dep = new Dep();//依赖收集
        define(data, '__ob__', this);
        if(Array.isArray(data)){
            this.dep.subscribe(watcher)
        }else{
            //对象
            const keys = Object.keys(data);
            keys.forEach(key => {
                defineReactive(this,data,key,data[key],watcher)
            })
        }

    }
}
/**
 * 有副作用的一个函数
 * 把传进来的对象observe化
 * @param {}} vm 
 * @param {*} data 
 */
export function createObserve(data,watcher){
    return new Observe(data,watcher);
}

function defineReactive(self,data,key,value,watcher){
    const dep = new Dep();//依赖收集
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            dep.subscribe(watcher)
            return value;
        },
        set:function(newVal){
            value = newVal;
            //通知
            dep.notify();
        }
    })
    //如果值是数组，特殊处理下
    if(Array.isArray(value)){
        //再new一个 Objserve
        let arrayObserver = createObserve(value,watcher);//暂时用祖先的watch
        value.__proto__ = yueArrayPrototype;//设置原型链方法
    }else if(isObject(value)){
        //如果是对象,递归react化
        createObserve(value,watcher);
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }
    subscribe(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher => {
            push(watcher)
        })
    }
}