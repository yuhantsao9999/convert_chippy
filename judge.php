<?php

    require('../JudgeServer/client/PHP/JudgeClient.php');
    $token = 'CT_BLOCKLY';
    $judgeClient = new JudgeClient($token, 'http://127.0.0.1:12358');

    if(isset($_POST['question']) && isset($_POST['code'])) {
        $py2src = $_POST['code'];
        // remove input message
        $py2src = str_replace('raw_input(msg)', 'raw_input()', $py2src);
        $py2src = str_replace('input(msg)', 'input()', $py2src);
        // define a python function for convert float to int
        $pyfun = <<<'EOF'
def custom_print(value):
    try:
        print int(float(value))
    except ValueError:
        print value


EOF;

        // use regular expression to replace print() to custom_print() and keep the parameter at the same time
        $py2src = preg_replace('/print\((.*)\)/', 'custom_print($1)', $py2src);
        $pyfun .= $py2src;
        echo json_encode($judgeClient->judge($pyfun, 'py2', $_POST['question']));

    }
    else {
        header("HTTP/1.1 500 error");
    }
?>