using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FunChess.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FixMessageTableNameMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Message");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Message",
                table: "Message");

            migrationBuilder.RenameTable(
                name: "Message",
                newName: "Messages");

            migrationBuilder.RenameIndex(
                name: "IX_Message_FriendshipAccountId_FriendshipFriendId",
                table: "Messages",
                newName: "IX_Messages_FriendshipAccountId_FriendshipFriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Messages",
                columns: new[] { "FriendshipAccountId", "FriendshipFriendId" },
                principalTable: "Friendships",
                principalColumns: new[] { "AccountId", "FriendId" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "Message");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_FriendshipAccountId_FriendshipFriendId",
                table: "Message",
                newName: "IX_Message_FriendshipAccountId_FriendshipFriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Message",
                table: "Message",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Friendships_FriendshipAccountId_FriendshipFriendId",
                table: "Message",
                columns: new[] { "FriendshipAccountId", "FriendshipFriendId" },
                principalTable: "Friendships",
                principalColumns: new[] { "AccountId", "FriendId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
