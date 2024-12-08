using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventTicketingSystem.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEventIdFromSeating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings");

            migrationBuilder.DropIndex(
                name: "IX_Seatings_EventId",
                table: "Seatings");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Seatings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Seatings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Seatings_EventId",
                table: "Seatings",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
