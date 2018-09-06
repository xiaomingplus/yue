import Yue from 'yue';

new Yue({
    data:{
        message:"Hello World"
    },
    created(){
        console.log('created vm');
    },
    render(h) {
        console.log('this render',this);
        return h('div',null,this.message);
    }
}).$mount('#root');