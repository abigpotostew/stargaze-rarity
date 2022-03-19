import { Exclude, Expose, Transform, Type } from 'class-transformer';
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
    @Transform(({obj}) => obj.meta.score, {toClassOnly: true})
    score: number;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj.meta.rank, {toClassOnly: true})
    rank: number;

    @Exclude()
    @Type(() => TokenMetaModel)
    meta: TokenMetaModel;

    @Exclude()
    contract: any;

    @Exclude()
    contract_address: string;

    @Type(() => TokenTraitModel)
    traits: TokenTraitModel[];

}
