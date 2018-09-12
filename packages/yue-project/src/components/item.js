export default {
    render(h){
        console.log('thisxxx',this);
        return h('li',null,this.title)
    }
}