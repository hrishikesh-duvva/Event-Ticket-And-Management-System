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

        public async Task<(bool success, string message)> BookTickets(int customerId, int scheduleId, int[] seatIds, int ticketTypeId, int quantity, string paymentMethod)
        {
            // Get ticket type and price
            var ticketType = await _dbContext.TicketTypes
                .Where(tt => tt.TicketTypeId == ticketTypeId)
                .FirstOrDefaultAsync();

            if (ticketType == null || ticketType.SeatAvailability < quantity)
            {
                return (false, "Not enough tickets available.");
            }

            // Calculate price considering discounts
            decimal ticketPrice = ticketType.Price;

            var activeDiscount = await _dbContext.Discounts
                .Where(d => d.EventId == ticketType.EventId && d.TicketTypeId == ticketTypeId && d.Status == DiscountStatus.Active)
                .Where(d => d.StartDate <= DateTime.Now && d.EndDate >= DateTime.Now)
                .FirstOrDefaultAsync();

            if (activeDiscount != null)
            {
                ticketPrice -= ticketPrice * (activeDiscount.DiscountPercentage / 100);
            }

            decimal totalPrice = ticketPrice * quantity;

            // Create a booking
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

            // Mark the booked seats as "Booked"
            var seats = await _dbContext.Seatings
                .Where(s => seatIds.Contains(s.SeatingId) && s.ScheduleId == scheduleId && s.AvailabilityStatus == SeatStatus.Available)
                .ToListAsync();

            if (seats.Count != quantity)
            {
                return (false, "Some of the selected seats are not available.");
            }

            foreach (var seat in seats)
            {
                seat.AvailabilityStatus = SeatStatus.Booked; // Mark the seat as booked
                seat.BookingId = booking.BookingId;
            }

            await _dbContext.SaveChangesAsync();

            // Process the payment
            var paymentResult = await _paymentService.ProcessPayment(totalPrice, paymentMethod);

            if (!paymentResult.success)
            {
                return (false, paymentResult.message);
            }

            // Create a payment record
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

            // Update booking status to "Confirmed"
            booking.Status = BookingStatus.Confirmed;
            await _dbContext.SaveChangesAsync();

            return (true, "Booking confirmed and payment processed.");
        }
    }
}
