using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

namespace Shared.Logging;

public static class LoggingExtensions
{
    public static void ConfigureLogging(this WebApplicationBuilder builder, string serviceName)
    {
        var logLevel = builder.Configuration["Logging:LogLevel:Default"] ?? "Information";
        var logLevelEnum = Enum.Parse<LogEventLevel>(logLevel);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Is(logLevelEnum)
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Service", serviceName)
            .Enrich.WithProperty("Environment", builder.Environment.EnvironmentName)
            .Enrich.WithMachineName()
            .Enrich.WithThreadId()
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Service} {Message:lj}{NewLine}{Exception}"
            )
            .WriteTo.File(
                path: $"logs/{serviceName}-.log",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 30,
                formatter: new CompactJsonFormatter()
            )
            .WriteTo.Seq(
                serverUrl: builder.Configuration["Logging:Seq:ServerUrl"] ?? "http://localhost:5341"
            )
            .CreateLogger();

        builder.Host.UseSerilog();
    }
}


