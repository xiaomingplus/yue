import {render} from '../../y-element/render';
export function mount(vm,el){
    if(typeof el === 'string'){
        el = document.querySelector(el);
    }
    //判断是否已经挂载
    console.log('vm',vm);
    if(vm._realRootElement){
        vm._update();
    }else{
        vm._mountedElement = el;
        vm._realRootElement = render(vm._yNode,el);
    }

}