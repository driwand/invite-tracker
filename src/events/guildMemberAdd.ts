import { Collection, GuildMember, Invite, TextChannel } from 'discord.js';
import { BClient } from '../client/client';
import { Event } from '../interfaces/event';

export const event: Event = {
	name: 'guildMemberAdd',
	execute: async (client, member) => {
		try {
			await checkInviter(client, member);
		} catch (error) {
			console.error();
		}
	}
};

const checkInviter = async (client: BClient, member: GuildMember) => {
	try {
		const newInvites = await member.guild.invites.fetch();
		const inviteChannel = member.guild.channels.cache.find(
			(channel) => channel.name === 'invite-logs'
		) as TextChannel;
		const oldInvites = client.serverInvites.get(member.guild.id);

		if (!oldInvites) return inviteChannel?.send(`Somehow ${member.user.tag} joined the server.`);

		const invite: Invite | null = await findInvite(newInvites, oldInvites);

		if (!invite || !invite.inviter) return inviteChannel?.send(`Somehow ${member.user.tag} joined the server.`);

		const inviter = client.users.cache.get(invite.inviter.id);
		if (!inviter) await client.users.fetch(invite.inviter.id);
		if (!inviter) return;

		const used = invite.uses && invite.uses > 1 ? 'time' : 'times';
		inviteChannel?.send(
			`**${member.user.tag}** is invited by **${inviter.tag}** using invite code ${invite.code} (used: ${invite.uses} ${used}).`
		);
	} catch (error) {
		console.error();
	}
};

const findInvite = (
	newInvites: Collection<string, Invite>,
	oldInvites: Map<string, number | null>
): Promise<Invite | null> => {
	return new Promise<Invite | null>((resolve, reject) => {
		newInvites.map((inv: Invite) => {
			const invCode = oldInvites.get(inv.code);
			const res = inv.uses && invCode && inv.uses > invCode ? inv.uses : null;
			if (res) resolve(inv);
		});
		reject(null);
	});
};
