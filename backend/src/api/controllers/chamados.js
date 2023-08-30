const core = require('../../../utils/core.js');
const connectionDB = require(`../services/connectionDB.js`)
const moment = require('moment');

function chamados_get(codChamado, dataDe, dataAte, status, usuario, callback) {
    connectionDB.runQuery({ 
        sqlStatement: `
            SELECT A03.*
                , A00_NOME
             FROM A03 A03
   
             LEFT JOIN A00 A00
                    ON A00_CODIGO = A03_CODA00
   
            WHERE ( ('ALL' = @A03_CODIGO) OR (A03_CODIGO = @A03_CODIGO) )
              AND ( ('ALL' = @A03_DATAINC) OR (A03_DATAINC >= @A03_DATAINC) )
              AND ( ('ALL' = @A03_DATAINC) OR (A03_DATAINC <= @A03_DATAINC) )
              AND ( ('ALL' IN (@A03_STATUS)) OR (A03_STATUS IN (@A03_STATUS)) )
              AND ( ('ALL' = @A03_CODA00) OR (A03_CODA00 = @A03_CODA00) )
        `,
        queryParams: [
            {name: 'A03_CODIGO' , value: codChamado},
            {name: 'A03_DATAINC', value: dataDe    },
            {name: 'A03_DATAINC', value: dataAte   },
            {name: 'A03_STATUS' , value: status    },
            {name: 'A03_CODA00' , value: usuario   }
        ],
        callbackSuccess: ( aRows, queryParams ) => {
            callback( aRows )
        }
    })
}

function chamados_save(oDados, callback) {

}

function chamados_updateStatus(oDados, callback) {

}

function chamados_delete(codChamado, callback) {

}

module.exports = {
    chamados_get,
    chamados_save,
    chamados_updateStatus,
    chamados_delete
}