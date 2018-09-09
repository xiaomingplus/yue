import { isObject } from '../util/object';
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
    constructor(ctx,tagName,props,children) {
        console.log('tagName',tagName);
        //为啥叫yElemnet?因为我姓杨
        if(typeof tagName === 'string'){
            this._isYElement = true;
            this.tagName = tagName;
            this.props = props || {};
            this.children = children || [];
            this.init()
        }else if(isObject(tagName)){
            //如果是组件
            console.log('是组件');
            return createComponent(tagName,props,children,ctx);
        }

    }
    init(){
        //还没想好要初始啥
    }
    getTagName(){
        return this.tagName;
    }
    getProps(){
        return this.props;
    }
    getChildren(){
        return this.children;
    }
    validYElement(){
        return this._isYElement;
    }

}
//返回一个yElement
export function createElement(ctx,tagName,props,children) {
    return new YElement(ctx,tagName,props,children);
}
export function createComponent(ctx,componentConfig,props,children){
    let propsData = {};
    if(props){
        propsData = props.props || {};
    }
    componentConfig = Object.assign(componentConfig,{
        props:propsData
    });
    let ComponentClass = ctx.extend(tagName);
    let componentInstanse = new ComponentClass();
    let options = componentInstanse.$options;
    let renderFunc = options.render;
    return renderFunc.call(componentInstanse,createElement)
}
export default YElement;