﻿// <auto-generated />
using System;
using FunChess.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FunChess.DAL.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20231125235137_FriendshipRequestMigration")]
    partial class FriendshipRequestMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("FunChess.Core.Client.Account", b =>
                {
                    b.Property<decimal>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("decimal(20,0)");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<decimal>("Id"));

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("FunChess.Core.Client.Friendship", b =>
                {
                    b.Property<decimal>("AccountId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("FriendId")
                        .HasColumnType("decimal(20,0)");

                    b.HasKey("AccountId", "FriendId");

                    b.HasIndex("FriendId");

                    b.ToTable("Friendships");
                });

            modelBuilder.Entity("FunChess.Core.Client.FriendshipRequest", b =>
                {
                    b.Property<decimal>("AccountId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("FriendId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<byte>("RequestType")
                        .HasColumnType("tinyint");

                    b.HasKey("AccountId", "FriendId");

                    b.HasIndex("FriendId");

                    b.ToTable("FriendshipRequest");
                });

            modelBuilder.Entity("FunChess.Core.Client.Message", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Creation")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("FriendshipAccountId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("FriendshipFriendId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.HasKey("Id");

                    b.HasIndex("FriendshipAccountId", "FriendshipFriendId");

                    b.ToTable("Message");
                });

            modelBuilder.Entity("FunChess.Core.Client.Friendship", b =>
                {
                    b.HasOne("FunChess.Core.Client.Account", "Account")
                        .WithMany("Friendships")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FunChess.Core.Client.Account", "Friend")
                        .WithMany()
                        .HasForeignKey("FriendId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("Friend");
                });

            modelBuilder.Entity("FunChess.Core.Client.FriendshipRequest", b =>
                {
                    b.HasOne("FunChess.Core.Client.Account", "Account")
                        .WithMany("FriendshipRequests")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FunChess.Core.Client.Account", "Friend")
                        .WithMany()
                        .HasForeignKey("FriendId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Account");

                    b.Navigation("Friend");
                });

            modelBuilder.Entity("FunChess.Core.Client.Message", b =>
                {
                    b.HasOne("FunChess.Core.Client.Friendship", "Friendship")
                        .WithMany("Messages")
                        .HasForeignKey("FriendshipAccountId", "FriendshipFriendId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Friendship");
                });

            modelBuilder.Entity("FunChess.Core.Client.Account", b =>
                {
                    b.Navigation("FriendshipRequests");

                    b.Navigation("Friendships");
                });

            modelBuilder.Entity("FunChess.Core.Client.Friendship", b =>
                {
                    b.Navigation("Messages");
                });
#pragma warning restore 612, 618
        }
    }
}
