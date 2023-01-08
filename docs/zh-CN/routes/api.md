---
title: API
---

## prompts(prompts, options)

类型：`Function`   
返回值：`Object`

Prompt 函数接受您传入的[prompt对象](/routes/prompt_object.html)并将答案作为对象返回。

**参数：prompts**  

类型：`Array | Object`

[Prompt对象](/routes/prompt_object.html#类型)数组。  
您可以点击[这里](/routes/types.html)查看支持的问题类型。

Prompt 通过 <kbd>return</kbd> 或 <kbd>enter</kbd> 键提交答案。  
通过 <kbd>esc</kbd>、<kbd>abort</kbd>、<kbd>ctrl</kbd>+<kbd>c</kbd>、<kbd>ctrl</kbd>+<kbd>d</kbd> 来取消问答。

当取消时，返回的答案对象为空。

**参数：options.onSubmit**

类型：`Function`
默认值：`() => {}`

在每个问题提交后调用。参数为`(prompt, answer, answers)`，其中：  
- `prompt` 代表当前的prompt对象。
- `answer` 代表用户对当前问题的回答结果。
- `answers`代表从开始到当前问题的作答结果。

支持异步函数。

函数返回`true`的时候退出问答，同时返回开始到当前问题的作答结果，否则继续遍历 prompt 对象生成问题。

```js
(async () => {
  const questions = [{ ... }];
  const onSubmit = (prompt, answer) => console.log(`Thanks I got ${answer} from ${prompt.name}`);
  const response = await prompts(questions, { onSubmit });
})();
```

**参数：options.onCancel**

类型：`Function`
默认值：`() => {}`

问答取消/退出时调用。参数为`(prompt, answers)`，其中：  
- `prompt` 代表当前的prompt对象。
- `answers`代表截止到当前问题的全部作答结果。

支持异步函数。

函数返回`true`的时候会继续问答流程，以避免问答流程中断。取消时返回截止到当前问题的回答结果。

```js
(async () => {
  const questions = [{ ... }];
  const onCancel = prompt => {
    console.log('Never stop prompting!');
    return true;
  }
  const response = await prompts(questions, { onCancel });
})();
```

## override

类型：`Function`

我们可以通过向`prompts.override`方法传入带有回答信息的对象来预设答案。这个功能在与`process`参数结合使用时有奇效。


示例：
```js
const prompts = require('prompts');
prompts.override(require('yargs').argv);

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'twitter',
      message: `What's your twitter handle?`
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' }
      ],
    }
  ]);

  console.log(response);
})();

```

## inject(values) <Badge text="该特性仅为方便开发者测试用" type="warn"/>

类型：`Function`

以编程方式注入回答（response）。这个功能方便您提前预设一些回答。如果配置了预设值，那么问答结果将直接以预设值返回。

**参数: values**

类型：`Array`

待注入值的数组。解析后的值将从内部注入数组中删除。我们可以传入二维数组来为需要多次询问的问题提供答案。我们可以将传入的值设置成`Error`的实例，来模拟用户实际取消/退出问答流程的情况。

```js
const prompts = require('prompts');

prompts.inject([ '@terkelg', ['#ff0000', '#0000ff'] ]);

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'twitter',
      message: `What's your twitter handle?`
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' }
      ],
    }
  ]);

  // => { twitter: 'terkelg', color: [ '#ff0000', '#0000ff' ] }
})();
```