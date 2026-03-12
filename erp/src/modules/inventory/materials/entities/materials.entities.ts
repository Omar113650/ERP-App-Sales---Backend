import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../../infrastructure/database/entities/base.entity';
import { Item } from '../../item/entities/item.entities';

@Entity('materials')
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  current_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_per_unit: number;

  @Column({ type: 'date', nullable: true })
  expiry_date: string;

  @ManyToOne(() => Item, (item) => item.materials)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}