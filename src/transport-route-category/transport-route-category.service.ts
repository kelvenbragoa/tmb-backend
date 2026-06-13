import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportRouteCategory } from './entities/transport-route-category.entity';
import { CreateTransportRouteCategoryDto } from './dto/create-transport-route-category.dto';
import { UpdateTransportRouteCategoryDto } from './dto/update-transport-route-category.dto';
import { User } from '../user/entities/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TransportRouteCategoryService {
  constructor(
    @InjectRepository(TransportRouteCategory)
    private readonly categoryRepository: Repository<TransportRouteCategory>,
  ) {}

  async create(
    createCategoryDto: CreateTransportRouteCategoryDto,
    user: User,
  ): Promise<TransportRouteCategory> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      createdBy: user,
      updatedBy: user,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<TransportRouteCategory>> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.createdBy', 'createdBy')
      .leftJoinAndSelect('category.updatedBy', 'updatedBy')
      .where('category.deletedAt IS NULL')
      .orderBy('category.createdAt', 'DESC');

    return await paginate<TransportRouteCategory>(queryBuilder, options);
  }

  async findOne(id: number): Promise<TransportRouteCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'routes'],
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateTransportRouteCategoryDto,
    user: User,
  ): Promise<TransportRouteCategory> {
    const category = await this.findOne(id);

    Object.assign(category, {
      ...updateCategoryDto,
      updatedBy: user,
    });

    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softDelete(id);
  }

  async restore(id: number): Promise<TransportRouteCategory> {
    await this.categoryRepository.restore(id);
    return this.findOne(id);
  }
}
