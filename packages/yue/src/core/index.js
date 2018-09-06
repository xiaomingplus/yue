import {render} from '../y-element/render';
import {createElement} from '../y-element/yElement';
import {debug} from '../util/log'; 
class Yue{
    $mount(el){
        if(typeof el === 'string'){
            el = document.querySelector(el);
        }
        render(this.rootElement,el);
    }
    constructor(props) {
        debug('init props',props);
        let renderFunc = props.render || function(){
            return createElement('div',null,'');
        };
        this.rootElement = renderFunc(createElement)
    }
}

export {
    Yue
}