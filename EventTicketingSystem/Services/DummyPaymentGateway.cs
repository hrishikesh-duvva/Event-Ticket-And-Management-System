namespace EventTicketingSystem.Services
{
    public class DummyPaymentGateway
    {
        public async Task<bool> ProcessPayment(decimal amount, string paymentMethod)
        {
            // Simulating payment processing delay
            await Task.Delay(500);
            return true;  // Always returns success for now
        }
    }
}
