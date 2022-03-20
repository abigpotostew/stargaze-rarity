import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SG721 } from './sg721.entity';

@Entity('sg721_meta')
@Unique('sg721_meta_unique_contract',['contract'])
export class SG721Meta {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @OneToOne(() => SG721, (sg721) => sg721.meta)
    @JoinColumn({ name: 'contract_id' })
    contract: SG721;

    @Column({
        type: 'numeric'
    })
    count: number;
}
