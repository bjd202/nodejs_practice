console.log('handler_info 파일 로딩됨.');

var handler_info = [
    {file : './echo', method : 'echo'}, // echo
    {file : './echo_error', method : 'echo_error'}, // echo_err
    {file : './add', method : 'add'},
    {file : './listuser', method : 'listuser'}
];

module.exports = handler_info;