$('#showPassword').on('click', () => {
    if( $('#txtPassword').attr('type') == 'password' ) {
        $('#txtPassword').attr('type', 'text')
    } else {
        $('#txtPassword').attr('type', 'password')
    }

    toggleClassesIconEye( $('#showPassword')[0] )
})

const toggleClassesIconEye = ( el ) => {
    $(el).toggleClass('fa-eye-slash')
    $(el).toggleClass('fa-eye')
}
