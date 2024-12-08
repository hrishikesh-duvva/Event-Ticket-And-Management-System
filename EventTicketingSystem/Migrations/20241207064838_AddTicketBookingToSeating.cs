using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventTicketingSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketBookingToSeating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_TicketBookings_TicketBookingBookingId",
                table: "Seatings");

            migrationBuilder.RenameColumn(
                name: "TicketBookingBookingId",
                table: "Seatings",
                newName: "BookingId");

            migrationBuilder.RenameIndex(
                name: "IX_Seatings_TicketBookingBookingId",
                table: "Seatings",
                newName: "IX_Seatings_BookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_TicketBookings_BookingId",
                table: "Seatings",
                column: "BookingId",
                principalTable: "TicketBookings",
                principalColumn: "BookingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_TicketBookings_BookingId",
                table: "Seatings");

            migrationBuilder.RenameColumn(
                name: "BookingId",
                table: "Seatings",
                newName: "TicketBookingBookingId");

            migrationBuilder.RenameIndex(
                name: "IX_Seatings_BookingId",
                table: "Seatings",
                newName: "IX_Seatings_TicketBookingBookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_TicketBookings_TicketBookingBookingId",
                table: "Seatings",
                column: "TicketBookingBookingId",
                principalTable: "TicketBookings",
                principalColumn: "BookingId");
        }
    }
}
