import {createElement} from '../../y-element/yElement';
export function initLife(vm){
    //初始化生命周期
    let options = vm.$options;
    console.log('options',options);
    if(vm.created){
        vm.created();
    }
    let renderFunc = options.render;
    vm.rootElement = renderFunc.call(vm,createElement);

}