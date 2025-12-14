using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Serilog;
using Shared.Messaging;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Notification Service API", Version = "v1" });
});

var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB");

// Handle masked connection strings from environment/config
if (string.IsNullOrWhiteSpace(mongoConnectionString) || 
    mongoConnectionString.Contains("<hidden>") || 
    mongoConnectionString.Contains("hidden"))
{
    mongoConnectionString = "mongodb://banking_admin:Banking@123!@127.0.0.1:27017/banking_documents?authSource=admin";
    Log.Warning("Using fallback MongoDB connection string");
}
else
{
    Log.Information($"Using MongoDB connection string from configuration");
}

Log.Information($"MongoDB connection string configured (length: {mongoConnectionString?.Length ?? 0})");
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoConnectionString));

builder.Services.AddScoped<KafkaProducer>();

// Register Kafka consumer for notifications
builder.Services.AddHostedService<NotificationConsumer>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();

Log.Information("Notification Service started on port 5004");

// Configure URLs - use environment variable or default
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (string.IsNullOrEmpty(urls))
{
    // Default to localhost for local dev, Docker will override with ASPNETCORE_URLS
app.Urls.Clear();
    app.Urls.Add("http://0.0.0.0:5004");
}

app.Run();

// Notification Consumer
public class NotificationConsumer : KafkaConsumer<NotificationEvent>
{
    private readonly IMongoClient _mongoClient;
    private readonly ILogger<NotificationConsumer> _logger;

    public NotificationConsumer(
        IConfiguration configuration,
        ILogger<NotificationConsumer> logger,
        IMongoClient mongoClient) 
        : base(configuration, logger, "user-registered", "notification-service-group")
    {
        _mongoClient = mongoClient;
        _logger = logger;
    }

    protected override async Task ProcessMessageAsync(NotificationEvent message, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Processing notification: {message.EventType} for user {message.UserId}");

        var database = _mongoClient.GetDatabase("banking_documents");
        var collection = database.GetCollection<NotificationDocument>("notifications");

        var notification = new NotificationDocument
        {
            Id = Guid.NewGuid(),
            UserId = message.UserId,
            EventType = message.EventType,
            Message = message.Message,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        await collection.InsertOneAsync(notification, cancellationToken: cancellationToken);
        _logger.LogInformation($"Notification saved: {notification.Id}");
    }
}

public class NotificationEvent
{
    public Guid UserId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class NotificationDocument
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

