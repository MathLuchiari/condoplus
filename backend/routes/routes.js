'use strict';

const core = require('../utils/core.js');
const connectionDB = require(`../src/api/services/connectionDB.js`)
const moment = require('moment');

module.exports = function(app) {
    app.route('/')
        .get( (req, res) => {
            res.render("login", {
                page_title: 'login',
                layout: 'login'
            })
        })
    
    app.route('/login')
        .post( (req, res) => {
            const { login, password } = req.body;

            let encryptedPassword = core.criptografarSenha( password );

            connectionDB.runQuery({ 
                sqlStatement: "SELECT * FROM A00 WHERE A00_LOGIN = @A00_LOGIN AND A00_SENHA = @A00_SENHA;",
                queryParams: [
                    { name: "A00_LOGIN", value: login }, 
                    { name: "A00_SENHA", value: encryptedPassword.toString()}
                ],
                callbackSuccess: ( aRows ) => {
                    let contentResp = {}

                    if( aRows.length > 0 ) {
                        contentResp = {
                            cod: 200,
                            mensagem: "Usuário logado com sucesso!"
                        }
                    } else {
                        contentResp = {
                            cod: 401,
                            mensagem: "Não foi possível realizar o login!"
                        }
                    }

                    if( contentResp.cod === 200 ) {
                        connectionDB.runQuery({ 
                            sqlStatement: `
                                SELECT * 
                                  FROM A02 A02
                                 WHERE A02.A02_CODIGO = (
                                    SELECT MAX(SUB_A02.A02_CODIGO) AS MAX_A02_CODIGO
                                      FROM A02 SUB_A02
                                     WHERE SUB_A02.A02_CODA00 = @A02_CODA00
                                 )
                            `,
                            queryParams: [
                                { name: "A02_CODA00" , value: aRows[0].A00_CODIGO }
                            ],
                            callbackSuccess: ( aRowsCheckSessao ) => {
                                if( aRowsCheckSessao.length > 0 && aRowsCheckSessao[0]["A02_ISACTIVE"] == 1 ) {
                                    contentResp.codSessao = aRowsCheckSessao["A02_CODIGO"]
                                    // res.render("index", {
                                    //     page_title: 'index',
                                    //     layout: 'index',
                                    //     ...contentResp
                                    // })
                                    res.json( contentResp )
                                } else {
                                    connectionDB.runQuery({ 
                                        sqlStatement: `
                                            INSERT INTO A02 (
                                                   A02_CODIGO
                                                 , A02_CODA00
                                                 , A02_DATAINI
                                                 , A02_HORAINI
                                                 , A02_ISACTIVE
                                             )    
                                            VALUES (
                                                   @A02_CODIGO
                                                 , @A02_CODA00
                                                 , @A02_DATAINI
                                                 , @A02_HORAINI
                                                 , 1
                                            );
                                        `,
                                        queryParams: [
                                            { name: "A02_CODA00" , value: aRows[0].A00_CODIGO },
                                            { name: "A02_CODIGO" , value: aRows[0].A00_CODIGO + Date.now().toString() },
                                            { name: "A02_DATAINI", value: moment().format('YYYY-MM-DD') },
                                            { name: "A02_HORAINI", value: moment().format('HH:mm:ss') }
                                        ],
                                        callbackSuccess: ( aRowsUPD, queryParams ) => {
                                            contentResp.codSessao = queryParams.find( param => param.name == "A02_CODIGO" ).value
                                            // res.render("index", {
                                            //     page_title: 'index',
                                            //     layout: 'index',
                                            //     ...contentResp
                                            // })
                                            res.json( contentResp )
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        res.json( contentResp )
                    }
                },
                callbackError: null
            })
        })

    app.route('/index')
        .get( (req, res) => {
            console.log('Teste')
            res.render("index", {
                page_title: 'index',
                layout: 'index'
            })
        })
}