using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace UtilityBot.Services.Configuration
{
    public sealed class Config
    {
        private Config() { }

        [JsonProperty("token")]
        public string Token { get; set; }
        [JsonProperty("command_activation_strings")]
        public IEnumerable<string> CommandStrings { get; set; } = new[]
        {
            "."
            
        };
        [JsonProperty("command_on_mention")]
        public bool TriggerOnMention { get; set; } = true;
        [JsonProperty("channels")]
        public IEnumerable<ulong> ChannelWhitelist { get; set; } = new ulong[]
        {
            81384956881809408,          // discord api      #dotnet_discord-net
            150482537465118720,         // discord.net dev  #general
        };
        [JsonProperty("elevated_user_map")]
        public Dictionary<ulong, IEnumerable<ulong>> GuildRoleMap { get; set; } = new Dictionary<ulong, IEnumerable<ulong>>
        {
            [362225000348123136] = new ulong[] // Pokebip
            {
                366926672995418114     // Chef de Section
            },
            [369449808601022464] = new ulong[] //testserv
            {
                369461474483109898     // Admin supreme
            }
        };

        public class ConfigDatabase
        {
            [JsonProperty("host")]
            public string Host { get; set; }
            [JsonProperty("port")]
            public int Port { get; set; } = 5432;
            [JsonProperty("db")]
            public string Db { get; set; }
            [JsonProperty("user")]
            public string Username { get; set; }
            [JsonProperty("password")]
            public string Password { get; set; }
            [JsonIgnore]
            public string ConnectionString => $"Host={Host};Port={Port};Username={Username};Password={Password};Database={Db}";
        }
        [JsonProperty("db")]
        public ConfigDatabase Database { get; set; }

        public static Config Load()
        {
            if (File.Exists("config.json"))
            {
                var json = File.ReadAllText("config.json");
                return JsonConvert.DeserializeObject<Config>(json);
            }
            var config = new Config();
            config.Save();
            throw new InvalidOperationException("configuration file created; insert token and restart.");
        }
        public static Config LoadFrom(string path)
        {
            path = Path.Combine(path, "config.json");
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                return JsonConvert.DeserializeObject<Config>(json);
            }
            else
                throw new FileNotFoundException("Config needs to be present!");
        }

        public void Save()
        {
            var json = JsonConvert.SerializeObject(this);
            File.WriteAllText("config.json", json);
        }
    }
}
