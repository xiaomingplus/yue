import Yue from 'yue';

new Yue({
    data:{
        testRoot:2
    },
    render: (h) => {
        return h('div',null,'Hellow world');
    }
}).$mount('#root');