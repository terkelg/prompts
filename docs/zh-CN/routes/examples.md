---
title: 示例
---

## 单个问题（Single Prompt）

Prompts 接受一个问题对象参数。将回答（response）结果作为对象返回。

```js
const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'text',
    name: 'meaning',
    message: 'What is the meaning of life?'
  });

  console.log(response.meaning);
})();
```

## 问题链（Prompt Chain）

Prompts 接受一个问题对象数组。将答案作为对象返回。请确保每个问题都有独一无二的`name`属性，以防止结果发生覆盖

```js
const prompts = require('prompts');

const questions = [
  {
    type: 'text',
    name: 'username',
    message: 'What is your GitHub username?'
  },
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?'
  },
  {
    type: 'text',
    name: 'about',
    message: 'Tell something about yourself',
    initial: 'Why should I?'
  }
];

(async () => {
  const response = await prompts(questions);

  // => response => { username, age, about }
})();
```

## 动态问题 （Dynamic Prompts）

Prompt属性可以是函数。`type`字段的计算结果为`虚值(falsy)`的 Prompt 配置对象将被跳过。

[falsy 值 (虚值) 是在 Boolean 上下文中认定为 false 的值](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)

> JavaScript中有6个falsy值： false、0、""、null、undefined和NaN

```js
const prompts = require('prompts');

const questions = [
  {
    type: 'text',
    name: 'dish',
    message: 'Do you like pizza?'
  },
  {
    type: prev => prev == 'pizza' ? 'text' : null,
    name: 'topping',
    message: 'Name a topping'
  }
];

(async () => {
  const response = await prompts(questions);
})();

```