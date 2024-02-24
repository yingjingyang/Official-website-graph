import { BigInt,Bytes,Address } from "@graphprotocol/graph-ts"
import { DistributorCreated as DistributorCreatedEvent, MerkleDistributorFactory } from "../generated/MerkleDistributorFactory/MerkleDistributorFactory"
import { Distributor,Token,Lastupdate } from "../generated/schema"
import { ERC20 } from '../generated//MerkleDistributorFactory/ERC20'
import { MerkleDistributor as MerkleDistributorTemplate } from '../generated/templates'

const zeroBigInt = BigInt.fromString("0")
const ONE = "1"
const zeroAddress = "0x0000000000000000000000000000000000000000"

export function handleDistributorCreated(event: DistributorCreatedEvent): void {
  let lastupdate = Lastupdate.load(ONE)
  if (lastupdate === null) {
    lastupdate = new Lastupdate(
      ONE
    )
  }

  lastupdate.lastupdateTimestamp = event.block.timestamp
  lastupdate.save()

  let distributorFactory = MerkleDistributorFactory.bind(event.address)
  let distributorAddressTmp = distributorFactory.try_redpacket_by_id(event.params.id)
  let distributorAddress = Bytes.fromHexString(distributorAddressTmp.value.toHexString())
  let distributor = new Distributor(
    distributorAddress
  )

  distributor.totalAmount = event.params.total
  distributor.name = event.params.name
  distributor.message = event.params.message
  distributor.tokenAddress = event.params.token_address
  distributor.number = event.params.number
  distributor.duration = event.params.duration
  distributor.creator = event.params.creator
  distributor.creationTimestamp = event.params.creation_time
  distributor.expireTimestamp = event.params.creation_time.plus(event.params.duration)
  distributor.remainToClaim = event.params.number
  distributor.allClaimed = false
  distributor.refunded = false
  distributor.isETH = false
  distributor.redpacketId = event.params.id


  let distributionTokenAddress = event.params.token_address.toHexString()
  
  if(distributionTokenAddress == zeroAddress){
    distributor.isETH = true

  }else{
    const tokenId = event.params.token_address.toString();

    let token = Token.load(tokenId);
    if (!token) {
      token = new Token(tokenId);
      const erc20 = ERC20.bind(Address.fromBytes(event.params.token_address));

      token.address = event.params.token_address;

      const nameResult = erc20.try_name()
      if (!nameResult.reverted) {
        token.name = nameResult.value.toString()
      }
      const symbolResult = erc20.try_symbol()
      if (!symbolResult.reverted) {
        token.symbol = symbolResult.value.toString()
      }
      const decimalsResult = erc20.try_decimals()
      if (!decimalsResult.reverted) {
        token.decimals = BigInt.fromI32(decimalsResult.value)
      }

      token.save();

      distributor.token = tokenId;
    }

  }

  distributor.save()

  // create the tracked contract based on the template
  MerkleDistributorTemplate.create(distributorAddressTmp.value)
}
