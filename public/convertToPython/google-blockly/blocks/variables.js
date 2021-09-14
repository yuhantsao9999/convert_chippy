/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Variable blocks for Blockly.

 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables'); // Deprecated.
goog.provide('Blockly.Constants.Variables');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldLabel');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.Mutator');

/**
 * Unused constant for the common HSV hue for all blocks in this category.
 * @deprecated Use Blockly.Msg['VARIABLES_HUE']. (2018 April 5)
 */
Blockly.Constants.Variables.HUE = 330;

Blockly.defineBlocksWithJsonArray([// BEGIN JSON EXTRACT
        // Block for variable getter.
        {
            "type": "variables_get",
            "message0": "%1",
            "args0": [{
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "%{BKY_VARIABLES_DEFAULT_NAME}"
                }
            ],
            "output": null,
            "style": "variable_blocks",
            "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
            "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
            "extensions": ["contextMenu_variableSetterGetter"]
        },
        // Block for variable setter.
        {
            "type": "variables_set",
            "message0": "%{BKY_VARIABLES_SET}",
            "args0": [{
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "%{BKY_VARIABLES_DEFAULT_NAME}"
                }, {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "style": "variable_blocks",
            "tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
            "helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
            "extensions": ["contextMenu_variableSetterGetter"]
        },
        // Block for global declaration
        {
            "type": "global_declaration",
            "message0": "initialize global %1 to %2",
            "args0": [{
                    "type": "field_input",
                    "name": "NAME",
                    "text": "name"
                }, {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "style": "variable_blocks",
            "tooltip": "",
            "helpUrl": ""

        },
        // Block for lexical_variable_get
        {
            "type": "lexical_variable_get",
            "message0": "get %1",
            "args0": [{
                    "type": "field_input",
                    "name": "VAR",
                    "text": "name"
                }
            ],
            "output": null,
            "style": "variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        },
        // Block for lexical_variable_set
        {
            "type": "lexical_variable_set",
            "message0": "set %1 to %2",
            "args0": [{
                    "type": "field_input",
                    "name": "VAR",
                    "text": "name"
                }, {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "style": "variable_blocks",
            "tooltip": "",
            "helpUrl": ""
        }
    ]); // END JSON EXTRACT (Do not delete this comment.)

// Local Variable Statement defines here
Blockly.Blocks['local_declaration_statement'] = {
    // Define a procedure with no return value.
    init: function () {
        var declInput = this.appendValueInput('DECL0');
        declInput.setAlign(Blockly.ALIGN_RIGHT)
        .appendField("initialize local")
        .appendField(new Blockly.FieldTextInput("x"), 'VAR0')
        .appendField("to");
        this.setMutator(new Blockly.Mutator(['local_mutator_arg']));
        this.appendStatementInput('STACK')
        .appendField("in");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
        this.itemCount_ = 1;
        this.localNames_ = ["x"];
    },
    mutationToDom: function () { // Store local names in mutation element of XML for block
        var container = Blockly.utils.xml.createElement('mutation');
        for (var i = 0; i < this.itemCount_; i++) {
            var parameter = Blockly.utils.xml.createElement('localname');
            parameter.setAttribute('name', this.localNames_[i]);
            container.appendChild(parameter);
        }
        return container;
    },
    domToMutation: function (xmlElement) { // Retrieve local names from mutation element of XML for block
        this.localNames_ = [];
        for (var i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
            if (childNode.nodeName.toLowerCase() == 'localname') {
                var varName = childNode.getAttribute('name');
                this.localNames_.push(varName);
            }
        }
        this.itemCount_ = this.localNames_.length;
        this.updateDeclarationInputs_();
    },
    updateDeclarationInputs_: function () {
        for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('DECL' + i)) {
                var declInput = this.appendValueInput('DECL' + i);
                declInput.setAlign(Blockly.ALIGN_RIGHT)
                .appendField("initialize local")
                .appendField(new Blockly.FieldTextInput("x"), 'VAR' + i)
                .appendField("to");
            }
        }
        while (this.getInput('DECL' + i)) {
            this.removeInput('DECL' + i);
            i++;
        }
    },
    decompose: function (workspace) {
        // Create "mutator" editor populated with name blocks with local variable names
        var containerBlock = workspace.newBlock('local_variable_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var localName = this.getFieldValue('VAR' + i);
            var nameBlock = workspace.newBlock('local_mutator_arg');
            nameBlock.initSvg();
            nameBlock.setFieldValue(localName, 'NAME');
            connection.connect(nameBlock.previousConnection);
            connection = nameBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        // [lyn, 10/27/13] Modified this so that doesn't rebuild block if names haven't changed.
        // This is *essential* to handle Subtlety #3 in localParameterChangeHandler within parameterFlydown.

        this.localNames_ = [];
        var initializers = [];
        var mutatorarg = containerBlock.getInputTargetBlock('STACK');
        while (mutatorarg) {
            this.localNames_.push(mutatorarg.getFieldValue('NAME'));
            initializers.push(mutatorarg.valueConnection_); // pushes undefined if doesn't exist
            mutatorarg = mutatorarg.nextConnection && mutatorarg.nextConnection.targetBlock();
        }
        this.itemCount_ = this.localNames_.length;
        this.updateDeclarationInputs_();
    },
    saveConnections: function (containerBlock) {
        // Store child initializer blocks for local name declarations with name blocks in mutator editor
        var nameBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (nameBlock) {
            var localDecl = this.getInput('DECL' + i);
            nameBlock.valueConnection_ =
                localDecl && localDecl.connection.targetConnection;
            i++;
            nameBlock = nameBlock.nextConnection &&
                nameBlock.nextConnection.targetBlock();
        }
        // Store body statement or expression connection
        var bodyInput = this.getInput(this.bodyInputName); // 'STACK' or 'RETURN'
        if (bodyInput) {
            containerBlock.bodyConnection_ = bodyInput.connection.targetConnection;
        }
    }
};

Blockly.Blocks['local_variable_container'] = {
    // Local variable container (for mutator dialog).
    init: function () {
        this.setStyle('variable_blocks');
        this.appendDummyInput()
        .appendField("local names");
        this.appendStatementInput('STACK');
        this.setTooltip("");
        this.contextMenu = false;
    }
};

Blockly.Blocks['local_mutator_arg'] = {
    // Procedure argument (for mutator dialog).
    init: function () {
        this.setStyle('variable_blocks');
        this.appendDummyInput()
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("name0"), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("");
        this.contextMenu = false;
    }
};

/**
 * Mixin to add context menu items to create getter/setter blocks for this
 * setter/getter.
 * Used by blocks 'variables_set' and 'variables_get'.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Variables.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
    /**
     * Add menu option to create getter/setter block for this setter/getter.
     * @param {!Array} options List of menu options to add to.
     * @this {Blockly.Block}
     */
    customContextMenu: function (options) {
        if (!this.isInFlyout) {
            // Getter blocks have the option to create a setter block, and vice versa.
            if (this.type == 'variables_get') {
                var opposite_type = 'variables_set';
                var contextMenuMsg = Blockly.Msg['VARIABLES_GET_CREATE_SET'];
            } else {
                var opposite_type = 'variables_get';
                var contextMenuMsg = Blockly.Msg['VARIABLES_SET_CREATE_GET'];
            }

            var option = {
                enabled: this.workspace.remainingCapacity() > 0
            };
            var name = this.getField('VAR').getText();
            option.text = contextMenuMsg.replace('%1', name);
            var xmlField = Blockly.utils.xml.createElement('field');
            xmlField.setAttribute('name', 'VAR');
            xmlField.appendChild(Blockly.utils.xml.createTextNode(name));
            var xmlBlock = Blockly.utils.xml.createElement('block');
            xmlBlock.setAttribute('type', opposite_type);
            xmlBlock.appendChild(xmlField);
            option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
            options.push(option);
            // Getter blocks have the option to rename or delete that variable.
        } else {
            if (this.type == 'variables_get' || this.type == 'variables_get_reporter') {
                var renameOption = {
                    text: Blockly.Msg.RENAME_VARIABLE,
                    enabled: true,
                    callback: Blockly.Constants.Variables.RENAME_OPTION_CALLBACK_FACTORY(this)
                };
                var name = this.getField('VAR').getText();
                var deleteOption = {
                    text: Blockly.Msg.DELETE_VARIABLE.replace('%1', name),
                    enabled: true,
                    callback: Blockly.Constants.Variables.DELETE_OPTION_CALLBACK_FACTORY(this)
                };
                options.unshift(renameOption);
                options.unshift(deleteOption);
            }
        }
    }
};

/**
 * Callback for rename variable dropdown menu option associated with a
 * variable getter block.
 * @param {!Blockly.Block} block The block with the variable to rename.
 * @return {!function()} A function that renames the variable.
 */
Blockly.Constants.Variables.RENAME_OPTION_CALLBACK_FACTORY = function (block) {
    return function () {
        var workspace = block.workspace;
        var variable = block.getField('VAR').getVariable();
        Blockly.Variables.renameVariable(workspace, variable);
    };
};

/**
 * Callback for delete variable dropdown menu option associated with a
 * variable getter block.
 * @param {!Blockly.Block} block The block with the variable to delete.
 * @return {!function()} A function that deletes the variable.
 */
Blockly.Constants.Variables.DELETE_OPTION_CALLBACK_FACTORY = function (block) {
    return function () {
        var workspace = block.workspace;
        var variable = block.getField('VAR').getVariable();
        workspace.deleteVariableById(variable.getId());
        workspace.refreshToolboxSelection();
    };
};

Blockly.Extensions.registerMixin('contextMenu_variableSetterGetter',
    Blockly.Constants.Variables.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN);