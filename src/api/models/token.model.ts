import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { SG721Model } from './sg721.model';
import { TokenMetaModel } from './tokenMeta.model';
import { TokenTraitModel } from './tokenTrait.model';

// This allows us to separate the JSON output
// from the DB models
export class TokenModel {

    @Exclude()
    id: number;

    @Exclude()
    createdAt: Date;

    tokenId: string;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj?.meta?.score, {toClassOnly: true})
    score: number;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj?.meta?.rank, {toClassOnly: true})
    rank: number;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj?.contract?.meta?.count, {toClassOnly: true})
    count: number;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj?.contract?.meta?.minted, {toClassOnly: true})
    minted: number;

    @Exclude()
    @Type(() => TokenMetaModel)
    meta: TokenMetaModel;

    @Exclude()
    @Type(() => SG721Model)
    contract: SG721Model;

    @Exclude()
    contract_address: string;

    @Type(() => TokenTraitModel)
    traits: TokenTraitModel[];

}
