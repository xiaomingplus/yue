import YElement from './yElement';
import {
    warn
} from '../util/log';
import {
    createElement
} from './yElement';
import {
    isDefine
} from '../util/object';
//这是个有副作用的函数
//传入一个yElemnt，然后render负责把他真实的渲染到dom上
//返回一个真实的js创建的Elemnet对象
export function render(yElement, parentElement) {
    let element = createRealElement(yElement,parentElement);//创建父节点
    return element;
}

export function update(vm) {
    let oldDomElement = vm._realElement;//是否已经有
    let renderFunc = vm.$options.render;//渲染函数
    let realParentElemnet = vm.$options._realParentElement;//父节点
    if (oldDomElement) {
        //移除所有子节点，然后添加
        removeAllChildren(oldDomElement);
        vm._realElement = render(renderFunc.call(vm, createElement.bind(null, vm)),realParentElemnet?realParentElemnet:vm._realElement);
        //然后渲染
        return vm._realElement;
    }else{
        vm._realElement = render(renderFunc.call(vm, createElement.bind(null, vm)),realParentElemnet?realParentElemnet:vm._realElement);
        //然后渲染
        return vm._realElement;
    }

}

function createRealElement(yElement,realParentElement) {
    //获取yElement
    if (!yElement || !yElement.validYElement || !yElement.validYElement()) {
        throw new Error('not a yElement');
    }
    let tagName = yElement.getTagName();
    let data = yElement.getData();
    let attr = data.attr || {};
    let children = yElement.getChildren();
    //如果是组件的话，处理hooks
    if(yElement.getComponentClass() && data.hooks){
       let hooks = data.hooks;
       if(hooks.init){
           //初始化hook
           hooks.init(yElement,realParentElement);
       }
       return;
    }
   
    let element = null;
    if (typeof children === 'string') {
        element = document.createElement(tagName);
        element.textContent = children;
    }else{
        element = document.createElement(tagName);
    }
    let attrKeys = Object.keys(attr);
    attrKeys.forEach(attrKey => {
        element.setAttribute(attrKey, attr[attr]);
    });
    if(Array.isArray(children)){
        //如果有子节点
        createRealChildren(children,element);
    }
    insert(realParentElement,element)
    return element;

}
function createRealChildren(children,parentElement){
    //创建子节点
    children.forEach(child => {
        let element = createRealElement(child,parentElement);
    })
}

function insert(parent, elm) {
    if (isDefine(parent)) {
        parent.appendChild(elm)
    }
}
function removeAllChildren(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}