using System.Linq;
using System.Threading.Tasks;
using EventTicketingSystem.Data;
using EventTicketingSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EventTicketingSystem.Services
{
    public class TicketBookingService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IPaymentService _paymentService;

        public TicketBookingService(ApplicationDbContext dbContext, IPaymentService paymentService)
        {
            _dbContext = dbContext;
            _paymentService = paymentService;
        }

        public async Task<(bool success, string message)> BookTickets(int customerId, int scheduleId, int[] seatIds, int ticketTypeId, int quantity, string paymentMethod, int? discountId)
        {
            var ticketType = await _dbContext.TicketTypes
                .Where(tt => tt.TicketTypeId == ticketTypeId)
                .FirstOrDefaultAsync();

            if (ticketType == null || ticketType.SeatAvailability < quantity)
            {
                return (false, "Not enough tickets available.");
            }

            decimal ticketPrice = ticketType.Price;

            // Apply the discount sent from the frontend
            if (discountId.HasValue)
            {
                var discount = await _dbContext.Discounts
                    .FirstOrDefaultAsync(d => d.DiscountId == discountId);

                if (discount != null && discount.StartDate <= DateTime.Now && discount.EndDate >= DateTime.Now)
                {
                    ticketPrice -= ticketPrice * (discount.DiscountPercentage / 100);
                }
            }

            decimal totalPrice = ticketPrice * quantity;

            // Create a booking record
            var booking = new TicketBooking
            {
                CustomerId = customerId,
                ScheduleId = scheduleId,
                TicketTypeId = ticketTypeId,
                Quantity = quantity,
                TotalPrice = totalPrice,
                BookingDate = DateTime.Now,
                Status = BookingStatus.Pending
            };

            _dbContext.TicketBookings.Add(booking);
            await _dbContext.SaveChangesAsync();

            // Mark seats as booked
            var seats = await _dbContext.Seatings
                .Where(s => seatIds.Contains(s.SeatingId) && s.ScheduleId == scheduleId && s.AvailabilityStatus == SeatStatus.Available)
                .ToListAsync();

            foreach (var seat in seats)
            {
                seat.AvailabilityStatus = SeatStatus.Booked;
                seat.BookingId = booking.BookingId;
            }

            await _dbContext.SaveChangesAsync();

            // Process payment (if applicable)
            var paymentResult = await _paymentService.ProcessPayment(totalPrice, paymentMethod);

            if (!paymentResult.success)
            {
                return (false, paymentResult.message);
            }

            var payment = new Payment
            {
                BookingId = booking.BookingId,
                PaymentAmount = totalPrice,
                PaymentMethod = paymentMethod,
                PaymentStatus = PaymentStatus.Success,
                PaymentDate = DateTime.Now,
                TransactionId = Guid.NewGuid().ToString()
            };

            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();


            // Update booking status to confirmed
            booking.Status = BookingStatus.Confirmed;
            await _dbContext.SaveChangesAsync();

            return (true, "Booking confirmed and payment processed.");
        }

    }
}
