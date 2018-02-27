<p align="center">
  <img src="https://github.com/terkelg/prompts/raw/master/prompts.png" alt="Prompts" width="500" height="120" />
</p>
 
<h1 align="center">❯ Prompts</h1>

<p align="center">
  <a href="https://npmjs.org/package/prompts">
    <img src="https://img.shields.io/npm/v/prompts.svg" alt="version" />
  </a>
  <a href="https://travis-ci.org/terkelg/prompts">
    <img src="https://img.shields.io/travis/terkelg/prompts.svg" alt="travis" />
  </a>
  <a href="https://npmjs.org/package/prompts">
    <img src="https://img.shields.io/npm/dm/prompts.svg" alt="downloads" />
  </a>
</p>

<p align="center">
  <b>Lightweight, beautiful and user-friendly interactive prompts</b></br>
  <sub>>_ Easy to use CLI prompts to enquire users for information▌<sub> 
</p>

<br />

* **Simple**: prompts has no big dependencies nor is it broken into a dozen tiny modules that only work well together.
* **User friendly**: prompt uses layout and colors to create beautiful cli interfaces.
* **Promised**: uses promises and `async`/`await`. No callback hell.
* **Flexible**: all prompts are independent and can be used on their own.


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ Install

```
$ npm install --save prompts
```

> This package uses async/await and requires Node.js 7.6

![split](https://github.com/terkelg/prompts/raw/master/media/split.png)

## ❯ Usage

<img src="https://github.com/terkelg/prompts/raw/master/media/number.gif" alt="example prompt" width="499" height="103" />

```js
const prompts = require('prompts');

let response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?'
});

console.log(response.value); // => 23
```


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ Examples

### Single Prompt

Prompt with a single prompt object. Returns object with the response.

```js
const prompts = require('prompts');

let response = await prompts({
    type: 'text',
    name: 'meaning',
    message: 'What is the meaning of life?'
});

console.log(response.meaning);
```

### Prompt Chain

Prompt with a list of prompt objects. Returns object with response.
Make sure to give each prompt a unique `name` property to prevent overwriting values.

```js
const prompt = require('prompts');

let questions = [
    {
        type: 'text',
        name: 'username',
        message: 'What is your GitHub username?'
    },
    {
        type: 'age',
        name: 'age',
        message: 'How old are you?'
    },
    {
        type: 'text',
        name: 'about',
        message: 'Tell somethign about yourself',
        initial: 'Why should I?'
    }
];

let response = await prompts(questions);

// => response => { username, age, about }
```

### Dynamic Prompts

Prompt properties can be functions too.
Prompt Objects with `type` set to `null` are skipped.

```js
const prompts = require('prompts');

let questions = [
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

let response = await prompts(questions);
```


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ API

### prompts(prompts, options)

Type: `Function`<br>
Returns: `Object`

Prompter function which takes your [prompt objects](#-prompt-objects) and returns an object with responses.


#### prompts

Type: `Array|Object`<br>

Array of [prompt objects](#-prompt-objects).
 These are the questions the user will be prompted. You can see the list of supported [prompt types here](#-types).

Prompts can be submitted (<kbd>return</kbd>, <kbd>enter</kbd>) or canceled (<kbd>esc</kbd>, <kbd>abort</kbd>, <kbd>ctrl</kbd>+<kbd>c</kbd>, <kbd>ctrl</kbd>+<kbd>d</kbd>). No property is being defined on the returned response object when a prompt is canceled.

#### options.onSubmit

Type: `Function`<br>
Default: `() => {}`

Callback that's invoked after each prompt submission.
Its signature is `(prompt, response)` where `prompt` is the current prompt object.

Return `true` to quit the prompt chain and return all collected responses so far, otherwise continue to iterate prompt objects.

**Example:**
```js
let questions = [{ ... }];
let onSubmit = (prompt, response) => console.log(`Thanks I got ${response} from ${prompt.name}`);
let response = await prompts(questions, { onSubmit });
```

#### options.onCancel

Type: `Function`<br>
Default: `() => {}`

Callback that's invoked when the user cancels/exits the prompt.
Its signature is `(prompt)` where `prompt` is the current prompt object.

Return `true` to quit the prompt loop and return all collected responses so far, otherwise continue to iterate prompt objects.

**Example:**
```js
let questions = [{ ... }];
let onCancel = prompt => {
  console.log('Lets stop prompting');
  return true;
}
let response = await prompts(questions, { onCancel });
```


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ Prompt Objects

Prompts Objects are JavaScript objects that define the "questions" and the [type of prompt](#-types).
Almost all prompt objects have the following properties:

```js
{
  type: String || Function,
  name: String || Function,
  message: String || Function,
  initial String || Function || Async Function
}
```

If `type` is `null` the prompter will skip that question.
```js
{
  type: null,
  name: 'forgetme',
  message: 'I\'ll never be shown anyway',
}
```

Each property can also be of type `function` and will be invoked right before prompting the user.

```js
{
    type: prev => prev >= 3 ? 'confirm' : null,
    name: 'confirm',
    message: (prev, values) => `Please confirm that you eat ${values.dish} times ${prev} a day?`
}
```

Its signature is `(prev, values, prompt)`, where `prev` is the value from the previous prompt, 
`values` is all values collected so far and `prompt` is the provious prompt object.


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ Types

### text(message, [initial], [style])
> Text prompt for free text input.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/text.gif" alt="text prompt" width="499" height="103" />

```js
{
  type: 'text',
  name: 'value',
  message: `What's your twitter handle?`,
  style: 'default',
  initial: ''
}
```

#### Options
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| initial | <code>string</code> | <code>''</code> | Default string value |
| style | <code>string</code> | <code>'default'</code> | Render style (`default`, `password`, `invisible`) |


### password(message, [initial])
> Password prompt with masked input.

This prompt is a similar to a prompt of type `'text'` with `style` set to `'password'`.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/password.gif" alt="password prompt" width="499" height="103" />

```js
{
  type: 'password',
  name: 'value',
  message: 'Tell me a secret',
  initial '',
}
```

#### Options
| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Prompt message to display |
| initial | <code>string</code> | Default string value |


### invisible(message, [initial])
> Prompts user for invisible text input.

This prompt is working like `sudo` where the input is invisible.
This prompt is a similar to a prompt of type `'text'` with style set to `'invisible'`.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/invisible.gif" alt="invisible prompt" width="499" height="103" />

```js
{
  type: 'invisible',
  name: 'value',
  message: 'Enter password',
  initial: ''
}
```

#### Options
| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Prompt message to display |
| initial | <code>string</code> | Default string value |


### number(message, initial, [max], [min], [style])
> Prompts user for number input. 

You can use `up`/`down` to increase/decrease the value.
Only numbers are allowed as input. Default resolve value is `null`.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/number.gif" alt="number prompt" width="499" height="103" />

```js
{
  type: 'number'
  name: 'value',
  message: 'How old are you?',
  initial: 0,
  style: 'default',
  min: 2,
  max: 10
}
```

#### Options
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| initial | <code>number</code> | `null` | Default number value |
| max | <code>number</code> | `Infinity` | Max value |
| min | <code>number</code> | `-infinity` | Min value |
| style | <code>string</code> | <code>'default'</code> | Render style (`default`, `password`, `invisible`) |


### confirm(message, [initial])
> Classic yes/no prompt.

Hit `y` or `n` to confirm/reject.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/confirm.gif" alt="confirm prompt" width="499" height="103" />

```js
{
  type: 'confirm'
  name: 'value',
  message: 'Can you confirm?',
  initial: true
}
```


#### Options
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| initial | <code>boolean</code> | <code>false</code> | Default value |


### list(message, [initial])
> List prompt that return an array.

Similar to the `text` prompt, but the output is an `Array` containing the
string separated by `separator`.

```js
{
  type: 'list'
  name: 'value',
  message: 'Enter keywords',
  initial: '',
  separator: ','
}
```

<img src="https://github.com/terkelg/prompts/raw/master/media/list.gif" alt="list prompt" width="499" height="103" />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| initial | <code>boolean</code> | <code>false</code> | Default value |
| seperator | <code>string</code> | <code>','</code> | String seperator. Will trim all white-spaces from start and end of string |


### toggle(message, [initial], [active], [inactive])
> Interactive toggle/switch prompt.

Use tab or arrow keys to switch between options.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/toggle.gif" alt="toggle prompt" width="499" height="103" />

```js
{
  type: 'toggle'
  name: 'value',
  message: 'Can you confirm?',
  initial: true,
  active: 'yes',
  inactive: 'no'
}
```

#### Options
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| initial | <code>boolean</code> | <code>false</code> | Default value |
| active | <code>string</code> | <code>'on'</code> | Text for `active` state |
| inactive | <code>string</code> | <code>'off'</code> | Text for `inactive` state |


### select(message, choices, [initial])
> Interactive select prompt.

Use space to select/unselect and arrow keys to navigate the list.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/select.gif" alt="select prompt" width="499" height="130" />

```js
{
    type: 'select',
    name: 'value',
    message: 'Pick a color',
    choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' }
    ],
    initial: 1
}
```

#### Options
| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Prompt message to display |
| initial | <code>number</code> | Index of default value |
| choices | <code>Array</code> | Array of choices objects `[{ title, value }, ...]` |


### multiselect(message, choices, [initial], [max], [hint])
> Interactive multi-select prompt.

Use space to select/unselect and arrow keys to navigate the list. 
By default this prompt returns an `array` containing the **values** of the selected items - not their display title.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/multiselect.gif" alt="multiselect prompt" width="499" height="130" />

```js
{
    type: 'multiselect',
    name: 'value',
    message: 'Pick colors',
    choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff', selected: true }
    ],
    initial: 1,
    max: 2,
    hint: '- Space to select. Return to submit'
}
```

#### Options
| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Prompt message to display |
| choices | <code>Array</code> | Array of choices objects `[{ title, value, [selected] }, ...]` |
| max | <code>number</code> | Max select |
| hint | <code>string</code> | Hint to display user |

This is one of the few prompts that don't take a initial value.
If you want to predefine selected values, give the choice object an `selected` property of `true`.


### autocomplete(message, choices, [initial], [suggest], [limit], [style])
> Interactive auto complete prompt. 

The prompt will list options based on user input. 

The default suggests function is sorting based on the `title` property of the choices.
You can overwrite how choices are being filtered by passing your own suggest function.

#### Example
<img src="https://github.com/terkelg/prompts/raw/master/media/autocomplete.gif" alt="auto complete prompt" width="499" height="163" />

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
        { title: 'Grant' },
    ]
}
```

#### Options
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | Prompt message to display |
| choices | <code>Array</code> |  | Array of auto-complete choices objects `[{ title, value }, ...]` |
| suggest | <code>function</code> | By `title` string | Filter function. Defaults to stort by `title` property. Suggest should always return a promise |
| limit | <code>number</code> | <code>10</code> | Max number of results to show |
| style | <code>string</code> | `'default'` | Render style (`default`, `password`, `invisible`) |


Example on what a `suggest` function might look like:
```js
const suggestByTitle = (input, choices) =>
  Promise.resolve(choices.filter(i => i.title.slice(0, input.length) === input))
```


![split](https://github.com/terkelg/prompts/raw/master/media/split.png)


## ❯ Credit
Many of the prompts are based on the work of [derhuerst](https://github.com/derhuerst).


## ❯ License

MIT © [Terkel Gjervig](https://terkel.com)
