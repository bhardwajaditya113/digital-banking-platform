using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Shared.Kernel.Middleware;

public class RequestValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestValidationMiddleware> _logger;

    public RequestValidationMiddleware(RequestDelegate next, ILogger<RequestValidationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip validation for health checks and static files
        if (context.Request.Path.StartsWithSegments("/health") ||
            context.Request.Path.StartsWithSegments("/swagger"))
        {
            await _next(context);
            return;
        }

        // Validate request size
        if (context.Request.ContentLength > 10_485_760) // 10MB
        {
            context.Response.StatusCode = 413; // Payload Too Large
            await context.Response.WriteAsync("Request payload too large");
            return;
        }

        // Validate content type for POST/PUT/PATCH
        if (context.Request.Method == "POST" || 
            context.Request.Method == "PUT" || 
            context.Request.Method == "PATCH")
        {
            var contentType = context.Request.ContentType;
            if (!string.IsNullOrEmpty(contentType) && 
                !contentType.Contains("application/json") && 
                !contentType.Contains("application/x-www-form-urlencoded"))
            {
                context.Response.StatusCode = 415; // Unsupported Media Type
                await context.Response.WriteAsync("Unsupported content type");
                return;
            }
        }

        await _next(context);
    }
}


