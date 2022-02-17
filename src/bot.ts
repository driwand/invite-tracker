import client from './client/client';
import { botToken } from './config/config.json';

const main = async () => {
	try {
		await client.init();
		await client.login(botToken);
	} catch (error) {
		console.error();
	}
};

main();
