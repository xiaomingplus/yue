
class Observe {
    constructor(data,watchCallback) {
        const keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data,key,data[key],watchCallback)
        })
    }
}

export function createObserve(vm,data){
    return new Observe(data,vm._watchCallback);
}

function defineReactive(data,key,value,watchCallback){
    const dep = new Dep();//收集依赖
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