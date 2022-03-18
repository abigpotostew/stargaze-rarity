import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SG721 } from "./sg721.entity";
import { TraitValue } from "../utils/types";
import { Exclude } from "class-transformer";
import { TokenTrait } from "./tokenTrait.entity";

@Entity('sg721_traits')
@Unique(['contract', 'traitType', 'value'])
export class SG721Trait {

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ManyToOne(() => SG721, contract => contract.traits)
  @JoinColumn({ name: 'contract_id' })
  contract: SG721;

  @Column({
    type: "varchar",
    length: 1024,
    name: 'trait_type'
  })
  traitType: string;

  // Might want to support this in the future
  //   @Column({
  //     type: "varchar",
  //     length: 1024,
  //     name: 'display_type'
  //   })
  //   displayType: string; 

  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  value: TraitValue;

  @Column({
    type: "integer"
  })
  count: number


  @OneToMany(() => TokenTrait, tokenTrait => tokenTrait.trait)
  tokenTraits: SG721Trait[];
}
