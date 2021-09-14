// const request = require('request');

const convert = async () => {
    const inputValue = document.getElementById('xml').value;
    let code;
    // let response =
    //     '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="ouLWA,piUt:=iyCtX^,t">蛋糕數</variable></variables><block type="controls_if" id="|D1Cbc^v;CVcFt]Gx`7H" x="537" y="-663"><value name="IF0"><block type="logic_compare" id="E!:8`-bgXw$=7?pR9;cS"><field name="OP">LTE</field><value name="B"><block type="math_number" id="?6d*?;;dBXK(_f`=ZE8V"><field name="NUM">5</field></block></value></block></value><statement name="DO0"><block type="controls_repeat_ext" id="#;(YiU:-Txr~W#CmjWn6"><value name="TIMES"><shadow type="math_number" id="PGsgkS^xv9Mu=M1PaXvo"><field name="NUM">0</field></shadow></value></block></statement><next><block type="controls_if" id="obL?;:eix[QbI](k93v3"><value name="IF0"><block type="logic_compare" id="mRom6,5fw[Y$3{/9|CQS"><field name="OP">LTE</field><value name="A"><block type="variables_get" id="A28|qzFliSvfgDV1fb:o"><field name="VAR" id="ouLWA,piUt:=iyCtX^,t" variabletype="">蛋糕數</field></block></value><value name="B"><block type="math_number" id="RQ7:rCkE|ce514HkMQ4k"><field name="NUM">10</field></block></value></block></value><next><block type="controls_if" id="ZE;KjZEMHqCiVSZzIgF3"><value name="IF0"><block type="logic_compare" id="AfL6}i$bxH~~3CX|/tZ^"><field name="OP">LTE</field><value name="A"><block type="variables_get" id="DB*22e*d(X3oz|j+t3r,"><field name="VAR" id="ouLWA,piUt:=iyCtX^,t" variabletype="">蛋糕數</field></block></value><value name="B"><block type="math_number" id="jW9=]LYAl5avUDpXcD[{"><field name="NUM">15</field></block></value></block></value><next><block type="controls_if" id="~lSy|KYTf-V~znFGGFdO"><value name="IF0"><block type="logic_compare" id="VJGTTP{M!:0@.AG:Ilqr"><field name="OP">GTE</field><value name="A"><block type="variables_get" id="T$f:,ZOZ4O5[+wbfGY5m"><field name="VAR" id="ouLWA,piUt:=iyCtX^,t" variabletype="">蛋糕數</field></block></value><value name="B"><block type="math_number" id="VJG@2pR_Py{_dhXOsUsF"><field name="NUM">16</field></block></value></block></value></block></next></block></next></block></next></block><block type="math_arithmetic" id="o+JwHI}N;ti%S#v3K_,#" x="838" y="-612"><field name="OP">MULTIPLY</field><value name="A"><shadow type="math_number" id="-0:ff~=*wSrwS?G6?K2%"><field name="NUM">1</field></shadow><block type="variables_get" id="gT0tU,N}RKa(Q2KlBKK["><field name="VAR" id="ouLWA,piUt:=iyCtX^,t" variabletype="">蛋糕數</field></block></value><value name="B"><shadow type="math_number" id="prAse_M%v:#71P*A6_,U"><field name="NUM">270</field></shadow></value></block></xml>';

    try {
        xml = Blockly.Xml.textToDom(inputValue);
    } catch (e) {
        console.log('xml error', e);
    }

    const demoWorkspace = new Blockly.Workspace();
    Blockly.Xml.domToWorkspace(xml, demoWorkspace);

    code = Blockly.Python.workspaceToCode(demoWorkspace);
    // return code;
    // let options = {
    //     method: 'POST',
    //     url: 'http://140.122.183.42:8088/dist/judge.php',
    //     headers: {
    //         'content-type': 'text/html; charset=UTF-8',
    //     },
    //     formData: {
    //         question: 'Cake',
    //         // code: decodeURIComponent(
    //         //     `x%20%3D%20None%0Ay%20%3D%20None%0A%0Adef%20text_prompt(msg)%3A%0A%20%20try%3A%0A%20%20%20%20return%20raw_input(msg)%0A%20%20except%20NameError%3A%0A%20%20%20%20return%20input(msg)%0A%0A%0Ax%20%3D%20300%0Ay%20%3D%20text_prompt('%E8%B3%BC%E8%B2%B7%E6%95%B8%E9%87%8F')%0Aif%20y%20%3C%3D%205%3A%0A%20%20pass%0A`
    //         // ),
    //         code: code,
    //     },
    // };
    // request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     console.log(response.body);
    // });
    var myHeaders = new Headers();
    myHeaders.append('content-type', 'text/html; charset=UTF-8');

    var formdata = new FormData();
    formdata.append('question', 'Cake');
    formdata.append('code', "''");

    var requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
    };

    fetch('http://140.122.183.42:8088/dist/judge.php', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
};
