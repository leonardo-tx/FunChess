using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FunChess.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FriendshipFixMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FriendshipRequest_Accounts_AccountId",
                table: "FriendshipRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendshipRequest_Accounts_FriendId",
                table: "FriendshipRequest");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendshipRequest",
                table: "FriendshipRequest");

            migrationBuilder.RenameTable(
                name: "FriendshipRequest",
                newName: "FriendshipRequests");

            migrationBuilder.RenameIndex(
                name: "IX_FriendshipRequest_FriendId",
                table: "FriendshipRequests",
                newName: "IX_FriendshipRequests_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendshipRequests",
                table: "FriendshipRequests",
                columns: new[] { "AccountId", "FriendId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FriendshipRequests_Accounts_AccountId",
                table: "FriendshipRequests",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendshipRequests_Accounts_FriendId",
                table: "FriendshipRequests",
                column: "FriendId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FriendshipRequests_Accounts_AccountId",
                table: "FriendshipRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendshipRequests_Accounts_FriendId",
                table: "FriendshipRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendshipRequests",
                table: "FriendshipRequests");

            migrationBuilder.RenameTable(
                name: "FriendshipRequests",
                newName: "FriendshipRequest");

            migrationBuilder.RenameIndex(
                name: "IX_FriendshipRequests_FriendId",
                table: "FriendshipRequest",
                newName: "IX_FriendshipRequest_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendshipRequest",
                table: "FriendshipRequest",
                columns: new[] { "AccountId", "FriendId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FriendshipRequest_Accounts_AccountId",
                table: "FriendshipRequest",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendshipRequest_Accounts_FriendId",
                table: "FriendshipRequest",
                column: "FriendId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }
    }
}
