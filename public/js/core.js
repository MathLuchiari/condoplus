function openPage( pageName, callbackFunc ) {
    const url = '/index/' + pageName

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.text())
    .then( (responseData) => {
        let divConteudoRet = $($(responseData).children('div.conteudo')[0]).html()
        $('div.conteudo').html(divConteudoRet)

        eval(callbackFunc)
    })
    .catch(error => {
        // Manipule os erros da chamada aqui
        console.error(error);
    });
}

function openPopUp( content, width ) {
    if( $('.page-popUp-background').length > 0 ) {
        $('.page-popUp-background').remove()
    }
    
    $('.page-content').append(`
        <div class="page-popUp-background" style="visibility: hidden;">
            <div class="page-popUp">
                <div id="popUpContent"> 
                    <div class="iconClosePopUp"><i class="fas fa-xmark"></i></div>
                    ${content}
                </div>
            </div>
        </div>
    `)

    $('.page-popUp-background').css({
        "visibility": "visible"
    })

    $('.page-popUp').css({ width })

    $('.iconClosePopUp').on('click', () => {
        closePopUp()
    })
}

function closePopUp() {
    $('.page-popUp-background').remove()
}

function validateRequired( container ) {
    let valid = true
    let aCamposObrigEmpty = []

    $(`${container} [required]`).each( (i,el) => {
        if( el.value == '' ) {
            valid = false

            aCamposObrigEmpty.push( $(`${container} [for="${el.id}"]` ).html() )
            
            el.style.border = 'solid red .1rem'
            el.onfocus = () => {
                el.style.border = ''
            }
        }
    })

    if( !valid ) {
        toastr.warning(`
            Campos obrigatórios não preenchidos!<br>

            ${  
                aCamposObrigEmpty.join('<br>')
            }
        `)
    } 

    return valid
}
