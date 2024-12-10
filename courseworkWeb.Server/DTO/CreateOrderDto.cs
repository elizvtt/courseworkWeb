public class CreateOrderDTO
{
    public required int ClientId { get; set; }
    public required string Address { get; set; }
    public required int DeliveryMethodId { get; set; }
    public required string PaymentMethod { get; set; }
    public required decimal TotalAmount { get; set; }
}
