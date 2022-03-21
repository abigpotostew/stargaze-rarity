import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SG721Trait } from "./sg721Trait.entity";
import { Token } from "./token.entity";
import { SG721Meta } from "./sg721Meta.entity";


@Entity('sg721s')
@Unique('sg721s_unique_contract',['contract'])
export class SG721 {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 64
  })
  contract: string; // Probably want to validate that it is a stars... address    

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => SG721Trait, trait => trait.contract)
  traits: SG721Trait[];

  @OneToMany(() => Token, token => token.contract)
  tokens: Token[];

  @OneToOne(() => SG721Meta, meta => meta.contract)
  meta: SG721Meta;
}
