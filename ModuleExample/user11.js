function User(id, name) {
    this.id=id;
    this.name=name;
}

User.prototype.getUser=function () {
    return {id: this.id, name: this.name};
}

User.prototype.group={id: 'group1', name: '친구'};

User.prototype.printUser=function () {
    console.log('user name : %s, group name : %s', this.name, this.group.name);
}

exports.User=User;