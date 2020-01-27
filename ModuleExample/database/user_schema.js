var crypto=require('crypto');

var Schema={};

Schema.createSchema=function (mongoose) {
    UserSchmea=mongoose.Schema({
        id: {type: String, required: true, unique: true, 'default': ' '},
        hashed_password: {type: String, required: true, 'default': ' '},
        salt: {type: String, required: true},
        name: {type: String, index: 'hashed', 'default': ' '},
        age: {type: Number, 'default': -1},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    UserSchmea.virtual('password').set(function (password) {
        this._password=password;
        this.salt=this.makeSalt();
        this.hashed_password=this.encryptPassword(password);
        console.log('virtual password call : ' + this.hashed_password);
    })
    .get(function () {
        return this._password;
    });

    //비밀번호 암호화
    UserSchmea.method('encryptPassword', function (plainText, inSalt) {
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    //salt 값 만듬
    UserSchmea.method('makeSalt', function () {
        return Math.round((new Date().valueOf()*Math.random()))+'';
    });

    //인증 메소드 - 입력된 비밀번호와 비교 return true/false
    UserSchmea.method('authenticate', function (plainText, inSalt, hashed_password) {
        if(inSalt){
            console.log('authenticate call %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);

            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }else{
            console.log('authenticate call : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);

            return this.encryptPassword(plainText) == this.hashed_password;
        }
    });

    //필수 속성에 대한 유효성 확인
    UserSchmea.path('id').validate(function (id) {
        return id.length;
    }, 'id colum is not exsist');

    UserSchmea.path('name').validate(function (name) {
        return name.length;
    }, 'name colum is not exsist');

    UserSchmea.static('findById', function (id, callback) {
        return this.find({id: id}, callback);
    });

    UserSchmea.static('findAll', function (callback) {
        return this.find({ }, callback);
    });

    UserModel=mongoose.model('users3', UserSchmea);

    return UserSchmea;
}

module.exports=Schema;