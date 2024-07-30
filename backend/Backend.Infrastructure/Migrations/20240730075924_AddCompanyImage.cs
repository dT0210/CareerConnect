using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"));

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Companies");

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
                values: new object[] { new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), new DateTime(2024, 7, 30, 14, 6, 48, 418, DateTimeKind.Local).AddTicks(5485), new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), null, null, "admin@gmail.com", new DateTime(2024, 7, 30, 14, 6, 48, 418, DateTimeKind.Local).AddTicks(5509), new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), "First admin", "AQAAAAIAAYagAAAAEKkv/1Q+YY5HXJ8iOhC/IqdxxnfKU+55yFxixGJPjrzBctxjE3q/GgUbvKs9sFn48g==", 1 });
        }
    }
}
