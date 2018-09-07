import YElement from './yElement';
import {warn} from '../util/log';
import {createElement} from './yElement';
//这是个有副作用的函数
//传入一个yElemnt，然后render负责把他真实的渲染到dom上
//返回一个真实的js创建的Elemnet对象
export function render(yElement,mountElement){
    let element = renderPureJsElement(yElement);
    //先remove掉所有已有的子节点
    while (mountElement.firstChild) {
        mountElement.removeChild(mountElement.firstChild);
    }
    mountElement.appendChild(element);
    return element;
}

export function update(vm,oldDomElement,renderFunc,mountElement){
    if(oldDomElement && oldDomElement.parentElement){
        let parentDomElement = oldDomElement.parentElement;
        parentDomElement.removeChild(oldDomElement);
        return render(renderFunc.call(vm,createElement),mountElement)
    }else{
        warn('no mounted element');
        return null;
    }

}

function renderPureJsElement(yElement){
        //获取yElement
        if(!yElement || !yElement.validYElement || !yElement.validYElement()){
            throw new Error('not a yElement');
        }
        let tagName = yElement.getTagName();
        let props = yElement.getProps();
        let children = yElement.getChildren();

        let element = document.createElement(tagName);
        let propsData = props || {};
        let propKeys = Object.keys(propsData);
        propKeys.forEach(propKey => {
            element.setAttribute(propKey,propsData[propKey]);
        });

        if(Array.isArray(children)){
            children.forEach( child => {
                let childElement;
                if(YElement.isYElement(child)){
                    childElement = renderPureJsElement(child);
                }else{
                    childElement = document.createTextNode(child);
                }
                element.appendChild(childElement);
            })
        }else if(typeof children === 'string'){
            element.textContent = children;
        }
        return element;
}