import { Event } from '../interfaces/event';
import { Guild } from 'discord.js';

export const event: Event = {
	name: 'guildDelete',
	execute: async (client, guild: Guild) => {
		if (client.serverInvites.has(guild.id)) client.serverInvites.delete(guild.id);
	}
};
