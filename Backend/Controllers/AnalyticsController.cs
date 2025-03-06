using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserTemplate.Services;
using UserTemplate.Interfaces;

namespace UserTemplate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AnalyticsService _analyticsService;

        public AnalyticsController(AnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("product-count-by-category")]
        public async Task<IActionResult> GetProductCountByCategory()
        {
            var result = await _analyticsService.GetProductCountByCategoryAsync();
            return Ok(result);
        }

        [HttpGet("most-viewed")]
        public async Task<IActionResult> GetMostViewedProduct()
        {
            try
            {
                var productDto = await _analyticsService.GetMostViewedProductAsync();
                if (productDto == null)
                {
                    return NotFound(new { message = "No products found." });
                }
                return Ok(productDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the most viewed product.", details = ex.Message });
            }
        }

        [HttpGet("most-viewed-by-category/{categoryId}")]
        public async Task<IActionResult> GetMostViewedProductByCategory(int categoryId)
        {
            try
            {
                var productDto = await _analyticsService.GetMostViewedProductByCategoryAsync(categoryId);
                if (productDto == null)
                {
                    return NotFound(new { message = $"No products found for category ID {categoryId}." });
                }
                return Ok(productDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the most viewed product by category.", details = ex.Message });
            }
        }
    }
}