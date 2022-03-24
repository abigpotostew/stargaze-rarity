import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SG721 } from "./sg721.entity";
import { Token } from "./token.entity";
import { SG721Trait } from "./sg721Trait.entity";
import { TraitValue } from "../utils/types";

/**
 * Trying to follow: https://docs.opensea.io/docs/metadata-standards
 */
@Entity('token_traits')
@Unique('token_traits_contract_token_trait_type_unique', ['contract', 'token', 'traitType'])
export class TokenTrait {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => SG721, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'contract_id' })
  contract: SG721;

  @ManyToOne(() => Token, token => token.traits, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'token_id' })
  token: Token;

  @Column({
    type: 'varchar',
    length: 1024,
    name: 'trait_type'
  })
  traitType: string;

  @Column({
    type: "jsonb",
    array: false,
    nullable: true
  })
  value: { v: TraitValue };

  // Might want to support this in the future
  //   @Column({
  //     type: "varchar",
  //     length: 1024,
  //     name: 'display_type'
  //   })
  //   displayType: string; 

  @ManyToOne(() => SG721Trait, sg721Trait => sg721Trait.tokenTraits, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'trait_id' })
  trait: SG721Trait;

}
