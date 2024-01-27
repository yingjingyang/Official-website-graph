import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { DistributorCreated } from "../generated/schema"
import { DistributorCreated as DistributorCreatedEvent } from "../generated/MerkleDistributorFactory/MerkleDistributorFactory"
import { handleDistributorCreated } from "../src/merkle-distributor-factory"
import { createDistributorCreatedEvent } from "./merkle-distributor-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let distributorAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDistributorCreatedEvent = createDistributorCreatedEvent(
      distributorAddress
    )
    handleDistributorCreated(newDistributorCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DistributorCreated created and stored", () => {
    assert.entityCount("DistributorCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DistributorCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "distributorAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
