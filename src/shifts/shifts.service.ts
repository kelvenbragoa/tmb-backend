import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    const shift = this.shiftRepository.create(createShiftDto);
    return await this.shiftRepository.save(shift);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Shift>> {
    const qb = this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.deletedAt IS NULL')
      .orderBy('shift.createdAt', 'DESC');

    return await paginate<Shift>(qb, options);
  }

  async findOne(id: number): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!shift) {
      throw new NotFoundException(`Turno com ID ${id} não encontrado`);
    }

    return shift;
  }

  async update(id: number, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);
    Object.assign(shift, updateShiftDto);
    return await this.shiftRepository.save(shift);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.shiftRepository.softDelete(id);
  }

  async restore(id: number): Promise<Shift> {
    await this.shiftRepository.restore(id);
    return this.findOne(id);
  }
}
