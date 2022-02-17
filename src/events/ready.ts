import { BClient } from '../client/client';
import { Event } from '../interfaces/event';
import { setTimeout as sleep } from 'timers/promises';

export const event: Event = {
	name: 'ready',
	execute: async (client) => {
		console.log(`I am ready! ${client.user?.tag}`);
		await sleep(100);
		loadInvites(client);
	}
};

const loadInvites = async (client: BClient) => {
	client.guilds.cache.forEach(async (guild) => {
		try {
			const firstInvites = await guild.invites.fetch();
			if (!firstInvites) return;
			const serverInvites = new Map(firstInvites.map((invite) => [invite.code, invite.uses]));
			if (serverInvites) client.serverInvites.set(guild.id, serverInvites);
		} catch (error) {
			console.log(`Missing invite permissions in guild ${guild.name}.`);
		}
	});
};
