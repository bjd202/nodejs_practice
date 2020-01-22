var user=require('./user3');

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log('user info : %s', showUser());