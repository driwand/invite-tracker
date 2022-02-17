import { Event } from '../interfaces/event';

export const event: Event = {
	name: 'inviteDelete',
	execute: async (client, invite) => {
		client.serverInvites.get(invite.guild.id)?.delete(invite.code);
	}
};
