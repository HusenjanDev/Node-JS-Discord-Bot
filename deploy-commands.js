const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
    .setName('verify')
    .setDescription('shoppy-order')
    .addStringOption(option => 
        option.setName('order-id')
        .setDescription('Enter the shoppy.gg order id which was sent you on your email.')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('orderinfo')
    .setDescription('Displays order information')
    .addStringOption(option => 
        option.setName('order-id')
        .setDescription('Enter the order-id')
        .setRequired(true))
];

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('🟢 Application: Setup Success.'))
	.catch(console.error);

module.exports = commands;