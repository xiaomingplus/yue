import Yue from 'yue';

new Yue({
    data: {
        message: "Hello World",
        user:{
            name:'未知用户'
        },
        list: []
    },
    beforeCreate(){
        console.log('beforeCreate');
        this.list.push('beforeCreate');
    },
    created() {
        console.log('created vm');
        this.list.push('created');
        setTimeout(() => {
            this.message = 'Hello Yue';
            this.user.name = 'xiaomingplus'
        }, 1000);
    },
    beforeMount(){
        console.log('beforeMount');
        this.list.push('beforeMount')
    },
    mounted() {
        console.log('mouted');
        this.list.push('mounted')
    },
    beforeUpdate(){
        console.log('beforeUpdate');
    },
    updated(){
        console.log('updated');
    },
    render(h) {
        console.log('render')
        return h('div', null, [
            h('div', null, `${this.user.name},${this.message}`),
            h('div', null, [
                h('div', null, '生命周期'),
                h('div', null, this.list.map((item) => {
                    return h('div', null, item);
                }))


            ])
        ]);
    }
}).$mount('#root');