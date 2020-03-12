
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
		{file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'},
		{file: './coffeeshop_schema', collection: 'coffeeshop', schemaName: 'CoffeeShopSchema', modelName: 'CoffeeShopModel'}
	],
	route_info: [
		//=========== CoffeeShop ==========//
		{file : './coffeeshop', path : '/process/addcoffeeshop', method : 'add', type : 'post'},
		{file : './coffeeshop', path : '/process/listcoffeeshop', method : 'list', type : 'post'}
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