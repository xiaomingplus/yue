import {createElement} from '../../y-element/yElement';
import {update} from '../../y-element/render';

export function initLife(vm){
    //初始化生命周期
    let options = vm.$options;
    if(options.created){
        options.created.call(vm);
    }
    let renderFunc = options.render;
    vm._yNode = renderFunc.call(vm,createElement);
    vm._render = renderFunc.bind(vm,createElement);
    vm._update = function(){
        update(vm._realRootElement,vm._render(),vm._mountedElement)
    }
    if(options.mounted){
        options.mounted.call(vm);
    }
}