import {debug} from '../util/log'; 
import {initLife} from './instance';
import {mount} from './dom';
import {handleState} from './state';
import {handleWatcher} from './watch';
import {callLifeHook} from './hook'
let yid = 1;
class Yue{
    static extend(componentConfig){
        //入参是一个component的配置
        //extend出一个vue组件
        return class Component extends Yue {
            constructor(props){
                //处理props
                //merge
                let extendsProps = Object.assign(componentConfig,props);//合并props
                super(extendsProps);
            }
        }

    }
    constructor(props) {
        debug('init props',props);
        this.$options = Object.assign(props,this.constructor.options);
        console.log('$options',this.$options);
        let data = props.data || {};
        this._yid = yid++;
        //初始化watch
        handleWatcher(this);

        //初始化 state
        handleState(this);
        
        callLifeHook(this,'beforeCreate');
        //初始化生命周期
        initLife(this);


    }
    $mount(el){
        mount(this,el);
    }
}

Yue.options = {
    _base:Yue
}
export {
    Yue
}