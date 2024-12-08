namespace EventTicketingSystem.Helpers
{
    public static class RoleConstants
    {
        public const string Admin = "Admin";
        public const string EventOrganizer = "EventOrganizer";
        public const string Customer = "Customer";
        public const string SupportAgent = "SupportAgent";

        public static readonly string[] AllRoles = { Admin, EventOrganizer, Customer, SupportAgent };
    }
}
