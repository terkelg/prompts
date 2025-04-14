---
title: prompt对象
---

## Prompt 对象

### 类型

Prompt对象的作用是定义“问题”和问答类型。几乎所有的问答对象都包含以下属性：

```ts
{
  type: String | Function,
  name: String | Function,
  message: String | Function,
  initial: String | Function | Async Function
  format: Function | Async Function,
  onRender: Function
  onState: Function
}
```

`Function`类型的属性会在询问问题之前被调用。

函数的参数为`(prev, values, prompt)`，其中：

- `prev`是前一个问题的回答。
- `values`是截止到当前问题时，所有问题的答案集合。
- `prompt`是前一个prompt对象。

Function 示例

```js
{
  type: prev => prev > 3 ? 'confirm' : null,
  name: 'confirm',
  message: (prev, values) => `Please confirm that you eat ${values.dish} times ${prev} a day?`
}
```

如果示例中前一个prompt的值小于3，那么该问题会被跳过。

### type

类型：`String | Function`

定义展示的问题类型。可以设置的类型[上面](/routes/prompt_object.html#类型)已经列出。

如果`type`是虚值（falsy）那么这个问题会被跳过

```js
{
  type: null,
  name: 'forgetme',
  message: `I'll never be shown anyway`,
}
```

### name

类型：`String | Function`

用户的答案将以键/值对的形式存储到返回的对象中（下文将统称'答案对象'）。如果多个问题拥有相同的`name`值，返回的对象只保留**最后一个**重名问题的答案。

> 请确保每个问题的名字唯一，以避免覆盖

### message

类型：`String | Function`

展示给用户的信息。

### initial

类型：`Stirng | Function`

问题的默认值。支持异步函数。

### format

类型：`Function`

接受用户的输入并返回格式化后的值。返回值将放入答案对象中。

它的参数为`(val, values)`，其中：

- `val`是当前问题的答案值。
- `values`是当前的答案对象，当您需要用到前一个问题的答案时就是它出场的时候了。

示例：

```js
{
  type: 'number',
  name: 'price',
  message: 'Enter price',
  format: val => Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val);
}
```

### onRender

类型：`Function`

问题呈现到控制台时触发。它的第一个参数是[kleur对象](https://chinabigpan.github.io/kleur_docs_cn/)（这是一个命令行美化的库），函数内的`this`指向当前问题。

示例：

```js
{
  type: 'number',
  message: 'This message will be overridden',
  onRender(kleur) {
    this.msg = kleur.cyan('Enter a number');
  }
}
```

### onState

类型：`Function`

当前问题发生改变时调用。它的参数是`(state)`，这是一个对象，是当前状态的快照。它有两个属性`value`和`aborted`。格式是这样：

```js
{
	value: "This is",
	aborted: false
}
```














