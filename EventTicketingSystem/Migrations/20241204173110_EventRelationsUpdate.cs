using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventTicketingSystem.Migrations
{
    /// <inheritdoc />
    public partial class EventRelationsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Events_EventId",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings");

            migrationBuilder.DropIndex(
                name: "IX_Events_OrganizerId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "GeneralRows",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "VIPRows",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "TicketTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "Seatings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GeneralRows",
                table: "Schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VIPRows",
                table: "Schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "EventImage",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "Discounts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TicketTypeId",
                table: "Discounts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_ScheduleId",
                table: "TicketTypes",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Seatings_ScheduleId",
                table: "Seatings",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Discounts_ScheduleId",
                table: "Discounts",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Discounts_TicketTypeId",
                table: "Discounts",
                column: "TicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_Schedules_ScheduleId",
                table: "Discounts",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "ScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_TicketTypes_TicketTypeId",
                table: "Discounts",
                column: "TicketTypeId",
                principalTable: "TicketTypes",
                principalColumn: "TicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Events_EventId",
                table: "Schedules",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_Schedules_ScheduleId",
                table: "Seatings",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketTypes_Schedules_ScheduleId",
                table: "TicketTypes",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_Schedules_ScheduleId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_TicketTypes_TicketTypeId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Events_EventId",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings");

            migrationBuilder.DropForeignKey(
                name: "FK_Seatings_Schedules_ScheduleId",
                table: "Seatings");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketTypes_Schedules_ScheduleId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_TicketTypes_ScheduleId",
                table: "TicketTypes");

            migrationBuilder.DropIndex(
                name: "IX_Seatings_ScheduleId",
                table: "Seatings");

            migrationBuilder.DropIndex(
                name: "IX_Discounts_ScheduleId",
                table: "Discounts");

            migrationBuilder.DropIndex(
                name: "IX_Discounts_TicketTypeId",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "TicketTypes");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "Seatings");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "GeneralRows",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "VIPRows",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "EventImage",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "TicketTypeId",
                table: "Discounts");

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GeneralRows",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VIPRows",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Events_OrganizerId",
                table: "Events",
                column: "OrganizerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_OrganizerId",
                table: "Events",
                column: "OrganizerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Events_EventId",
                table: "Schedules",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Seatings_Events_EventId",
                table: "Seatings",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
