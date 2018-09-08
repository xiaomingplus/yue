# yue

练习项目，实现vue的大多数特性

## 如何使用？

```javascript
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
```
## 如何开发

    git clone https://github.com/xiaomingplus/yue.git
    cd yue && npm i
    npm run init
    npm run dev

将会打开初始页面

## TODO

1. 优化渲染次数，按照tick来 ----- done
2. 优化虚拟dom diff，只渲染变化的部分
3. 优化depend
4. 支持组件功能
5. 支持$nextTick
6. 支持updated生命周期
7. 支持数组里复杂的对象