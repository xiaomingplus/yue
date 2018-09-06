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
    constructor(tagName,props,children) {
        //为啥叫yElemnet?因为我姓杨
        this._isYElement = true;
        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.init()
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
export function createElement(tagName,props,children) {
    return new YElement(tagName,props,children);
}