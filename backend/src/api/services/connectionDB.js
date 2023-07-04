//Conexão com o DB
const tedious = require('tedious')

const objConnectionDB = {
    connection: null
}

async function connect() {
    var Connection = tedious.Connection;  
    var config = {  
        server: '127.0.0.1',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'SA', //update me
                password: 'admin123!'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'CondoPlus',  //update me
            trustServerCertificate: true
        }
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        objConnectionDB.connection = connection

        // If no error, then good to proceed.
        if( err ) {
            objConnectionDB.connection = null
            console.log( err );  
            return 
        }

        console.log("Connected");  

        // let rows = await query( { sqlStatement: "SELECT * FROM A00;" } );
    });

    connection.connect();
}
  
async function query( objQuery ) {  
    return new Promise( (resolve, reject) => {
        const Request = tedious.Request
        const TYPES = tedious.TYPES

        let aRows = []

        var request = new Request(objQuery.sqlStatement, function(err, rowsCount, rows) {  
            if (err)
                reject(err);
        }); 
        
        request.on('row', function(columns) {  
            let rowData = {}

            columns.forEach(function(column) {  
                rowData[column.metadata.colName] = column.value 
            });  

            aRows.push( rowData )
        });  

        request.on('done', function(rowCount, more) {  
            console.log(rowCount + ' rows returned');  
        });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            resolve( aRows )

            objConnectionDB.connection.close();
        });

        objConnectionDB.connection.execSql(request);  
    })
}  

connect()

module.exports = {
    connectDB: connect,
    query
}
