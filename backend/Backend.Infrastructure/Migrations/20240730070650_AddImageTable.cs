using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImageTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DeleteData(
            //     table: "Admins",
            //     keyColumn: "Id",
            //     keyValue: new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"));

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileExtension = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSizeInBytes = table.Column<long>(type: "bigint", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                });

            // migrationBuilder.InsertData(
            //     table: "Admins",
            //     columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
            //     values: new object[] { new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), new DateTime(2024, 7, 30, 14, 6, 48, 418, DateTimeKind.Local).AddTicks(5485), new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), null, null, "admin@gmail.com", new DateTime(2024, 7, 30, 14, 6, 48, 418, DateTimeKind.Local).AddTicks(5509), new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"), "First admin", "AQAAAAIAAYagAAAAEKkv/1Q+YY5HXJ8iOhC/IqdxxnfKU+55yFxixGJPjrzBctxjE3q/GgUbvKs9sFn48g==", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DeleteData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: new Guid("341a96f6-9024-4cf9-810c-bf403cbfeed6"));

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "Email", "ModifiedAt", "ModifiedBy", "Name", "PasswordHash", "Role" },
                values: new object[] { new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), new DateTime(2024, 7, 25, 1, 37, 31, 395, DateTimeKind.Utc).AddTicks(8213), new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), null, null, "admin@gmail.com", new DateTime(2024, 7, 25, 1, 37, 31, 395, DateTimeKind.Utc).AddTicks(8222), new Guid("b4bd61fa-d03b-41cb-99b9-972784e20a01"), "First admin", "AQAAAAIAAYagAAAAECoQA/Ca2rIAZOl84O2CA56fi9uTy8GknoYgoFmJUvE7T5uy0qbTLa7Ogbi/8+vItg==", 1 });
        }
    }
}
