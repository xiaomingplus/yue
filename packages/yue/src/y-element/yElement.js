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
    constructor(ctx,tagName,data,children) {
        //为啥叫yElemnet?因为我姓杨
        if(typeof tagName === 'string'){
            this._isYElement = true;
            this.tagName = tagName;
            this.data = data || {};
            this.children = children || [];
            this.init()
        }else if(isObject(tagName)){
            //如果是组件
            return createComponent(ctx,tagName,data,children);
        }

    }
    init(){
        //还没想好要初始啥
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
export function createElement(ctx,tagName,data,children) {
    return new YElement(ctx,tagName,data,children);
}
export function createComponent(ctx,componentConfig,props,children){
    let propsData = {};
    if(props){
        propsData = props.props || {};
    }
    componentConfig = Object.assign(componentConfig,{
        props:propsData
    });
    // console.log('ctx.extend',ctx.$options);
    let baseCrl = ctx.$options._base;
    let ComponentClass = baseCrl.extend(componentConfig);
    let componentInstanse = new ComponentClass();
    let options = componentInstanse.$options;
    let renderFunc = options.render;
    componentId++;
    return renderFunc.call(componentInstanse,createElement)
    return new YElement(ctx,`yue-component-${componentId}`);
}
export default YElement;