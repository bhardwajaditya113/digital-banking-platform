using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace AuthService.API.Swagger;

public class SwaggerConfig
{
    public static void ConfigureSwaggerGen(SwaggerGenOptions options)
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Auth Service API",
            Version = "v1",
            Description = "Authentication and authorization service for the Digital Banking Platform",
            Contact = new OpenApiContact
            {
                Name = "Banking Platform Team",
                Email = "support@bankingplatform.com",
                Url = new Uri("https://bankingplatform.com/support")
            },
            License = new OpenApiLicense
            {
                Name = "Proprietary",
                Url = new Uri("https://bankingplatform.com/license")
            }
        });

        // Add JWT authentication
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

        // Include XML comments
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            options.IncludeXmlComments(xmlPath);
        }

        // Add examples
        options.SchemaFilter<ExampleSchemaFilter>();
    }
}

public class ExampleSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(AuthService.Application.DTOs.RegisterRequest))
        {
            schema.Example = new Microsoft.OpenApi.Any.OpenApiObject
            {
                ["email"] = new Microsoft.OpenApi.Any.OpenApiString("user@example.com"),
                ["password"] = new Microsoft.OpenApi.Any.OpenApiString("SecurePassword123!"),
                ["firstName"] = new Microsoft.OpenApi.Any.OpenApiString("John"),
                ["lastName"] = new Microsoft.OpenApi.Any.OpenApiString("Doe"),
                ["phoneNumber"] = new Microsoft.OpenApi.Any.OpenApiString("+1234567890")
            };
        }
    }
}


