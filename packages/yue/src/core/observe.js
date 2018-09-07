import {define} from '../util/object';
import {yueArrayPrototype} from './array';
class Observe {
    constructor(data,watchCallback) {
        this._watchCallback = watchCallback;
        this.value = data;
        this.dep = new Dep();//依赖收集
        define(data, '__ob__', this);
        if(Array.isArray(data)){
            this.dep.subscribe(watchCallback)
        }else{
            //对象
            const keys = Object.keys(data);
            keys.forEach(key => {
                defineReactive(this,data,key,data[key],watchCallback)
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
export function createObserve(data,_watchCallback){
    return new Observe(data,_watchCallback);
}

function defineReactive(self,data,key,value,watchCallback){
    const dep = new Dep();//依赖收集
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            dep.subscribe(watchCallback)
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
        let arrayObserver = createObserve(value,self._watchCallback);//暂时用祖先的watch
        value.__proto__ = yueArrayPrototype;//设置原型链方法
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }
    subscribe(watchCallback){
        this.subs.push(watchCallback)
    }
    notify(){
        this.subs.forEach(sub => {
            sub();
        })
    }
}