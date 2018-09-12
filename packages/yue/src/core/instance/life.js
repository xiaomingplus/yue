import {createElement} from '../../y-element/yElement';
import {update} from '../../y-element/render';
import {callLifeHook} from '../hook'
export function initLife(vm){
    //初始化生命周期
    let options = vm.$options;
    callLifeHook(vm,'created')
    let renderFunc = options.render;
    vm._yElement = renderFunc.call(vm,createElement.bind(vm,vm));
    vm._update = function(){
        callLifeHook(vm,'beforeUpdate');
        vm._realElement = update(vm,vm._realElement,renderFunc,vm._mountedElement)
        callLifeHook(vm,'updated');
    }

}