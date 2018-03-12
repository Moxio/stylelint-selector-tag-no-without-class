const testRule = require('stylelint-test-rule-tape');
const selectorTagNoWithoutClass = require('..');

testRule(selectorTagNoWithoutClass.rule, {
	ruleName: selectorTagNoWithoutClass.ruleName,
	// The config options below should eventually be just `[ 'span', 'div' ]`,
	// but this does not work yet with stylelint-test-rule-tape;
	// see https://github.com/stylelint/stylelint-test-rule-tape/issues/6
	config: [ [ 'span', 'div' ] ],
	skipBasicChecks: false,

	accept: [
		{ code: 'span.foo, h1.bar > h2.baz > h3.qux {}' },
		{ code: 'span.foo {}' },
		{ code: 'div.foo {}' },
		{ code: 'h1 {}' },
	],

	reject: [
		{
			code: 'div {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 1
		},
		{
			code: 'div, div.foo {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 1
		},
		{
			code: '.foo div {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 6
		},
		{
			code: 'div:hover {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 1
		},
		{
			code: 'div::before {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 1
		},
		{
			code: 'div:first-child {}',
			message: 'Unexpected tag div without class qualifier (' + selectorTagNoWithoutClass.ruleName + ')',
			line: 1,
			column: 1
		},
	]
});