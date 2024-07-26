using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CompanyRequestedDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"));

            migrationBuilder.AddColumn<DateTime>(
                name: "RequestedAt",
                table: "Companies",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
                values: new object[] { new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), new DateTime(2024, 7, 25, 1, 37, 31, 395, DateTimeKind.Utc).AddTicks(8213), new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), null, null, "admin@gmail.com", new DateTime(2024, 7, 25, 1, 37, 31, 395, DateTimeKind.Utc).AddTicks(8222), new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), "First admin", "AQAAAAIAAYagAAAAECoQA/Ca2rIAZOl84O2CA56fi9uTy8GknoYgoFmJUvE7T5uy0qbTLa7Ogbi/8+vItg==", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"));

            migrationBuilder.DropColumn(
                name: "RequestedAt",
                table: "Companies");

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
                values: new object[] { new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), new DateTime(2024, 7, 23, 7, 57, 11, 943, DateTimeKind.Utc).AddTicks(7817), new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), null, null, "admin@gmail.com", new DateTime(2024, 7, 23, 7, 57, 11, 943, DateTimeKind.Utc).AddTicks(7824), new Guid("a3d10ab2-ada5-442c-87ca-6e00b9197e1d"), "First admin", "AQAAAAIAAYagAAAAECjOoEOvFduM2N32ZbLINmNRGP3rnH4P+eKojpT7Edkdiaidze5AXKCkHubwUhLiTQ==", 1 });
        }
    }
}
