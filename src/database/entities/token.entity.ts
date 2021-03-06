import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { SG721 } from './sg721.entity';
import { TokenMeta } from './tokenMeta.entity';
import { TokenTrait } from './tokenTrait.entity';

@Entity('tokens')
@Unique('token_unique_id_contract', ['tokenId', 'contract'])
export class Token {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 1024,
    name: 'token_id'
  })
  tokenId: string;

  @OneToOne(() => TokenMeta, meta => meta.token, { cascade: true, onDelete: "CASCADE" })
  meta: TokenMeta;

  @ManyToOne(() => SG721, contract => contract.tokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract: SG721;

  // Keep a normalized field of contract address for fast lookups
  @Column({
    type: "varchar",
    length: 64
  })
  contract_address: string;

  @OneToMany(() => TokenTrait, trait => trait.token, { cascade: true })
  traits: TokenTrait[];
}
