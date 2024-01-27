import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { DistributorCreated } from "../generated/MerkleDistributorFactory/MerkleDistributorFactory"

export function createDistributorCreatedEvent(
  distributorAddress: Address
): DistributorCreated {
  let distributorCreatedEvent = changetype<DistributorCreated>(newMockEvent())

  distributorCreatedEvent.parameters = new Array()

  distributorCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "distributorAddress",
      ethereum.Value.fromAddress(distributorAddress)
    )
  )

  return distributorCreatedEvent
}
