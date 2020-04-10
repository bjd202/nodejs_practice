
/*
 * 설정
 */

module.exports = {
	server_port: 8081,
	db_url: 'mongodb+srv://test01:test01@cluster0-wnn5t.mongodb.net/test?retryWrites=true&w=majority',
	db_schemas: [
		{file:'./user_schema', collection:'users5', schemaName:'UserSchema', modelName:'UserModel'},
		{file:'./post_schema', collection:'post', schemaName:'PostSchema', modelName:'PostModel'}
	],
	route_info: [
		{file : './post', path : '/process/addpost', method : 'addpost', type : 'post'},
		{file : './post', path : '/process/showpost/:id', method : 'showpost', type : 'get'},
		{file : './post', path : '/process/listpost', method : 'listpost', type : 'post'},
		{file : './post', path : '/process/listpost', method : 'listpost', type : 'get'}
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}