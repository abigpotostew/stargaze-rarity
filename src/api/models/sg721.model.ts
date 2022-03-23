import { Exclude, Expose, Transform, Type } from "class-transformer";
import { SG721MetaModel } from "./sg721Meta.model";
import { SG721TraitModel } from "./sg721Trait.model";
import { TokenModel } from "./token.model";

export class SG721Model {

  @Exclude()
  id: number;

  contract: string; // Probably want to validate that it is a stars... address    

  createdAt: Date;

  @Exclude()
  lastRefreshed: Date;

  @Expose()
  @Type(() => Number)
  @Transform(({obj}) => obj?.meta?.count, {toClassOnly: true})
  count: number;

  @Expose()
  @Type(() => Number)
  @Transform(({obj}) => obj?.meta?.minted, {toClassOnly: true})
  minted: number;

  @Type(() => SG721TraitModel)
  traits: SG721TraitModel[];

  @Type(() => TokenModel)
  tokens: TokenModel[];

  @Exclude()
  @Type(() => SG721MetaModel)
  meta: SG721MetaModel;
}
