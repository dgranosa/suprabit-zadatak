import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Beer, BeerRelations, User, Food} from '../models';
import {UserRepository} from './user.repository';
import {FoodRepository} from './food.repository';

export class BeerRepository extends DefaultCrudRepository<
  Beer,
  typeof Beer.prototype.id,
  BeerRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Beer.prototype.id>;

  public readonly foods: HasManyRepositoryFactory<Food, typeof Beer.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>,
  ) {
    super(Beer, dataSource);
    this.foods = this.createHasManyRepositoryFactoryFor('foods', foodRepositoryGetter,);
    this.registerInclusionResolver('foods', this.foods.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
  }
}
