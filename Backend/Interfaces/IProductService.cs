using UserTemplate.DTOs;
using UserTemplate.Models;


namespace UserTemplate.Interfaces
{
    public interface IProductService
    {

        Task<ProductDto> GetProductByIdAsync(int id);
        Task<List<ProductDto>> GetAllProductsAsync();
        Task<ProductDto> CreateProductAsync(Product product);
        Task<ProductDto> UpdateProductAsync(int id, CreateProductDto productDto);
        Task<bool> DeleteProductAsync(int id);
    }
}