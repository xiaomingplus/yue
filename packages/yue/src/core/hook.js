export function callLifeHook(vm,life){
    let options = vm.$options;
    if(options[life]){
        options[life].call(vm);
    }
}