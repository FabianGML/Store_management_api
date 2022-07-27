const express = require('express');

const { showErrors,  errorHandler, boomError, seqErrorHandler, sequelizeUnique } = require('./middlewares/error.handler');
const routerApi = require('./routes');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Api Running   ')
})
routerApi(app);


app.use(showErrors);
app.use(seqErrorHandler);
app.use(sequelizeUnique);
app.use(boomError);
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Server listening in port ${port}`);
});