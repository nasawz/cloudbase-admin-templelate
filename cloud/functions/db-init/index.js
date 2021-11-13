const tcb = require('@cloudbase/node-sdk');
const CryptoJS = require('crypto-js');

exports.main = async (event, context) => {
	let { ADMIN_USER_NAME: username, ADMIN_PASS_WORD: password } = process.env;
	const currentEnv = tcb.SYMBOL_CURRENT_ENV;
	const app = tcb.init({
		env: currentEnv,
	});
	const db = app.database();

	const initAuth = () => {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection('Auth');
			password = CryptoJS.SHA256(password).toString().toLowerCase();

			let res = await collection
				.where({
					username,
					password,
				})
				.get();

			if (res.data.length == 0) {
				res = await collection.add({
					_id: `1000000${username}`,
					username,
					password,
					createdAt: new Date().getTime(),
					updatedAt: new Date().getTime(),
				});
			}
			resolve(res);
		});
	};

	await initAuth();
	return {};
}