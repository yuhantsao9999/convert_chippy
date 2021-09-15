// const request = require('request');

const convert = async () => {
    const inputValue = document.getElementById('xml').value;
    let code;

    try {
        xml = Blockly.Xml.textToDom(inputValue);
    } catch (e) {
        console.log('xml error', e);
    }

    const demoWorkspace = new Blockly.Workspace();
    Blockly.Xml.domToWorkspace(xml, demoWorkspace);

    code = Blockly.Python.workspaceToCode(demoWorkspace);

    var requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            question: 'Cake',
            code: code,
        }),
        headers: {
            'content-type': 'application/json',
        },
    };

    await fetch('/convert', requestOptions)
        .then((response) => {
            return response;
        })
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
};
