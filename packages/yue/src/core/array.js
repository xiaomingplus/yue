import {
    define
} from '../util/object';

function getArrayLikeProto() {
    //初始化array
    const patchedMethods = [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ]
    const arrayProto = Array.prototype;
    const arrayMethods = Object.create(arrayProto);
    patchedMethods.forEach(method => {
        if (arrayMethods[method]) {
            define(arrayMethods, method, function (...args) {
                const result = arrayProto[method].apply(this, args);
                const ob = this.__ob__;
                if(ob){
                    ob.dep.notify();//通知变更
                }
                return result;
            })

        }
    })
    return arrayMethods;
}


export const yueArrayPrototype = getArrayLikeProto();