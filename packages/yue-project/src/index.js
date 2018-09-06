import Yue from 'yue';

new Yue({
    data:{
        message:"Hello World"
    },
    created(){
        console.log('created vm');
        setTimeout(() => {
            this.message = 'Hello Yue'  
        }, 1000);
    },
    mounted(){
        console.log('mouted');
    },
    render(h) {
        return h('div',null,this.message);
    }
}).$mount('#root');