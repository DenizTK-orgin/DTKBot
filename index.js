const {
  Client,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

const express = require("express");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers, // Üyeleri yönetme yetkisi
  ],
});
const app = express();
const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Bot yaşıyor ow ye"));
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda başlatıldı`));

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} yaşıyor`);

  
  client.user.setStatus("idle");

  client.user.setActivity('DenizTKyı izliyor', {
        type: 'WATCHING',  // Aktivite türü
        details: 'DTKland',  // Küçük başlık
        state: 'Hell yah',  // Büyük başlık
        largeImageKey: 'logo', // Discord Developer Portal'dan yüklediğiniz büyük resmin anahtarı
        largeImageText: 'DenizTK Sunucusu',  // Büyük resmin altındaki metin
        smallImageKey: 'gif',  // Discord Developer Portal'dan yüklediğiniz küçük resmin anahtarı
        smallImageText: 'Level 100',  // Küçük resmin altındaki metin
        buttons: [
            { label: 'Siteme Git', url: 'https://www.youtube.com/@DenizTK' },
            { label: 'Discord', url: 'https://discord.gg/kXsNvc7R7S' }
        ]
    });
  
  const guildId = "1252197549675380827";
  const guild = client.guilds.cache.get(guildId);
  //const guild = await client.guilds.fetch(guildId);

  if (guild) {
    const commands = [
      new SlashCommandBuilder()
        .setName("yasakla")
        .setDescription("Bir kullanıcıyı sunucudan atar ve yasaklar")
        .addUserOption((option) =>
          option
            .setName("kullanıcı")
            .setDescription("Yasaklanacak kişi")
            .setRequired(true),
        ),

      new SlashCommandBuilder()
        .setName("at")
        .setDescription("Bir kullanıcıyı sunucudan atar")
        .addUserOption((option) =>
          option
            .setName("kullanıcı")
            .setDescription("Atılacak kişi")
            .setRequired(true),
        ),
    ].map((command) => command.toJSON());

    await client.application.commands.set(commands);
    console.log("Slash komutları yapılandırıldı ow yeeeee");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "yasakla") {
    const member = options.getMember("kullanıcı");
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "Üyeleri yasaklamana iznin yok :]",
        ephemeral: true,
      });
    }
    if (!member)
      return interaction.reply(
        "Kullanıcı maalesef bulunamadı <:AhBe:1312707627112861728>",
      );
    if (!member.bannable)
      return interaction.reply(
        "Bu kullanıcı yasaklanamaz <:KediSilah:1312707596184195084>",
      );

    await member.ban();
    await interaction.reply(
      `${member.user.tag} sunucudan yasaklandı ve artık giremez <:yakaladim:1311716011912724480>`,
    );
  }

  if (commandName === "at") {
    const member = options.getMember("kullanıcı");
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return interaction.reply({
        content: "Üyeleri atma iznin yok :]",
        ephemeral: true,
      });
    }
    if (!member)
      return interaction.reply(
        "Kullanıcı bulunamadı <:AhBe:1312707627112861728>",
      );
    if (!member.kickable)
      return interaction.reply(
        "Bu kullanıcı atılamaz! <:KediSilah:1312707596184195084>",
      );

    await member.kick();
    await interaction.reply(
      `${member.user.tag} sunucudan atıldı <:yakaladim:1311716011912724480>`,
    );
  }
});

// Mesajlara yanıt vermesi gibi
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "sa") {
    message.channel.send("as");
  }
});

//başlatıcı.dtk
client.login(process.env.TOKEN);

setInterval(
  () => {
    console.log("Ping Gönderildi:", new Date().toLocaleTimeString());
  },
  5 * 60 * 1000,
);
