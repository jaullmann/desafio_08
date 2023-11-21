require('express-async-errors');

const migrationsRun = require('./database/sqlite/migrations');
const AppError = require('./utils/AppError');
const express = require('express');
const routes = require('./routes');

migrationsRun();

const app = express();

app.use(express.json());

app.use(routes);

// Função para identificar se erro foi causado por uma má requisição ou se foi erro do servidor (ex.: erro no código)
app.use((error, request, response, next) => {
    // verifica se o erro foi da requisição
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.error(error)
    // se não caiu no if acima, então foi erro no servidor
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

