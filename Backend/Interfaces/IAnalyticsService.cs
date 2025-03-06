using UserTemplate.DTOs;

namespace UserTemplate.Interfaces
{
    public interface IAnalyticsService
    {
        Task<List<object>> GetProductCountByCategoryAsync();
        Task<ProductDto?> GetMostViewedProductAsync();
        Task<ProductDto?> GetMostViewedProductByCategoryAsync(int categoryId);
    }
}