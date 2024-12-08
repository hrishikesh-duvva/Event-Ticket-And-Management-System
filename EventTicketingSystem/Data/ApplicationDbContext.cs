using Microsoft.EntityFrameworkCore;
using EventTicketingSystem.Models;
using System.Reflection.Emit;
using System.Composition;

namespace EventTicketingSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<TicketBooking> TicketBookings { get; set; }
        public DbSet<TicketBookingRequest> TicketBookingRequest { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        //public DbSet<Notification> Notifications { get; set; }
        public DbSet<Seating> Seatings { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        //public DbSet<Report> Reports { get; set; }

        public DbSet<SupportTicket> SupportTickets { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Event -> Schedule relationship
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Event)  // Each Schedule belongs to one Event
                .WithMany(e => e.Schedules)  // An Event has many Schedules
                .HasForeignKey(s => s.EventId)
                .OnDelete(DeleteBehavior.Restrict);  // Use Restrict or SetNull for delete behavior

            // Schedule -> Seating relationship
            modelBuilder.Entity<Seating>()
                .HasOne(s => s.Schedule)  // Each Seating belongs to one Schedule
                .WithMany(sch => sch.Seating)  // A Schedule has many Seatings
                .HasForeignKey(s => s.ScheduleId)
                .OnDelete(DeleteBehavior.Restrict);  // Use Restrict or SetNull for delete behavior

            // Seating -> TicketType relationship
            modelBuilder.Entity<Seating>()
                .HasOne(s => s.TicketType)  // Each Seating belongs to one TicketType
                .WithMany()
                .HasForeignKey(s => s.TicketTypeId)
                .OnDelete(DeleteBehavior.Restrict);  // Use Restrict or SetNull for delete behavior

            // Discount-TicketType Foreign Key
            modelBuilder.Entity<Discount>()
                .HasOne(d => d.TicketType)
                .WithMany()
                .HasForeignKey(d => d.TicketTypeId)
                .OnDelete(DeleteBehavior.NoAction);  // or DeleteBehavior.SetNull depending on your needs

            // Discount-Schedule Foreign Key
            modelBuilder.Entity<Discount>()
                .HasOne(d => d.Schedule)
                .WithMany()
                .HasForeignKey(d => d.ScheduleId)
                .OnDelete(DeleteBehavior.NoAction);  // or DeleteBehavior.SetNull depending on your needs

            modelBuilder.Entity<TicketBooking>()
                .HasOne(t => t.Schedule)
                .WithMany()
                .HasForeignKey(t => t.ScheduleId)
                .OnDelete(DeleteBehavior.NoAction); // Specify NoAction

            modelBuilder.Entity<TicketBooking>()
                .HasOne(t => t.TicketType)
                .WithMany()
                .HasForeignKey(t => t.TicketTypeId)
                .OnDelete(DeleteBehavior.NoAction); // Specify NoAction

            modelBuilder.Entity<TicketBooking>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TicketBookingRequest>().HasNoKey();

            modelBuilder.Entity<Seating>()
               .HasOne(s => s.TicketBooking)
               .WithMany(b => b.BookedSeats)
               .HasForeignKey(s => s.BookingId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SupportTicket>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Issue).IsRequired();
                entity.Property(e => e.Status).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

        }




    }
}

