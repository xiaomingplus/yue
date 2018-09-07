import Yue from 'yue';

new Yue({
    data: {
        message: "Hello World",
        list: []
    },
    created() {
        console.log('created vm');
        this.list.push('created');
        setTimeout(() => {
            this.message = 'Hello Yue';
        }, 1000);
    },
    mounted() {
        console.log('mouted');
        this.list.push('mounted')
    },
    render(h) {
        return h('div', null, [
            h('div', null, this.message),
            h('div', null, [
                h('div', null, '生命周期'),
                h('div', null, this.list.map((item) => {
                    return h('div', null, item);
                }))


            ])
        ]);
    }
}).$mount('#root');