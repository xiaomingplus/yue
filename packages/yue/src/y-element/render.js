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
export function render(yElement, mountElement, parentElement) {
    let element = createRealElement(yElement);//创建父节点

    
    console.log('element',element);
    if (mountElement) {
        //根元素
        //先remove掉所有已有的子节点
        while (mountElement.firstChild) {
            mountElement.removeChild(mountElement.firstChild);
        }
        mountElement.appendChild(element);
        return element;
    } else if(parentElement) {
        insert(parentElement,element);
        return element;
    }

}

export function update(vm, oldDomElement, renderFunc, mountElement) {

    if (oldDomElement && oldDomElement.parentElement) {
        let parentDomElement = oldDomElement.parentElement;
        parentDomElement.removeChild(oldDomElement);
        return render(renderFunc.call(vm, createElement.bind(vm, vm)), mountElement)
    } else {
        warn('no mounted element');
        return null;
    }

}

function createRealElement(yElement) {
    //获取yElement
    if (!yElement || !yElement.validYElement || !yElement.validYElement()) {
        throw new Error('not a yElement');
    }
    let tagName = yElement.getTagName();
    let data = yElement.getData();
    let attr = data.attr || {};
    let children = yElement.getChildren();
    //如果data里hooks的话，处理hooks
    if(data.hooks){
       let hooks = data.hooks;
       if(hooks.init){
           //初始化hook
           debugger
           hooks.init(yElement);
       }
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
    return element;

}
function createRealChildren(children,parentElement){
    //创建子节点
    children.forEach(child => {
        let element = createRealElement(child);
        insert(parentElement,element)
    })
}

function renderPureJsElement(yElement) {
    //获取yElement
    if (!yElement || !yElement.validYElement || !yElement.validYElement()) {
        throw new Error('not a yElement');
    }
    let tagName = yElement.getTagName();
    let data = yElement.getData();
    let attr = data.attr || {};
    let children = yElement.getChildren();
    //如果data里hooks的话，处理hooks
    if(data.hooks){
       let hooks = data.hooks;
       if(hooks.init){
           //初始化hook
           hooks.init(yElement);
       }
    }
    let element = document.createElement(tagName);
    let attrKeys = Object.keys(attr);
    attrKeys.forEach(attrKey => {
        element.setAttribute(attrKey, attr[attr]);
    });

    if (Array.isArray(children)) {
        children.forEach(child => {
            let childElement;
            if (YElement.isYElement(child)) {
                childElement = renderPureJsElement(child);
            } else {
                childElement = document.createTextNode(child);
            }
            element.appendChild(childElement);
        })
    } else if (typeof children === 'string') {
        element.textContent = children;
    }
    return element;
}

function insert(parent, elm) {
    if (isDefine(parent)) {
        parent.appendChild(elm)
    }
}