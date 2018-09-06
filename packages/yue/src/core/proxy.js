import {isReserved} from '../util/string'
export function proxy(vm,key){
     // 对$或者_开头的属性不做处理。也就是说，data中的属性名不允许以$或_开头
     if (!isReserved(key)) {
        // 这里为什么要将this存储到self中。源码中的注释解释是：这些属性可能会在子实例中被调用
        var self = vm
        Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            // 这里的get和set虽然只是简单的返回数据，但是在_data中对数据进行读写时，进行了逻辑处理。
            get: function proxyGetter () {
                return self._data[key]
            },
            set: function proxySetter (val) {
                self._data[key] = val
            }
        })
    }
}

export function removeProxy(vm,key){
    // 对$或者_开头的属性不做处理。也就是说，data中的属性名不允许以$或_开头
    if (!isReserved(key)) {
       // 这里为什么要将this存储到self中。源码中的注释解释是：这些属性可能会在子实例中被调用
       var self = vm
       delete self[key];
   }
}