import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCostumerDto } from './dto/create-costumer.dto';
import { UpdateCostumerDto } from './dto/update-costumer.dto';
import { Costumer } from './entities/costumer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../user/entities/user.entity';
import { TicketType } from '../ticket-type/entities/ticket-type.entity';

@Injectable()
export class CostumerService {
  constructor(
    @InjectRepository(Costumer)
    private costumerRepository: Repository<Costumer>,
    @InjectRepository(TicketType)
    private ticketTypeRepository: Repository<TicketType>,
  ) {}
  async create(createCostumerDto: CreateCostumerDto, user: User) {
    // Validar se ticket_type existe
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id: createCostumerDto.ticket_type_id, is_active: true },
    });

    if (!ticketType) {
      throw new BadRequestException('Ticket type not found or inactive');
    }

    // Gerar número do cliente automaticamente
    const customer_number = await this.generateCustomerNumber();

    const costumer = this.costumerRepository.create({
      ...createCostumerDto,
      customer_number,
      createdBy: user,
      updatedBy: user,
    });

    return await this.costumerRepository.save(costumer);
  }

  async findAll(options: IPaginationOptions, user: User) {
    const queryBuilder = this.costumerRepository
      .createQueryBuilder('costumer')
      .leftJoinAndSelect('costumer.ticketType', 'ticketType')
      .leftJoinAndSelect('costumer.createdBy', 'createdBy')
      .orderBy('costumer.customer_number', 'ASC');

    return await paginate(queryBuilder, options);
  }

  async findOne(id: number, user: User) {
    const result = await this.costumerRepository.findOne({
      where: { id },
      relations: ['ticketType', 'createdBy', 'updatedBy'],
    });
    if (!result) {
      throw new NotFoundException(
        `Costumer with id ${id} not found or you don't have access to it`,
      );
    }
    return result;
  }

  async update(id: number, updateCostumerDto: UpdateCostumerDto, user: User) {
    // First check if the Costumer exists
    const existingCostumer = await this.costumerRepository.findOne({
      where: { id },
    });

    if (!existingCostumer) {
      throw new NotFoundException(
        `Costumer with id ${id} not found or you don't have access to it`,
      );
    }

    const result = await this.costumerRepository.update(
      { id },
      {
        name: updateCostumerDto.name ? updateCostumerDto.name : undefined,
        email: updateCostumerDto.email ? updateCostumerDto.email : undefined,
        mobile: updateCostumerDto.mobile ? updateCostumerDto.mobile : undefined,
      },
    );

    return result;
  }

  async remove(id: number, user: User) {
    // First check if the Costumer exists
    const existingCostumer = await this.costumerRepository.findOne({
      where: { id },
    });

    if (!existingCostumer) {
      throw new NotFoundException(
        `Costumer with id ${id} not found or you don't have access to it`,
      );
    }

    await this.costumerRepository.softDelete({ id });
    
    return { message: 'Costumer deleted successfully' };
  }

  private async generateCustomerNumber(): Promise<string> {
    const count = await this.costumerRepository.count();
    const customerNumber = `CUST${(count + 1).toString().padStart(6, '0')}`;
    
    // Verificar se já existe (em caso de números deletados)
    const exists = await this.costumerRepository.findOne({
      where: { customer_number: customerNumber },
    });
    
    if (exists) {
      // Se existir, gerar baseado no timestamp
      const timestamp = Date.now().toString().slice(-6);
      return `CUST${timestamp}`;
    }
    
    return customerNumber;
  }

  async findByCustomerNumber(customerNumber: string): Promise<Costumer | null> {
    return await this.costumerRepository.findOne({
      where: { customer_number: customerNumber },
      relations: ['ticketType'],
    });
  }
}
