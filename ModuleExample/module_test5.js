//require() 메소드는 export가 아닌 module.exports로 설정된 속성 반환
var user=require('./user5');

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log('user info : %s', showUser());