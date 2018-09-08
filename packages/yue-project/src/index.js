import Yue from 'yue';

new Yue({
    data: {
        message: "Hello World",
        user:{
            name:'未知用户'
        },
        lifeList: [],
        todos:[]

    },
    beforeCreate(){
        console.log('beforeCreate');
        this.lifeList.push('beforeCreate');
    },
    created() {
        console.log('created vm');
        this.lifeList.push('created');
        setTimeout(() => {
            this.message = 'Hello Yue';
            this.user.name = 'xiaomingplus';
            this.todos.push({
                title:"todo1"
            });

            setTimeout(() => {
                this.todos[0].title = 'todo1 edited'
                this.todos.push({
                    title:"todo2"
                });
            }, 1000);
        }, 1000);
    },
    beforeMount(){
        console.log('beforeMount');
        this.lifeList.push('beforeMount')
    },
    mounted() {
        console.log('mouted');
        this.lifeList.push('mounted')
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
            h('h2', null, `${this.user.name},${this.message}`),
            h('div', null, [
                h('h3', null, '生命周期'),
                h('ul', null, this.lifeList.map((item) => {
                    return h('li', null, item);
                }))
            ]),
            h('div', null, [
                h('h3', null, '代办列表'),
                h('ul', null, this.todos.map((item) => {
                    return h('li', null, item.title);
                }))
            ])
        ]);
    }
}).$mount('#root');