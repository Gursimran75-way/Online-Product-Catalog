using Microsoft.EntityFrameworkCore;
using UserTemplate.Data;
using UserTemplate.DTOs;
using UserTemplate.Interfaces;

namespace UserTemplate.Services
{
    public class AnalyticsService
    {
        private readonly AppDbContext _context;

        public AnalyticsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetProductCountByCategoryAsync()
        {
            return await _context.Categories
                .Select(c => new { c.Id, c.Name, ProductCount = c.Products.Count })
                .ToListAsync<object>();
        }

        public async Task<ProductDto?> GetMostViewedProductAsync()
        {
            return await _context.Products
                .OrderByDescending(p => p.ViewCount)
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : null,
                    Image = p.Image,
                    ViewCount = p.ViewCount
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProductDto?> GetMostViewedProductByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.ViewCount)
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : null,
                    Image = p.Image,
                    ViewCount = p.ViewCount
                })
                .FirstOrDefaultAsync();
        }
    }
}