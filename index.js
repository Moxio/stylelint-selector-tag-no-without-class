import _ from "lodash";
import stylelint from "stylelint";
import selectorParser from 'postcss-selector-parser';

import hasInterpolation from 'stylelint/lib/utils/hasInterpolation.mjs';
import hasLessInterpolation from 'stylelint/lib/utils/hasLessInterpolation.mjs';
import hasPsvInterpolation from "stylelint/lib/utils/hasPsvInterpolation.mjs";
import hasScssInterpolation from "stylelint/lib/utils/hasScssInterpolation.mjs";
import hasTplInterpolation from "stylelint/lib/utils/hasTplInterpolation.mjs";
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import matchesStringOrRegExp from 'stylelint/lib/utils/matchesStringOrRegExp.mjs';
import isStandardSyntaxSelector from 'stylelint/lib/utils/isStandardSyntaxSelector.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions }
  } = stylelint;

export const ruleName = 'plugin/selector-tag-no-without-class';
export const messages = ruleMessages(ruleName, {
	unexpected: (tagName) => `Unexpected tag ${tagName} without class qualifier`
});

/** @type {import('stylelint').Rule} */
const rule = function(primaryOption) {
	return function(root, result) {
		let validOptions = validateOptions(result, ruleName, {
			actual: primaryOption,
			possible: [_.isString]
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
					if (node.type === 'tag' && matchesStringOrRegExp(node.value, primaryOption)) {
						unqualifiedTagNode = node;
					}
					if (node.type === 'class') {
						unqualifiedTagNode = void 0;
					}
				});

				if (unqualifiedTagNode) {
					report({
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
			if (ruleNode.parent && ruleNode.parent.type === "atrule" && ruleNode.parent.name === "keyframes") {
				// Skip rules within an @keyframes at-rule
				// (https://github.com/Moxio/stylelint-selector-tag-no-without-class/issues/5)
				return;
			}

			ruleNode.selectors.forEach(selector => {
				const callback = container => checkSelectorRoot(container, ruleNode);
				try {
					return selectorParser(callback).processSync(selector);
				} catch (err) {
					result.warn(`Cannot parse selector (${err})`, { node, stylelintType: 'parseError' });
					return undefined;
				}
			});
		});
	};
};
rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
