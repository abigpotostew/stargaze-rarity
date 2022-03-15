import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SG721 } from "./sg721.entity";

@Entity('traits')
export class Trait {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => SG721, contract=>contract.traits)
  @JoinColumn({ name: 'contract_id' })
  contract: SG721;

  @Column({
    type: "varchar",
    length: 1024,
  })
  name: string;   
}
