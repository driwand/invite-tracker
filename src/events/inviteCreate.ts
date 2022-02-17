import { Event } from '../interfaces/event';

export const event: Event = {
	name: 'inviteCreate',
	execute: async (client, invite) => {
		if (client.serverInvites.has(invite.guild.id))
			client.serverInvites.get(invite.guild.id)?.set(invite.code, invite.uses);
	}
};
