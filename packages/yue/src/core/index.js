import {debug} from '../util/log'; 
import {initLife} from './instance';
import {mount} from './dom';
class Yue{
    $mount(el){
        mount(this,el);
    }
    constructor(props) {
        debug('init props',props);
        this.$options = props;
        let renderFunc = props.render || function(){
            return createElement('div',null,'');
        };
        let data = props.data || {};
        //代理data的属性
        let dataKeys = Object.keys(data);

        dataKeys.forEach( key =>{
            this[key] = data[key];
        });
        //初始化生命周期
        initLife(this);
    }
}

export {
    Yue
}