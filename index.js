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

  // Aktivite ve butonları ayarla
  client.user.setActivity({
    name: "DenizTK",
    type: ActivityType.Watching,
    assets: {
      largeImage: "logo", // Developer Portal'daki resim anahtarı
      largeText: "DenizTK Sunucusu",
      smallImage: "gif",
      smallText: "En İyi Botum"
    },
    buttons: [
      { label: "Siteme Git", url: "https://www.youtube.com/@DenizTK" },
      { label: "Discord", url: "https://discord.gg/kXsNvc7R7S" }
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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const xp = db.get(`xp_${message.guild.id}_${message.author.id}`) || 0;
  const level = Math.floor(xp / 100);

  // Level 10'a ulaşanlara rozet ver
  if (level >= 10) {
    const badge = await Badge.findOne({ userID: message.author.id, guildID: message.guild.id });
    if (!badge.badges.some(b => b.name === 'Geliştirici')) {
      badge.badges.push({ name: 'Geliştirici', earnedAt: new Date() });
      await badge.save();
      message.member.roles.add('ROZET_ROL_ID');
      message.channel.send(`🎉 ${message.author}, **Geliştirici Rozeti** kazandın!`);
    }
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
    const embed = new EmbedBuilder()
      .setTitle("Başlık")
      .setDescription("As")
      .setColor("#ffffff"); // renk

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
