import { BigInt } from "@graphprotocol/graph-ts"
import { Claimed as ClaimEvent,Refund as RefundEvent } from "../generated/templates/MerkleDistributor/MerkleDistributor"
import { Claimer,Distributor,Lastupdate,Refund  } from "../generated/schema"

const oneBigInt = BigInt.fromString("1")
const zeroBigInt = BigInt.fromString("0")
const ONE = "1"

export function handleClaimed(event: ClaimEvent): void {
  // let lastupdate = Lastupdate.load(ONE)
  // if (lastupdate === null) {
  //   return
  // }
  // lastupdate.lastupdateTimestamp = event.block.timestamp
  // lastupdate.save()


  let claimer = new Claimer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  claimer.claimTimestamp = event.block.timestamp
  claimer.distributor = event.address
  claimer.index = event.params.index
  claimer.claimer = event.params.account
  claimer.amount = event.params.amount

  claimer.save()

  let distributor = Distributor.load(event.address)
  if (distributor === null) {
    return
  }

  let remainToClaim = distributor.remainToClaim
  remainToClaim = remainToClaim.minus(oneBigInt)
  distributor.remainToClaim = remainToClaim

  if(distributor.remainToClaim.equals(zeroBigInt)){
    distributor.allClaimed = true
  }

  distributor.save()


}

export function handleRefund(event: RefundEvent): void {
  let lastupdate = Lastupdate.load(ONE)
  if (lastupdate === null) {
    return
  }
  lastupdate.lastupdateTimestamp = event.block.timestamp
  lastupdate.save()

  /////
  let tempRefundId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let refundID = tempRefundId.toHexString()
  let refund = new Refund(
    refundID
  )

  refund.distributor = event.address
  refund.to = event.params.to
  refund.amount = event.params.refund_balance
  refund.blockNumber = event.block.number
  refund.blockTimestamp = event.block.timestamp

  refund.save()

  let distributor = Distributor.load(event.address)
  if (distributor === null) {
    return
  }
  distributor.refunded = true
  distributor.refunder = refundID
  distributor.save()

}
