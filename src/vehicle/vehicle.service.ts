import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { TransportRoute } from '../transport-route/entities/transport-route.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(TransportRoute)
    private routeRepository: Repository<TransportRoute>,
  ) {}

  async create(
    createVehicleDto: CreateVehicleDto,
    userId: number,
  ): Promise<Vehicle> {
    const { route_ids, ...vehicleData } = createVehicleDto;

    // Verificar se a placa já existe
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: createVehicleDto.plate },
    });

    if (existingVehicle) {
      throw new BadRequestException('Vehicle with this plate already exists');
    }

    const vehicle = this.vehicleRepository.create(vehicleData);
    // Note: createdBy and updatedBy são gerenciados pela BaseEntityWithAudit

    // Se foram fornecidos IDs de rotas, associá-las
    if (route_ids && route_ids.length > 0) {
      const routes = await this.routeRepository.findBy({
        id: In(route_ids),
      });

      if (routes.length !== route_ids.length) {
        throw new NotFoundException('One or more routes not found');
      }

      vehicle.routes = routes;
    }

    return await this.vehicleRepository.save(vehicle);
  }

  // async findAll(options: IPaginationOptions): Promise<Pagination<Vehicle>> {
  //   const queryBuilder = this.vehicleRepository
  //     .createQueryBuilder('vehicle')
  //     .leftJoinAndSelect('vehicle.routes', 'routes')
  //     .orderBy('vehicle.name', 'ASC');

  //   return paginate<Vehicle>(queryBuilder, options);
  // }

  async findAll(
    options: IPaginationOptions,
    searchQuery?: string,
  ): Promise<Pagination<Vehicle>> {
    const whereCondition = searchQuery
      ? [
          { plate: ILike(`%${searchQuery}%`) },
          { name: ILike(`%${searchQuery}%`) },
        ]
      : {};

    return await paginate<Vehicle>(this.vehicleRepository, options, {
      relations: ['routes'],
      order: { createdAt: 'DESC' },
      where: whereCondition,
    });
  }

  async findActive(options: IPaginationOptions): Promise<Pagination<Vehicle>> {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.routes', 'routes')
      .where('vehicle.is_active = :isActive', { isActive: true })
      .orderBy('vehicle.name', 'ASC');

    return paginate<Vehicle>(queryBuilder, options);
  }

  async findByRoute(
    routeId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Vehicle>> {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.routes', 'routes')
      .where('routes.id = :routeId', { routeId })
      .andWhere('vehicle.is_active = :isActive', { isActive: true })
      .orderBy('vehicle.name', 'ASC');

    return paginate<Vehicle>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['routes'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
    userId: number,
  ): Promise<Vehicle> {
    const { route_ids, ...vehicleData } = updateVehicleDto;

    const vehicle = await this.findOne(id);

    // Verificar se a placa já existe em outro veículo
    if (updateVehicleDto.plate) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { plate: updateVehicleDto.plate },
      });

      if (existingVehicle && existingVehicle.id !== id) {
        throw new BadRequestException('Vehicle with this plate already exists');
      }
    }

    // Atualizar dados do veículo
    Object.assign(vehicle, {
      ...vehicleData,
      updatedBy: userId,
      updatedAt: new Date(),
    });

    // Se foram fornecidos IDs de rotas, atualizar associações
    if (route_ids !== undefined) {
      if (route_ids.length > 0) {
        const routes = await this.routeRepository.findBy({
          id: In(route_ids),
        });

        if (routes.length !== route_ids.length) {
          throw new NotFoundException('One or more routes not found');
        }

        vehicle.routes = routes;
      } else {
        vehicle.routes = [];
      }
    }

    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.softDelete(id);
  }

  async addRoute(vehicleId: number, routeId: number): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    if (!vehicle.routes) {
      vehicle.routes = [];
    }

    // Verificar se a rota já está associada
    const isRouteAlreadyAssociated = vehicle.routes.some(
      (existingRoute) => existingRoute.id === routeId,
    );

    if (!isRouteAlreadyAssociated) {
      vehicle.routes.push(route);
      return await this.vehicleRepository.save(vehicle);
    }

    return vehicle;
  }

  async removeRoute(vehicleId: number, routeId: number): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);

    if (vehicle.routes) {
      vehicle.routes = vehicle.routes.filter(
        (route) => route.id !== routeId,
      );
      return await this.vehicleRepository.save(vehicle);
    }

    return vehicle;
  }
}