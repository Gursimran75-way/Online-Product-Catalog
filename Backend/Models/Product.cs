namespace UserTemplate.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Image { get; set; } // URL or base64 string
        public int ViewCount { get; set; } = 0;
    }
}