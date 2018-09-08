import {createElement} from '../../y-element/yElement';
import {update} from '../../y-element/render';
import {callLifeHook} from '../hook'
export function initLife(vm){
    //初始化生命周期
    let options = vm.$options;
    callLifeHook(vm,'created')
    let renderFunc = options.render;
    vm._yNode = renderFunc.call(vm,createElement);
    vm._update = function(){
        callLifeHook(vm,'beforeUpdate');
        vm._realRootElement = update(vm,vm._realRootElement,renderFunc,vm._mountedElement)
        callLifeHook(vm,'updated');
    }

}