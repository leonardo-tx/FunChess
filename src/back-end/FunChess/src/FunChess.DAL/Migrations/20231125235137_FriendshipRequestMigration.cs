using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FunChess.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FriendshipRequestMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friendship_Accounts_AccountId",
                table: "Friendship");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendship_Accounts_FriendId",
                table: "Friendship");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Friendship_FriendshipAccountId_FriendshipFriendId",
                table: "Message");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Friendship",
                table: "Friendship");

            migrationBuilder.RenameTable(
                name: "Friendship",
                newName: "Friendships");

            migrationBuilder.RenameIndex(
                name: "IX_Friendship_FriendId",
                table: "Friendships",
                newName: "IX_Friendships_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Friendships",
                table: "Friendships",
                columns: new[] { "AccountId", "FriendId" });

            migrationBuilder.CreateTable(
                name: "FriendshipRequest",
                columns: table => new
                {
                    AccountId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    FriendId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    RequestType = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendshipRequest", x => new { x.AccountId, x.FriendId });
                    table.ForeignKey(
                        name: "FK_FriendshipRequest_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FriendshipRequest_Accounts_FriendId",
                        column: x => x.FriendId,
                        principalTable: "Accounts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FriendshipRequest_FriendId",
                table: "FriendshipRequest",
                column: "FriendId");

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Accounts_AccountId",
                table: "Friendships",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friendships_Accounts_FriendId",
                table: "Friendships",
                column: "FriendId",
                principalTable: "Accounts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Message",
                columns: new[] { "FriendshipAccountId", "FriendshipFriendId" },
                principalTable: "Friendships",
                principalColumns: new[] { "AccountId", "FriendId" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Accounts_AccountId",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Friendships_Accounts_FriendId",
                table: "Friendships");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Message");

            migrationBuilder.DropTable(
                name: "FriendshipRequest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Friendships",
                table: "Friendships");

            migrationBuilder.RenameTable(
                name: "Friendships",
                newName: "Friendship");

            migrationBuilder.RenameIndex(
                name: "IX_Friendships_FriendId",
                table: "Friendship",
                newName: "IX_Friendship_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Friendship",
                table: "Friendship",
                columns: new[] { "AccountId", "FriendId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Friendship_Accounts_AccountId",
                table: "Friendship",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friendship_Accounts_FriendId",
                table: "Friendship",
                column: "FriendId",
                principalTable: "Accounts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Friendship_FriendshipAccountId_FriendshipFriendId",
                table: "Message",
                columns: new[] { "FriendshipAccountId", "FriendshipFriendId" },
                principalTable: "Friendship",
                principalColumns: new[] { "AccountId", "FriendId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
