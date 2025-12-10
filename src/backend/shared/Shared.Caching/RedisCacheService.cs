using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Shared.Caching;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly DistributedCacheEntryOptions _defaultOptions;

    public RedisCacheService(IDistributedCache cache, ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
        _defaultOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
            SlidingExpiration = TimeSpan.FromMinutes(10)
        };
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        try
        {
            var cachedValue = await _cache.GetStringAsync(key);
            if (string.IsNullOrEmpty(cachedValue))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<T>(cachedValue);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting cache key: {key}");
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
    {
        try
        {
            var options = expiration.HasValue
                ? new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration }
                : _defaultOptions;

            var serializedValue = JsonConvert.SerializeObject(value);
            await _cache.SetStringAsync(key, serializedValue, options);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error setting cache key: {key}");
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _cache.RemoveAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error removing cache key: {key}");
        }
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        // Note: Redis doesn't support pattern deletion directly in IDistributedCache
        // This would require direct Redis connection for pattern matching
        _logger.LogWarning("RemoveByPatternAsync is not fully implemented with IDistributedCache");
        await Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(string key)
    {
        try
        {
            var value = await _cache.GetStringAsync(key);
            return !string.IsNullOrEmpty(value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error checking cache key existence: {key}");
            return false;
        }
    }
}


