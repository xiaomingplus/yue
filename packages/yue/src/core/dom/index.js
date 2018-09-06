import {render} from '../../y-element/render';
export function mount(vm,el){
    if(typeof el === 'string'){
        el = document.querySelector(el);
    }
    vm._mountedElement = el;
    vm._realRootElement = render(vm._yNode,el);
}