using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Shared.Messaging;

public abstract class KafkaConsumer<T> : BackgroundService
{
    private readonly IConsumer<string, string> _consumer;
    private readonly ILogger<KafkaConsumer<T>> _logger;
    protected readonly string Topic;

    protected KafkaConsumer(IConfiguration configuration, ILogger<KafkaConsumer<T>> logger, string topic, string groupId)
    {
        _logger = logger;
        Topic = topic;

        var config = new ConsumerConfig
        {
            BootstrapServers = configuration["KafkaSettings:BootstrapServers"] ?? "localhost:9092",
            GroupId = groupId,
            AutoOffsetReset = AutoOffsetReset.Earliest,
            EnableAutoCommit = false
        };

        _consumer = new ConsumerBuilder<string, string>(config)
            .SetKeyDeserializer(Deserializers.Utf8)
            .SetValueDeserializer(Deserializers.Utf8)
            .Build();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _consumer.Subscribe(Topic);
        _logger.LogInformation($"Subscribed to topic: {Topic}");

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var result = _consumer.Consume(stoppingToken);
                    if (result?.Message?.Value != null)
                    {
                        var message = JsonConvert.DeserializeObject<T>(result.Message.Value);
                        if (message != null)
                        {
                            await ProcessMessageAsync(message, stoppingToken);
                            _consumer.Commit(result);
                        }
                    }
                }
                catch (ConsumeException ex)
                {
                    _logger.LogError(ex, $"Error consuming message from topic {Topic}");
                }
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Consumer stopped");
        }
        finally
        {
            _consumer.Close();
        }
    }

    protected abstract Task ProcessMessageAsync(T message, CancellationToken cancellationToken);
}


