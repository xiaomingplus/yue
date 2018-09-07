export function handleWatcher(vm){
    vm._watchCallback = function(){
        //重新渲染
        if(vm._update){
            vm._update();
        }
    }
}