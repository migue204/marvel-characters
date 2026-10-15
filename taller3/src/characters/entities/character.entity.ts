import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export enum CharacterStatus {
    ACTIVE = 'active',
    INJURED = 'injured',
    MISSING = 'missing',
    RETIRED = 'retired',
}

@Entity("characters")
export class Character {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    real_name: string;

    @Column({ unique: true })
    alias: string;

    @Column()
    main_power: string;

    @Column()
    power_level: number;

    @Column()
    status: CharacterStatus;

    @Column()
    is_villain: boolean;

    @Column()
    team_id: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}