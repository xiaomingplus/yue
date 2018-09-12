import { isObject } from '../util/object';
let componentId = 0;
class YElement {
    static isYElement(yEelment) {
        if(yEelment && yEelment instanceof YElement){
            return true;
        }else{
            return false;
        }
    }
    static diff(oldYElement,newYElement){
    
    }
    constructor(vm,tagName,data,children,options) {
        options = options || {};
        //为啥叫yElemnet?因为我姓杨
            this._isYElement = true;
            this.tagName = tagName;
            this.data = data || {};
            this.children = children || [];
            this.componentClass = options.componentClass;
            this.componentInstance = options.componentInstance;
    }
    getComponentClass(){
        return this.componentClass;
    }
    getComponentInstance(){
        return this.componentInstance;
    }
    getTagName(){
        return this.tagName;
    }
    getData(){
        return this.data;
    }
    getChildren(){
        return this.children;
    }
    validYElement(){
        return this._isYElement;
    }

}
//返回一个yElement
export function createElement(vm,tagName,data,children,options) {
    //判断是否组件
    if(typeof tagName === 'string'){
        return new YElement(vm,tagName,data,children,options);
    }else{
        return createComponent(vm,tagName,data,children,options);
    }
}
export function createComponent(vm,tagName,data,children,options){
    options = options || {};
    let propsData = {};
    if(data){
        propsData = data.props || {};
    }
    let componentConfig = Object.assign(tagName,{
        props:propsData,
        _realParentElement:vm._realElement,//内部参数
    });
    let hooks = {
        init:(yElement)=>{
            //init hooks,render的时候会被执行
            if(yElement.getComponentInstance()){
                //已经初始化过了
                console.log('已经初始了');//TODO
            }else{
                let componentClass = yElement.getComponentClass();
                new componentClass().$mount();//执行渲染
            }
        }
    };

    let finalData = {
        hooks:hooks,//用于render的时候执行的函数
    }
    let baseCrl = vm.$options._base;
    let componentClass = baseCrl.extend(componentConfig);
    componentId++;
    return new YElement(vm,`yue-component-${componentId}`,finalData,undefined,{
        componentClass:componentClass
    });
}
export default YElement;