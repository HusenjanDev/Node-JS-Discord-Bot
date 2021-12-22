const shoppy 									= require('./shoppy');
const shoppyitems 								= require('./json_files/shoppyitems.json');
const shoppyroles								= require('./json_files/shoppyroles.json');
const mysqlconnector 							= require('./mysql-connector');
const { Client, Intents } 						= require('discord.js');
const iconfig									= require('./json_files/config.json');


// Shoppy instance.
const shoppycon = new shoppy(iconfig.api_key);

// MySQL instance.
const mysqlcon = new mysqlconnector();

// Setting up Mysql instance.
mysqlcon.Setup(iconfig.database_ip, iconfig.database_user, iconfig.database_password);

// Discord Bot instance.
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// If bot instance was successfull...
client.on('ready', async () => {
    console.log('🟢 BOT Status: Running.');
});

// Discord Bot increationCreate instance.
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

	// If user entered /verify...
	if (commandName === 'verify') {
		// Getting the order-id that user entered.
        const orderId = options.getString('order-id');

		// Authenticating order-id.
		await shoppycon.AuthenticateOrder(orderId).then(async response => {
			if (response === true)
			{
				// Getting order-id title.
				const productTitle = await shoppycon.GetProductTitle(orderId);

				// Authenticating user (server-sided).
				await mysqlcon.AuthenticateOrder(interaction.member.id, orderId, productTitle).then(async response => {

					console.log(response);

					if (response === true)
					{
						// Getting information about order-id.
						await shoppycon.GetOrderInformation(orderId).then(async response => {

						// Searching through the purchased item to give the user the correct role.
						switch(response[0])
						{
							case shoppyitems.GAMESENSE:
								interaction.member.roles.add(shoppyroles.GAMESENSE);
								await interaction.reply({ content: '🟢 You now have access to gamesense configs!', ephemeral: true });
								break;

							case shoppyitems.NEVERLOSE:
								interaction.member.roles.add(shoppyroles.NEVERLOSE);
								await interaction.reply({ content: '🟢 You now have access to neverlose configs!', ephemeral: true });
								break;	

							case shoppyitems.ONETAP:
								interaction.member.roles.add(shoppyroles.ONETAP);
								await interaction.reply({ content: '🟢 You now have access to onetap configs!', ephemeral: true });
								break;

							case shoppyitems.AIMWARE:
								interaction.member.roles.add(shoppyroles.AIMWARE);
								await interaction.reply({ content: '🟢 You now have access to aimware configs!', ephemeral: true });
								break;

							case shoppyitems.LUCKYCHARMS:
								interaction.member.roles.add(shoppyroles.LUCKYCHARMS);
								await interaction.reply({ content: '🟢 You now have access to aimware configs!', ephemeral: true });
								break;
								
							default:
								await interaction.reply('🔴 Item not found!');
								break;
							};
						});
					}

					// If response equals false it means the user already has access or received it previously.
					if (response === false)
					{
						await interaction.reply({ content: '🔴 This order id has already been used!', ephemeral: true });
					}
				});
			}
			else
			{
				await interaction.reply({ content: '🔴 Invalid order!', ephemeral: true});
			}
		});
	}

	// 🔴 This command is only for administrators.
	if (commandName === 'orderinfo')
	{
		// Getting the order-id that the admin entered.
		const orderId = options.getString('order-id');

		// Checking if the user has the administrator role, if the user has it we will continue.
		if(await interaction.member.roles.cache.find(r => r.name === shoppyroles.ADMINISTRATOR)) {

			// Getting information about the order-id.
			const order = await shoppycon.GetOrderInformation(orderId);

			// If order returns false it means that the order-id doesn't exist.
			if (order === false) 
			{
				await interaction.reply({ content: '🔴 The order does not exist...', ephemeral: true });
			}
			// Else if the order is found we will display information about the order.
			else
			{
				// Printing ur Product, Email and IP-Address.
				order[2] = order[2].substr(0, 10);
				const message = `**Order Information**\n**Product:** ${order[1]}\n**Paid At:** ${order[2]}\n**Email:** ${order[3]}\n**IP-Address:** ${order[4]}`;
				await interaction.reply({ content:message, ephemeral: true });
			}
		}
		else
		{
			await interaction.reply('⛔️ You don\'t have the permission to use the command!');
		}
	}
});

client.login(iconfig.token);