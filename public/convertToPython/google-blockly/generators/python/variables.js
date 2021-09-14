/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Python for variable blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Python.variables');

goog.require('Blockly.Python');

Blockly.Python['variables_get'] = function (block) {
    // Variable getter.
    var code = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
            Blockly.VARIABLE_CATEGORY_NAME);
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['variables_set'] = function (block) {
    // Variable setter.
    var argument0 = Blockly.Python.valueToCode(block, 'VALUE',
            Blockly.Python.ORDER_NONE) || '0';
    var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
            Blockly.VARIABLE_CATEGORY_NAME);
    return varName + ' = ' + argument0 + '\n';
};

Blockly.Python['global_declaration'] = function (block) {
    var text_name = block.getFieldValue('NAME');
    var value_value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
    text_name = 'global_' + text_name;
    var code = text_name + ' = ' + value_value + '\n';
    return code;
};

Blockly.Python['lexical_variable_get'] = function (block) {
    var text_name = block.getFieldValue('VAR');
    var res = text_name.split(" "), code = '';
    if (res.length != 1) {
        code = 'global_' + res[1];
    } else {
        code = text_name;
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['lexical_variable_set'] = function (block) {
    var text_name = block.getFieldValue('VAR');
    var value_value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
    var res = text_name.split(" "), code = '';
    if (res.length != 1) {
        code = 'global_' + res[1] + ' = ' + value_value + '\n';
    } else {
        code = text_name + ' = ' + value_value + '\n';
    }
    return code;
};

Blockly.Python['local_declaration_statement'] = function (block) {
	var code = '';
	for (var i = 0; i < block.itemCount_; i++) {
		var text_name = block.getFieldValue('VAR' + i);
		var value_value = Blockly.Python.valueToCode(block, 'DECL' + i, Blockly.Python.ORDER_ATOMIC);
		code += text_name + ' = ' + value_value + '\n';
	}
	var state_stack = Blockly.Python.statementToCode(block, 'STACK');
	code += state_stack;
	return code;
};
