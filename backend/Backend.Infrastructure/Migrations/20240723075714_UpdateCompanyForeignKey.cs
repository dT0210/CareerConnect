using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCompanyForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DeleteData(
            //     table: "Admins",
            //     keyColumn: "Id",
            //     keyValue: new Guid("3f874498-6ba1-446b-82b3-df648e4139bd"));

            migrationBuilder.AddColumn<Guid>(
                name: "RecruiterId",
                table: "Companies",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // migrationBuilder.InsertData(
            //     table: "Admins",
            //     columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
            //     values: new object[] { new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), new DateTime(2024, 7, 23, 7, 57, 11, 943, DateTimeKind.Utc).AddTicks(7817), new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), null, null, "admin@gmail.com", new DateTime(2024, 7, 23, 7, 57, 11, 943, DateTimeKind.Utc).AddTicks(7824), new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), "First admin", "AQAAAAIAAYagAAAAECjOoEOvFduM2N32ZbLINmNRGP3rnH4P+eKojpT7Edkdiaidze5AXKCkHubwUhLiTQ==", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DeleteData(
            //     table: "Admins",
            //     keyColumn: "Id",
            //     keyValue: new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"));

            migrationBuilder.DropColumn(
                name: "RecruiterId",
                table: "Companies");

            // migrationBuilder.InsertData(
            //     table: "Admins",
            //     columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
            //     values: new object[] { new Guid("3f874498-6ba1-446b-82b3-df648e4139bd"), new DateTime(2024, 7, 20, 4, 59, 23, 326, DateTimeKind.Utc).AddTicks(6444), new Guid("3f874498-6ba1-446b-82b3-df648e4139bd"), null, null, "admin@gmail.com", new DateTime(2024, 7, 20, 4, 59, 23, 326, DateTimeKind.Utc).AddTicks(6449), new Guid("3f874498-6ba1-446b-82b3-df648e4139bd"), "First admin", "AQAAAAIAAYagAAAAEADOAPC7v5QgjRM5W/vRK9d++kCtXxDhudh9tpZZoEN7I6IxpcgoBwl1Y6Y6OYBCMw==", 1 });
        }
    }
}
