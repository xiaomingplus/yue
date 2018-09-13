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
    //是否首次挂在
    if (!vm._realElement) {
        //首次挂载
        vm._realElement = el;
        callLifeHook(vm, 'beforeMount');
        vm._update();
        callLifeHook(vm, 'mounted')
    } else {
        callLifeHook(vm, 'beforeUpdate');
        vm._update();
        callLifeHook(vm, 'updated')
    }


}