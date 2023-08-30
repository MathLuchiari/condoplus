function chamados_init() {
    chamados_get( 'ALL', ( aData ) => {
        // chamados_createGrid( aData )
    })

    $('.datepicker').each( (i, e) => {
        const datepicker = new Datepicker(e); 
    }) 
}

function chamados_get( codChamado, callback ) {

        codChamado = 'ALL'
    let dataDe = 'ALL'
    let dataAte = 'ALL'
    let status = 'ALL'
    let usuario = 'ALL'
    var url = `/index/chamados?codChamado=${codChamado}&dataDe=${dataDe}&dataAte=${dataAte}&status=${status}&usuario=${usuario}`;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status === 200) {
            callback( JSON.parse(request.response) )
        } else {
            console.error('Erro na requisição:', request.status, request.statusText);
        }
    };

    request.onerror = function() {
        console.error('Erro na requisição.');
    };

    request.send();
}