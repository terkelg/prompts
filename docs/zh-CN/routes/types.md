---
title: '类型'
---

## 文本 (text) 

**text (message, [initial], [style])**

> 用于让用户随意输入文字内容

用户按下<kbd>tab</kbd>键会自动输入设置好的`initial`值。

示例：

![image](/prompts_docs_cn/images/type_text.gif)

```js
{
  type: 'text',
  name: 'value',
  message: `What's your twitter handle?`
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `String` | 默认字符串值 |
| style | `String` | 渲染样式（`default`, `password`, `invisible`, `emoje`）。默认是`default`  |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| validate | `Function` |  接收用户的输入。如果符合验证则返回`true`，否则返回一个错误信息`String`。如果返回的是`false`，那么会返回一个默认的错误信息 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |


## 密码 (password)

**password(message, [initial])**

<br />

> 密码形式的输入项，用以遮蔽用户的输入

设置参数和`text`相类似，也可以为`password`设置`style`

示例：

![image](/prompts_docs_cn/images/password.gif)

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `String` | 默认字符串值 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| validate | `Function` |  接收用户的输入。如果符合验证则返回`true`，否则返回一个错误信息`String`。如果返回的是`false`，那么会返回一个默认的错误信息 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 隐藏 (invisible)

**invisible(message, [initial])**

<br />

> 隐藏用户的输入内容

和`sudo`类似，用户的输入内容是不可见的。它和样式设置为`invisible`的`text`类型有异曲同工之妙。

示例：

![image](/prompts_docs_cn/images/invisible.gif)

```js
{
  type: 'invisible',
  name: 'value',
  message: 'Enter password'
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `String` | 默认字符串值 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| validate | `Function` |  接收用户的输入。如果符合验证则返回`true`，否则返回一个错误信息`String`。如果返回的是`false`，那么会返回一个默认的错误信息 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |


## 数字 (number)

**number(message, initial, [max], [min], [style])**

<br />

> 用于让用户输入数字

您可以输入数字并使用<kbd>↑</kbd><kbd>↓</kbd>键来增/减值。只接受数字类型的输入。用户按下<kbd>tab</kbd>键会自动输入设置好的`initial`值。

示例：

![image](/prompts_docs_cn/images/number.gif)

```js
{
  type: 'number',
  name: 'value',
  message: 'How old are you?',
  initial: 0,
  style: 'default',
  min: 2,
  max: 10
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `Number` | 默认数字值 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| validate | `Function` |  接收用户的输入。如果符合验证则返回`true`，否则返回一个错误信息`String`。如果返回的是`false`，那么会返回一个默认的错误信息 |
| max | `Number` | 最大值。默认是`Infinity` |
| min | `Number` | 最小值。默认是`-Infinity` |
| float | `Boolean` | 是否允许输入浮点数，默认是`false` |
| round | `Number` | 将浮点数四舍五入到几位小数。默认是**2** |
| increment | `Number`| 使用<kbd>↑</kbd><kbd>↓</kbd>键来增/减值的步幅。默认是**1** |
| style | `String` | 渲染样式（`default`, `password`, `invisible`, `emoje`）。默认是`default` |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 是非 (confirm)

**confirm(message, [initial])**

> 经典的是/否问题

键入 <kbd>y</kbd>/<kbd>n</kbd> 来回答yes/no

示例：

![image](/prompts_docs_cn/images/confirm.gif)

```js
{
  type: 'confirm',
  name: 'value',
  message: 'Can you confirm?',
  initial: true
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `Boolean` | 默认值。默认为`false` |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 清单 (list)

**list(message, [initial])**

> 返回值为数组的问题列表

和`text`类型相似，返回值是由`分隔符(seprartor)`分割的字符串组成的数组。

示例：

![image](/prompts_docs_cn/images/list.gif)

```js
{
  type: 'list',
  name: 'value',
  message: 'Enter keywords',
  initial: '',
  separator: ','
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `Boolean` | 默认值 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| seprartor | `String` | 字符串分隔符。默认是`，`。会自动`trim`掉前后的空格 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 切换 (toggle)

**toggle(message, [initial], [active], [inactive])**

> 交互式的开关/切换问题

使用 <kbd>箭头</kbd> <kbd>tab</kbd> <kbd>空格</kbd> 来切换各个选项。

示例

![image](/prompts_docs_cn/images/toggle.gif)

```js
{
  type: 'toggle',
  name: 'value',
  message: 'Can you confirm?',
  initial: true,
  active: 'yes',
  inactive: 'no'
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `Boolean` | 默认值，默认为`false` |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| active | `String`| `激活（active）`状态的说明文字。默认是`on` |
| inactive | `String`| `未激活（inactive）`状态的说明文字。默认是`off`|
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 选择 (select)

**select(message, choices, [initial], [hint], [warn])**

> 交互式选择问题

示例：

![image](/prompts_docs_cn/images/select.gif)

```js
{
  type: 'select',
  name: 'value',
  message: 'Pick a color',
  choices: [
    { title: 'Red', description: 'This option has a description', value: '#ff0000' },
    { title: 'Green', value: '#00ff00', disabled: true },
    { title: 'Blue', value: '#0000ff' }
  ],
  initial: 1
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| initial | `Number` | 默认值的索引 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| hint | `String` | 展示给用户的提示 |
| warn | `String` | 当用户选则了一个`不可用（disable）`的选项时弹出的警告信息 |
| choices | `Array` | 字符串或选项对象的数组`[{ title, description, value, disabled }, ...]`。如果没有指定`value`, 那么将使用其索引值 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

## 多选 (multiselect)

**multiselect(message, choices, [initial], [max], [hint], [warn])**

**autocompleteMultiselect(same)**

> 交互式多选问题   
> autocomplete 是一个可搜索的多选问题，配置项相同。常用于长列表。

用 <kbd>空格</kbd> 键（也可以使用<kbd>←</kbd>和<kbd>→</kbd>）来切换选择/取消状态，用 <kbd>↑</kbd><kbd>↓</kbd> 切换问题。 用 <kbd>tab</kbd> 来循环列表。默认返回一个包含所选项`value`而非`title`的数组。


![image](/prompts_docs_cn/images/multiselect.gif)

```js
{
  type: 'multiselect',
  name: 'value',
  message: 'Pick colors',
  choices: [
    { title: 'Red', value: '#ff0000' },
    { title: 'Green', value: '#00ff00', disabled: true },
    { title: 'Blue', value: '#0000ff', selected: true }
  ],
  max: 2,
  hint: '- Space to select. Return to submit'
}
```

| 参数 | 类型 | 描述  |
| ----|-----| -----|
| message | `String` | 问题的内容 |
| format | `Function` | 接收用户的输入。返回值会放入答案对象中 |
| instructions | `String | Boolean` | 说明 |
| choices | `Array` | 字符串或选项对象的数组`[{ title, value, disabled }, ...]`。如果没有指定`value`, 那么将使用其索引值 |
| optionsPerPage | `Number` | 每一页所显示的选项数，默认是**10**  |
| min | `Number` | 最少选择数。传入负数会报错 |
| max | `Number` | 最多选择数 |
| hint | `String` | 展示给用户的提示 |
| warn | `String` | 当用户选则了一个`不可用（disable）`的选项时弹出的警告信息 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

这是为数不多的不需要设置`initial`值的问题类型。如果您想要预设一些选项，请传入把`choices`中的对象设置一个`selected: true`

## 自动填充 (autoComplete)

**autocomplete(message, choices, [initial], [suggest], [limit], [style])**

> 交互式自动填充答案

这种类型会基于用户的输入来显示选项。再根据输入进一步过滤。
通过 <kbd>↑</kbd><kbd>↓</kbd> 切换问题。 用 <kbd>tab</kbd> 来循环列表。
通过 <kbd>Page Up</kbd>/<kbd>Page Down</kbd> (Mac上则是 <kbd>fn</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd>) 来翻页。
按下 <kbd>回车</kbd> 选择处于高亮状态的项目。

默认的`suggest`函数是基于选项的`title`属性来排序的。您可以传入自定义的`suggest`方法来更改选项的顺序。

示例：

![image](/prompts_docs_cn/images/autocomplete.gif)

```js
{
  type: 'autocomplete',
  name: 'value',
  message: 'Pick your favorite actor',
  choices: [
    { title: 'Cage' },
    { title: 'Clooney', value: 'silver-fox' },
    { title: 'Gyllenhaal' },
    { title: 'Gibson' },
    { title: 'Grant' }
  ]
}
```

| 参数 | 类型 | 描述 |
| -------|--------| --------- | 
| message | `String`  |  提问的信息 |
| format  | `Function` |  接收用户的输入值。返回值会放入答案对象中 |
| choices  | `Array`   |  自动填充的选项的数组`[{title, value}], ...` |
| suggest  | `function` |  过滤器方法。默认是按`title`属性排列。 `suggest`应该返回一个promise。它以`title`作为默认参数。 |
| limit     | `Number` |  显示结果的最大数量。默认是**10** |
| initial | `String | Number` | 默认值 |
| style | `String` | 渲染样式（`default`, `password`, `invisible`, `emoje`）。默认是`default`  |
| fallback | `String` | 没有匹配到任何项的回退信息。如果提供了`initial`值则默认使用它 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

`suggest`方法的示例：

```js
const suggestByTitle = (input, choices) => Promise.resolve(choices.filter(i => i.title.slice(0, input.length) === input))
```

## 日期 (data)

**date(message, [initial], [warn])**

> 交互式日期问答

使用 <kbd>→</kbd>/<kbd>→</kbd>/<kbd>tab</kbd> 切换变更项。使用 <kbd>↑</kbd>/<kbd>↓</kbd> 来更改日期。

示例：

![image](/prompts_docs_cn/images/date.gif)

```js
{
  type: 'date',
  name: 'value',
  message: 'Pick a date',
  initial: new Date(1997, 09, 12),
  validate: date => date > Date.now() ? 'Not in the future' : true
}
```

| 参数 | 类型 | 描述 |
| -------|--------| --------- | 
| message | `String`  |  提问的信息 |
| initial | `Date` | 默认日期 |
| locales | `Object`|  用于定义本地化设置。示例见后文 |
| mask | `String` | 日期格式化字符串蒙板。更多信息见后文 |
| validate | `Function` |  接收用户的输入。如果符合验证则返回`true`，否则返回一个错误信息`String`。如果返回的是`false`，那么会返回一个默认的错误信息 |
| onRender | `Function` | 渲染时的回调。其中的`this`指向当前问题 |
| onState | `Function` | 状态改变时的回调。它的参数是一个拥有两个属性的`对象`: `value`和`aborted` |

默认本地化（locales）设置：

```js
{
  months: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],
  monthsShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  weekdays: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ],
  weekdaysShort: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ]
}
```

<date-format-table />