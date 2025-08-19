## 使用 (Usage)

![image](/prompts_docs_cn/images/Usage.gif)

```js
const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: value => value < 18 ? `Nightclub is 18+ only` : true
  });

  console.log(response); // => { value: 24 }
})();
```

> 参见 [example.js](https://github.com/terkelg/prompts/blob/master/example.js) 查看更多示例

