using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MySql.EntityFrameworkCore.Extensions;
using NewsLetterAPI.Auth;
using NewsLetterAPI.Entities;
using NewsLetterAPI.Models;
using NewsLetterAPI.Services;
using System.Configuration;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
            policy => 
            {
                policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
            }

        );
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}/";
    options.Audience = builder.Configuration["Auth0:Audience"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier
    };
});

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";

builder.Services
      .AddAuthorization(options =>
      {
          options.AddPolicy(
            "read:messages",
            policy => policy.Requirements.Add(
              new HasScopeRequirement("read:messages", domain)
            )
          );
      });

builder.Services.Configure<MailSettings>(options =>
    {
        options.Mail =  builder.Configuration["MailSettings:Mail"];
        options.DisplayName = builder.Configuration["MailSettings:DisplayName"];
        options.Port = Int32.Parse( builder.Configuration["MailSettings:Port"]);
        options.Host = builder.Configuration["MailSettings:Host"];
        options.Password = builder.Configuration["MailSettings:Password"];
    }
);
builder.Services.AddTransient<IMailService, MailService>();


builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string? connstr = builder.Configuration.GetConnectionString("DefaultConnection");

try
{
    builder.Services.AddEntityFrameworkMySQL().AddDbContext<NewsletterMsqlContext>(options => { options.UseMySQL(connstr); });
} catch (Exception e)
{ 
    
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();


app.UseAuthorization();

app.MapControllers();

app.Run();
