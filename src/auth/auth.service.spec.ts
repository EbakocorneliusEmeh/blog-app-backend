import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../users/user.schema';
import { Tenant } from '../tenants/tenant.schema';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockTenantModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn((payload) => `signed-${payload.email}`),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Tenant.name), useValue: mockTenantModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should create a Google user and return an access token', async () => {
    const newUser = {
      _id: 'abc123',
      email: 'alice@gmail.com',
      username: 'alice',
      passwordHash: '',
      role: 'author',
      tenantId: 'tenant123',
      save: jest.fn().mockResolvedValue(true),
    };

    const newTenant = {
      _id: 'tenant123',
      owner: 'abc123',
      userId: 'abc123',
      name: 'alice',
      slug: 'alice',
      save: jest.fn().mockResolvedValue(true),
    };

    mockUserModel.findOne.mockResolvedValueOnce(null);
    mockUserModel.create.mockReturnValue(newUser);
    mockTenantModel.findOne.mockResolvedValueOnce(null);
    mockTenantModel.create.mockReturnValue(newTenant);

    const result = await service.validateGoogleUser({
      email: 'alice@gmail.com',
      firstName: 'Alice',
      lastName: 'Smith',
      picture: 'https://example.com/pic.jpg',
    });

    expect(result.accessToken).toBe('signed-alice@gmail.com');
    expect(result.user.email).toBe('alice@gmail.com');
    expect(mockUserModel.create).toHaveBeenCalled();
  });
});
