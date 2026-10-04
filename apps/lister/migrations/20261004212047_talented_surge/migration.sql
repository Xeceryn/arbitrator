CREATE TABLE "opportunity" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "opportunity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cmcId" integer NOT NULL,
	"exchangeBuyId" integer NOT NULL,
	"exchangeSellId" integer NOT NULL,
	"buyPrice" double precision NOT NULL,
	"sellPrice" double precision NOT NULL,
	"buyVolume" double precision NOT NULL,
	"sellVolume" double precision NOT NULL,
	"profitPercentage" double precision GENERATED ALWAYS AS (
      COALESCE(
        ("opportunity"."sellPrice" - "opportunity"."buyPrice")
        / NULLIF("opportunity"."buyPrice", 0),
        0
      )
    ) STORED,
	"profitVolume" double precision GENERATED ALWAYS AS (
      LEAST("opportunity"."buyVolume", "opportunity"."sellVolume")
      * COALESCE(
        ("opportunity"."sellPrice" - "opportunity"."buyPrice")
        / NULLIF("opportunity"."buyPrice", 0),
        0
      )
    ) STORED
);
