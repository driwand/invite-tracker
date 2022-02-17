import { Event } from '../interfaces/event';
import { Guild } from 'discord.js';
import { BClient } from '../client/client';

export const event: Event = {
	name: 'guildCreate',
	execute: async (client, guild: Guild) => {
		try {
			await loadInvites(client, guild);
		} catch (error) {
			console.error();
		}
	}
};

const loadInvites = async (client: BClient, guild: Guild) => {
	guild.invites
		.fetch()
		.then((guildInvites) => {
			client.serverInvites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
		})
		.catch((error) => {
			console.log(error);
		});
};
