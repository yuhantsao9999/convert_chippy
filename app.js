const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.json({ limit: '50000mb' }));
app.use(express.urlencoded({ limit: '50000mb', extended: true }));
app.use(express.static(path.join(__dirname, '../watermelon-chess-with-hooks/build')));
app.use(express.static(path.join(__dirname, 'public/assets/image/')));

app.use(express.static('public', { extensions: ['html'] }));

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
