'use strict';

const { prompt } = require('./lib');

(async function(){
    const questions = [
        {
            type: 'text',
            name: 'twitter',
            message: `What's your twitter handle?`
        },
        {
            type: 'password',
            name: 'secret',
            message: 'Tell me a secret'
        },
        {
            type: 'invisible',
            name: 'password',
            message: `Enter password`
        },
        {
            type: 'number',
            name: 'age',
            message: 'How old are you?'
        },
        {
            type: (prev, ans, prompt) => {
              console.log()
              console.log(prev, ans, prompt)
              return 'confirm'
            },
            name: 'confirmed',
            message: 'Can you confirm?' 
        },
        {
            type: 'list',
            name: 'keywords',
            message: 'Enter keywords' 
        },
        {
            type: 'toggle',
            name: 'confirmtoggle',
            message: 'Can you confirm?',
            active: 'yes',
            inactive: 'no'
        },
        {
            type: 'select',
            name: 'color',
            message: 'Pick a color',
            choices: [
              { title: 'Red', value: '#ff0000' }, 
              { title: 'Green', value: '#00ff00' },
              { title: 'Blue', value: '#0000ff' }
            ]
        },
        {
            type: 'multiselect',
            name: 'multicolor',
            message: 'Pick colors',
            choices: [
                { title: 'Red', value: '#ff0000' },
                { title: 'Green', value: '#00ff00' },
                { title: 'Blue', value: '#0000ff' }
            ]
        },
        {
            type: 'autocomplete',
            name: 'actor',
            message: 'Pick your favorite color',
            choices: [
                { title: 'Brad Pitt' },
                { title: 'George Clooney', value: 'silver-fox' },
                { title: 'Ana de Armas' },
                { title: 'Arnold' },
                { title: 'Felicity Jones' },
            ]
        }
    ];

    const answers = await prompt(questions);
    console.log(answers);

})();
