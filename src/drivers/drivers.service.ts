import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save(driver);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Driver>> {
    const queryBuilder = this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.deletedAt IS NULL')
      .orderBy('driver.createdAt', 'DESC');

    return await paginate<Driver>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!driver) {
      throw new NotFoundException(`Motorista com ID ${id} não encontrado`);
    }

    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findOne(id);

    Object.assign(driver, updateDriverDto);

    return await this.driverRepository.save(driver);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.driverRepository.softDelete(id);
  }

  async restore(id: number): Promise<Driver> {
    await this.driverRepository.restore(id);
    return this.findOne(id);
  }
}
