using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FunChess.DAL.Migrations
{
    /// <inheritdoc />
    public partial class MessagesMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Message",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    Creation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FriendshipAccountId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    FriendshipFriendId = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Message_Friendship_FriendshipAccountId_FriendshipFriendId",
                        columns: x => new { x.FriendshipAccountId, x.FriendshipFriendId },
                        principalTable: "Friendship",
                        principalColumns: new[] { "AccountId", "FriendId" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Message_FriendshipAccountId_FriendshipFriendId",
                table: "Message",
                columns: new[] { "FriendshipAccountId", "FriendshipFriendId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Message");
        }
    }
}
