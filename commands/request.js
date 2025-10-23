const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("request")
    .setDescription("Submit a mod request.")
    .addStringOption((option) =>
      option.setName("mod_name").setDescription("Name of the mod").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("for_what")
        .setDescription("Purpose (fun, pvp, etc.)")
        .addChoices(
          { name: "Fun", value: "fun" },
          { name: "PvP", value: "pvp" },
          { name: "Utility", value: "utility" },
          { name: "Other", value: "other" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("what_you_need")
        .setDescription("Briefly describe what you need.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const modName = interaction.options.getString("mod_name");
    const forWhat = interaction.options.getString("for_what");
    const needs = interaction.options.getString("what_you_need");

    const user = interaction.user;
    const modChannelId = "1422245718831136922"; // MOD CHANNEL ID

    // Reply to user (public)
    const userReply = await interaction.reply({
      content: `✅ **Request Submitted!**\n_Your request has been sent to moderators._`,
      fetchReply: true,
    });

    // Create mod embed
    const embed = new EmbedBuilder()
      .setColor("#BF4400")
      .setTitle("🔥 New Mod Request")
      .addFields(
        { name: "🧍 Requested by", value: `${user.tag}`, inline: true },
        { name: "🧩 Mod Name", value: modName, inline: true },
        { name: "🎯 For What", value: forWhat, inline: true },
        { name: "📝 Needs", value: needs }
      )
      .setTimestamp();

    // Buttons
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("approve_request")
        .setLabel("✔️ Approve")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("deny_request")
        .setLabel("❌ Deny")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("neutral_request")
        .setLabel("➖ Neutral")
        .setStyle(ButtonStyle.Secondary)
    );

    // Send embed to mod channel
    const modChannel = await client.channels.fetch(modChannelId);
    const modMsg = await modChannel.send({ embeds: [embed], components: [buttons] });

    // Create collector for mod buttons
    const collector = modMsg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (!i.member.permissions.has("ManageMessages")) {
        return i.reply({ content: "You don’t have permission for this.", ephemeral: true });
      }

      if (i.customId === "approve_request") {
        await userReply.react("✔️");
        await i.reply({ content: "Approved ✅", ephemeral: true });
      } else if (i.customId === "deny_request") {
        await userReply.react("❌");
        await i.reply({ content: "Denied ❌", ephemeral: true });
      } else if (i.customId === "neutral_request") {
        await userReply.react("➖");
        await i.reply({ content: "Marked as neutral ➖", ephemeral: true });
      }
    });
  },
};
