using UserTemplate.DTOs;
using UserTemplate.Models;

namespace UserTemplate.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<Category> CreateCategoryAsync(CreateCategoryDto categoryDto);
        Task<CategoryDto?> UpdateCategoryAsync(int id, CreateCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}