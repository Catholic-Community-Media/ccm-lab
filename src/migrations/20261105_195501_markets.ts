import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_markets_items_key" AS ENUM('br', 'nola');
  CREATE TABLE "markets_items_frequencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "markets_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_markets_items_key" NOT NULL,
  	"name" varchar NOT NULL,
  	"stream_url" varchar NOT NULL,
  	"metadata_url" varchar,
  	"backup_player_url" varchar NOT NULL,
  	"pledge_phone" varchar
  );
  
  CREATE TABLE "markets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "markets_items_frequencies" ADD CONSTRAINT "markets_items_frequencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."markets_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "markets_items" ADD CONSTRAINT "markets_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "markets_items_frequencies_order_idx" ON "markets_items_frequencies" USING btree ("_order");
  CREATE INDEX "markets_items_frequencies_parent_id_idx" ON "markets_items_frequencies" USING btree ("_parent_id");
  CREATE INDEX "markets_items_order_idx" ON "markets_items" USING btree ("_order");
  CREATE INDEX "markets_items_parent_id_idx" ON "markets_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "markets_items_frequencies" CASCADE;
  DROP TABLE "markets_items" CASCADE;
  DROP TABLE "markets" CASCADE;
  DROP TYPE "public"."enum_markets_items_key";`)
}
