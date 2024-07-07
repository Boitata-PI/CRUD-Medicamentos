//IMPORTANDO BIBLIOTECAS
const express = require("express");
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess,} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
var Medicamento = require(__dirname + '/models/Medicamento.js');
const handlebars = require("express-handlebars").engine;
const multer = require('multer');

//Iniciando Bibliotecas
const app = express()

//Iniciando Middleware que recolhe os dados do formulário via POST
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Definindo rota dos arquivos complementares
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static('public'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

//Definindo layout das páginas
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/medicamentos');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });



//ROTAS
//INDEX
app.get("/", (req, res) => {
    res.render("home");
})

//CREATE
app.post("/cadastrar", upload.single('imagem'), async (req, res) => {
    try{
        await Medicamento.create({
            nome: req.body.nome,
            tarja: req.body.tarja,
            laboratorio: req.body.laboratorio,
            venda: req.body.venda,
            compra: req.body.compra,
            observacao: req.body.observacao,
            imagem: req.file.filename,
        });

        console.log("Medicamento Cadastrado com Sucesso!");
    
        return res.redirect('/consulta');
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
})



//READ
app.get("/consulta", async (req, res) => {
    try {
        const medicamentos = await Medicamento.findAll();

        return res.render("consulta", { medicamentos: medicamentos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})



//EDITAR
app.get("/editar/:id", async (req, res) => {
    try {
        const medicamento = await Medicamento.findByPk(req.params.id)

        if(!medicamento)
        {
            res.redirect("/consulta");
        }else
        {
            res.render("editar", { medicamento: medicamento });
        }
    }catch(error){
        res.status(400).json({ error: error.message });
    }
})

//UPDATE
app.post("/editar/:id", async (req, res) => {
    try {
        const medicamento = await Medicamento.findByPk(req.params.id)

        if(medicamento)
        {
            await medicamento.update(req.body);
        }
        else{
            res.redirect("/consulta");
        }

        console.log("Medicamento Atualizado com Sucesso!");
        
        res.redirect("/consulta");
    }catch(error){
        res.status(400).json({ error: error.message });
    }
})



//DELETE
app.post("/deletar/:id", async (req, res) => {
    try{
        const medicamento = await Medicamento.findByPk(req.params.id);

        if(medicamento){
            await medicamento.destroy();
        }

        console.log("Medicamento Deletado com Sucesso!");

        res.redirect("/consulta");
    }catch(error){
        res.status(400).json({ error: error.message });
    }
})



app.listen(8081, function(){
    console.log("Servidor Ativo na Porta 8081!")
})