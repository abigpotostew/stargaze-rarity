import { Exclude, Expose, Transform, Type } from "class-transformer";
import { SG721Model } from "./sg721.model";
import { SG721TraitModel } from "./sg721Trait.model";
import { TokenModel } from "./token.model";

export class TokenTraitModel {

    @Exclude()
    id: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    contract: SG721Model;

    @Exclude()
    token: TokenModel;

    traitType: string;

    @Transform(({value}) => value.v, {toClassOnly: true})
    value: any;

    @Exclude()
    @Type(() => SG721TraitModel)
    trait: SG721TraitModel;

    @Expose()
    @Type(() => Number)
    @Transform(({obj}) => obj?.trait?.count, {toClassOnly: true})
    count: number

}
