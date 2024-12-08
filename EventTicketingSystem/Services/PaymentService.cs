using System.Threading.Tasks;

namespace EventTicketingSystem.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly DummyPaymentGateway _paymentGateway;

        public PaymentService(DummyPaymentGateway paymentGateway)
        {
            _paymentGateway = paymentGateway;
        }

        public async Task<(bool success, string message)> ProcessPayment(decimal amount, string paymentMethod)
        {
            bool paymentSuccessful = await _paymentGateway.ProcessPayment(amount, paymentMethod);

            if (paymentSuccessful)
            {
                return (true, "Payment Success");
            }
            else
            {
                return (false, "Payment Failed");
            }
        }
    }
}
