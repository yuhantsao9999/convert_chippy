const express = require('express');
const app = express();
const port = 5000;

app.use(express.json({ limit: '50000mb' }));
app.use(express.urlencoded({ limit: '50000mb', extended: true }));
app.use(express.static('public', { extensions: ['html'] }));

app.use('/', require('./routers/convert'));

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
