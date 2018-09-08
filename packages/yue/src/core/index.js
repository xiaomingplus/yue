import {debug} from '../util/log'; 
import {initLife} from './instance';
import {mount} from './dom';
import {handleState} from './state';
import {handleWatcher} from './watch';
import {callLifeHook} from '../hook'

class Yue{
    $mount(el){
        mount(this,el);
    }
    constructor(props) {
        debug('init props',props);
        callLifeHook(this,'beforeCreate');
        this.$options = props;
        let renderFunc = props.render || function(){
            return createElement('div',null,'');
        };
        let data = props.data || {};

        //初始化watch
        handleWatcher(this);

        //初始化 state
        handleState(this,data);

        //初始化生命周期
        initLife(this);


    }
}

export {
    Yue
}