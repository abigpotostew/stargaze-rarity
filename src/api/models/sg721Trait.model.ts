import { Exclude } from "class-transformer";
import { SG721Model } from "./sg721.model";

export class SG721TraitModel {

  @Exclude()
  id: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  contract: SG721Model;

  traitType: string;

  // Might want to support this in the future
  //   @Column({
  //     type: "varchar",
  //     length: 1024,
  //     name: 'display_type'
  //   })
  //   displayType: string; 
  

  value: any;

  count: number

  tokenTraits: SG721TraitModel[];
}
