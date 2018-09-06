import {render} from '../../y-element/render';
export function mount(vm,el){
    if(typeof el === 'string'){
        el = document.querySelector(el);
    }
    render(vm.rootElement,el);
}