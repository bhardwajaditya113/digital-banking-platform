using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Shared.Messaging;

public class KafkaProducer : IDisposable
{
    private readonly IProducer<string, string> _producer;
    private readonly ILogger<KafkaProducer> _logger;

    public KafkaProducer(IConfiguration configuration, ILogger<KafkaProducer> logger)
    {
        _logger = logger;
        var config = new ProducerConfig
        {
            BootstrapServers = configuration["KafkaSettings:BootstrapServers"] ?? "localhost:9092",
            Acks = Acks.All,
            EnableIdempotence = true
        };

        _producer = new ProducerBuilder<string, string>(config)
            .SetKeySerializer(Serializers.Utf8)
            .SetValueSerializer(Serializers.Utf8)
            .Build();
    }

    public async Task<bool> PublishAsync<T>(string topic, T message, string? key = null)
    {
        try
        {
            var messageJson = JsonConvert.SerializeObject(message);
            var kafkaMessage = new Message<string, string>
            {
                Key = key ?? Guid.NewGuid().ToString(),
                Value = messageJson
            };

            var result = await _producer.ProduceAsync(topic, kafkaMessage);
            _logger.LogInformation($"Message published to topic {topic}, partition {result.Partition}, offset {result.Offset}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error publishing message to topic {topic}");
            return false;
        }
    }

    public void Dispose()
    {
        _producer?.Dispose();
    }
}

