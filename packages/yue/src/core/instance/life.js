import {createElement} from '../../y-element/yElement';
import {update} from '../../y-element/render';
import {callLifeHook} from '../hook'
export function initLife(vm){
    //初始化生命周期
    let options = vm.$options;
    callLifeHook(vm,'created')
    let renderFunc = options.render;
    vm._yElement = renderFunc.call(vm,createElement.bind(vm,vm));//相当于vue的vnode
    vm._update = function(){
        callLifeHook(vm,'beforeUpdate');
        update(vm)
        callLifeHook(vm,'updated');
    }

}