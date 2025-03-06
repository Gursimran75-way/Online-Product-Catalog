using Microsoft.EntityFrameworkCore;
using UserTemplate.Data;
using UserTemplate.DTOs;
using UserTemplate.Models;
using UserTemplate.Interfaces;

namespace UserTemplate.Services
{
    public class CategoryService: ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryDto>> GetCategoriesAsync()
        {
            return await _context.Categories
                .Include(c => c.Products)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Products = c.Products.Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        CategoryId = p.CategoryId,
                        CategoryName = c.Name,
                        Image = p.Image,
                        ViewCount = p.ViewCount
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<Category> CreateCategoryAsync(CreateCategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Products = new List<Product>() // Explicitly initialize as empty
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<CategoryDto?> UpdateCategoryAsync(int id, CreateCategoryDto categoryDto)
        {
            var existingCategory = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.Name = categoryDto.Name;
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = existingCategory.Id,
                Name = existingCategory.Name,
                Products = existingCategory.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    CategoryName = existingCategory.Name,
                    Image = p.Image,
                    ViewCount = p.ViewCount
                }).ToList()
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}