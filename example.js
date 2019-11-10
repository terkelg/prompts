'use strict';

const { prompt } = require('./');

let interval;

(async function(){
    const questions = [
        {
            type: 'text',
            name: 'twitter',
            message: `What's your twitter handle?`,
            initial: `terkelg`,
            format: v => `@${v}`
        },
        {
            type: 'number',
            name: 'age',
            message: 'How old are you?',
            validate: value => value < 18 ? `Sorry, you have to be 18` : true
        },
        {
            type: 'password',
            name: 'secret',
            message: 'Tell me a secret'
        },
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Can you confirm?'
        },
        {
            type: prev => prev && 'toggle',
            name: 'confirmtoggle',
            message: 'Can you confirm again?',
            active: 'yes',
            inactive: 'no'
        },
        {
            type: 'list',
            name: 'keywords',
            message: 'Enter keywords'
        },
        {
            type: 'select',
            name: 'color',
            message: 'Pick a color',
            choices: [
                { title: 'Red', description: 'This option has a description.', value: '#ff0000' },
                { title: 'Green', value: '#00ff00' },
                { title: 'Yellow', value: '#ffff00', disabled: true },
                { title: 'Blue', value: '#0000ff' }
            ]
        },
        {
            type: 'multiselect',
            name: 'multicolor',
            message: 'Pick colors',
            hint: false,
            choices: [
                { title: 'Red', description: 'This option has a description.', value: '#ff0000' },
                { title: 'Green', value: '#00ff00' },
                { title: 'Yellow', value: '#ffff00', disabled: true },
                { title: 'Blue', value: '#0000ff' }
            ]
        },
        {
            type: 'autocomplete',
            name: 'actor',
            message: 'Pick your favorite actor',
            initial: 1,
            limit: 3,
            suggest: (input, choices) => choices.filter(i => i.title.toLowerCase().includes(input.toLowerCase())),
            choices: [
                { title: 'Cage' },
                { title: 'Clooney', value: 'silver-fox' },
                { title: 'Gyllenhaal' },
                { title: 'Gibson' },
                { title: 'Grant', description: 'This option has a description.' },
                { title: 'Hanks' },
                { title: 'Downey Jr.' }
            ],
            fallback: {
                title: `This is the fallback. Its value is 'fallback'`,
                value: 'fallback'
            }
        },
        {
            type: 'date',
            name: 'birthday',
            message: `What's your birthday?`,
            validate: date => date > Date.now() ? `Your birth day can't be in the future` : true
        },
        {
            type: 'number',
            name: 'prompt',
            message: 'This will be overridden',
            onRender(color) {
                this.no = (this.no || 1);
                this.msg = `Enter a number (e.g. ${color.cyan(this.no)})`;
                if (!interval) interval = setInterval(() => {
                    this.no += 1;
                    this.render();
                }, 1000);
            }
        }
    ];

    const answers = await prompt(questions, {onCancel:cleanup, onSubmit:cleanup});
    console.log(answers);
})();

function cleanup() {
    clearInterval(interval);
}

