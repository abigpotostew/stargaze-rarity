import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SG721 } from './sg721.entity';

@Entity('sg721_meta')
@Unique(['contract'])
export class SG721Meta {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => SG721)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @Column({
        type: 'numeric'
    })
    count: number;
}
