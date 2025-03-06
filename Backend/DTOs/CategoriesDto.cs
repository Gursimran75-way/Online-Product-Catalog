namespace UserTemplate.DTOs
{
    public class CreateCategoryDto
    {
        public required string Name { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
    }
}