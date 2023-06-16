const {
	rule: { ruleName, messages }
} = require('.');

testRule({
	ruleName: ruleName,
	config: [ 'span', 'div' ],

	accept: [
		{ code: 'span.foo, h1.bar > h2.baz > h3.qux {}' },
		{ code: 'span.foo {}' },
		{ code: 'div.foo {}' },
		{ code: 'h1 {}' },
	],

	reject: [
		{
			code: 'div {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 1
		},
		{
			code: 'div, div.foo {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 1
		},
		{
			code: '.foo div {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 6
		},
		{
			code: 'div:hover {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 1
		},
		{
			code: 'div::before {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 1
		},
		{
			code: 'div:first-child {}',
			message: messages.unexpected('div'),
			line: 1,
			column: 1
		},
	]
});

testRule({
	ruleName: ruleName,
	config: [ '/./' ],

	accept: [
		// https://github.com/Moxio/stylelint-selector-tag-no-without-class/issues/5
		{ code: '@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }' },
	]
});
