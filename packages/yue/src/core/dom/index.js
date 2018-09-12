import {
    render
} from '../../y-element/render';
import {
    callLifeHook
} from '../hook'
export function mount(vm, el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    
    //是否有父节点
    if (vm._realParentElement) {
        //如果有父节点，说明是组件，那么插入
        if (vm._realElement) {
            debugger

            //已经挂载
            vm._update();
        } else {
            debugger

            callLifeHook(vm, 'beforeMount');
            vm._realElement = render(vm._yElement, null,vm._realParentElement);
            //首次
            callLifeHook(vm, 'mounted')
        }
    } else {
        //根节点
        //判断是否已经挂载
        if (vm._realElement) {
            //已经挂载

            vm._update();
        } else {
            
            callLifeHook(vm, 'beforeMount');
            vm._mountedElement = el;
            vm._realElement = render(vm._yElement, el);
            //首次
            callLifeHook(vm, 'mounted')
        }
    }


}