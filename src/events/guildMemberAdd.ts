import { Collection, GuildMember, Invite, TextChannel, User } from 'discord.js';
import { BClient } from '../client/client';
import { Event } from '../interfaces/event';
import EmbedMessage from '../classes/EmbedMessage';
import moment from 'moment';

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

		const oldInvites = client.serverInvites.get(member.guild.id);

		if (!oldInvites) return sendEmbed(member, null, null);

		const invite: Invite | null = await findInvite(newInvites, oldInvites);

		if (!invite || !invite.inviter) return sendEmbed(member, null, null);

		const inviter = client.users.cache.get(invite.inviter.id);
		if (!inviter) await client.users.fetch(invite.inviter.id);
		if (!inviter) return sendEmbed(member, null, null);

		sendEmbed(member, inviter, invite);
	} catch (error) {
		console.error();
	}
};

const sendEmbed = (member: GuildMember, inviter: User | null, invite: Invite | null) => {
	const inviteChannel = member.guild.channels.cache.find((channel) =>
		channel.name.includes('invite-logs')
	) as TextChannel;

	const embed = new EmbedMessage();
	const currentTime = moment().utc().format('ddd MMMM Do, YYYY hh:mm A');

	embed.setAuthor({ name: `${member.guild.name}`, iconURL: member.guild.iconURL() ?? '' });
	embed.setDescription(`**New Member: ${member.guild?.memberCount ?? 0}**`);

	if (!inviter || !invite) {
		const unknownInviteDescription = `Somehow!! ${member.user.tag} (<@${member.user.id}> joined the server.)`;
		embed.addField('Invite', unknownInviteDescription);
	} else {
		let accountCreationDate = member?.user.createdAt;
		const inviteDescription =
			`**User:** ${member.user.tag} (<@${member.user.id}>)\n` +
			`**Account Age:** ${`<t:${moment(accountCreationDate).format('X')}:R>`}\n` +
			`**Invite:** https://discord.gg/${invite.code}\n` +
			`**Invite Created:** ${`<t:${moment(invite.createdAt).format('X')}:R>`}\n` +
			`**Invite Uses:** ${invite.uses}`;

		accountCreationDate = inviter.createdAt ?? new Date();
		const inviterDescription =
			`**User:** ${inviter.tag} (<@${inviter.id}>)\n` +
			`**Account Age:** ${`<t:${moment(accountCreationDate).format('X')}:R>`}`;

		embed.addFields(
			{ name: '<:newmember:947651148574244874> Invite', value: inviteDescription },
			{ name: '<:member:947651157805920267> Inviter', value: inviterDescription }
		);
	}

	const botAvatar = member.client.user?.avatarURL();
	embed.setFooter({ text: currentTime, iconURL: botAvatar ?? '' });

	inviteChannel?.send({ embeds: [embed] });
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
