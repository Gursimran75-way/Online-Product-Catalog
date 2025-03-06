using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using UserTemplate.DTOs;
using UserTemplate.Models;
using UserTemplate.Services;
using UserTemplate.Interfaces;

namespace UserTemplate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching products.", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            try
            {
                var productDto = await _productService.GetProductByIdAsync(id);
                if (productDto == null)
                {
                    return NotFound();
                }
                return Ok(productDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the product.", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                CategoryId = productDto.CategoryId,
                Image = productDto.Image,
                ViewCount = productDto.ViewCount
            };

            try
            {
                var createdProductDto = await _productService.CreateProductAsync(product);
                return CreatedAtAction(nameof(GetProduct), new { id = createdProductDto.Id }, createdProductDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedProductDto = await _productService.UpdateProductAsync(id, productDto);
                if (updatedProductDto == null)
                {
                    return NotFound();
                }
                return Ok(updatedProductDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the product.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportProducts(IFormFile file)
        {
            if (file == null || !file.FileName.EndsWith(".xlsx"))
                return BadRequest("Invalid file format. Please upload an .xlsx file.");

            using var stream = file.OpenReadStream();
            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];

            for (int row = 2; row <= worksheet.Dimension.Rows; row++)
            {
                var product = new Product
                {
                    Name = worksheet.Cells[row, 1].Value?.ToString(),
                    Price = Convert.ToDecimal(worksheet.Cells[row, 2].Value),
                    CategoryId = Convert.ToInt32(worksheet.Cells[row, 3].Value),
                    Image = worksheet.Cells[row, 4].Value?.ToString(),
                    ViewCount = 0
                };
                await _productService.CreateProductAsync(product);
            }

            return Ok("Products imported successfully.");
        }
    }
}