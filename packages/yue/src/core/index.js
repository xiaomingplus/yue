import {debug} from '../util/log'; 
import {initLife} from './instance';
import {mount} from './dom';
import {handleData} from './data';
import {handleWatcher} from './watch'
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
        handleWatcher(this);

        handleData(this,data);

        //初始化生命周期
        initLife(this);
    }
}

export {
    Yue
}