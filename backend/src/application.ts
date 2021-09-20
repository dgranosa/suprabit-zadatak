import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {OpenApiSpec, RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings} from './keys';
import {BeerRepository, UserRepository} from './repositories';
import {MySequence} from './sequence';
import {BcryptHasher, JWTService, MyUserService} from './services';
import {SECURITY_SCHEME_SPEC} from './utils/security-spec';

export {ApplicationConfig};

export class BackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(
    options: ApplicationConfig = {}
  ) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    this.add(createBindingFromClass(JWTAuthenticationStrategy));
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.setUpBindings();

    const spec: OpenApiSpec = {
      openapi: '3.0.0',
      info: {title: 'Backend', version: 'alpha'},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [{url: '/api'}],
    };
    this.api(spec);
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options);

    // Get repositories
    const userRepo = await this.getRepository(UserRepository);
    const beerRepo = await this.getRepository(BeerRepository);

    // Add user
    const user = {
      email: 'user@example.com',
      password: 'stringst',
      role: 'admin'
    };
    const savedUser = await userRepo.create(_.omit(user, 'password'),);
    await userRepo.userCredentials(savedUser.id).create({password: '$2a$10$GLRdWVlG8NtrcaOueioM3.jGfObD2Ef97VQfrsQMMC1.4wA1OtJs2'});

    // Load beers
    const data = await JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      var dd = d.first_brewed.length == 4 ? new Date('01/01/' + d.first_brewed) : new Date(d.first_brewed.split('/')[0] + '/01/' + d.first_brewed.split('/')[1]);
      dd.setHours(dd.getHours() + 4);
      const beer = {
        name: d.name,
        tagline: d.tagline,
        first_brewed: dd ? dd.toISOString() : new Date().toISOString(),
        yeast: d.ingredients.yeast ?? "x",
        image_url: d.image_url,
        abv: d.abv,
        ibu: d.ibu,
        ebc: d.ebc,
        description: d.description,
        userId: savedUser.id
      };
      const savedBeer = await beerRepo.create(beer);

      for (let j = 0; j < d.food_pairing.length; j++) {
        await beerRepo.foods(savedBeer.id).create({name: d.food_pairing[j]});
      }
    }
  }

  private setUpBindings(): void {

    // Bind package.json to the application context
    // this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
}
