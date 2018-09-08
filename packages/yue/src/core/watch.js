export function handleWatcher(vm){
    vm._watcher = new Watch(function(){
        //重新渲染
        if(vm._update){
            vm._update();
        }
    },vm);
    
    
}
let watchId = 0;//唯一id
class Watch {
    constructor(cb,ctx) {
        watchId = watchId+1;
        this._watchId = watchId;
        this._callback = ()=>{
            cb.call(ctx);
        }
    }
    run(){
        if(this._callback){
            this._callback();
        }
    }
    getWatchId(){
        return this._watchId;
    }
    
}