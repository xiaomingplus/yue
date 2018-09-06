export function handleWatcher(vm){
    vm._watchCallback = function(){
        //重新渲染
        vm._update();
    }
}