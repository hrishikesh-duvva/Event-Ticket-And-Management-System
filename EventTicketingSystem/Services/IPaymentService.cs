namespace EventTicketingSystem.Services
{
    public interface IPaymentService
    {
        Task<(bool success, string message)> ProcessPayment(decimal amount, string paymentMethod);
    }
}
