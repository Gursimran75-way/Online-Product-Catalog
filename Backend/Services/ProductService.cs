using Microsoft.EntityFrameworkCore;
using UserTemplate.Data;
using UserTemplate.DTOs;
using UserTemplate.Models;
using UserTemplate.Interfaces;

namespace UserTemplate.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category) // Load Category for mapping
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return null; // Or throw an exception, depending on your preference
            }

            // Increment ViewCount
            product.ViewCount++;
            await _context.SaveChangesAsync();

            // Map to DTO
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                CategoryId = product.CategoryId,
                CategoryName = product.Category != null ? product.Category.Name : null,
                Image = product.Image,
                ViewCount = product.ViewCount
            };
        }

        public async Task<List<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category) // Load Category for mapping
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
                .ToListAsync();

            return products;
        }

        public async Task<ProductDto> CreateProductAsync(Product product)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == product.CategoryId);
            if (!categoryExists)
            {
                throw new ArgumentException($"Category with ID {product.CategoryId} does not exist.");
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Map to DTO
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                CategoryId = product.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(product.CategoryId))?.Name,
                Image = product.Image,
                ViewCount = product.ViewCount
            };
        }

        public async Task<ProductDto> UpdateProductAsync(int id, CreateProductDto productDto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return null; // Or throw an exception, depending on your preference
            }

            // Validate CategoryId exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId);
            if (!categoryExists)
            {
                throw new ArgumentException($"Category with ID {productDto.CategoryId} does not exist.");
            }

            // Update fields
            existingProduct.Name = productDto.Name;
            existingProduct.Price = productDto.Price;
            existingProduct.CategoryId = productDto.CategoryId;
            existingProduct.Image = productDto.Image;
            existingProduct.ViewCount = productDto.ViewCount; // Optional: typically not updated here

            await _context.SaveChangesAsync();

            // Map to DTO
            return new ProductDto
            {
                Id = existingProduct.Id,
                Name = existingProduct.Name,
                Price = existingProduct.Price,
                CategoryId = existingProduct.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(existingProduct.CategoryId))?.Name,
                Image = existingProduct.Image,
                ViewCount = existingProduct.ViewCount
            };
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}