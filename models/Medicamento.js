const Sequelize = require('sequelize');
const sequelize = require('../server/banco.js');

const Medicamento = sequelize.define('medicamentos',{
    nome:{
        type: Sequelize.STRING
    },
    tarja:{
        type: Sequelize.STRING
    },
    laboratorio:{
        type: Sequelize.STRING
    },
    venda:{
        type: Sequelize.STRING
    },
    compra:{
        type: Sequelize.STRING
    },
    observacao:{
        type: Sequelize.STRING
    },
    imagem:{
        type: Sequelize.STRING
    }
})

Medicamento.sync();

module.exports = Medicamento;