const express = require('express');
const router = express.Router();
const request = require('request');
router.post('/convert', async (req, res) => {
    const { question, code } = req.body;

    let options = {
        method: 'POST',
        url: 'http://140.122.183.42:8088/dist/judge.php',
        headers: {
            'content-type': 'text/html; charset=UTF-8',
        },
        formData: {
            question: question,
            code: code,
        },
    };
    const data = await request(options, function (error, response) {
        if (error) throw new Error(error);
        let tmp = [];
        for (let i = 0; i < 5; i++) {
            tmp.push(JSON.parse(response.body).data[i].result);
        }
        console.log('every cases score', tmp);
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
        const score = countOccurrences(tmp, 0);
        console.log('score', score);
        return response.body.data;
    });
    res.send(data);
});
module.exports = router;
