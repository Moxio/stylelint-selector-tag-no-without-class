const _ = require('lodash');
const stylelint = require('stylelint');
const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
const parseSelector = require("stylelint/lib/utils/parseSelector");

const ruleName = 'plugin/selector-tag-no-without-class';
const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpected: (tagName) => `Unexpected tag ${tagName} without class qualifier`
});
const optionsSchema = {
	tags: [ _.isString ]
};

module.exports = stylelint.createPlugin(ruleName, function(primaryOption, secondaryOptionObject) {
	return function(root, result) {
		if (!primaryOption) {
			return;
		}
		let validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: primaryOption,
			possible: _.isBoolean
		}, {
			actual: secondaryOptionObject,
			possible: optionsSchema
		});
		if (!validOptions) {
			return;
		}

		function checkSelector(selectorNode, ruleNode) {
			let combinedSegments = selectorNode.split(node => {
				return node.type === 'combinator';
			});

			combinedSegments.forEach(segment => {
				let unqualifiedTagNode;
				segment.forEach(node => {
					if (node.type === 'tag' && _.includes(secondaryOptionObject.tags, node.value)) {
						unqualifiedTagNode = node;
					}
					if (node.type === 'class') {
						unqualifiedTagNode = void 0;
					}
				});

				if (unqualifiedTagNode) {
					stylelint.utils.report({
						ruleName: ruleName,
						result: result,
						node: ruleNode,
						message: messages.unexpected(unqualifiedTagNode.value),
						word: unqualifiedTagNode
					});
				}
			});
		}

		function checkSelectorRoot(selectorRootNode, ruleNode) {
			selectorRootNode.each(selectorNode => {
				checkSelector(selectorNode, ruleNode);
			});
		}

		root.walkRules(ruleNode => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}
			if (!isStandardSyntaxSelector(ruleNode.selector)) {
				return;
			}
			if (
				ruleNode.nodes.some(
					node => ["rule", "atrule"].indexOf(node.type) !== -1
				)
			) {
				// Skip unresolved nested selectors
				return;
			}

			ruleNode.selectors.forEach(selector => {
				parseSelector(selector, result, ruleNode, container =>
					checkSelectorRoot(container, ruleNode)
				);
			});
		});
	};
});
module.exports.ruleName = ruleName;
module.exports.messages = messages;
