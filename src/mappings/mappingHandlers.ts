import assert from "assert";
import { CosmosEvent } from "@subql/types-cosmos";
import { Bet, DailyAggregation } from "../types";

async function updateDailyAggregation(
  date: Date,
  type: "BULL" | "BEAR",
  size: bigint
): Promise<void> {
  const id = date.toISOString().slice(0, 10);
  let aggregation = await DailyAggregation.get(id);
  if (!aggregation) {
    aggregation = DailyAggregation.create({
      id,
      bullBets: BigInt(0),
      bearBets: BigInt(0),
      bullBetSize: BigInt(0),
      bearBetSize: BigInt(0),
      totalSize: BigInt(0),
    });
  }

  if (type == "BULL") {
    aggregation.bullBets++;
    aggregation.bullBetSize += size;
    aggregation.totalSize += size;
  }
  if (type == "BEAR") {
    aggregation.bearBets++;
    aggregation.bearBetSize += size;
    aggregation.totalSize += size;
  }

  await aggregation.save();
}

export async function handleBet(event: CosmosEvent): Promise<void> {
  // We create a new entity using the transaction hash and message index as a unique ID
  logger.info(`New bet at block ${event.block.block.header.height}`);

  // Getting all the info from the event attributes
  const newBetType = event.event.attributes.find((a)=> a.key === "direction")?.value;
  const newAddress= event.event.attributes.find((a)=> a.key === "account")?.value;
  const newBetSize = event.event.attributes.find((a)=> a.key === "amount")?.value;

  assert(newBetType, "bet type not found");
  assert(newAddress, "bettor address not found");
  assert(newBetSize, "bet size not found");


  logger.info("bet type: " + newBetType);
  logger.info("bettor address: " + newAddress);


  if (newBetType === "bull") {
    const newBet = await Bet.create({
      id: event.tx.hash,
      blockHeight: BigInt(event.block.header.height),
      timestamp: new Date(event.block.header.time.toISOString()),
      betType: newBetType,
      bettorAddress: newAddress,
      betSize: BigInt(newBetSize),
    });

    newBet.save();

    await updateDailyAggregation(newBet.timestamp, "BULL", newBet.betSize);
  }


  if (newBetType === "bear") {
    const newBet = Bet.create({
      id: event.tx.hash,
      blockHeight: BigInt(event.block.header.height),
      timestamp: new Date(event.block.header.time.toISOString()),
      betType: newBetType,
      bettorAddress: newAddress,
      betSize: BigInt(newBetSize),
    });

    newBet.save();

    await updateDailyAggregation(newBet.timestamp, "BEAR", newBet.betSize);
  }
}

/*export async function handleSpotPriceEvent(event: CosmosEvent): Promise<void> {
  // We create a new entity using the transaction hash and message index as a unique ID
  logger.info(
    `New spot price change at block ${event.block.block.header.height}`
  );
  const contractAddress: string | undefined = event.event.attributes.find(
    (a) => a.key === "_contract_address"
  )?.value;

  if (contractAddress) {
    const id = `${event.block.header.height}-${contractAddress}`;

    let exchangeRate = await ExchangeRate.get(id);
    if (!exchangeRate) {
      exchangeRate = ExchangeRate.create({
        id,
        blockHeight: BigInt(event.block.header.height),
        timestamp: new Date(event.block.header.time.toISOString()),
        txHash: event.tx.hash,
        contractAddress,
      });
    }

    // Cosmos events code attributes as an array of key value pairs, we're looking for to extract a few things
    // Example https://sei.explorers.guru/transaction/9A5D1FB99CDFB03282459355E4C7221D93D9971160AE79E201FA2B2895952878
    for (const attr of event.event.attributes) {
      if (attr.key === "time") {
        // encoded as seconds
        exchangeRate.timestamp = new Date(parseFloat(attr.value) * 1000);
      } else if (attr.key === "price-notional") {
        exchangeRate.priceNotional = parseFloat(attr.value);
      } else if (attr.key === "price-base") {
        exchangeRate.priceUSD = parseFloat(attr.value);
      } else if (attr.key === "contract_version") {
        exchangeRate.contractVersion = attr.value;
      } else if (attr.key === "contract_name") {
        exchangeRate.contractName = attr.value;
      }
    }
    await exchangeRate.save();

    if (exchangeRate.priceUSD) {
      await updateDailyAggregation(
        exchangeRate.timestamp,
        exchangeRate.priceUSD
      );
    }
  }
}*/
